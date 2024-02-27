import { NextFunction, Request, Response } from 'express';
import { ScheduleService } from '../services/schedule.service';
import { parseISO } from 'date-fns';

class ScheduleController {
  private scheduleService: ScheduleService;
  constructor() {
    this.scheduleService = new ScheduleService();
  }

  async create(request: Request, response: Response, next: NextFunction) {
    const { name, phone, date, description } = request.body;
    const { user_id } = request;

    const result = await this.scheduleService.create({
      name,
      phone,
      date,
      user_id,
      description,
    });

    return response.status(201).json(result);
  }

  async findEverythingOfTheDay(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const { date } = request.query;
    const { user_id } = request;
    const parseDate = date ? parseISO(date.toString()) : new Date();

    const result = await this.scheduleService.findEverythingOfTheDay({
      date: parseDate,
      user_id,
    });

    return response.json(result);
  }

  async findAll(request: Request, response: Response, next: NextFunction) {
    const { user_id } = request;

    const result = await this.scheduleService.findAll(user_id);

    return response.json(result);
  }

  async update(request: Request, response: Response, next: NextFunction) {
    const { id } = request.params;
    const { date, name, phone, description } = request.body;
    const { user_id } = request;

    const result = await this.scheduleService.update({
      id,
      date,
      name,
      user_id,
      phone,
      description,
    });

    return response.json(result);
  }

  async delete(request: Request, response: Response, next: NextFunction) {
    const { id } = request.params;

    const result = await this.scheduleService.delete(id);

    return response.status(204).json(result);
  }

  async deleteOldSchedules(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const { user_id } = request;

    const result = await this.scheduleService.deleteOldSchedules(user_id);

    return response.status(204).json(result);
  }
}

export { ScheduleController };
