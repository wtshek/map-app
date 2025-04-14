"use client";

import { Search } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import Image from "next/image";
import { DatePickerWithRange } from "./ui/date-range-picker";
import { Separator } from "./ui/separator";
import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b">
      <div className="flex items-center justify-between px-6 h-20">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Image src="/logo.svg" alt="Ping Out" width={200} height={100} />
        </div>

        {/* Search Bar */}
        {/* <div className="flex items-center max-w-xl flex-1 mx-auto">
          <div className="flex items-center w-full rounded-full border shadow-sm hover:shadow-md transition-shadow">
            <Button variant="ghost" className="rounded-l-full px-6">Map area</Button>
            <Separator orientation="vertical" className="h-8" />
            <DatePickerWithRange className="border-0 shadow-none" />
            <Separator orientation="vertical" className="h-8" />
            <div className="flex items-center pr-2">
              <Input
                type="text"
                placeholder="Add guests"
                className="border-0 focus-visible:ring-0"
              />
              <Button size="icon" variant="default" className="rounded-full">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div> */}

        {/* Right side buttons */}
        <div className="flex items-center gap-4">
          <Link href="/activities/create">
            <Button>Gather your tribe!</Button>
          </Link>
          <Button
            variant="outline"
            className="rounded-full flex items-center gap-2"
          >
            <div className="w-5 h-5">☰</div>
            <div className="w-8 h-8 rounded-full bg-gray-500"></div>
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 px-6 h-14 overflow-x-auto">
        <Button variant="outline" className="rounded-full">
          Filters
        </Button>
      </div>
    </header>
  );
}
