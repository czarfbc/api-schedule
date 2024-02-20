import { endOfDay, startOfDay } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { prisma } from '../prisma';
import * as schedulesInterfaces from '../../validations/interfaces/services/schedules.interfaces';
import * as schedulesZSchemas from '../../validations/z.schemas/schedules.z.schemas';

class SchedulesDALs {
  async create({
    name,
    phone,
    date,
    user_id,
    description,
  }: schedulesInterfaces.ICreateSchedules) {
    const validateInput = schedulesZSchemas.createSchemaSchedules.parse({
      name,
      phone,
      date,
      user_id,
      description,
    });

    const timeZone = 'America/Sao_Paulo';
    const dateInGmtMinus3 = utcToZonedTime(validateInput.date, timeZone);

    const result = await prisma.schedule.create({
      data: {
        name: validateInput.name,
        phone: validateInput.phone,
        date: dateInGmtMinus3,
        user_id: validateInput.user_id,
        description: validateInput.description,
      },
    });
    return result;
  }

  async findAll(user_id: string) {
    const result = await prisma.schedule.findMany({
      where: {
        user_id,
      },
      orderBy: {
        date: 'asc',
      },
    });
    return result;
  }

  async deleteOldSchedules(user_id: string) {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - 91);

    const result = await this.findAll(user_id);
    const filteredData = result.filter(
      (item) => new Date(item.date) < currentDate
    );

    for (const item of filteredData) {
      await prisma.schedule.delete({
        where: { id: item.id },
      });
    }

    return filteredData;
  }

  async findIfVerificationIsAvailable({
    date,
    user_id,
  }: schedulesInterfaces.IFindSchedules) {
    const result = await prisma.schedule.findFirst({
      where: {
        date,
        user_id,
      },
    });
    return result;
  }

  async findById(id: string) {
    const result = await prisma.schedule.findUnique({
      where: { id },
    });
    return result;
  }

  async findEverythingOfTheDay({
    date,
    user_id,
  }: schedulesInterfaces.IFindSchedules) {
    const result = await prisma.schedule.findMany({
      where: {
        date: {
          gte: startOfDay(date),
          lt: endOfDay(date),
        },
        user_id,
      },
      orderBy: {
        date: 'asc',
      },
    });
    return result;
  }

  async update({
    id,
    date,
    phone,
    description,
  }: schedulesInterfaces.IUpdateSchedule) {
    const validateInput = schedulesZSchemas.updateSchemaSchedule.parse({
      id,
      date,
      phone,
      description,
    });
    const result = await prisma.schedule.update({
      where: {
        id: validateInput.id,
      },
      data: {
        date: validateInput.date,
        phone: validateInput.phone,
        description: validateInput.description,
      },
    });
    return result;
  }

  async delete(id: string) {
    const result = await prisma.schedule.delete({
      where: { id },
    });
    return result;
  }
}
export { SchedulesDALs };
