import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
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
import { UpdateFavouriteToolsDto } from './dto/update-favourite-tools.dto';
import { UpdateUserDto } from './dto/user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // get current authenticated user
  @Get('me')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async getAuthenticatedUser(@Req() req: CustomRequest) {
    const result = await this.usersService.getAuthenticatedUser(req.user.id);
    return createResponse(undefined, result.data);
  }

  // get current authenticated user gamification information
  @Get('me/gamification')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async getAuthenticatedUserGamification(@Req() req: CustomRequest) {
    const result = await this.usersService.getAuthenticatedUserGamification(
      req.user.id,
    );
    return createResponse(undefined, result.data);
  }

  // get all users
  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async getUsers() {
    const result = await this.usersService.getUsers();
    return createResponse(undefined, result.data);
  }

  // get all tools
  @Get('tools')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async getTools() {
    const result = await this.usersService.getTools();
    return createResponse(undefined, result.data);
  }

  // get user by id
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async getUserById(@Param('id') id: string) {
    const result = await this.usersService.getUserById(id);
    return createResponse(undefined, result.data);
  }

  // update user
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
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
    return createResponse(result.message);
  }

  // toggle notificationSettings
  @Patch(':id/notification-settings')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async toggleNotification(
    @Param('id') id: string,
    @Body() toggleNotificationDto: ToggleNotificationDto,
  ) {
    const result = await this.usersService.toggleNotification(
      id,
      toggleNotificationDto,
    );
    return createResponse(result.message, result.data);
  }

  // patch favourite tools
  @Patch(':id/favourite-tools')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async updateFavouriteTools(
    @Body() updateFavouriteToolsDto: UpdateFavouriteToolsDto,
    @Req() req: CustomRequest,
  ) {
    const result = await this.usersService.updateFavouriteTools(
      updateFavouriteToolsDto.toolIds,
      req,
    );
    return createResponse(result.message);
  }

  // delete user
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  async deleteUser(@Param('id') id: string, @Req() req: CustomRequest) {
    const result = await this.usersService.deleteUser(id, req);
    return createResponse(result.message, result.data);
  }
}
