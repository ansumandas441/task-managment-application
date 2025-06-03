import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { TaskService } from './task-service.service';
import { TaskDto } from './dto/task.dto';
import { GetUserClaims, UserClaims } from './decorators/user-claims.decorator';
import { AuthGuard } from './decorators/auth.guard';
import { GetAllTaskRequestDto } from './dto/get-all-task.dto';
import { TaskUpdateDto } from './dto/task-update.dto';
import { Response } from './response/response-content';

@Controller()
@UseGuards(AuthGuard)
export class TaskServiceController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  async create(
    @Body() taskDto: TaskDto,
    @GetUserClaims() userClaims: UserClaims
  ){
    const userId = userClaims.getUserId();
    const result = await this.taskService.create(userId, taskDto);
    if(!result){
      throw new HttpException('INTERNAL_SERVER_ERROR' , HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return Response.Success(result);
  }

  @Put(':id')
  async update(
    @Param('id') taskId: string,
    @Body() taskUpdateDto: TaskUpdateDto,
    @GetUserClaims() userClaims: UserClaims,
  ){
    const userId = userClaims.getUserId();
    const result = await this.taskService.update(userId, taskId, taskUpdateDto);
    if(!result){
      throw new HttpException('INTERNAL_SERVER_ERROR' , HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return Response.Success(result);
  }

  @Patch(':id/completion')
  async updateStatus(
    @Param('id') taskId: string,
    @GetUserClaims() userClaims: UserClaims,
  ){
    const userId = userClaims.getUserId();
    const result = await this.taskService.taskCompletion(userId, taskId);
    if(!result){
      throw new HttpException('INTERNAL_SERVER_ERROR' , HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return Response.Success(result);
  }

  @Get()
  async getAll(
    @Query() getAllTaskDto: GetAllTaskRequestDto,
    @GetUserClaims() userClaims: UserClaims,
  ){
    const userId = userClaims.getUserId();
    const result = await this.taskService.getAllPaginated(userId, getAllTaskDto);
    if(!result) {
      throw new HttpException('INTERNAL_SERVER_ERROR', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return Response.Success(result);
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

    return Response.Success(result);

  }

  @Delete(':id')
  async delete(
    @Param('id') taskId: string,
    @GetUserClaims() userClaims: UserClaims,
  ){
    const userId = userClaims.getUserId();
    const result = await this.taskService.delete(userId, taskId);
    if(!result){
      throw new HttpException('INTERNAL_SERVER_ERROR' , HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return Response.Success('DELETED SUCCESSFULLY')
  }

}
