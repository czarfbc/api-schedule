import { ICreate } from "../interfaces/schedules.interface";
import { isBefore, startOfMinute } from "date-fns";
import { SchedulesRepository } from "../repositories/services.repository";

class SchedulesService {
  private schedulesRepository: SchedulesRepository;
  constructor() {
    this.schedulesRepository = new SchedulesRepository();
  }
  async create({ name, phone, date, user_id, description }: ICreate) {
    const dateFormatted = new Date(date);

    const minuteStart = startOfMinute(dateFormatted);

    if (isBefore(minuteStart, new Date())) {
      throw new Error("Não é permitido agendar data antiga");
    }

    const checkIsAvailable = await this.schedulesRepository.findAll(
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
      description,
    });
    return create;
  }

  async index(date: Date, user_id: string) {
    const result = await this.schedulesRepository.findEverythingOfTheDay(
      date,
      user_id
    );

    return result;
  }

  async indexes(date: Date, user_id: string) {
    const result = await this.schedulesRepository.findAll(date, user_id);

    return result;
  }

  async update(
    id: string,
    date: Date,
    user_id: string,
    phone: string,
    description: string
  ) {
    const dateFormatted = new Date(date);

    const minuteStart = startOfMinute(dateFormatted);

    if (isBefore(minuteStart, new Date())) {
      throw new Error("Não é permitido agendar data antiga");
    }

    const checkIsAvailable = await this.schedulesRepository.findAll(
      minuteStart,
      user_id
    );

    if (checkIsAvailable) {
      throw new Error("A data agendada não está disponível");
    }

    const result = await this.schedulesRepository.update(
      id,
      date,
      phone,
      description
    );
    return result;
  }

  async delete(id: string) {
    await this.schedulesRepository.delete(id);
  }
}
export { SchedulesService };
