'use client';

import { useState, useEffect } from 'react';
import { Stethoscope, Clock, UserRound, ClipboardList } from 'lucide-react';
import Link from 'next/link';
import { getPatientDiagnoses } from '../../../api/medical';
import { Skeleton } from '../../../components/Skeleton';

export default function DiagnosesPage() {
  const [diagnoses, setDiagnoses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const u = localStorage.getItem('user');
    if (u) fetchData(JSON.parse(u).id);
  }, []);

  const fetchData = async (patientId: string) => {
    try {
      const data = await getPatientDiagnoses(patientId);
      setDiagnoses(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Diagnoses</h1>
        <p className="text-slate-500 font-medium">Detailed records of your diagnosed conditions and doctor's notes.</p>
      </div>

      {loading ? (
        <div className="space-y-6">
          <Skeleton className="h-64 rounded-3xl w-full" />
          <Skeleton className="h-64 rounded-3xl w-full" />
        </div>
      ) : diagnoses.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center shadow-sm">
          <Stethoscope className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-xl font-bold text-slate-700 mb-2">No diagnoses found</p>
          <p className="text-slate-500">Your clinical diagnoses will appear here.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {diagnoses.map(diag => (
            <div key={diag.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 md:p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 mb-1">{diag.name}</h2>
                  <p className="text-slate-500 font-medium flex items-center gap-2">
                    <Clock className="w-4 h-4"/> 
                    {new Date(diag.createdAt).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
                
                <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="w-10 h-10 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center">
                    <UserRound className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Diagnosed By</p>
                    <p className="font-bold text-slate-900">Dr. {diag.consultation?.appointment?.doctor?.name}</p>
                  </div>
                </div>
              </div>

              <div className="p-6 md:p-8 bg-slate-50 grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-3">
                      <ClipboardList className="w-4 h-4" /> Symptoms
                    </h3>
                    <p className="text-slate-700 leading-relaxed font-medium">
                      {diag.consultation?.symptoms || 'No symptoms recorded.'}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-3">
                      <ClipboardList className="w-4 h-4" /> Clinical Notes
                    </h3>
                    <p className="text-slate-700 leading-relaxed font-medium">
                      {diag.notes || 'No clinical notes provided.'}
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-3">
                      <ClipboardList className="w-4 h-4" /> Treatment Plan
                    </h3>
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                      <p className="text-slate-700 leading-relaxed font-medium">
                        {diag.consultation?.treatmentPlan || 'No specific treatment plan recorded.'}
                      </p>
                    </div>
                  </div>

                  {diag.consultation?.prescription && (
                    <div>
                      <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-3">
                        <ClipboardList className="w-4 h-4" /> Related Prescription
                      </h3>
                      <Link href={`/patient/prescriptions/${diag.consultation.prescription.id}`} className="block bg-orange-50 border border-orange-100 p-5 rounded-2xl text-orange-800 font-bold hover:bg-orange-100 transition-colors">
                        View Prescription →
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
