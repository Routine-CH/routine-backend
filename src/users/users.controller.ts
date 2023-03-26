import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiHeader,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Response } from 'express';
import { promises as fs } from 'fs';
import { diskStorage } from 'multer';
import { User } from 'src/utils/return-types.ts/types';
import { CustomRequest } from 'src/utils/types';
import { JwtAuthGuard } from './../auth/jwt.guard';
import { UpdateUserDto } from './dto/user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // get current authenticated user
  @ApiHeader({
    name: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
    eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.
    SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`,
    description: 'Authorization',
  })
  @ApiCreatedResponse({
    description: 'Returns the authenticated user',
    type: User,
  })
  @ApiBadRequestResponse({
    description: 'Something went wrong. Please try again.',
  })
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getAuthenticatedUser(@Req() req: CustomRequest) {
    return await this.usersService.getAuthenticatedUser(req.user.id);
  }

  // get all users
  @ApiHeader({
    name: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
    eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.
    SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`,
    description: 'Authorization',
  })
  @ApiCreatedResponse({
    description: 'Returns all user',
    type: User,
  })
  @ApiBadRequestResponse({
    description: 'Something went wrong. Please try again.',
  })
  @Get()
  @UseGuards(JwtAuthGuard)
  getUsers() {
    return this.usersService.getUsers();
  }

  // get user by id
  @ApiHeader({
    name: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
    eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.
    SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`,
    description: 'Authorization',
  })
  @ApiCreatedResponse({
    description: 'Returns the user associated with that ID',
    type: User,
  })
  @ApiBadRequestResponse({
    description: 'Something went wrong. Please try again.',
  })
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  getUserById(@Param('id') id: string) {
    return this.usersService.getUserById(id);
  }

  // update user
  @ApiConsumes('multipart/form-data')
  @ApiHeader({
    name: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
    eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.
    SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`,
    description: 'Authorization',
  })
  @ApiBody({
    description: 'Update User with optional image',
    type: 'object',
    isArray: false,
    schema: {
      properties: {
        email: {
          example: 'john.doe@example.com',
          type: 'string',
        },
        username: {
          example: 'johndoe',
          type: 'string',
        },
        oldPassword: {
          example: 'Password!1234',
          type: 'string',
          minLength: 8,
        },
        newPassword: {
          example: 'Password!123456',
          type: 'string',
          minLength: 8,
        },
        avatar: {
          type: 'string',
          format: 'binary',
          example: 'Upload an image file',
        },
      },
    },
  })
  @ApiCreatedResponse({ description: 'User updated successfully' })
  @ApiBadRequestResponse({
    description: `
    Username not available: Username already taken
    E-Mail not available: E-Mail already taken
    User not updated: Oops! Something went wrong. Please try again.
    `,
  })
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('avatar', { storage: diskStorage({}) }))
  async updateUser(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: CustomRequest,
    @Res() res: Response,
  ) {
    const buffer = file ? await fs.readFile(file.path) : undefined;
    return await this.usersService.updateUser(
      id,
      updateUserDto,
      buffer,
      file?.mimetype,
      file?.originalname,
      req,
      res,
    );
  }

  // delete user
  @ApiHeader({
    name: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
    eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.
    SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`,
    description: 'Authorization',
  })
  @ApiCreatedResponse({
    description: 'User deleted successfully',
    type: User,
  })
  @ApiBadRequestResponse({
    description: 'Something went wrong. Please try again.',
  })
  @ApiUnauthorizedResponse({
    description: 'You are not authorized to delete this profile.',
  })
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteUser(
    @Param('id') id: string,
    @Req() req: CustomRequest,
    @Res() res: Response,
  ) {
    return await this.usersService.deleteUser(id, req, res);
  }
}
