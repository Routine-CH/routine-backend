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
import { Response } from 'express';
import { promises as fs } from 'fs';
import { diskStorage } from 'multer';
import { CustomRequest } from 'src/utils/types';
import { JwtAuthGuard } from './../auth/jwt.guard';
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
