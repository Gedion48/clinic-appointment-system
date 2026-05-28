"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { clearAuth, getUser } from "@/lib/auth";
import { User } from "@/types";
import toast from "react-hot-toast";

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setUser(getUser());
  }, [pathname]);

  const handleLogout = () => {
    clearAuth();
    toast.success("Logged out successfully");
    router.push("/login");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/appointments"
            className="font-bold text-slate-800 text-lg"
          >
            Clinic<span className="text-teal-600">Flow</span>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              href="/appointments"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === "/appointments"
                  ? "bg-teal-50 text-teal-700"
                  : "text-slate-600 hover:text-teal-600 hover:bg-slate-50"
              }`}
            >
              Appointments
            </Link>
            <Link
              href="/appointments/create"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === "/appointments/create"
                  ? "bg-teal-50 text-teal-700"
                  : "text-slate-600 hover:text-teal-600 hover:bg-slate-50"
              }`}
            >
              Book Appointment
            </Link>
          </div>

          {/* User + Logout */}
          <div className="flex items-center gap-3">
            {user && (
              <div className="hidden sm:flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-sm">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-semibold text-slate-700">
                  {user.name}
                </span>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="text-sm text-slate-500 hover:text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
