import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { S3Service } from 'src/s3/s3.service';
import { ApiResponseMessages } from 'src/utils/return-types.ts/response-messages';
import {
  CustomRequest,
  NotificationType,
  NotificationUpdateData,
  UpdateData,
} from 'src/utils/types';
import { PrismaService } from './../prisma/prisma.service';
import { ToggleNotificationDto } from './dto/toggle-notification.dto';
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
        notificationSettings: {
          select: {
            goalsEmailNotification: true,
            goalsPushNotification: true,
            todosEmailNotification: true,
            todosPushNotification: true,
            journalsEmailNotification: true,
            journalsPushNotification: true,
            muteAllNotifications: true,
            muteGamification: true,
          },
        },
      },
    });
    // if no user is found, throw an error
    if (!user) {
      throw new NotFoundException(ApiResponseMessages.error.not_found_404.USER);
    }

    // generate a signed url for the image if exists
    if (user.avatarUrl) {
      const key = user.avatarUrl.split('.amazonaws.com/')[1];
      user.avatarUrl = await this.s3Service.getSignedUrl(key);
    }

    return { data: user };
  }

  // get all users
  async getUsers() {
    const result = await this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        username: true,
        avatarUrl: true,
        badges: true,
      },
    });

    return { data: result };
  }

  // get all tools
  async getTools() {
    const result = await this.prisma.tool.findMany({
      select: { id: true, titleKey: true, screenName: true },
    });

    return { data: result };
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
        experience: true,
        createdAt: true,
        badges: {
          select: {
            badge: true,
          },
        },
        userTools: {
          where: { favourite: true },
          select: { tool: true },
        },
        userLogins: {
          select: {
            streakCount: true,
          },
        },
      },
    });

    // if no user is found, throw an error
    if (!user) {
      throw new NotFoundException(ApiResponseMessages.error.not_found_404.USER);
    }

    // generate a signed url for the image if exists
    if (user.avatarUrl) {
      const key = user.avatarUrl.split('.amazonaws.com/')[1];
      user.avatarUrl = await this.s3Service.getSignedUrl(key);
    }

    return { data: user };
  }

  async getAuthenticatedUserGamification(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: id },
      select: {
        id: true,
        username: true,
        avatarUrl: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException(ApiResponseMessages.error.not_found_404.USER);
    }

    const avatarUrl = user.avatarUrl;

    const badgeCount = await this.prisma.userBadges.count({
      where: { userId: id },
    });

    const userBadges = await this.prisma.userBadges.findMany({
      where: { userId: id },
      include: { badge: true },
    });

    for (const userBadge of userBadges) {
      if (userBadge.badge && userBadge.badge.imageUrl) {
        const key = userBadge.badge.imageUrl.split('.amazonaws.com/')[1];
        userBadge.badge.imageUrl = await this.s3Service.getSignedUrl(key);
      }
    }

    const userExperience = await this.prisma.user.findUnique({
      where: { id: id },
      select: { experience: true },
    });

    const userStreakCount = await this.prisma.userStreaks.findMany({
      where: { userId: id },
      select: { streakCount: true },
    });

    const completedTodoCount = await this.prisma.todo.count({
      where: { userId: id, completed: true },
    });

    const completedGoalsCount = await this.prisma.goal.count({
      where: { userId: id, completed: true },
    });

    const meditationMinutes = await this.prisma.meditations.findMany({
      where: { userId: id },
      select: { totalDuration: true },
    });

    const journalCount = await this.prisma.journal.count({
      where: { userId: id },
    });

    const journalDaysThisWeek = await this.prisma.$queryRaw`
      SELECT
        DATE(createdAt) as date
      FROM journals
      WHERE userId = ${id} AND WEEKOFYEAR(createdAt) = WEEKOFYEAR(NOW())
    `;

    return {
      data: {
        id: user.id,
        username: user.username,
        avatarUrl: avatarUrl,
        createdAt: user.createdAt,
        badgeCount: badgeCount,
        badges: userBadges,
        experience: userExperience.experience,
        userStreakCount: userStreakCount.reduce(
          (acc, curr) => acc + curr.streakCount,
          0,
        ),
        completedTodoCount: completedTodoCount,
        completedGoalsCount: completedGoalsCount,
        meditationMinutes: meditationMinutes.reduce(
          (acc, curr) => acc + curr.totalDuration,
          0,
        ),
        journalCount: journalCount,
        // completedTasksThisWeek: completedTasksThisWeek,
        journalDaysThisWeek: journalDaysThisWeek,
      },
    };
  }

  async updateUser(
    id: string,
    updateUserDto: UpdateUserDto,
    buffer: Buffer | undefined,
    mimetype: string | undefined,
    originalname: string | undefined,
    req: CustomRequest,
  ) {
    // get the user id from the JWT token
    const userId = req.user.id;

    // get user from the database
    const user = await this.prisma.user.findUnique({ where: { id: id } });

    // if no user is found, throw an error
    if (!user) {
      throw new NotFoundException(ApiResponseMessages.error.not_found_404.USER);
    }

    // check if userId from token equals the id from the request params
    if (user.id !== userId) {
      throw new UnauthorizedException(
        ApiResponseMessages.error.unauthorized_401.UNAUTHORIZED,
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
    const updateData: UpdateData = {
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
        throw new BadRequestException(
          ApiResponseMessages.error.bad_request_400.INVALID_PASSWORD,
        );
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
        throw new BadRequestException(
          ApiResponseMessages.error.bad_request_400.USERNAME_TAKEN,
        );
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
        throw new BadRequestException(
          ApiResponseMessages.error.bad_request_400.EMAIL_TAKEN,
        );
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
      return {
        message: ApiResponseMessages.success.ok_200.USER_UPDATED,
      };
    } else {
      throw new BadRequestException(
        ApiResponseMessages.error.bad_request_400.GENERAL_EXCEPTION,
      );
    }
  }

  // notificationSettings user
  async toggleNotification(userId: string, dto: ToggleNotificationDto) {
    const { notificationType, isEnabled } = dto;

    // get user from the database
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    // if no user is found, throw an error
    if (!user) {
      throw new NotFoundException(ApiResponseMessages.error.not_found_404.USER);
    } else {
      const updateData: NotificationUpdateData = {
        [notificationType]: isEnabled,
      };

      // check if mute all notification is true based on the notificationType
      if (notificationType === NotificationType.MUTE_ALL) {
        if (isEnabled) {
          // set all other notification to false
          updateData.goalsEmailNotification = false;
          updateData.goalsPushNotification = false;
          updateData.todosEmailNotification = false;
          updateData.todosPushNotification = false;
          updateData.journalsEmailNotification = false;
          updateData.journalsPushNotification = false;
        }
      } else {
        // if another notification is toggled, set mute all to false
        if (isEnabled) {
          updateData.muteAllNotifications = false;
        } else {
          // check if all settings are false, set mute all to true
          const settings = await this.prisma.notificationSettings.findUnique({
            where: { userId: user.id },
          });
          const allNotificationsDisabled = Object.values(
            NotificationType,
          ).every((type) => {
            return (
              type === notificationType ||
              type === NotificationType.MUTE_GAMIFICATION ||
              !settings[type]
            );
          });
          if (allNotificationsDisabled) updateData.muteAllNotifications = true;
        }
      }

      const updatedSettings = await this.prisma.notificationSettings.update({
        where: { userId: user.id },
        data: updateData,
        select: {
          goalsEmailNotification: true,
          goalsPushNotification: true,
          todosEmailNotification: true,
          todosPushNotification: true,
          journalsEmailNotification: true,
          journalsPushNotification: true,
          muteAllNotifications: true,
          muteGamification: true,
        },
      });

      return {
        message:
          ApiResponseMessages.success.ok_200.NOTIFICATION_SETTINGS_UPDATED,
        data: updatedSettings,
      };
    }
  }

  // update favourite tools
  async updateFavouriteTools(toolIds: string[], req: CustomRequest) {
    // get the user id from the JWT token
    const userId = req.user.id;

    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException(ApiResponseMessages.error.not_found_404.USER);
    }

    // delete the current favourite tools
    await this.prisma.userTools.deleteMany({
      where: { userId },
    });

    // connect new ones
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        userTools: {
          create: toolIds.map((id) => ({
            tool: { connect: { id } },
            favourite: true,
          })),
        },
      },
    });

    // update favourite field
    await this.prisma.userTools.updateMany({
      where: {
        userId: userId,
        toolId: { in: toolIds },
      },
      data: {
        favourite: true,
      },
    });

    if (updatedUser) {
      return {
        message: ApiResponseMessages.success.ok_200.USER_UPDATED,
      };
    } else {
      throw new BadRequestException(
        ApiResponseMessages.error.bad_request_400.GENERAL_EXCEPTION,
      );
    }
  }

  // delete user
  async deleteUser(id: string, req: CustomRequest) {
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

      // delete related todo before deleting the user
      await this.prisma.todo.deleteMany({
        where: {
          userId: id,
        },
      });

      // delete related journals before deleting the user
      await this.prisma.journal.deleteMany({
        where: {
          userId: id,
        },
      });

      // delete related user logins before deleting the user
      await this.prisma.userStreaks.deleteMany({
        where: {
          userId: id,
        },
      });

      // delete related pomodoro timers before deleting the user
      await this.prisma.pomodoroTimers.deleteMany({
        where: {
          userId: id,
        },
      });

      // delete related meditation timers before deleting the user
      await this.prisma.meditations.deleteMany({
        where: {
          userId: id,
        },
      });

      // delete related user badges before deleting the user
      await this.prisma.userBadges.deleteMany({
        where: {
          userId: id,
        },
      });

      // delete related user streaks before deleting the user
      await this.prisma.userStreaks.deleteMany({
        where: {
          userId: id,
        },
      });

      // delete relates user notifications before deleting the user
      await this.prisma.notificationSettings.deleteMany({
        where: {
          userId: id,
        },
      });

      // delete user
      const deleteUser = await this.prisma.user.delete({
        where: {
          id: id,
        },
        select: {
          id: true,
          email: true,
          username: true,
          avatarUrl: true,
          badges: true,
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
        const deleteUserMessage =
          ApiResponseMessages.success.ok_200.USER_DELETED(deleteUser.username);
        return {
          message: deleteUserMessage,
          data: deleteUser,
        };
      } else {
        // if user was not deleted, throw an error
        throw new BadRequestException(
          ApiResponseMessages.error.bad_request_400.GENERAL_EXCEPTION,
        );
      }
    } else {
      // if user is not the user, throw an error
      throw new UnauthorizedException(
        ApiResponseMessages.error.unauthorized_401.UNAUTHORIZED,
      );
    }
  }
}
