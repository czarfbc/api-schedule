import { Router } from "express";
import { SchedulesController } from "../controllers/schedules.controller";

class SchedulesRoutes {
    private router: Router
    private schedulesController: SchedulesController
    constructor() {
        this.router = Router()
        this.schedulesController = new SchedulesController()
    }
    getRoutes(): Router { 
        
        this.router.post('/', this.schedulesController.store.bind(this.schedulesController))
        return this.router
    }
}
export { SchedulesRoutes }