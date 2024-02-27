import * as schedulesInterfaces from '../validations/interfaces/services/schedule.interfaces';
import { isBefore, startOfMinute } from 'date-fns';
import { ScheduleDAL } from '../database/data.access.layer/schedule.dal';
import * as errorHelpers from '../helpers/error.helpers';

class ScheduleService {
  private scheduleDAL: ScheduleDAL;
  constructor() {
    this.scheduleDAL = new ScheduleDAL();
  }

  async create({
    name,
    phone,
    date,
    user_id,
    description,
  }: schedulesInterfaces.ICreateSchedule) {
    const dateFormatted = new Date(date);
    const minuteStart = startOfMinute(dateFormatted);

    if (isBefore(minuteStart, new Date())) {
      throw new errorHelpers.BadRequestError({
        message: 'It is not allowed to schedule an old date',
      });
    }

    const checkIsAvailable =
      await this.scheduleDAL.findIfVerificationIsAvailable({
        date: minuteStart,
        user_id,
      });

    if (checkIsAvailable) {
      throw new errorHelpers.BadRequestError({
        message: 'The scheduled date is not available',
      });
    }

    const create = await this.scheduleDAL.create({
      name,
      phone,
      date: minuteStart,
      user_id,
      description,
    });

    return create;
  }

  async findEverythingOfTheDay({
    date,
    user_id,
  }: schedulesInterfaces.IFindSchedule) {
    const result = await this.scheduleDAL.findEverythingOfTheDay({
      date,
      user_id,
    });

    return result;
  }

  async findAll(user_id: string) {
    const result = await this.scheduleDAL.findAll(user_id);

    return result;
  }

  async update({
    id,
    date,
    user_id,
    phone,
    description,
  }: schedulesInterfaces.IUpdateSchedule) {
    const dateFormatted = new Date(date);
    const minuteStart = startOfMinute(dateFormatted);

    if (isBefore(minuteStart, new Date())) {
      throw new errorHelpers.BadRequestError({
        message: 'It is not allowed to schedule an old date',
      });
    }

    if (!user_id) {
      throw new errorHelpers.NotFoundError({ message: 'User not found' });
    }

    const checkIsAvailable =
      await this.scheduleDAL.findIfVerificationIsAvailable({
        date: minuteStart,
        user_id,
      });

    if (checkIsAvailable) {
      throw new errorHelpers.BadRequestError({
        message: 'The scheduled date is not available',
      });
    }

    const result = await this.scheduleDAL.update({
      id,
      date,
      phone,
      description,
    });

    return result;
  }

  async delete(id: string) {
    await this.scheduleDAL.delete(id);
  }

  async deleteOldSchedules(user_id: string) {
    const result = await this.scheduleDAL.deleteOldSchedules(user_id);

    return result;
  }
}

export { ScheduleService };
