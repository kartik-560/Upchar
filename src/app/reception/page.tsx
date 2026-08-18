'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { io } from 'socket.io-client';
import { getHospitals, getDepartments } from '../../api/hospitals';
import { getQueue, checkIn, markLate, markEmergency } from '../../api/queue';
import { Activity, CheckSquare, Scan, Users, Clock, AlertTriangle, LogOut, Camera } from 'lucide-react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { Spinner } from '../../components/Spinner';

export default function ReceptionDashboard() {
  const [user, setUser] = useState<any>(null);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [selectedDoc, setSelectedDoc] = useState('');
  const [queue, setQueue] = useState<any[]>([]);
  const [scanInput, setScanInput] = useState('');
  const [message, setMessage] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const u = localStorage.getItem('user');
    if (!u) { router.push('/login'); return; }
    const parsed = JSON.parse(u);
    if(parsed.role !== 'RECEPTION') { router.push('/login'); return; }
    setUser(parsed);
    loadDoctors();

    const socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000');
    socket.on('queueUpdate', (data) => {
      setQueue((prevQueue) => {
        // since we might be viewing this doctor's queue, refresh if doc id matches
        if (selectedDoc === data.doctorId) {
          return data.queue;
        }
        return prevQueue;
      });
      // also if selectedDoc matches data.doctorId, we can just update it using functional state but we need selectedDoc ref
    });

    return () => { socket.disconnect(); };
  }, [selectedDoc]);

  const loadDoctors = async () => {
    try {
      const hosps = await getHospitals();
      if (hosps.length > 0) {
        const depts = await getDepartments(hosps[0].id);
        let allDocs: any[] = [];
        depts.forEach((d:any) => allDocs.push(...d.doctors));
        setDoctors(allDocs);
        if (allDocs.length > 0) {
          setSelectedDoc(allDocs[0].id);
          loadQueue(allDocs[0].id);
        }
      }
    } catch(e) {}
  };

  const loadQueue = async (docId: string) => {
    try {
      const data = await getQueue(docId);
      setQueue(data);
    } catch(e) {}
  };

  const handleDocChange = (e: any) => {
    setSelectedDoc(e.target.value);
    loadQueue(e.target.value);
  };

  const handleCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scanInput) return;
    setLoading(true);
    try {
      await checkIn(scanInput);
      setMessage('Checked in successfully!');
      setScanInput('');
      loadQueue(selectedDoc);
      setTimeout(() => setMessage(''), 3000);
    } catch (e:any) {
      setMessage('Error checking in: ' + e.response?.data?.error || e.message);
    } finally {
      setLoading(false);
    }
  };

  const markLateHandler = async (appointmentId: string) => {
    try {
      await markLate(appointmentId);
      loadQueue(selectedDoc);
    } catch (e) {}
  };

  const markEmergencyHandler = async (appointmentId: string) => {
    try {
      await markEmergency(appointmentId);
      loadQueue(selectedDoc);
    } catch (e) {}
  };

  if (!user) return null;

  return (
    <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
      
      {/* Left Col: Check-in & Actions */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
            <h3 className="font-bold text-lg mb-4 flex items-center justify-between">
              <span className="flex items-center gap-2"><Scan className="w-5 h-5 text-brand-600" /> Patient Check-In</span>
              <button type="button" onClick={() => setIsScanning(!isScanning)} className="p-2 bg-brand-50 text-brand-600 rounded-full hover:bg-brand-100 transition-colors">
                <Camera className="w-5 h-5" />
              </button>
            </h3>
            <p className="text-sm text-slate-500 mb-6 bg-slate-50 p-3 rounded-lg border border-slate-100">
              In this portal you have not use the AI/ML for prediction and from where the patient will book the appoinment and from the doctor will add the slot for bookking accroding to there availability 
            </p>
            {isScanning && (
              <div className="mb-4 rounded-xl overflow-hidden border border-slate-200">
                <Scanner 
                  onScan={(result) => {
                    if (result && result.length > 0) {
                      setScanInput(result[0].rawValue);
                      setIsScanning(false);
                    }
                  }} 
                  onError={(error) => console.log(error?.message)}
                />
              </div>
            )}

            <form onSubmit={handleCheckIn}>
              <label className="block text-sm font-medium text-slate-700 mb-2">Scan QR or enter Appt ID</label>
              <input 
                value={scanInput} onChange={e=>setScanInput(e.target.value)} 
                placeholder="e.g. REF1001 or ID" 
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none mb-4"
              />
              <button type="submit" disabled={loading} className="w-full py-3 bg-brand-600 text-white rounded-xl font-semibold hover:bg-brand-700 transition-colors disabled:opacity-70 flex justify-center items-center gap-2">
                {loading ? <><Spinner size={20} /> Verifying...</> : 'Verify & Check-In'}
              </button>
              {message && <p className="mt-4 text-sm text-center font-medium text-brand-700">{message}</p>}
            </form>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-brand-600" />
              Select Doctor View
            </h3>
            <select value={selectedDoc} onChange={handleDocChange} className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none">
              {doctors.map(d => <option key={d.id} value={d.id}>{d.name} ({d.specialization})</option>)}
            </select>
          </div>
        </div>

        {/* Right Col: Live Queue Monitor */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 min-h-[600px]">
            <h2 className="text-2xl font-bold mb-6 flex items-center justify-between">
              Live Queue Monitor
              <span className="text-sm font-medium bg-brand-100 text-brand-700 px-3 py-1 rounded-full">{queue.length} Total</span>
            </h2>

            <div className="space-y-3">
              {queue.length === 0 && (
                <div className="text-center py-12 text-slate-400">
                  <Activity className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p>No active patients in queue for this doctor.</p>
                </div>
              )}
              
              {queue.map((appt, idx) => (
                <div key={appt.id} className={clsx(
                  "p-4 rounded-2xl border flex items-center justify-between transition-colors",
                  appt.status === 'IN_CONSULTATION' ? "bg-brand-50 border-brand-200 shadow-sm" : 
                  appt.priority === 'EMERGENCY' ? "bg-red-50 border-red-200" :
                  "bg-white border-slate-100 hover:border-slate-300"
                )}>
                  <div className="flex items-center gap-4">
                    <div className={clsx(
                      "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm",
                      appt.status === 'IN_CONSULTATION' ? "bg-brand-600 text-white" :
                      appt.priority === 'EMERGENCY' ? "bg-red-600 text-white" :
                      "bg-slate-100 text-slate-600"
                    )}>
                      #{idx + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-lg">{appt.patientName}</p>
                      <div className="flex items-center gap-3 text-sm text-slate-500">
                        <span className="flex items-center gap-1"><Clock className="w-4 h-4"/> {appt.slotTime}</span>
                        <span className={clsx(
                          "px-2 py-0.5 rounded-full text-xs font-bold",
                          appt.status === 'CHECKED_IN' ? "bg-green-100 text-green-700" :
                          appt.status === 'LATE' ? "bg-amber-100 text-amber-700" :
                          appt.status === 'IN_CONSULTATION' ? "bg-brand-100 text-brand-700" :
                          "bg-slate-100 text-slate-600"
                        )}>{appt.status}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-lg font-bold">
                      {appt.status === 'IN_CONSULTATION' ? 'Now' : `${appt.estimatedWait}m wait`}
                    </span>
                    
                    {appt.status === 'BOOKED' && (
                      <div className="flex gap-2">
                        <button onClick={() => markLateHandler(appt.id)} className="text-xs font-semibold px-2 py-1 bg-amber-50 text-amber-600 rounded hover:bg-amber-100 border border-amber-200 transition-colors">Mark Late</button>
                        <button onClick={() => markEmergencyHandler(appt.id)} className="text-xs font-semibold px-2 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100 border border-red-200 transition-colors flex items-center gap-1"><AlertTriangle className="w-3 h-3"/> Emergency</button>
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
