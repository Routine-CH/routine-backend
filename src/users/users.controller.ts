import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { promises as fs } from 'fs';
import { diskStorage } from 'multer';
import { CustomRequest } from 'src/utils/types';
import { JwtAuthGuard } from './../auth/jwt.guard';
import { ToggleNotificationDto } from './dto/toggle-notification.dto';
import { UpdateUserDto } from './dto/user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // get current authenticated user
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getAuthenticatedUser(@Req() req: CustomRequest) {
    return await this.usersService.getAuthenticatedUser(req.user.id);
  }

  // get all users
  @Get()
  @UseGuards(JwtAuthGuard)
  getUsers() {
    return this.usersService.getUsers();
  }

  // get user by id
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  getUserById(@Param('id') id: string) {
    return this.usersService.getUserById(id);
  }

  // update user
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('avatar', { storage: diskStorage({}) }))
  async updateUser(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: CustomRequest,
  ) {
    const buffer = file ? await fs.readFile(file.path) : undefined;
    return await this.usersService.updateUser(
      id,
      updateUserDto,
      buffer,
      file?.mimetype,
      file?.originalname,
      req,
    );
  }

  // toggle notificationSettings
  @Patch(':id/notification-settings')
  @UseGuards(JwtAuthGuard)
  async toggleNotification(
    @Param('id') id: string,
    @Body() toggleNotificationDto: ToggleNotificationDto,
  ) {
    return await this.usersService.toggleNotification(
      id,
      toggleNotificationDto,
    );
  }

  // delete user
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteUser(@Param('id') id: string, @Req() req: CustomRequest) {
    return await this.usersService.deleteUser(id, req);
  }
}
