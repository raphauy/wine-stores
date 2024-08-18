import { config } from 'dotenv';
import { createAvailability, createSchedule, createUser, getSchedule, getSchedules, listTeams, me, removeAllAvailabilities, removeAvailability } from "./calcom-sdk";
config()

async function main() {
    console.log('main')

    const apiKey = process.env.CALCOM_API_KEY;
    if (!apiKey) {
        throw new Error('CALCOM_API_KEY no encontrado en el entorno');
    }

    // const scheduleName = 'Test';
    // const timeZone = 'America/Montevideo';
    // const success = await createSchedule(scheduleName, timeZone);
    // console.log('Success:', success);


    // const scheduleId = 298882;
    // let schedule = await getSchedule(scheduleId);
    // console.log("schedule:")
    // console.log(JSON.stringify(schedule, null, 2));

    // await removeAllAvailabilities(scheduleId);

    // schedule = await getSchedule(scheduleId);
    // console.log("schedule:")
    // console.log(JSON.stringify(schedule, null, 2));

    // const scheduleId = 298917;
    // const days = [1, 2, 3, 4, 5];
    // const startTime = "1970-01-01T17:00:00.000Z"
    // const endTime = "1970-01-01T17:00:00.000Z"
    // const success = await createAvailability(scheduleId, days, startTime, endTime);
    // console.log('Success:', success);

    // const teams = await listTeams();
    // console.log(JSON.stringify(teams, null, 2));

    // const user = await me();
    // console.log(user);

    const teamId= 17484
    const userId = 1;
    const role= "MEMBER";

    const name = "Test";
    const email = "rapha@tinta.wine";
    const success = await createUser(name, email);
    console.log('Success:', success);
}

main()