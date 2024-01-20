import {
  ICreateSchedules,
  IFindSchedules,
  IUpdateSchedule,
} from '../interfaces/schedules.interface';
import { isBefore, startOfMinute } from 'date-fns';
import { SchedulesRepository } from '../repositories/schedules.repository';

class SchedulesService {
  private schedulesRepository: SchedulesRepository;
  constructor() {
    this.schedulesRepository = new SchedulesRepository();
  }

  async create({ name, phone, date, user_id, description }: ICreateSchedules) {
    const dateFormatted = new Date(date);

    const minuteStart = startOfMinute(dateFormatted);

    if (isBefore(minuteStart, new Date())) {
      throw new Error('Não é permitido agendar data antiga');
    }

    const checkIsAvailable =
      await this.schedulesRepository.findIfVerificationIsAvailable({
        date: minuteStart,
        user_id,
      });

    if (checkIsAvailable) {
      throw new Error('A data agendada não está disponível');
    }

    const create = await this.schedulesRepository.create({
      name,
      phone,
      date: minuteStart,
      user_id,
      description,
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
    const dateFormatted = new Date(date);

    const minuteStart = startOfMinute(dateFormatted);

    if (isBefore(minuteStart, new Date())) {
      throw new Error('Não é permitido agendar data antiga');
    }

    if (!user_id) {
      throw new Error('Usuário não encontrado');
    }
    const checkIsAvailable =
      await this.schedulesRepository.findIfVerificationIsAvailable({
        date: minuteStart,
        user_id,
      });

    if (checkIsAvailable) {
      throw new Error('A data agendada não está disponível');
    }

    const result = await this.schedulesRepository.update({
      id,
      date,
      phone,
      description,
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
