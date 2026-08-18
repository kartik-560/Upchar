'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { io } from 'socket.io-client';
import { getQueue } from '../../api/queue';
import { startConsultation, delayConsultation } from '../../api/consultations';
import { Activity, Clock, PlayCircle, CheckCircle, Clock4, Users } from 'lucide-react';
import clsx from 'clsx';
import { Spinner } from '../../components/Spinner';

export default function DoctorDashboard() {
  const [user, setUser] = useState<any>(null);
  const [queue, setQueue] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const u = localStorage.getItem('user');
    if (!u) { router.push('/login'); return; }
    const parsed = JSON.parse(u);
    if(parsed.role !== 'DOCTOR') { router.push('/login'); return; }
    setUser(parsed);
    loadQueue(parsed.id);

    const socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000');
    socket.on('queueUpdate', (data) => {
      if (data.doctorId === parsed.id) {
        setQueue(data.queue);
      }
    });

    return () => { socket.disconnect(); };
  }, []);

  const loadQueue = async (docId: string) => {
    try {
      const q = await getQueue(docId);
      setQueue(q);
    } catch(e) {}
  };

  const startConsultationHandler = async (appointmentId: string) => {
    setLoading(true);
    try {
      await startConsultation(appointmentId);
    } finally {
      setLoading(false);
    }
  };

  const markDelay = async (minutes: number) => {
    setLoading(true);
    try {
      await delayConsultation(user.id, minutes);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  const currentPatient = queue.find(q => q.status === 'IN_CONSULTATION');
  const nextPatients = queue.filter(q => q.status !== 'IN_CONSULTATION');

  return (
    <div className="space-y-8 max-w-5xl mx-auto h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Welcome back, {user.name.toLowerCase().startsWith('dr') ? user.name : `Dr. ${user.name}`}
          </h1>
          <p className="text-slate-500 mt-2 text-lg">Here is your consultation queue for today.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 flex-1 min-h-0">
        
        {/* Left Col: Current Patient */}
        <div className="space-y-6 h-full flex flex-col">
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 h-full flex flex-col">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 shrink-0">
              <Activity className="w-5 h-5 text-brand-600" />
              Current Consultation
            </h2>
            
            {currentPatient ? (
              <div className="flex-1 flex flex-col overflow-y-auto pr-2 pb-2">
                <div className="mb-8">
                  <p className="text-sm text-slate-500 font-medium uppercase tracking-wider mb-1">Patient</p>
                  <Link href={`/doctor/patients/${currentPatient.patientId}?name=${encodeURIComponent(currentPatient.patientName)}`} className="text-3xl font-extrabold text-brand-600 hover:text-brand-700 hover:underline inline-block transition-colors">
                    {currentPatient.patientName}
                  </Link>
                  <p className="text-slate-500 font-mono mt-1">ID: {currentPatient.bookingReference}</p>
                </div>
                
                <div className="flex gap-8 mb-auto">
                  <div>
                    <p className="text-sm text-slate-500 font-medium uppercase tracking-wider mb-1">Slot</p>
                    <p className="text-lg font-semibold flex items-center gap-1"><Clock className="w-4 h-4"/>{currentPatient.slotTime}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 font-medium uppercase tracking-wider mb-1">Status</p>
                    <p className="text-lg font-semibold text-brand-600 flex items-center gap-1"><Activity className="w-4 h-4"/>In Progress</p>
                  </div>
                </div>

                <div className="mt-8 space-y-3 shrink-0">
                  <Link href={`/doctor/appointments/${currentPatient.id}/consultation`} className="w-full py-4 bg-brand-600 text-white rounded-xl font-bold text-lg hover:bg-brand-700 transition-colors flex justify-center items-center gap-2 shadow-md shadow-brand-500/20">
                    <CheckCircle className="w-6 h-6" /> Complete Consultation
                  </Link>
                  
                  <div className="flex gap-3">
                    <button disabled={loading} onClick={() => markDelay(15)} className="flex-1 py-3 bg-amber-50 text-amber-700 rounded-xl font-bold hover:bg-amber-100 transition-colors flex justify-center items-center gap-2 border border-amber-200 disabled:opacity-70">
                      {loading ? <Spinner size={20} /> : <Clock4 className="w-5 h-5" />} Delay +15m
                    </button>
                    <button disabled={loading} onClick={() => markDelay(30)} className="flex-1 py-3 bg-red-50 text-red-700 rounded-xl font-bold hover:bg-red-100 transition-colors flex justify-center items-center gap-2 border border-red-200 disabled:opacity-70">
                      {loading ? <Spinner size={20} /> : null} Delay +30m
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                <Users className="w-16 h-16 mb-4 opacity-20" />
                <p className="text-lg font-medium text-slate-500">No active consultation</p>
                {nextPatients.length > 0 && nextPatients[0].status === 'CHECKED_IN' && (
                  <button disabled={loading} onClick={() => startConsultationHandler(nextPatients[0].id)} className="mt-8 px-8 py-3 bg-brand-600 text-white rounded-full font-bold hover:bg-brand-700 transition-colors flex items-center gap-2 disabled:opacity-70 shadow-md shrink-0">
                    {loading ? <Spinner size={20} /> : <PlayCircle className="w-5 h-5" />} Start Next Patient
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Next Queue */}
        <div className="bg-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-xl h-full flex flex-col overflow-hidden">
          <h2 className="text-xl font-bold mb-6 flex items-center justify-between shrink-0">
            Up Next
            <span className="text-sm font-medium bg-slate-800 text-slate-300 px-3 py-1 rounded-full">{nextPatients.length} Waiting</span>
          </h2>

          <div className="flex-1 overflow-y-auto space-y-4 pr-2 pb-2">
            {nextPatients.length === 0 && (
              <p className="text-slate-500 text-center py-12">Queue is empty</p>
            )}
            {nextPatients.map((appt, idx) => (
              <div key={appt.id} className="p-4 bg-slate-800 rounded-2xl border border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center font-bold text-slate-300">
                    #{idx + 1}
                  </div>
                  <div>
                    <Link href={`/doctor/patients/${appt.patientId}?name=${encodeURIComponent(appt.patientName)}`} className="font-semibold text-brand-400 hover:text-brand-300 hover:underline transition-colors">
                      {appt.patientName}
                    </Link>
                    <div className="flex items-center gap-3 text-sm text-slate-400 mt-1">
                      <span>{appt.slotTime}</span>
                      <span className={clsx(
                        "px-2 py-0.5 rounded text-xs font-bold",
                        appt.status === 'CHECKED_IN' ? "bg-green-500/20 text-green-400" :
                        appt.priority === 'EMERGENCY' ? "bg-red-500/20 text-red-400" :
                        "bg-slate-700 text-slate-300"
                      )}>{appt.status}</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  {idx === 0 && appt.status === 'CHECKED_IN' && !currentPatient ? (
                    <button disabled={loading} onClick={() => startConsultationHandler(appt.id)} className="px-4 py-2 bg-brand-500 text-white rounded-lg font-semibold text-sm hover:bg-brand-600 transition-colors disabled:opacity-70 flex items-center gap-2">
                      {loading ? <Spinner size={16} /> : null} Call Patient
                    </button>
                  ) : (
                    <div className="flex flex-col items-end">
                      <span className="font-bold text-slate-200">{appt.estimatedWait}m</span>
                      <span className="text-xs text-slate-500">wait</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
