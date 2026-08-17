'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Clock, MapPin } from 'lucide-react';
import clsx from 'clsx';

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
      const res = await fetch(`http://localhost:4000/api/appointments/patient/${patientId}`);
      setAppointments(await res.json());
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
        <div className="text-center py-12 text-slate-500">Loading appointments...</div>
      ) : currentList.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center shadow-sm">
          <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-xl font-bold text-slate-700 mb-2">No {activeTab} appointments</p>
          <p className="text-slate-500">You don't have any appointments in this category.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {currentList.map(appt => (
            <div key={appt.id} className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-12">
                <div className="flex-shrink-0 text-center md:text-left">
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">Date</p>
                  <p className="text-2xl font-black text-brand-900">{new Date(appt.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}</p>
                  <p className="text-slate-500 font-medium">{new Date(appt.date).getFullYear()}</p>
                </div>
                
                <div className="flex-1 border-l-0 md:border-l-2 border-slate-100 md:pl-8">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-slate-900">Dr. {appt.doctor?.name}</h3>
                    <span className={clsx("px-2 py-0.5 rounded text-xs font-bold uppercase", 
                      appt.status === 'CANCELLED' ? "bg-red-100 text-red-700" : 
                      appt.status === 'COMPLETED' ? "bg-green-100 text-green-700" :
                      "bg-blue-100 text-blue-700"
                    )}>{appt.status}</span>
                  </div>
                  <p className="text-brand-600 font-medium mb-3">{appt.doctor?.specialization}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-slate-500 font-medium">
                    <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {appt.slotTime}</span>
                    <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> In-person</span>
                  </div>
                </div>
              </div>
              
              <div className="flex shrink-0">
                <Link href={`/patient/appointments/${appt.id}`} className="w-full md:w-auto px-6 py-3 border border-slate-200 text-slate-700 text-center font-bold rounded-xl hover:bg-slate-50 transition-colors">
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
