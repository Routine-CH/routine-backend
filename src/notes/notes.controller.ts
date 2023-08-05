import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { createResponse } from 'src/utils/helper/functions';
import { CustomRequest } from 'src/utils/types';
import { CreateNoteRequestDto, UpdateNoteRequestDto } from './dto/note.dto';
import { NotesService } from './notes.service';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  // get all notes by selected week
  @Get('week')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async getSelectedWeekNotes(@Req() req: CustomRequest) {
    const result = await this.notesService.getNotesBySelectedWeek(req);
    return createResponse(undefined, result.data);
  }

  // get all notes by selected day
  @Get('day')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async getSelectedDayNotes(@Req() req: CustomRequest) {
    const result = await this.notesService.getNotesBySelectedDay(req);
    return createResponse(undefined, result.data);
  }

  // get all notes
  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async getNotes(@Req() req: CustomRequest) {
    const result = await this.notesService.getAllNotes(req);
    return createResponse(undefined, result.data);
  }

  // create note
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('images', 5))
  async createNote(
    @UploadedFiles() images: Express.Multer.File[],
    @Body() createNoteRequestDto: CreateNoteRequestDto,
    @Req() req: CustomRequest,
  ) {
    const { title, description } = createNoteRequestDto;
    const result = await this.notesService.createNote(
      title,
      description,
      images,
      req.user,
    );
    return createResponse(result.message, result.data);
  }

  // get note by id
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async getNoteById(@Param() params: { id: string }) {
    const result = await this.notesService.getNoteById(params.id);
    return createResponse(undefined, result.data);
  }

  // edit note by id
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('images', 5))
  async editNoteById(
    @Param('id') id: string,
    @UploadedFiles() images: Express.Multer.File[],
    @Body() updateNoteRequestDto: UpdateNoteRequestDto,
    @Req() req: CustomRequest,
  ) {
    const { title, description } = updateNoteRequestDto;
    const result = await this.notesService.updateNote(
      id,
      title,
      description,
      images,
      req.user,
    );
    return createResponse(result.message);
  }

  // delete note by id
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  async deleteNoteById(@Param('id') id: string, @Req() req: CustomRequest) {
    const result = await this.notesService.deleteNoteById(id, req);
    return createResponse(result.message, result.data);
  }
}
