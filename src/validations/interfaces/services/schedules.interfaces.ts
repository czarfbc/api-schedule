export interface ICreateSchedules {
  name: string;
  phone: string;
  date: Date;
  user_id: string;
  description: string;
}

export interface IFindSchedules {
  date: Date;
  user_id: string;
}

export interface IUpdateSchedule {
  id: string;
  date: Date;
  phone: string;
  description: string;
  user_id?: string;
}
