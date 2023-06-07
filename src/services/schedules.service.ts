import { ICreate } from "../interfaces/schedules.interface";
import { isBefore, startOfHour } from "date-fns";
import { SchedulesRepository } from "../repositories/services.repository";

class SchedulesService {
    private schedulesRepository: SchedulesRepository;
    constructor() {
        this.schedulesRepository = new SchedulesRepository()
    }
    async create({name, phone, date}: ICreate) {
        const dateFormatter = new Date(date)
        
        const hourStart = startOfHour(dateFormatter)
       
        if(isBefore(hourStart, new Date())) {
            throw new Error("It is not allowed to schedule old date")
        }

        const checkIsAvailable = await this.schedulesRepository.find(hourStart)

        if(checkIsAvailable) {
            throw new Error("Schedule date is not available")
        }
        const create = await this.schedulesRepository.create({name, phone, date: hourStart})
        return create
    }
}
export { SchedulesService }