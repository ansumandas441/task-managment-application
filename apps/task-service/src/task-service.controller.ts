import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { TaskService } from './task-service.service';
import { TaskDto } from './dto/task.dto';
import { GetUserClaims, UserClaims } from './decorators/user-claims.decorator';
import { AuthGuard } from './decorators/auth.guard';
import { GetAllTaskRequestDto } from './dto/get-all-task.dto';
import { TaskUpdateDto } from './dto/task-update.dto';

@Controller()
@UseGuards(AuthGuard)
export class TaskServiceController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  create(
    @Body() taskDto: TaskDto,
    @GetUserClaims() userClaims: UserClaims
  ){
    const userId = userClaims.getUserId();
    const result = this.taskService.create(userId, taskDto);
    if(!result){
      throw new HttpException('INTERNAL_SERVER_ERROR' , HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return result;
  }

  @Put()
  update(
    @Body() taskUpdateDto: TaskUpdateDto,
    @GetUserClaims() userClaims: UserClaims,
  ){
    const userId = userClaims.getUserId();
    const result = this.taskService.update(userId, taskUpdateDto);
    if(!result){
      throw new HttpException('INTERNAL_SERVER_ERROR' , HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return result;
  }

  @Get()
  async getAll(
    @Body() getAllTaskDto: GetAllTaskRequestDto,
    @GetUserClaims() userClaims: UserClaims,
  ){
    const userId = userClaims.getUserId();
    await this.taskService.getAllPaginated(userId, getAllTaskDto);

  }

  @Get(':id')
  async getById(
    @Param('id') taskId: string,
    @GetUserClaims() userClaims: UserClaims,
  ){
    const userId = userClaims.getUserId();
    const result = await this.taskService.getById(userId, taskId);
    if(!result){
      throw new HttpException('INTERNAL_SERVER_ERROR' , HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return result;

  }

  @Delete(':id')
  async delete(
    @Param('id') taskId: string,
    @GetUserClaims() userClaims: UserClaims,
  ){
    const userId = userClaims.getUserId();
    await this.taskService.delete(userId, taskId);

  }

}
