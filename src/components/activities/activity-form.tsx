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

const formSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().min(1, "Description is required").max(500),
  dateTime: z.date({
    required_error: "Date and time is required",
  }),
  location: z.object({
    address: z.string().min(1, "Location is required"),
    coordinates: z.object({
      lat: z.number(),
      lng: z.number(),
    }),
  }),
  category: z.enum([
    "sports",
    "social",
    "education",
    "entertainment",
    "food",
    "travel",
    "other",
  ]),
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
      // TODO: Implement API call to create activity
      console.log("Form submitted:", data);

      toast.success("Activity created successfully");
      router.back();
    } catch (error) {
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
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
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
