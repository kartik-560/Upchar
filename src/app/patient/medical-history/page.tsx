'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { History, Stethoscope, Pill, MapPin } from 'lucide-react';

export default function MedicalHistoryPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const u = localStorage.getItem('user');
    if (u) fetchData(JSON.parse(u).id);
  }, []);

  const fetchData = async (patientId: string) => {
    try {
      const res = await fetch(`http://localhost:4000/api/diagnoses/patient/${patientId}`);
      setHistory(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Medical History</h1>
        <p className="text-slate-500 font-medium">A complete timeline of your past consultations and diagnoses.</p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-500">Loading history...</div>
      ) : history.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center shadow-sm">
          <History className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-xl font-bold text-slate-700 mb-2">No medical history found</p>
          <p className="text-slate-500">Your past consultations will appear here.</p>
        </div>
      ) : (
        <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
          {history.map((record) => (
            <div key={record.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              {/* Timeline Icon */}
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-brand-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                <Stethoscope className="w-4 h-4" />
              </div>
              
              {/* Card */}
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full uppercase tracking-wider">
                    {new Date(record.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                
                <h3 className="text-2xl font-black text-slate-900 mb-1">{record.name}</h3>
                <p className="text-slate-600 mb-6 font-medium">Dr. {record.consultation?.appointment?.doctor?.name}</p>

                {record.consultation?.prescription && (
                  <div className="mb-6 p-4 bg-orange-50 rounded-xl border border-orange-100 flex items-start gap-3">
                    <Pill className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-orange-900 mb-1">Prescription Included</p>
                      <p className="text-sm text-orange-700 font-medium">Medication prescribed during this visit.</p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center gap-3">
                  <Link href={`/patient/diagnoses`} className="flex-1 text-center py-2 bg-brand-50 text-brand-700 font-bold rounded-lg hover:bg-brand-100 transition-colors">
                    View Diagnosis
                  </Link>
                  {record.consultation?.prescription && (
                    <Link href={`/patient/prescriptions/${record.consultation.prescription.id}`} className="flex-1 text-center py-2 bg-orange-50 text-orange-700 font-bold rounded-lg hover:bg-orange-100 transition-colors">
                      View Prescription
                    </Link>
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
