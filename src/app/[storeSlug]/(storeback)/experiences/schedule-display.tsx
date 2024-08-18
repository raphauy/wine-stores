import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Availability, Schedule } from "@/services/calcom-sdk";


const dayAbbreviations = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

const formatTime = (time: string) => {
  return time?.substring(0, 5) || ''; // Removes seconds from the time string, returns empty string if time is undefined
}

const sortAvailability = (a: Availability, b: Availability) => {
  if (a.days[0] !== b.days[0]) {
    return a.days[0] - b.days[0];
  }
  return a.startTime.localeCompare(b.startTime);
}

export default function ScheduleDisplay({ scheduleList }: { scheduleList?: Schedule[] }) {
  if (!Array.isArray(scheduleList) || scheduleList.length === 0) {
    return <div className="text-center p-4">No schedules available</div>;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {scheduleList.map((schedule) => (
        <Card key={schedule.id} className="w-full">
          <CardHeader>
            <CardTitle>{schedule.name || 'Unnamed Schedule'}</CardTitle>
          </CardHeader>
          <CardContent>
            {Array.isArray(schedule.availability) && schedule.availability.length > 0 ? (
              <ul className="space-y-2">
                {schedule.availability.sort(sortAvailability).map((slot, index) => (
                  <li key={index} className="text-sm">
                    {Array.isArray(slot.days) && slot.days.map(day => (
                      <div key={day}>
                        {dayAbbreviations[day] || 'Unknown'}, {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                      </div>
                    ))}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No availability set for this schedule</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}