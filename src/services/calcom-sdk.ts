import axios from 'axios';
import { config } from 'dotenv'
config()

const apiKey= process.env.CALCOM_API_KEY;


export type Availability = {
    id?: number;
    days: number[];
    startTime: string;
    endTime: string;
}

export type Schedule = {
    id: number;
    name: string;
    timeZone: string;
    availability: Availability[];
}

export async function me(){
    
    try {
        const url = `https://api.cal.com/api/v1/me?apiKey=${apiKey}`;
        const response = await axios.get(url);
        const data = response.data.user;
        
        if (response.status === 200) {
            return data
        } else {
            throw new Error('Error fetching me, code: ' + response.status);
        }        

    } catch (error) {
        console.error('Error fetching me', error);
        throw new Error('Error fetching me');
    }
}


export async function bookings(userId: string){
    
    try {
        const url = `https://api.cal.com/api/v1/bookings?apiKey=${apiKey}&userId=${userId}`;
        const response = await axios.get(url);
        const data = response.data.bookings;
        
        if (response.status === 200) {
            return data;
        } else {
            throw new Error('Error fetching bookings, code: ' + response.status);
        }
    } catch (error) {
        console.error('Error fetching bookings', error);
        throw new Error('Error fetching bookings');
    }
}

export async function eventTypes(): Promise<EventType[]> {

    try {
        const url = `https://api.cal.com/api/v1/event-types?apiKey=${apiKey}`;
        const response = await axios.get(url);
        
        if (response.status === 200) {
            return response.data.event_types;
        } else {
            throw new Error('Error fetching eventTypes, code: ' + response.status);
        }
    } catch (error) {
        console.error('Error fetching eventTypes', error);
        throw new Error('Error fetching eventTypes');
    }
}

export async function getSchedules() {
    try {
        const url = `https://api.cal.com/api/v1/schedules?apiKey=${apiKey}`;
        const response = await axios.get(url);
        const data = response.data.schedules;
        
        if (response.status === 200) {
            return data;
        } else {
            throw new Error('Error fetching schedules, code: ' + response.status);
        }
    } catch (error) {
        console.error('Error fetching schedules', error);
        throw new Error('Error fetching schedules');
    }
}

export async function getSchedule(scheduleId: number): Promise<Schedule> {
    try {
        const url = `https://api.cal.com/api/v1/schedules/${scheduleId}?apiKey=${apiKey}`;
        const response = await axios.get(url);
        const data = response.data.schedule;
        
        if (response.status === 200) {
            return data;
        } else {
            throw new Error('Error fetching schedule, code: ' + response.status);
        }
    } catch (error) {
        console.error('Error fetching schedule', error);
        throw new Error('Error fetching schedule');
    }
}

export async function createSchedule(name: string, timeZone: string): Promise<boolean> {
    try {
        const url = `https://api.cal.com/api/v1/schedules?apiKey=${apiKey}`;
        const response = await axios.post(url, {
            name,
            timeZone
        });
        const dataRes = response.data;
        console.log('Response', dataRes);
        
        return response.status === 200;
    } catch (error) {
        console.error('Error fetching eventTypes', error);
        return false;
    }
}

export async function createAvailability(scheduleId: number, days: number[], startTime: string, endTime: string): Promise<boolean> {
    try {
        const url = `https://api.cal.com/api/v1/availabilities?apiKey=${apiKey}`;
        const response = await axios.post(url, {
            scheduleId,
            days,
            startTime,
            endTime,
        });
        const dataRes = response.data;
        console.log('Response', dataRes);
        
        return response.status === 200;
    } catch (error) {
        console.error('Error fetching eventTypes', error);
        return false;
    }
}

export async function removeAvailability(availabilityId: number): Promise<boolean> {
    try {
        const url = `https://api.cal.com/api/v1/availabilities/${availabilityId}?apiKey=${apiKey}`;
        const response = await axios.delete(url);
        const dataRes = response.data;
        console.log('Response', dataRes);
        
        return response.status === 200;
    } catch (error) {
        console.error('Error fetching eventTypes', error);
        return false;
    }
}

export async function removeAllAvailabilities(scheduleId: number): Promise<boolean> {
    try {
        const schedule = await getSchedule(scheduleId);
        const availabilities = schedule.availability;
        for (const availability of availabilities) {
            if (!availability.id) {
                continue;
            }
            await removeAvailability(availability.id);
        }
        return true;
    } catch (error) {
        console.error('Error removing all availabilities', error);
        return false;
    }
}

export async function updateAvailabilities(scheduleId: number, availabilities: Availability[]): Promise<boolean> {
    try {
        const schedule = await getSchedule(scheduleId);
        await removeAllAvailabilities(scheduleId);

        for (const availability of availabilities) {
            await createAvailability(scheduleId, availability.days, addDate(availability.startTime), addDate(availability.endTime));
        }
        return true;
    } catch (error) {
        console.error('Error updating availabilities', error);
        return false;
    }
}

function addDate(time: string): string {
    const date = new Date(time);
    return `1970-01-01T${time}:00.000Z`;
}

export type EventType = {
    title: string,
    slug: string,
    scheduleId: number | null,
    length: number,
    hidden: boolean,
    position: number,
    eventName: string | null,
    timeZone: string | null,
    periodType: string | null,
    periodStartDate: string | null,
    periodEndDate: string | null,
    periodDays: number | null,
    periodCountCalendarDays: number | null,
    requiresConfirmation: boolean,
    disableGuests: boolean,
    hideCalendarNotes: boolean,
    minimumBookingNotice: number,
    beforeEventBuffer: number,
    afterEventBuffer: number,
    schedulingType: string | null,
    price: number,
    currency: string,
    slotInterval: number | null,
    successRedirectUrl: string | null,
    description: string,
    locations?: Location[],
    metadata: any,
    seatsPerTimeSlot: number,
    seatsShowAttendees: boolean,
    seatsShowAvailabilityCount: boolean,
}

type Location = {
    address?: string,
    type: string
}
export async function createEventType(data: EventType): Promise<boolean> {
    try {
        const url = `https://api.cal.com/api/v1/event-types?apiKey=${apiKey}`;
        const response = await axios.post(url, data);
        const dataRes = response.data;
        console.log('Response', dataRes);
        
        return response.status === 200;
    } catch (error) {
        console.error('Error fetching eventTypes', error);
        return false;
    }
}

export async function createUser(name: string, email: string): Promise<boolean> {
    try {
        const url = `https://api.cal.com/api/v1/users?apiKey=${apiKey}`;
        const response = await axios.post(url, {
            name,
            email,
        });
        const dataRes = response.data;
        console.log('Response', dataRes);
        
        return response.status === 200;
    } catch (error) {
        console.error('Error fetching teams', error);
        return false;
    }
}

export async function listTeams() {
    try {
        const url = `https://api.cal.com/api/v1/teams?apiKey=${apiKey}`;
        const response = await axios.get(url);
        const data = response.data.teams;
        
        if (response.status === 200) {
            return data;
        } else {
            throw new Error('Error fetching teams, code: ' + response.status);
        }
    } catch (error) {
        console.error('Error fetching teams', error);
        throw new Error('Error fetching teams');
    }
}