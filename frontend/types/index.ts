export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
  message?: string;
}

export interface Appointment {
  _id: string;
  patientName: string;
  appointmentDate: string;
  appointmentTime: string;
  reason: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface AppointmentsResponse {
  success: boolean;
  count: number;
  data: Appointment[];
}

export interface CreateAppointmentPayload {
  patientName: string;
  appointmentDate: string;
  appointmentTime: string;
  reason: string;
}