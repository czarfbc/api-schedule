import { ICreate } from "../interfaces/schedules.interface";
import {
  getHours,
  isBefore,
  startOfHour,
  getMinutes,
  startOfMinute,
} from "date-fns";
import { SchedulesRepository } from "../repositories/services.repository";

class SchedulesService {
  private schedulesRepository: SchedulesRepository;
  constructor() {
    this.schedulesRepository = new SchedulesRepository();
  }
  async create({ name, phone, date, user_id }: ICreate) {
    const dateFormatted = new Date(date);

    const minuteStart = startOfMinute(dateFormatted);

    if (isBefore(minuteStart, new Date())) {
      throw new Error("Não é permitido agendar data antiga");
    }

    const checkIsAvailable = await this.schedulesRepository.find(
      minuteStart,
      user_id
    );

    if (checkIsAvailable) {
      throw new Error("A data agendada não está disponível");
    }

    const create = await this.schedulesRepository.create({
      name,
      phone,
      date: minuteStart,
      user_id,
    });
    return create;
  }
  async index(date: Date, user_id: string) {
    const result = await this.schedulesRepository.findAll(date, user_id);

    return result;
  }
  async update(id: string, date: Date, user_id: string) {
    const dateFormatted = new Date(date);

    const minuteStart = startOfMinute(dateFormatted);

    if (isBefore(minuteStart, new Date())) {
      throw new Error("Não é permitido agendar data antiga");
    }

    const checkIsAvailable = await this.schedulesRepository.find(
      minuteStart,
      user_id
    );

    if (checkIsAvailable) {
      throw new Error("A data agendada não está disponível");
    }

    const result = await this.schedulesRepository.update(id, date);
    return result;
  }
  async delete(id: string) {
    const checkExists = await this.schedulesRepository.delete(id);
  }
}
export { SchedulesService };
