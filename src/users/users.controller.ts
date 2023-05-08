import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
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
import { createResponse } from 'src/utils/helper/functions';
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
    const result = await this.usersService.getAuthenticatedUser(req.user.id);
    return createResponse(HttpStatus.OK, undefined, result.data);
  }

  // get all users
  @Get()
  @UseGuards(JwtAuthGuard)
  async getUsers() {
    const result = await this.usersService.getUsers();
    return createResponse(HttpStatus.OK, undefined, result.data);
  }

  // get user by id
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getUserById(@Param('id') id: string) {
    const result = await this.usersService.getUserById(id);
    return createResponse(HttpStatus.OK, undefined, result.data);
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
    const result = await this.usersService.updateUser(
      id,
      updateUserDto,
      buffer,
      file?.mimetype,
      file?.originalname,
      req,
    );
    return createResponse(HttpStatus.OK, result.message);
  }

  // toggle notificationSettings
  @Patch(':id/notification-settings')
  @UseGuards(JwtAuthGuard)
  async toggleNotification(
    @Param('id') id: string,
    @Body() toggleNotificationDto: ToggleNotificationDto,
  ) {
    const result = await this.usersService.toggleNotification(
      id,
      toggleNotificationDto,
    );
    return createResponse(HttpStatus.OK, result.message, result.data);
  }

  // delete user
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteUser(@Param('id') id: string, @Req() req: CustomRequest) {
    const result = await this.usersService.deleteUser(id, req);
    return createResponse(HttpStatus.OK, result.message, result.data);
  }
}
