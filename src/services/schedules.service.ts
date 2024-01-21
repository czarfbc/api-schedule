import {
  ICreateSchedules,
  IFindSchedules,
  IUpdateSchedule,
} from '../interfaces/schedules.interface';
import { isBefore, startOfMinute } from 'date-fns';
import { SchedulesRepository } from '../repositories/schedules.repository';
import {
  createSchemaSchedules,
  updateSchemaSchedule,
} from '../z.schema/schedules.z.schema';

class SchedulesService {
  private schedulesRepository: SchedulesRepository;
  constructor() {
    this.schedulesRepository = new SchedulesRepository();
  }

  async create({ name, phone, date, user_id, description }: ICreateSchedules) {
    const validateInput = createSchemaSchedules.parse({
      name,
      phone,
      date,
      user_id,
      description,
    });

    const dateFormatted = new Date(validateInput.date);
    const minuteStart = startOfMinute(dateFormatted);

    if (isBefore(minuteStart, new Date())) {
      throw new Error('It is not allowed to schedule an old date');
    }

    const checkIsAvailable =
      await this.schedulesRepository.findIfVerificationIsAvailable({
        date: minuteStart,
        user_id: validateInput.user_id,
      });

    if (checkIsAvailable) {
      throw new Error('The scheduled date is not available');
    }

    const create = await this.schedulesRepository.create({
      name: validateInput.name,
      phone: validateInput.phone,
      date: minuteStart,
      user_id: validateInput.user_id,
      description: validateInput.description,
    });
    return create;
  }

  async findEverythingOfTheDay({ date, user_id }: IFindSchedules) {
    const result = await this.schedulesRepository.findEverythingOfTheDay({
      date,
      user_id,
    });

    return result;
  }

  async findAll(user_id: string) {
    const result = await this.schedulesRepository.findAll(user_id);

    return result;
  }

  async update({ id, date, user_id, phone, description }: IUpdateSchedule) {
    const validateInput = updateSchemaSchedule.parse({
      id,
      date,
      phone,
      description,
      user_id,
    });

    const dateFormatted = new Date(validateInput.date);
    const minuteStart = startOfMinute(dateFormatted);

    if (isBefore(minuteStart, new Date())) {
      throw new Error('It is not allowed to schedule an old date');
    }

    if (!user_id) {
      throw new Error('User not found');
    }
    const checkIsAvailable =
      await this.schedulesRepository.findIfVerificationIsAvailable({
        date: minuteStart,
        user_id: validateInput.user_id,
      });

    if (checkIsAvailable) {
      throw new Error('The scheduled date is not available');
    }

    const result = await this.schedulesRepository.update({
      id: validateInput.id,
      date: validateInput.date,
      phone: validateInput.phone,
      description: validateInput.description,
    });
    return result;
  }

  async delete(id: string) {
    await this.schedulesRepository.delete(id);
  }

  async deleteOldSchedules(user_id: string) {
    const result = await this.schedulesRepository.deleteOldSchedules(user_id);

    return result;
  }
}
export { SchedulesService };
