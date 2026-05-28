import api from '@/lib/axios';
import { AppointmentsResponse, Appointment, CreateAppointmentPayload } from '@/types';

export const appointmentService = {
  getAll: async (): Promise<AppointmentsResponse> => {
    const { data } = await api.get<AppointmentsResponse>('/appointments');
    return data;
  },

  create: async (payload: CreateAppointmentPayload): Promise<{ success: boolean; data: Appointment }> => {
    const { data } = await api.post('/appointments', payload);
    return data;
  },
};