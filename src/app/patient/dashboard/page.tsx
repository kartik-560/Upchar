'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Clock, MapPin, Video, Stethoscope, Pill, Search } from 'lucide-react';
import clsx from 'clsx';
import { QRCodeSVG } from 'qrcode.react';

export default function PatientDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [diagnoses, setDiagnoses] = useState<any[]>([]);
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const u = localStorage.getItem('user');
    if (!u) {
      router.push('/');
      return;
    }
    const userData = JSON.parse(u);
    setUser(userData);
    fetchData(userData.id);
  }, []);

  const fetchData = async (patientId: string) => {
    try {
      const [apptRes, diagRes, presRes] = await Promise.all([
        fetch(`http://localhost:4000/api/appointments/patient/${patientId}`),
        fetch(`http://localhost:4000/api/diagnoses/patient/${patientId}`),
        fetch(`http://localhost:4000/api/prescriptions/patient/${patientId}`)
      ]);
      const apptData = await apptRes.json();
      const diagData = await diagRes.json();
      const presData = await presRes.json();
      
      setAppointments(Array.isArray(apptData) ? apptData : []);
      setDiagnoses(Array.isArray(diagData) ? diagData : []);
      setPrescriptions(Array.isArray(presData) ? presData : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !user) {
    return <div className="flex h-full items-center justify-center">Loading dashboard...</div>;
  }

  const today = new Date().toISOString().split('T')[0];
  const todayAppts = appointments.filter(a => a.date === today && a.status !== 'CANCELLED' && a.status !== 'COMPLETED');
  const upcomingAppts = appointments.filter(a => a.date > today && a.status !== 'CANCELLED');
  const recentDiag = diagnoses[0];
  const recentPres = prescriptions[0];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Welcome back, {user.name}</h1>
        <p className="text-slate-500 mt-1">Here is your health overview.</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link href="/patient/doctors" className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center gap-3 hover:border-brand-400 hover:shadow-md transition-all group">
          <div className="w-12 h-12 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center group-hover:bg-brand-100 transition-colors">
            <Search className="w-6 h-6" />
          </div>
          <span className="font-semibold text-slate-700">Find Doctor</span>
        </Link>
        
        <Link href="/patient/doctors" className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center gap-3 hover:border-brand-400 hover:shadow-md transition-all group">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
            <Calendar className="w-6 h-6" />
          </div>
          <span className="font-semibold text-slate-700">Book Appt</span>
        </Link>
        
        <Link href="/patient/medical-history" className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center gap-3 hover:border-brand-400 hover:shadow-md transition-all group">
          <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-100 transition-colors">
            <Stethoscope className="w-6 h-6" />
          </div>
          <span className="font-semibold text-slate-700">Medical History</span>
        </Link>
        
        <Link href="/patient/prescriptions" className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center gap-3 hover:border-brand-400 hover:shadow-md transition-all group">
          <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center group-hover:bg-orange-100 transition-colors">
            <Pill className="w-6 h-6" />
          </div>
          <span className="font-semibold text-slate-700">Prescriptions</span>
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Today's Appointment */}
          <div>
            <h2 className="text-xl font-bold mb-4">Today's Appointments</h2>
            {todayAppts.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center text-slate-500 shadow-sm">
                <p>No appointments for today.</p>
                <Link href="/patient/doctors" className="inline-block mt-4 px-6 py-2 bg-brand-600 text-white font-medium rounded-full hover:bg-brand-700 transition-colors">Book Now</Link>
              </div>
            ) : (
              <div className="space-y-4">
                {todayAppts.map(appt => (
                  <div key={appt.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row">
                    <div className="p-6 flex-1 border-b md:border-b-0 md:border-r border-slate-100">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">DOCTOR</p>
                          <h3 className="text-xl font-bold text-slate-900">{appt.doctor?.name}</h3>
                          <p className="text-brand-600 font-medium">{appt.doctor?.specialization || 'General Physician'}</p>
                        </div>
                        <span className={clsx("px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide", appt.status === 'BOOKED' ? "bg-blue-50 text-blue-600" : "bg-green-50 text-green-600")}>
                          {appt.status}
                        </span>
                      </div>
                      <div className="flex gap-8 mb-6">
                        <div>
                          <p className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-1">Time</p>
                          <p className="font-semibold flex items-center gap-1.5"><Clock className="w-4 h-4 text-slate-400" /> {appt.slotTime}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-1">Type</p>
                          <p className="font-semibold flex items-center gap-1.5"><MapPin className="w-4 h-4 text-slate-400" /> In-person</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Link href={`/patient/appointments/${appt.id}`} className="px-5 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors">View Details</Link>
                      </div>
                    </div>
                    <div className="p-6 bg-slate-50 flex flex-col items-center justify-center min-w-[200px]">
                      <p className="text-xs font-medium text-slate-500 uppercase mb-3">Check-in QR</p>
                      <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100">
                        <QRCodeSVG value={appt.bookingReference} size={100} />
                      </div>
                      <p className="text-xs font-mono text-slate-400 mt-3">{appt.bookingReference}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming Appointments */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Upcoming Appointments</h2>
              <Link href="/patient/appointments" className="text-sm font-medium text-brand-600 hover:text-brand-700">View All</Link>
            </div>
            {upcomingAppts.length === 0 ? (
              <div className="bg-white rounded-2xl p-6 border border-slate-200 text-center text-slate-500 shadow-sm">
                <p>No upcoming appointments.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingAppts.slice(0,3).map(appt => (
                  <div key={appt.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-slate-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">{appt.doctor?.name}</h4>
                        <p className="text-sm text-slate-500">{appt.date} • {appt.slotTime}</p>
                      </div>
                    </div>
                    <Link href={`/patient/appointments/${appt.id}`} className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">View</Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Recent Diagnosis */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg flex items-center gap-2"><Stethoscope className="w-5 h-5 text-purple-600"/> Last Diagnosis</h3>
            </div>
            {recentDiag ? (
              <div>
                <p className="text-2xl font-black text-slate-900 mb-1">{recentDiag.name}</p>
                <p className="text-sm text-slate-500 mb-4">Dr. {recentDiag.consultation?.appointment?.doctor?.name} • {new Date(recentDiag.createdAt).toLocaleDateString()}</p>
                <Link href={`/patient/diagnoses`} className="block text-center w-full py-2 bg-purple-50 text-purple-700 font-semibold rounded-xl hover:bg-purple-100 transition-colors">View Details</Link>
              </div>
            ) : (
              <p className="text-slate-500 text-sm">No recent diagnoses found.</p>
            )}
          </div>

          {/* Recent Prescription */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg flex items-center gap-2"><Pill className="w-5 h-5 text-orange-600"/> Last Prescription</h3>
            </div>
            {recentPres ? (
              <div>
                <p className="font-medium text-slate-700 mb-1">{recentPres.medicines?.length || 0} Medicines</p>
                <p className="text-sm text-slate-500 mb-4">Dr. {recentPres.consultation?.appointment?.doctor?.name} • {new Date(recentPres.createdAt).toLocaleDateString()}</p>
                <Link href={`/patient/prescriptions/${recentPres.id}`} className="block text-center w-full py-2 bg-orange-50 text-orange-700 font-semibold rounded-xl hover:bg-orange-100 transition-colors">View Prescription</Link>
              </div>
            ) : (
              <p className="text-slate-500 text-sm">No recent prescriptions found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
