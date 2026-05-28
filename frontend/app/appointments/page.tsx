"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { appointmentService } from "@/services/appointmentService";
import AppointmentCard from "@/components/AppointmentCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import EmptyState from "@/components/EmptyState";
import { Appointment } from "@/types";
import { getUser } from "@/lib/auth";

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const user = getUser();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await appointmentService.getAll();
        setAppointments(res.data);
      } catch {
        toast.error("Failed to load appointments");
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const stats = {
    total: appointments.length,
    scheduled: appointments.filter((a) => a.status === "scheduled").length,
    completed: appointments.filter((a) => a.status === "completed").length,
  };

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <p className="text-sm text-teal-600 font-medium mb-1">{today}</p>
          <h1 className="text-2xl font-bold text-slate-900">
            Good day, {user?.name?.split(" ")[0]} 👋
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Here&apos;s your appointment overview
          </p>
        </div>
        <Link
          href="/appointments/create"
          className="btn-primary text-sm self-start"
        >
          + Book Appointment
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Total", value: stats.total },
          { label: "Scheduled", value: stats.scheduled },
          { label: "Completed", value: stats.completed },
        ].map(({ label, value }) => (
          <div key={label} className="card p-4">
            <p className="text-xs text-slate-400 font-medium mb-1">{label}</p>
            <p className="text-2xl font-bold text-slate-800">
              {loading ? "—" : value}
            </p>
          </div>
        ))}
      </div>

      {/* List */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="font-bold text-slate-800">All Appointments</h2>
          {!loading && appointments.length > 0 && (
            <span className="text-xs text-slate-400">
              {appointments.length} records
            </span>
          )}
        </div>

        {loading ? (
          <LoadingSpinner text="Loading appointments..." />
        ) : appointments.length === 0 ? (
          <EmptyState
            title="No appointments yet"
            description="Book your first appointment to get started."
            actionLabel="Book Appointment"
            actionHref="/appointments/create"
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 p-6">
            {appointments.map((appt) => (
              <AppointmentCard key={appt._id} appointment={appt} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
