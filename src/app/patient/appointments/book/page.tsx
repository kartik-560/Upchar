'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle2, UserRound, Calendar as CalendarIcon, Clock, MapPin } from 'lucide-react';
import { bookAppointment } from '../../../../api/appointments';
import { Skeleton } from '../../../../components/Skeleton';
import { Spinner } from '../../../../components/Spinner';

export default function BookAppointmentPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [bookingData, setBookingData] = useState<any>(null);
  
  const [reason, setReason] = useState('');
  const [apptType, setApptType] = useState('In-person');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<any>(null);

  useEffect(() => {
    const u = localStorage.getItem('user');
    if (!u) router.push('/');
    else setUser(JSON.parse(u));

    const bd = sessionStorage.getItem('bookingSlot');
    if (bd) {
      setBookingData(JSON.parse(bd));
    } else {
      router.push('/patient/doctors');
    }
  }, []);

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        patientId: user.id,
        doctorId: bookingData.doctor.id,
        date: bookingData.date,
        slotId: bookingData.slot.id,
        type: apptType,
        reason
      };

      const confirmedAppt = await bookAppointment(payload);
      setSuccess(confirmedAppt);
      sessionStorage.removeItem('bookingSlot');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!bookingData || !user) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 p-8">
        <Skeleton className="w-1/4 h-6 mb-8" />
        <Skeleton className="w-1/3 h-10 mb-2" />
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Skeleton className="h-32 rounded-3xl" />
            <Skeleton className="h-32 rounded-3xl" />
          </div>
          <Skeleton className="h-64 rounded-3xl" />
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="max-w-2xl mx-auto mt-12 text-center bg-white p-12 rounded-3xl border border-slate-200 shadow-sm">
        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <h1 className="text-3xl font-black text-slate-900 mb-2">Appointment Confirmed!</h1>
        <p className="text-lg text-slate-500 mb-8">Your booking with Dr. {bookingData.doctor.name} was successful.</p>
        
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-left mb-8 max-w-sm mx-auto">
          <p className="text-sm font-bold text-slate-500 uppercase mb-1">Booking ID</p>
          <p className="text-xl font-mono text-slate-900 mb-4">{success.bookingReference}</p>
          
          <p className="text-sm font-bold text-slate-500 uppercase mb-1">Date & Time</p>
          <p className="text-lg font-bold text-slate-900">{success.date} at {success.slotTime}</p>
        </div>

        <button onClick={() => router.push('/patient/appointments')} className="px-8 py-4 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 transition-colors">
          View My Appointments
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-medium transition-colors">
        <ArrowLeft className="w-5 h-5" /> Back to Schedule
      </button>

      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Confirm Booking</h1>
        <p className="text-slate-500 font-medium">Please review details and confirm your appointment.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-start gap-4">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
              <UserRound className="w-8 h-8 text-slate-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">Doctor</p>
              <h3 className="text-xl font-bold text-slate-900">{bookingData.doctor.name}</h3>
              <p className="text-brand-600 font-medium">{bookingData.doctor.specialization}</p>
            </div>
          </div>

          <div className="bg-brand-50 p-6 rounded-3xl border border-brand-100 flex flex-col gap-4">
            <div>
              <p className="text-sm font-bold text-brand-600/70 uppercase tracking-widest mb-1">Date</p>
              <p className="text-xl font-bold text-brand-900 flex items-center gap-2">
                <CalendarIcon className="w-5 h-5" /> {bookingData.date}
              </p>
            </div>
            <div>
              <p className="text-sm font-bold text-brand-600/70 uppercase tracking-widest mb-1">Time Slot</p>
              <p className="text-xl font-bold text-brand-900 flex items-center gap-2">
                <Clock className="w-5 h-5" /> {bookingData.slot.startTime}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleConfirm} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Appointment Type</label>
            <div className="flex gap-4">
              <label className="flex-1 flex items-center gap-3 p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 has-[:checked]:border-brand-500 has-[:checked]:bg-brand-50 transition-colors">
                <input type="radio" name="type" value="In-person" checked={apptType === 'In-person'} onChange={(e)=>setApptType(e.target.value)} className="w-5 h-5 text-brand-600 border-slate-300 focus:ring-brand-500" />
                <span className="font-semibold text-slate-700">In-person</span>
              </label>
              <label className="flex-1 flex items-center gap-3 p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 has-[:checked]:border-brand-500 has-[:checked]:bg-brand-50 transition-colors">
                <input type="radio" name="type" value="Online" checked={apptType === 'Online'} onChange={(e)=>setApptType(e.target.value)} className="w-5 h-5 text-brand-600 border-slate-300 focus:ring-brand-500" />
                <span className="font-semibold text-slate-700">Online</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Reason for Visit</label>
            <textarea 
              required
              rows={4}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Please briefly describe your symptoms or reason for visit..."
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all resize-none"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 transition-colors disabled:opacity-70 flex justify-center items-center gap-2 shadow-lg shadow-brand-500/30"
          >
            {loading ? <><Spinner size={20} /> Confirming...</> : 'Confirm Appointment'}
          </button>
        </form>
      </div>
    </div>
  );
}
