"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { appointmentService } from "@/services/appointmentService";
import { CreateAppointmentPayload } from "@/types";

interface FormErrors {
  patientName?: string;
  appointmentDate?: string;
  appointmentTime?: string;
  reason?: string;
}

const TIME_SLOTS = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
];

function formatTimeSlot(time: string) {
  const [h, m] = time.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${ampm}`;
}

export default function CreateAppointmentPage() {
  const router = useRouter();
  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState<CreateAppointmentPayload>({
    patientName: "",
    appointmentDate: "",
    appointmentTime: "",
    reason: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  const validate = (): boolean => {
    const errs: FormErrors = {};
    if (!form.patientName.trim() || form.patientName.trim().length < 2)
      errs.patientName = "Patient name is required (min 2 characters)";
    if (!form.appointmentDate) errs.appointmentDate = "Please select a date";
    else if (form.appointmentDate < today)
      errs.appointmentDate = "Date cannot be in the past";
    if (!form.appointmentTime)
      errs.appointmentTime = "Please select a time slot";
    if (!form.reason.trim() || form.reason.trim().length < 5)
      errs.reason = "Reason must be at least 5 characters";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await appointmentService.create(form);
      toast.success("Appointment booked successfully!");
      router.push("/appointments");
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Failed to create appointment",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-400 mb-6">
        <Link href="/appointments" className="hover:text-teal-600">
          Appointments
        </Link>
        <span>›</span>
        <span className="text-slate-600 font-medium">Book Appointment</span>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">
          Book an Appointment
        </h1>
        <p className="text-slate-500 text-sm">
          Fill in the details to schedule a clinic visit
        </p>
      </div>

      <div className="card p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {/* Patient Name */}
          <div>
            <label htmlFor="patientName" className="label">
              Patient Name
            </label>
            <input
              id="patientName"
              name="patientName"
              type="text"
              placeholder="Enter full patient name"
              value={form.patientName}
              onChange={handleChange}
              className={`input-field ${errors.patientName ? "border-red-400" : ""}`}
            />
            {errors.patientName && (
              <p className="text-xs text-red-500 mt-1.5">
                {errors.patientName}
              </p>
            )}
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="appointmentDate" className="label">
                Date
              </label>
              <input
                id="appointmentDate"
                name="appointmentDate"
                type="date"
                min={today}
                value={form.appointmentDate}
                onChange={handleChange}
                className={`input-field ${errors.appointmentDate ? "border-red-400" : ""}`}
              />
              {errors.appointmentDate && (
                <p className="text-xs text-red-500 mt-1.5">
                  {errors.appointmentDate}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="appointmentTime" className="label">
                Time Slot
              </label>
              <select
                id="appointmentTime"
                name="appointmentTime"
                value={form.appointmentTime}
                onChange={handleChange}
                className={`input-field ${errors.appointmentTime ? "border-red-400" : ""}`}
              >
                <option value="">Select a time</option>
                {TIME_SLOTS.map((slot) => (
                  <option key={slot} value={slot}>
                    {formatTimeSlot(slot)}
                  </option>
                ))}
              </select>
              {errors.appointmentTime && (
                <p className="text-xs text-red-500 mt-1.5">
                  {errors.appointmentTime}
                </p>
              )}
            </div>
          </div>

          {/* Reason */}
          <div>
            <label htmlFor="reason" className="label">
              Reason for Visit
            </label>
            <textarea
              id="reason"
              name="reason"
              rows={4}
              placeholder="Describe the reason for the appointment..."
              value={form.reason}
              onChange={handleChange}
              className={`input-field resize-none ${errors.reason ? "border-red-400" : ""}`}
            />
            {errors.reason && (
              <p className="text-xs text-red-500 mt-1.5">{errors.reason}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
            <Link href="/appointments" className="btn-secondary flex-1 text-sm">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1 text-sm"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Booking...
                </>
              ) : (
                "Confirm Appointment"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
