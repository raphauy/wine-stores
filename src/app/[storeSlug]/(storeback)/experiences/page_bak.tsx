import { getSchedules } from "@/services/calcom-sdk"
import AvailabilitySelector from "./availability-selector"
import ScheduleDisplay from "./schedule-display"
import ScheduleEmbedded from "./schedule-embedded"

type Props= {
  params: {
      storeSlug: string;
  }
}

export default async function ProductsPage({ params }: Props) {
  const storeSlug = params.storeSlug
  
  const schedules = await getSchedules();

  const duration = 30
  const scheduleId = 295040
  const slug= "agency-planner"
  const namespace= "bodega-1"

  return (
    <div className="w-full">      


      <div className="container bg-white p-3 py-4 mx-auto border rounded-md text-muted-foreground dark:text-white space-y-5">
        <p className="text-2xl font-bold">Experiences</p>

        <ScheduleDisplay scheduleList={schedules} />

        <AvailabilitySelector duration={duration} scheduleId={scheduleId} />

        <ScheduleEmbedded slug={slug} namespace={namespace} />

      </div>
    </div>
  )
}
  
