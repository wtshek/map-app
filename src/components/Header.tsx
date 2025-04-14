"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function Header() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Sign out from Firebase
      await signOut(auth);

      // Clear session cookie via API
      await fetch("/api/auth/session", {
        method: "DELETE",
      });

      // Redirect to home page
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b">
      <div className="flex items-center justify-between px-6 h-20">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Image src="/logo.svg" alt="Ping Out" width={200} height={100} />
        </div>

        {/* Right side buttons */}
        <div className="flex items-center gap-4">
          <Link href="/activities/create">
            <Button>Gather your tribe!</Button>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="rounded-full flex items-center gap-2"
              >
                <div className="w-5 h-5">☰</div>
                <div className="w-8 h-8 rounded-full bg-gray-500"></div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
