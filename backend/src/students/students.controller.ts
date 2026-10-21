import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ParseIdPipe } from '../common/parse-id.pipe';
import { CreateStudentDto } from './dto/create-student.dto';
import { StudentEntity } from './dto/student.entity';
import { UpdateStudentDto } from './dto/update-student.dto';
import { StudentsService } from './students.service';

@ApiTags('students')
@Controller('students')
export class StudentsController {
  constructor(private readonly students: StudentsService) {}

  @Post()
  @ApiOperation({ summary: "O'quvchi yaratish" })
  @ApiCreatedResponse({ type: StudentEntity })
  @ApiBadRequestResponse({ description: 'Validatsiya xatosi' })
  create(@Body() dto: CreateStudentDto) {
    return this.students.create(dto);
  }

  @Get()
  @ApiOperation({ summary: "O'quvchilar ro'yxati" })
  @ApiOkResponse({ type: [StudentEntity] })
  findAll() {
    return this.students.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: "Bitta o'quvchi" })
  @ApiOkResponse({ type: StudentEntity })
  @ApiNotFoundResponse({ description: "O'quvchi topilmadi" })
  findOne(@Param('id', ParseIdPipe) id: number) {
    return this.students.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: "O'quvchini tahrirlash" })
  @ApiOkResponse({ type: StudentEntity })
  @ApiNotFoundResponse({ description: "O'quvchi topilmadi" })
  update(@Param('id', ParseIdPipe) id: number, @Body() dto: UpdateStudentDto) {
    return this.students.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: "O'quvchini o'chirish (to'lovlari ham o'chadi)" })
  @ApiOkResponse({ type: StudentEntity })
  @ApiNotFoundResponse({ description: "O'quvchi topilmadi" })
  remove(@Param('id', ParseIdPipe) id: number) {
    return this.students.remove(id);
  }
}
