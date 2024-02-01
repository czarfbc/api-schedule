import {
  ICreateSchedules,
  IFindSchedules,
  IUpdateSchedule,
} from '../validations/interfaces/schedules.interface';
import { isBefore, startOfMinute } from 'date-fns';
import { SchedulesDALs } from '../database/data.access.layer/schedules.dals';
import {
  createSchemaSchedules,
  updateSchemaSchedule,
} from '../validations/z.schema/schedules.z.schema';

class SchedulesService {
  private schedulesDALs: SchedulesDALs;
  constructor() {
    this.schedulesDALs = new SchedulesDALs();
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
      await this.schedulesDALs.findIfVerificationIsAvailable({
        date: minuteStart,
        user_id: validateInput.user_id,
      });

    if (checkIsAvailable) {
      throw new Error('The scheduled date is not available');
    }

    const create = await this.schedulesDALs.create({
      name: validateInput.name,
      phone: validateInput.phone,
      date: minuteStart,
      user_id: validateInput.user_id,
      description: validateInput.description,
    });
    return create;
  }

  async findEverythingOfTheDay({ date, user_id }: IFindSchedules) {
    const result = await this.schedulesDALs.findEverythingOfTheDay({
      date,
      user_id,
    });

    return result;
  }

  async findAll(user_id: string) {
    const result = await this.schedulesDALs.findAll(user_id);

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
      await this.schedulesDALs.findIfVerificationIsAvailable({
        date: minuteStart,
        user_id: validateInput.user_id,
      });

    if (checkIsAvailable) {
      throw new Error('The scheduled date is not available');
    }

    const result = await this.schedulesDALs.update({
      id: validateInput.id,
      date: validateInput.date,
      phone: validateInput.phone,
      description: validateInput.description,
    });
    return result;
  }

  async delete(id: string) {
    await this.schedulesDALs.delete(id);
  }

  async deleteOldSchedules(user_id: string) {
    const result = await this.schedulesDALs.deleteOldSchedules(user_id);

    return result;
  }
}
export { SchedulesService };
