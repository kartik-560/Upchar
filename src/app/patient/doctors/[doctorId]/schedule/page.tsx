'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock } from 'lucide-react';
import clsx from 'clsx';
import { getDoctorById, getDoctorSlots } from '../../../../../api/doctors';
import { Skeleton } from '../../../../../components/Skeleton';

export default function DoctorSchedulePage() {
  const { doctorId } = useParams() as { doctorId: string };
  const router = useRouter();
  const [doctor, setDoctor] = useState<any>(null);
  const [slots, setSlots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchDoctor();
  }, []);

  useEffect(() => {
    if (doctor) {
      fetchSlots(date);
    }
  }, [date, doctor]);

  const fetchDoctor = async () => {
    try {
      const data = await getDoctorById(doctorId);
      setDoctor(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSlots = async (selectedDate: string) => {
    setLoading(true);
    try {
      const data = await getDoctorSlots(doctorId, selectedDate);
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

  const bookSlot = (slot: any) => {
    // Store selected slot in session storage to pass to booking page
    sessionStorage.setItem('bookingSlot', JSON.stringify({
      doctor,
      date,
      slot
    }));
    router.push('/patient/appointments/book');
  };

  if (!doctor) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 pb-12">
        <Skeleton className="w-1/4 h-6 mb-8" />
        <Skeleton className="w-1/3 h-10 mb-2" />
        <Skeleton className="w-full h-32 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-medium transition-colors">
        <ArrowLeft className="w-5 h-5" /> Back to Profile
      </button>

      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Book Appointment</h1>
        <p className="text-slate-500 font-medium">Select an available time slot for Dr. {doctor.name}</p>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
        {/* Date Navigator */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100">
          <button onClick={() => changeDate(-1)} className="p-3 bg-slate-50 text-slate-600 rounded-full hover:bg-slate-100 transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <div className="text-center flex flex-col items-center">
            <CalendarIcon className="w-6 h-6 text-brand-600 mb-2" />
            <h2 className="text-xl font-bold text-slate-900">
              {new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
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
            <p className="text-lg font-medium text-slate-500">No slots generated for this date.</p>
            <p className="text-sm text-slate-400 mt-1">The doctor may not be working on this day.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {slots.map((slot) => {
              const isAvailable = slot.status === 'AVAILABLE';
              return (
                <button
                  key={slot.id}
                  disabled={!isAvailable}
                  onClick={() => bookSlot(slot)}
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
                    {isAvailable ? 'Available' : 'Booked'}
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
