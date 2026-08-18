'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, CheckCircle2 } from 'lucide-react';
import clsx from 'clsx';
import { getAppointmentById, rescheduleAppointment } from '../../../../../api/appointments';
import { getDoctorSlots } from '../../../../../api/doctors';
import { Skeleton } from '../../../../../components/Skeleton';
import { Spinner } from '../../../../../components/Spinner';

export default function RescheduleAppointmentPage() {
  const { appointmentId } = useParams() as { appointmentId: string };
  const router = useRouter();
  const [appt, setAppt] = useState<any>(null);
  const [slots, setSlots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [rescheduling, setRescheduling] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [date, setDate] = useState<string>('');

  useEffect(() => {
    fetchAppt();
  }, []);

  useEffect(() => {
    if (appt && date) {
      fetchSlots(date);
    }
  }, [date, appt]);

  const fetchAppt = async () => {
    try {
      const data = await getAppointmentById(appointmentId);
      setAppt(data);
      // Default to next day from current appointment
      const d = new Date(data.date);
      d.setDate(d.getDate() + 1);
      setDate(d.toISOString().split('T')[0]);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSlots = async (selectedDate: string) => {
    setLoading(true);
    try {
      const data = await getDoctorSlots(appt.doctorId, selectedDate);
      setSlots(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const changeDate = (days: number) => {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    setDate(d.toISOString().split('T')[0]);
  };

  const handleReschedule = async (slotId: string) => {
    if (!confirm('Are you sure you want to reschedule to this time?')) return;
    
    setRescheduling(true);
    try {
      await rescheduleAppointment(appt.id, { newSlotId: slotId, date });
      setSuccess(true);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setRescheduling(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-xl mx-auto mt-12 text-center bg-white p-12 rounded-3xl border border-slate-200 shadow-sm">
        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <h1 className="text-3xl font-black text-slate-900 mb-2">Rescheduled Successfully!</h1>
        <p className="text-lg text-slate-500 mb-8">Your appointment has been updated.</p>
        <button onClick={() => router.push(`/patient/appointments/${appt.id}`)} className="px-8 py-4 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 transition-colors">
          View Appointment Details
        </button>
      </div>
    );
  }

  if (!appt) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 pb-12">
        <Skeleton className="w-1/4 h-6 mb-8" />
        <Skeleton className="w-1/3 h-10 mb-2" />
        <Skeleton className="h-24 rounded-2xl w-full" />
        <Skeleton className="h-96 rounded-3xl w-full" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-medium transition-colors">
        <ArrowLeft className="w-5 h-5" /> Back to Appointment
      </button>

      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Reschedule Appointment</h1>
        <p className="text-slate-500 font-medium">Select a new time for your visit with Dr. {appt.doctor?.name}.</p>
      </div>

      <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-amber-700/60 uppercase tracking-widest mb-1">Current Appointment</p>
          <p className="text-xl font-bold text-amber-900 flex items-center gap-2">
            <CalendarIcon className="w-5 h-5" /> {appt.date} <Clock className="w-5 h-5 ml-4" /> {appt.slotTime}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm mt-8">
        {/* Date Navigator */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100">
          <button onClick={() => changeDate(-1)} className="p-3 bg-slate-50 text-slate-600 rounded-full hover:bg-slate-100 transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <div className="text-center flex flex-col items-center">
            <CalendarIcon className="w-6 h-6 text-brand-600 mb-2" />
            <h2 className="text-xl font-bold text-slate-900">
              {date ? new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : ''}
            </h2>
          </div>

          <button onClick={() => changeDate(1)} className="p-3 bg-slate-50 text-slate-600 rounded-full hover:bg-slate-100 transition-colors">
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Slots Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            <Skeleton className="h-24 rounded-xl" />
            <Skeleton className="h-24 rounded-xl" />
            <Skeleton className="h-24 rounded-xl" />
            <Skeleton className="h-24 rounded-xl" />
          </div>
        ) : slots.length === 0 ? (
          <div className="text-center py-16 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
            <Clock className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-lg font-medium text-slate-500">No slots available for this date.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {slots.map((slot) => {
              const isAvailable = slot.status === 'AVAILABLE';
              return (
                <button
                  key={slot.id}
                  disabled={!isAvailable || rescheduling}
                  onClick={() => handleReschedule(slot.id)}
                  className={clsx(
                    "p-4 rounded-xl text-center border-2 transition-all flex flex-col items-center justify-center gap-2",
                    isAvailable 
                      ? "border-brand-200 bg-white hover:border-brand-500 hover:shadow-md cursor-pointer group" 
                      : "border-slate-100 bg-slate-50 opacity-60 cursor-not-allowed"
                  )}
                >
                  <span className={clsx(
                    "text-lg font-bold",
                    isAvailable ? "text-slate-700 group-hover:text-brand-700" : "text-slate-400"
                  )}>
                    {slot.startTime}
                  </span>
                  <span className={clsx(
                    "text-xs font-bold uppercase tracking-wider px-2 py-1 rounded",
                    isAvailable ? "bg-green-100 text-green-700" : "bg-slate-200 text-slate-500"
                  )}>
                    {rescheduling ? <Spinner size={12} className="inline-block" /> : (isAvailable ? 'Select' : 'Booked')}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
