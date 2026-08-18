'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Clock, MapPin } from 'lucide-react';
import clsx from 'clsx';
import { getAppointmentsByPatient } from '../../../api/appointments';
import { Skeleton } from '../../../components/Skeleton';

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');

  useEffect(() => {
    const u = localStorage.getItem('user');
    if (u) fetchData(JSON.parse(u).id);
  }, []);

  const fetchData = async (patientId: string) => {
    try {
      const data = await getAppointmentsByPatient(patientId);
      setAppointments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  const upcoming = appointments.filter(a => a.date >= today && a.status !== 'CANCELLED' && a.status !== 'COMPLETED');
  const past = appointments.filter(a => a.date < today || a.status === 'COMPLETED');
  const cancelled = appointments.filter(a => a.status === 'CANCELLED');

  const getActiveList = () => {
    if (activeTab === 'upcoming') return upcoming;
    if (activeTab === 'past') return past;
    return cancelled;
  };

  const currentList = getActiveList();

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">My Appointments</h1>
          <p className="text-slate-500 font-medium">Manage your bookings and view past visits.</p>
        </div>
        <Link href="/patient/doctors" className="px-6 py-3 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 transition-colors shadow-sm">
          Book New Appointment
        </Link>
      </div>

      <div className="flex gap-4 border-b border-slate-200">
        <button onClick={() => setActiveTab('upcoming')} className={clsx("pb-4 font-bold text-lg px-2 border-b-2 transition-colors", activeTab === 'upcoming' ? "border-brand-600 text-brand-600" : "border-transparent text-slate-500 hover:text-slate-800")}>Upcoming ({upcoming.length})</button>
        <button onClick={() => setActiveTab('past')} className={clsx("pb-4 font-bold text-lg px-2 border-b-2 transition-colors", activeTab === 'past' ? "border-brand-600 text-brand-600" : "border-transparent text-slate-500 hover:text-slate-800")}>Past ({past.length})</button>
        <button onClick={() => setActiveTab('cancelled')} className={clsx("pb-4 font-bold text-lg px-2 border-b-2 transition-colors", activeTab === 'cancelled' ? "border-brand-600 text-brand-600" : "border-transparent text-slate-500 hover:text-slate-800")}>Cancelled ({cancelled.length})</button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <Skeleton className="h-32 w-full rounded-2xl" />
          <Skeleton className="h-32 w-full rounded-2xl" />
          <Skeleton className="h-32 w-full rounded-2xl" />
        </div>
      ) : currentList.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center shadow-sm">
          <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-xl font-bold text-slate-700 mb-2">No {activeTab} appointments</p>
          <p className="text-slate-500">You don't have any appointments in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {currentList.map(appt => (
            <div key={appt.id} className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col gap-5 shadow-sm hover:shadow-md transition-shadow">
              {/* Top: Date & Status */}
              <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                <div>
                  <p className="text-2xl font-black text-brand-900">{new Date(appt.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}</p>
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">{new Date(appt.date).getFullYear()}</p>
                </div>
                <span className={clsx("px-2 py-0.5 rounded text-xs font-bold uppercase", 
                  appt.status === 'CANCELLED' ? "bg-red-100 text-red-700" : 
                  appt.status === 'COMPLETED' ? "bg-green-100 text-green-700" :
                  "bg-blue-100 text-blue-700"
                )}>{appt.status}</span>
              </div>
              
              {/* Middle: Doctor Info */}
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">{appt.doctor?.name}</h3>
                <p className="text-brand-600 font-medium mb-3">{appt.doctor?.specialization}</p>
                <div className="flex flex-wrap gap-4 text-sm text-slate-500 font-medium">
                  <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {appt.slotTime}</span>
                  <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> In-person</span>
                </div>
              </div>
              
              {/* Bottom: Action */}
              <div className="pt-2">
                <Link href={`/patient/appointments/${appt.id}`} className="block w-full px-6 py-2.5 border border-slate-200 text-slate-700 text-center font-bold rounded-xl hover:bg-slate-50 transition-colors">
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
