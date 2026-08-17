'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, MapPin, CheckCircle, XCircle, AlertCircle, UserRound } from 'lucide-react';
import clsx from 'clsx';
import { QRCodeSVG } from 'qrcode.react';

export default function AppointmentDetailsPage() {
  const { appointmentId } = useParams() as { appointmentId: string };
  const router = useRouter();
  const [appt, setAppt] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    fetchAppt();
  }, []);

  const fetchAppt = async () => {
    try {
      const res = await fetch(`http://localhost:4000/api/appointments/${appointmentId}`);
      if (!res.ok) throw new Error('Not found');
      setAppt(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    setCancelling(true);
    try {
      const res = await fetch(`http://localhost:4000/api/appointments/${appointmentId}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: cancelReason, cancelledBy: 'Patient' })
      });
      if (!res.ok) throw new Error('Failed to cancel');
      await fetchAppt(); // Refresh data
      setShowCancelModal(false);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setCancelling(false);
    }
  };

  if (loading) return <div className="p-8">Loading details...</div>;
  if (!appt) return <div className="p-8 text-red-500">Appointment not found.</div>;

  const canModify = appt.status !== 'CANCELLED' && appt.status !== 'COMPLETED';

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <button onClick={() => router.push('/patient/appointments')} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-medium transition-colors">
        <ArrowLeft className="w-5 h-5" /> Back to Appointments
      </button>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Appointment Details</h1>
          <p className="text-slate-500 font-medium font-mono">ID: {appt.bookingReference}</p>
        </div>
        <span className={clsx(
          "px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider",
          appt.status === 'CANCELLED' ? "bg-red-100 text-red-700" :
          appt.status === 'COMPLETED' ? "bg-green-100 text-green-700" :
          "bg-blue-100 text-blue-700"
        )}>
          {appt.status}
        </span>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 flex items-start gap-6">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center border-2 border-white shadow-sm flex-shrink-0">
              <UserRound className="w-10 h-10 text-slate-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">Doctor</p>
              <h2 className="text-2xl font-black text-slate-900 mb-1">Dr. {appt.doctor?.name}</h2>
              <p className="text-brand-600 font-medium mb-3">{appt.doctor?.specialization}</p>
              <p className="flex items-center gap-2 text-slate-500 text-sm"><MapPin className="w-4 h-4"/> {appt.doctor?.department?.hospital?.name || 'Upchaar Hospital'}</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
            <h3 className="font-bold text-lg mb-6 border-b border-slate-100 pb-4">Schedule Details</h3>
            <div className="grid sm:grid-cols-2 gap-8">
              <div>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Date</p>
                <p className="text-xl font-bold flex items-center gap-2 text-slate-900"><Calendar className="w-5 h-5 text-brand-600"/> {new Date(appt.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Time Slot</p>
                <p className="text-xl font-bold flex items-center gap-2 text-slate-900"><Clock className="w-5 h-5 text-brand-600"/> {appt.slotTime}</p>
              </div>
            </div>
          </div>
          
          {appt.status === 'CANCELLED' && (
            <div className="bg-red-50 rounded-3xl border border-red-100 p-8 flex items-start gap-4">
              <XCircle className="w-8 h-8 text-red-500 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-bold text-red-900 mb-1">Appointment Cancelled</h3>
                <p className="text-red-700 mb-3">This appointment was cancelled on {new Date(appt.cancelledAt).toLocaleDateString()}.</p>
                {appt.cancellationReason && (
                  <div className="bg-white/50 p-4 rounded-xl border border-red-200/50">
                    <p className="text-sm font-bold text-red-900/50 uppercase mb-1">Reason</p>
                    <p className="text-red-800">{appt.cancellationReason}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {canModify && (
            <div className="flex gap-4 pt-4">
              <Link href={`/patient/appointments/${appt.id}/reschedule`} className="flex-1 py-4 bg-white border-2 border-brand-200 text-brand-700 font-bold text-center rounded-xl hover:bg-brand-50 hover:border-brand-300 transition-colors">
                Reschedule
              </Link>
              <button onClick={() => setShowCancelModal(true)} className="flex-1 py-4 bg-white border-2 border-red-100 text-red-600 font-bold rounded-xl hover:bg-red-50 hover:border-red-200 transition-colors">
                Cancel Appointment
              </button>
            </div>
          )}
        </div>

        {/* Right Sidebar - QR Code */}
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-3xl p-8 text-white text-center shadow-lg">
            <h3 className="font-bold text-lg mb-2">Check-in QR</h3>
            <p className="text-slate-400 text-sm mb-6">Show this code at the reception desk when you arrive.</p>
            <div className="bg-white p-4 rounded-2xl inline-block mb-4 shadow-inner">
              <QRCodeSVG value={appt.bookingReference} size={150} />
            </div>
            <p className="font-mono text-slate-300 tracking-widest">{appt.bookingReference}</p>
          </div>
        </div>
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-3xl p-8 shadow-2xl">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Cancel Appointment?</h2>
            <p className="text-slate-600 mb-6">Are you sure you want to cancel your appointment with Dr. {appt.doctor?.name} on {appt.date}? This action cannot be undone.</p>
            
            <div className="mb-8">
              <label className="block text-sm font-bold text-slate-700 mb-2">Reason (Optional)</label>
              <textarea 
                rows={3}
                value={cancelReason}
                onChange={e => setCancelReason(e.target.value)}
                placeholder="Why are you cancelling?"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-red-500 resize-none"
              />
            </div>
            
            <div className="flex gap-4">
              <button onClick={() => setShowCancelModal(false)} className="flex-1 py-3 text-slate-600 font-bold hover:bg-slate-50 rounded-xl transition-colors">
                Keep Appointment
              </button>
              <button disabled={cancelling} onClick={handleCancel} className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors disabled:opacity-70 shadow-lg shadow-red-500/20">
                {cancelling ? 'Cancelling...' : 'Confirm Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
