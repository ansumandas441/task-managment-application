import { Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { TaskServiceService } from './task-service.service';

@Controller()
export class TaskServiceController {
  constructor(private readonly taskServiceService: TaskServiceService) {}

  @Post()
  create(){

  }

  @Put()
  update(){

  }

  @Delete()
  delete(){

  }

  @Get()
  getAll(){

  }

  @Get()
  getById(){
    
  }

}
