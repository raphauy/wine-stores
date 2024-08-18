//AvailabilitySelector
'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { updateAvailabilitiesAction } from './actions'
import { Availability } from '@/services/calcom-sdk'
import { toast } from '@/components/ui/use-toast'

const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']

type Props = {
  duration: number; 
  scheduleId: number;
}

export default function AvailabilitySelector({ duration = 60, scheduleId }: Props) {
  const [availability, setAvailability] = useState<{ [key: string]: { start: string, end: string } }>({
    'Lunes': { start: '09:00', end: '17:00' },
    'Martes': { start: '09:00', end: '17:00' },
    'Miércoles': { start: '09:00', end: '17:00' },
    'Jueves': { start: '09:00', end: '17:00' },
    'Viernes': { start: '09:00', end: '17:00' },
  })

  const timeSlots = useMemo(() => {
    const slots = [];
    const totalMinutesInDay = 24 * 60;
    for (let minutes = 0; minutes < totalMinutesInDay; minutes += duration) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      slots.push(`${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`);
    }
    return slots;
  }, [duration]);

  const handleDayToggle = (day: string) => {
    setAvailability(prev => {
      const newAvailability = { ...prev }
      if (newAvailability[day]) {
        delete newAvailability[day]
      } else {
        newAvailability[day] = { start: '09:00', end: '17:00' }
      }
      return newAvailability
    })
  }

  const handleTimeChange = (day: string, type: 'start' | 'end', value: string) => {
    setAvailability(prev => ({
      ...prev,
      [day]: { ...prev[day], [type]: value }
    }))
  }

  const generateAvailability = (): Availability[] => {
    const availabilityArray: Availability[] = []
    const dayIndices = { 'Lunes': 1, 'Martes': 2, 'Miércoles': 3, 'Jueves': 4, 'Viernes': 5, 'Sábado': 6, 'Domingo': 0 }

    Object.entries(availability).forEach(([day, times]) => {
      const dayIndex = dayIndices[day as keyof typeof dayIndices]
      const existingSlot = availabilityArray.find(slot => 
        slot.startTime === times.start && 
        slot.endTime === times.end && 
        slot.days[slot.days.length - 1] === dayIndex - 1
      )

      if (existingSlot) {
        existingSlot.days.push(dayIndex)
      } else {
        availabilityArray.push({
          days: [dayIndex],
          startTime: times.start,
          endTime: times.end
        })
      }
    })

    return availabilityArray
  }

  const handleSave = () => {
    const availabilities = generateAvailability()
    console.log('Generated Availability:', availabilities)
    updateAvailabilitiesAction(scheduleId, availabilities)
    .then(() => {
      toast({ title: "Disponibilidad actualizada" })
    })
    .catch((error) => {
      toast({ title: "Error", description: error.message })
    })
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Selecciona tu disponibilidad</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {daysOfWeek.map(day => (
            <div key={day} className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Switch
                  id={day}
                  checked={!!availability[day]}
                  onCheckedChange={() => handleDayToggle(day)}
                />
                <Label htmlFor={day} className="w-24">{day}</Label>
              </div>
              {availability[day] && (
                <div className="flex items-center space-x-2">
                  <Select
                    value={availability[day].start}
                    onValueChange={(value) => handleTimeChange(day, 'start', value)}
                  >
                    <SelectTrigger className="w-[100px]">
                      <SelectValue placeholder="Inicio" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map(slot => (
                        <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <span>-</span>
                  <Select
                    value={availability[day].end}
                    onValueChange={(value) => handleTimeChange(day, 'end', value)}
                  >
                    <SelectTrigger className="w-[100px]">
                      <SelectValue placeholder="Fin" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map(slot => (
                        <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave}>Guardar</Button>
      </CardFooter>
    </Card>
  )
}