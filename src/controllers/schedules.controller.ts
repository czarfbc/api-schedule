import { NextFunction, Request, Response } from 'express';
import { SchedulesService } from '../services/schedules.service';
import { parseISO } from 'date-fns';

class SchedulesController {
  private schedulesService: SchedulesService;
  constructor() {
    this.schedulesService = new SchedulesService();
  }

  async create(request: Request, response: Response, next: NextFunction) {
    const { name, phone, date, description } = request.body;
    const { user_id } = request;
    try {
      const result = await this.schedulesService.create({
        name,
        phone,
        date,
        user_id,
        description,
      });

      return response.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async findEverythingOfTheDay(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const { date } = request.query;
    const { user_id } = request;
    const parseDate = date ? parseISO(date.toString()) : new Date();
    try {
      const result = await this.schedulesService.findEverythingOfTheDay({
        date: parseDate,
        user_id,
      });

      return response.json(result);
    } catch (error) {
      next(error);
    }
  }

  async findAll(request: Request, response: Response, next: NextFunction) {
    const { user_id } = request;
    try {
      const result = await this.schedulesService.findAll(user_id);

      return response.json(result);
    } catch (error) {
      next(error);
    }
  }

  async update(request: Request, response: Response, next: NextFunction) {
    const { id } = request.params;
    const { date, phone, description } = request.body;
    const { user_id } = request;
    try {
      const result = await this.schedulesService.update({
        id,
        date,
        user_id,
        phone,
        description,
      });

      return response.json(result);
    } catch (error) {
      next(error);
    }
  }

  async delete(request: Request, response: Response, next: NextFunction) {
    const { id } = request.params;
    try {
      const result = await this.schedulesService.delete(id);

      return response.status(204).json(result);
    } catch (error) {
      next(error);
    }
  }

  async deleteOldSchedules(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const { user_id } = request;

    try {
      const result = await this.schedulesService.deleteOldSchedules(user_id);

      return response.status(204).json(result);
    } catch (error) {
      next(error);
    }
  }
}
export { SchedulesController };
