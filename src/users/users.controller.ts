import {
  Body,
  Controller,
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
import { Request, Response } from 'express';
import { promises as fs } from 'fs';
import { diskStorage } from 'multer';
import { UpdateUserDto } from './dto/user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  getUserById(@Param() params: { id: string }) {
    return this.usersService.getUserById(params.id);
  }

  @Get()
  getUsers() {
    return this.usersService.getUsers();
  }

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
}
