import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { S3Service } from 'src/s3/s3.service';
import { PrismaService } from './../prisma/prisma.service';
import { UpdateUserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService, private s3Service: S3Service) {}

  // get user by id
  async getUserById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: id },
      select: {
        id: true,
        email: true,
        username: true,
        avatarUrl: true,
        badges: true,
      },
    });
    // if no user is found, throw an error
    if (!user) {
      throw new BadRequestException('Something went wrong. Please try again.');
    }

    // generate a signed url for the image if exists
    if (user.avatarUrl) {
      const key = user.avatarUrl.split('.amazonaws.com/')[1];
      user.avatarUrl = await this.s3Service.getSignedUrl(key);
    }

    return user;
  }

  // get all users
  async getUsers() {
    return await this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        username: true,
        avatarUrl: true,
        badges: true,
      },
    });
  }

  // get current authenticated user
  async getAuthenticatedUser(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: id },
      select: {
        id: true,
        email: true,
        username: true,
        avatarUrl: true,
        badges: true,
      },
    });

    // if no user is found, throw an error
    if (!user) {
      throw new BadRequestException('Something went wrong. Please try again.');
    }

    // generate a signed url for the image if exists
    if (user.avatarUrl) {
      const key = user.avatarUrl.split('.amazonaws.com/')[1];
      user.avatarUrl = await this.s3Service.getSignedUrl(key);
    }

    return user;
  }

  async updateUser(
    id: string,
    updateUserDto: UpdateUserDto,
    buffer: Buffer | undefined,
    mimetype: string | undefined,
    originalname: string | undefined,
    req: any,
    res: any,
  ) {
    // get the user id from the JWT token
    const userId = req.user.id;

    // get user from the database
    const user = await this.prisma.user.findUnique({ where: { id: id } });

    // if no user is found, throw an error
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // check if userId from token equals the id from the request params
    if (user.id !== userId) {
      throw new BadRequestException(
        'You are not authorized to edit this profile.',
      );
    }

    // initialize the avatarUrl as existing or undefined
    let avatarUrl: string | undefined = user.avatarUrl;

    // check if user is trying to update the avatar, delete the old avatar from S3 and upload the new one
    if (buffer && mimetype && originalname) {
      if (avatarUrl) {
        const oldKey = avatarUrl.split('.amazonaws.com/')[1];
        await this.s3Service.deleteImage(oldKey);
      }
      const username = req.user.username;
      const key = `${username}/avatars/${Date.now()}-${originalname}`;
      avatarUrl = await this.s3Service.uploadImage(buffer, mimetype, key);
    }

    // updateData spread the updateUserDto and add the avatarUrl
    const updateData: Record<string, any> = {
      ...(updateUserDto.email !== undefined && { email: updateUserDto.email }),
      ...(updateUserDto.username !== undefined && {
        username: updateUserDto.username,
      }),
      avatarUrl,
    };

    // check if user is trying to update the password
    if (updateUserDto.oldPassword && updateUserDto.newPassword) {
      const isPasswordValid = await bcrypt.compare(
        updateUserDto.oldPassword,
        user.password,
      );

      if (!isPasswordValid) {
        throw new BadRequestException('Invalid old password');
      }

      const hashedPassword = await bcrypt.hash(updateUserDto.newPassword, 10);
      updateData.password = hashedPassword;
    }

    // check if user is trying to update the username
    if (updateUserDto.username) {
      const existingUsername = await this.prisma.user.findUnique({
        where: { username: updateUserDto.username },
      });

      if (existingUsername) {
        throw new BadRequestException('Username already taken');
      }
      // update the username in updateData
      updateData.username = updateUserDto.username;

      // move the user's files to the new folder
      if (user.username !== updateUserDto.username) {
        const folders = ['avatars', 'goals'];

        // iteratre through folders
        for (const folder of folders) {
          const oldFolder = `${user.username}/${folder}/`;
          const newFolder = `${updateUserDto.username}/${folder}/`;

          // list all files in the old folder
          const objects = await this.s3Service.listObjects(oldFolder);

          // copy each file to the new folder
          for (const object of objects) {
            const oldKey = object.Key;
            const newKey = oldKey.replace(oldFolder, newFolder);
            await this.s3Service.copyObject(oldKey, newKey);
          }

          // Delete the old files and folder
          for (const object of objects) {
            {
              // delete files
              await this.s3Service.deleteImage(object.Key);
            }
            // delete folder
            await this.s3Service.deleteFolder(oldFolder);
          }
        }
      }
    }

    // check if user is trying to update the email
    if (updateUserDto.email) {
      const existingEmail = await this.prisma.user.findUnique({
        where: { email: updateUserDto.email },
      });

      if (existingEmail) {
        throw new BadRequestException('Email already taken.');
      }

      updateData.email = updateUserDto.email;
    }

    // update the user
    const updateUser = await this.prisma.user.update({
      where: {
        id: id,
      },
      data: updateData,
    });

    // check if the user was updated
    if (updateUser) {
      return res.status(200).json({ message: 'User updated successfully' });
    } else {
      throw new BadRequestException('Oops! Something went wrong.');
    }
  }

  // delete user
  async deleteUser(id: string, req: any, res: any) {
    // get user from the database
    const user = await this.prisma.user.findUnique({ where: { id: id } });

    // check if user is the user
    if (req.user.id === user.id) {
      // initialize the avatarUrl as existing or undefined
      const avatarUrl: string | undefined = user.avatarUrl;

      // check if user has an avater, delete avatar
      if (avatarUrl) {
        const key = avatarUrl.split('.amazonaws.com/')[1];
        await this.s3Service.deleteImage(key);
      }

      // delete related goals before deleting the user
      await this.prisma.goal.deleteMany({
        where: {
          userId: id,
        },
      });

      // delete user
      const deleteUser = await this.prisma.user.delete({
        where: {
          id: id,
        },
      });

      // delete all objects under the user's folders (avatars and goals)
      const folders = ['avatars', 'goals'];
      for (const folder of folders) {
        const prefix = `${user.username}/${folder}/`;
        const objects = await this.s3Service.listObjects(prefix);
        for (const object of objects) {
          await this.s3Service.deleteImage(object.Key);
        }
      }

      //check if user was deleted
      if (deleteUser) {
        if (res) {
          return res.status(200).json({
            message: 'User deleted successfully',
            deletedUser: deleteUser,
          });
        } else {
          return {
            message: 'User deleted successfully',
            deletedUser: deleteUser,
          };
        }
      } else {
        // if user was not deleted, throw an error
        throw new BadRequestException(
          'Oops! Something went wrong. Please try again',
        );
      }
    } else {
      // if user is not the user, throw an error
      throw new BadRequestException(
        'You are not authorized to delete this profile.',
      );
    }
  }
}
