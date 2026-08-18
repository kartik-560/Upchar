'use client';

import { useState, useEffect } from 'react';
import { Pill, Clock, UserRound } from 'lucide-react';
import Link from 'next/link';
import { getPatientPrescriptions } from '../../../api/medical';
import { Skeleton } from '../../../components/Skeleton';

export default function PrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const u = localStorage.getItem('user');
    if (u) fetchData(JSON.parse(u).id);
  }, []);

  const fetchData = async (patientId: string) => {
    try {
      const data = await getPatientPrescriptions(patientId);
      setPrescriptions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Prescriptions</h1>
        <p className="text-slate-500 font-medium">View and manage your prescribed medications.</p>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 gap-6">
          <Skeleton className="h-48 rounded-3xl w-full" />
          <Skeleton className="h-48 rounded-3xl w-full" />
          <Skeleton className="h-48 rounded-3xl w-full" />
          <Skeleton className="h-48 rounded-3xl w-full" />
        </div>
      ) : prescriptions.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center shadow-sm">
          <Pill className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-xl font-bold text-slate-700 mb-2">No prescriptions found</p>
          <p className="text-slate-500">Your doctor's prescriptions will appear here.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {prescriptions.map(pres => (
            <div key={pres.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col hover:shadow-md transition-shadow">
              <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-orange-50/30 rounded-t-3xl">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 mb-1 flex items-center gap-2">
                    <Pill className="w-5 h-5 text-orange-500" /> 
                    {pres.medicines?.length || 0} Medications
                  </h2>
                  <p className="text-slate-500 text-sm font-medium flex items-center gap-1.5">
                    <Clock className="w-4 h-4"/> {new Date(pres.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5">Doctor</p>
                  <p className="font-bold text-slate-900 text-sm">Dr. {pres.consultation?.appointment?.doctor?.name}</p>
                </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <div className="mb-6">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Prescribed For</p>
                  <p className="font-bold text-slate-700">{pres.consultation?.diagnosis?.name || 'General Consultation'}</p>
                </div>
                
                <div className="mt-auto">
                  <Link href={`/patient/prescriptions/${pres.id}`} className="block w-full text-center py-3 bg-orange-50 text-orange-700 font-bold rounded-xl hover:bg-orange-100 transition-colors">
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
