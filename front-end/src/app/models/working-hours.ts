export type DayOfWeek = 
    'MONDAY' | 
    'TUESDAY' | 
    'WEDNESDAY' | 
    'THURSDAY' | 
    'FRIDAY' | 
    'SATURDAY' | 
    'SUNDAY';

export class WorkingHours {
    dayOfWeek: DayOfWeek;
    startTime: string; // e.g., "09:00"
    endTime: string;   // e.g., "17:00"

    constructor(dayOfWeek: DayOfWeek, startTime: string, endTime: string) {
        this.dayOfWeek = dayOfWeek;
        this.startTime = startTime;
        this.endTime = endTime;
    }
}