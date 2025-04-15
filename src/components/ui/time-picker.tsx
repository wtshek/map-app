"use client"

import * as React from "react"
import { format } from "date-fns"
import { Clock } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface TimePickerProps {
  value?: Date
  onChange?: (date: Date) => void
  className?: string
}

export function TimePicker({ value, onChange, className }: TimePickerProps) {
  const [hour, setHour] = React.useState<string>(
    value ? format(value, "HH") : "00"
  )
  const [minute, setMinute] = React.useState<string>(
    value ? format(value, "mm") : "00"
  )

  React.useEffect(() => {
    if (value) {
      setHour(format(value, "HH"))
      setMinute(format(value, "mm"))
    }
  }, [value])

  const handleTimeChange = (newHour: string, newMinute: string) => {
    setHour(newHour)
    setMinute(newMinute)
    if (onChange) {
      const newDate = new Date()
      newDate.setHours(parseInt(newHour))
      newDate.setMinutes(parseInt(newMinute))
      onChange(newDate)
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground",
            className
          )}
        >
          <Clock className="mr-2 h-4 w-4" />
          {value ? format(value, "HH:mm") : <span>Pick a time</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <div className="flex items-center gap-2 p-2">
          <Select
            value={hour}
            onValueChange={(value) => handleTimeChange(value, minute)}
          >
            <SelectTrigger className="w-[70px]">
              <SelectValue placeholder="HH" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0")).map(
                (h) => (
                  <SelectItem key={h} value={h}>
                    {h}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
          <span>:</span>
          <Select
            value={minute}
            onValueChange={(value) => handleTimeChange(hour, value)}
          >
            <SelectTrigger className="w-[70px]">
              <SelectValue placeholder="MM" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0")).map(
                (m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
        </div>
      </PopoverContent>
    </Popover>
  )
} 