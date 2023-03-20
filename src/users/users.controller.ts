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
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { promises as fs } from 'fs';
import { diskStorage } from 'multer';
import { CustomRequest } from 'src/utils/types';
import { UpdateUserDto } from './dto/user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // get current authenticated user
  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  async getAuthenticatedUser(@Req() req: CustomRequest) {
    return await this.usersService.getAuthenticatedUser(req.user.id);
  }

  // get user by id
  @Get(':id')
  getUserById(@Param('id') id: string) {
    return this.usersService.getUserById(id);
  }

  // get all users
  @Get()
  getUsers() {
    return this.usersService.getUsers();
  }

  // update user
  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('avatar', { storage: diskStorage({}) }))
  async updateUser(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: Request,
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
  @UseGuards(AuthGuard('jwt'))
  async deleteUser(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return await this.usersService.deleteUser(id, req, res);
  }
}
