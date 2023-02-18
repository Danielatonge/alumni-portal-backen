export interface Course {
    id: number;
    name: string;
    description: string;
    teachers: string[];
    tags: string[];
    slotsAvailable: number;
    slotsOccupied: number;
    startDate: Date;
    endDate: Date;
    applied: boolean;
}
