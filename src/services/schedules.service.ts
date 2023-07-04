import { ICreate } from "../interfaces/schedules.interface";
import { getHours, isBefore, startOfHour, getMinutes, startOfMinute } from "date-fns";
import { SchedulesRepository } from "../repositories/services.repository";

class SchedulesService {
    private schedulesRepository: SchedulesRepository
    constructor() {
        this.schedulesRepository = new SchedulesRepository()
    }
    async create({name, phone, date, user_id}: ICreate) {
        const dateFormatted = new Date(date)
        //const hourStart = startOfHour(dateFormatted)

        const minuteStart = startOfMinute(dateFormatted)

        const hour = getHours(dateFormatted)
        const minutes = getMinutes(dateFormatted)
        
        // if(hour <= 8 || hour >= 20) {
        //     throw new Error('Create Schedule between 9 and 19')
        // }

        
        if(isBefore(minuteStart, new Date())) {
            throw new Error('It is not allowed to schedule old date')
        }

        const checkIsAvailable = await this.schedulesRepository.find(minuteStart, user_id)

        
        if(checkIsAvailable) {
            throw new Error('Schedule date is not available')
        }

        const create = await this.schedulesRepository.create({name, phone, date:minuteStart, user_id})
        return create
    }
    async index(date: Date) {
        const result = await this.schedulesRepository.findAll(date)
        
        return result
    }
    async update(id: string, date: Date, user_id: string) {
        const dateFormatted = new Date(date)
        //const hourStart = startOfHour(dateFormatted)

        const minuteStart = startOfMinute(dateFormatted)
       
        if(isBefore(minuteStart, new Date())) {
 
            throw new Error('It is not allowed to schedule old date')
        }
      

        const checkIsAvailable = await this.schedulesRepository.find(minuteStart, user_id)
        
        if(checkIsAvailable) {
          
            throw new Error('Schedule date is not available')
        }
        

        const result = await this.schedulesRepository.update(id, date)
        return result
    }
    async delete(id: string) {
        const checkExists = await this.schedulesRepository.delete(id)
    }
}
export { SchedulesService }