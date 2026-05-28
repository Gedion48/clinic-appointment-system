import { Appointment } from "@/types";

interface Props {
  appointment: Appointment;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatTime(timeStr: string): string {
  const [hours, minutes] = timeStr.split(":").map(Number);
  const ampm = hours >= 12 ? "PM" : "AM";
  const h = hours % 12 || 12;
  return `${h}:${String(minutes).padStart(2, "0")} ${ampm}`;
}

const statusConfig = {
  scheduled: {
    label: "Scheduled",
    className: "badge-scheduled",
    dot: "bg-teal-500",
  },
  completed: {
    label: "Completed",
    className: "badge-completed",
    dot: "bg-slate-400",
  },
  cancelled: {
    label: "Cancelled",
    className: "badge-cancelled",
    dot: "bg-red-400",
  },
};

export default function AppointmentCard({ appointment }: Props) {
  const status = statusConfig[appointment.status] || statusConfig.scheduled;

  return (
    <div className="card p-5 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center text-teal-700 font-bold text-sm border border-teal-100">
            {appointment.patientName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-bold text-slate-800">
              {appointment.patientName}
            </h3>
            <p className="text-xs text-slate-400">Patient</p>
          </div>
        </div>
        <span className={status.className}>
          <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
          {status.label}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-slate-50 rounded-xl p-3">
          <p className="text-xs text-slate-400 mb-1">Date</p>
          <p className="text-sm font-semibold text-slate-700">
            {formatDate(appointment.appointmentDate)}
          </p>
        </div>
        <div className="bg-slate-50 rounded-xl p-3">
          <p className="text-xs text-slate-400 mb-1">Time</p>
          <p className="text-sm font-semibold text-slate-700">
            {formatTime(appointment.appointmentTime)}
          </p>
        </div>
      </div>

      <div className="border-t border-slate-100 pt-3">
        <p className="text-xs text-slate-400 mb-1">Reason for Visit</p>
        <p className="text-sm text-slate-600 line-clamp-2">
          {appointment.reason}
        </p>
      </div>
    </div>
  );
}
