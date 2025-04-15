"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { ACTIVITY_CATEGORIES } from "@/lib/constants/activity";
import { toast } from "sonner";
import { TimePicker } from "@/components/ui/time-picker"
import { PATH } from "@/lib/constants/path";
import { CreateActivityInput, ActivityCategory } from "@/lib/types/activity";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  dateTime: z.date({
    required_error: "Date and time is required",
  }),
  location: z.object({
    address: z.string().min(1, "Address is required"),
    coordinates: z.object({
      lat: z.number(),
      lng: z.number(),
    }),
  }),
  category: z.string().min(1, "Category is required"),
});

export function ActivityForm() {
  const router = useRouter();
  const [locationSuggestions, setLocationSuggestions] = useState<
    Array<{
      place_name: string;
      center: [number, number];
    }>
  >([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "other",
    },
  });

  const handleLocationSearch = async (value: string) => {
    if (value.length < 3) {
      setLocationSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          value
        )}.json?access_token=${
          process.env.NEXT_PUBLIC_MAPBOX_TOKEN
        }&types=address,place`
      );
      const data = await response.json();
      setLocationSuggestions(data.features);
    } catch (error) {
      console.error("Error fetching location suggestions:", error);
      toast.error("Failed to fetch location suggestions");
    }
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const createActivityInput: CreateActivityInput = {
        name: data.title,
        description: data.description,
        locationName: data.location.address,
        coordinates: data.location.coordinates,
        category: data.category as ActivityCategory,
        date: data.dateTime.toISOString(),
        maxParticipants: 10, // Default value, could be made configurable
        isPublic: true, // Default value, could be made configurable
      };

      const response = await fetch(PATH.API.ACTIVITIES.BASE(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(createActivityInput),
      });

      if (!response.ok) {
        throw new Error("Failed to create activity");
      }

      toast.success("Activity created successfully");
      router.back();
    } catch (error) {
      console.error("Error creating activity:", error);
      toast.error("Failed to create activity");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter activity title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter activity description"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dateTime"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date and Time</FormLabel>
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP p")
                        ) : (
                          <span>Pick a date and time</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <div className="flex flex-col gap-4 p-4">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => {
                          if (date) {
                            const newDate = field.value ? new Date(field.value) : new Date()
                            newDate.setFullYear(date.getFullYear())
                            newDate.setMonth(date.getMonth())
                            newDate.setDate(date.getDate())
                            field.onChange(newDate)
                          }
                        }}
                        initialFocus
                      />
                      <div className="border-t pt-4">
                        <TimePicker
                          value={field.value}
                          onChange={(time) => {
                            const newDate = field.value ? new Date(field.value) : new Date()
                            newDate.setHours(time.getHours())
                            newDate.setMinutes(time.getMinutes())
                            field.onChange(newDate)
                          }}
                        />
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <FormDescription>
                When will the activity take place?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    placeholder="Enter location"
                    value={field.value?.address || ""}
                    onChange={(e) => {
                      handleLocationSearch(e.target.value);
                      field.onChange({
                        ...field.value,
                        address: e.target.value,
                      });
                    }}
                  />
                  {locationSuggestions.length > 0 && (
                    <div className="absolute mt-1 w-full rounded-md bg-white shadow-lg">
                      {locationSuggestions.map((suggestion, index) => (
                        <div
                          key={index}
                          className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                          onClick={() => {
                            field.onChange({
                              address: suggestion.place_name,
                              coordinates: {
                                lat: suggestion.center[1],
                                lng: suggestion.center[0],
                              },
                            });
                            setLocationSuggestions([]);
                          }}
                        >
                          {suggestion.place_name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {ACTIVITY_CATEGORIES.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit">Create Activity</Button>
        </div>
      </form>
    </Form>
  );
}
