'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Pill, UserRound, Clock, AlertCircle } from 'lucide-react';
import clsx from 'clsx';

export default function PrescriptionDetailsPage() {
  const { prescriptionId } = useParams() as { prescriptionId: string };
  const router = useRouter();
  const [pres, setPres] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPres();
  }, []);

  const fetchPres = async () => {
    try {
      const res = await fetch(`http://localhost:4000/api/prescriptions/${prescriptionId}`);
      if (!res.ok) throw new Error('Not found');
      setPres(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8">Loading details...</div>;
  if (!pres) return <div className="p-8 text-red-500">Prescription not found.</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <button onClick={() => router.push('/patient/prescriptions')} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-medium transition-colors">
        <ArrowLeft className="w-5 h-5" /> Back to Prescriptions
      </button>

      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Prescription Details</h1>
        <p className="text-slate-500 font-medium font-mono">RX-{pres.id.split('-')[0].toUpperCase()}</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 text-white p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <p className="text-slate-400 font-medium flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4"/> 
              {new Date(pres.createdAt).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            <h2 className="text-2xl font-bold mb-1">Dr. {pres.consultation?.appointment?.doctor?.name}</h2>
            <p className="text-brand-400 font-medium">{pres.consultation?.appointment?.doctor?.specialization}</p>
          </div>
          
          <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 min-w-[200px]">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Diagnosis</p>
            <p className="font-bold text-white">{pres.consultation?.diagnosis?.name || 'General'}</p>
          </div>
        </div>

        {/* Medicines List */}
        <div className="p-8">
          <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Pill className="w-6 h-6 text-orange-500" /> Prescribed Medications
          </h3>
          
          <div className="space-y-4">
            {pres.medicines && pres.medicines.length > 0 ? (
              pres.medicines.map((med: any, idx: number) => (
                <div key={med.id} className="bg-slate-50 rounded-2xl border border-slate-200 p-6 flex flex-col md:flex-row gap-6">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center font-black text-slate-300 text-xl border-2 border-slate-100 flex-shrink-0">
                    {idx + 1}
                  </div>
                  <div className="flex-1 grid sm:grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="md:col-span-2">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Medicine Name</p>
                      <p className="text-lg font-black text-slate-900 mb-1">{med.name}</p>
                      <p className="text-sm font-bold text-brand-600">{med.strength}</p>
                    </div>
                    
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Dosage</p>
                      <p className="font-bold text-slate-700 mb-1">{med.dosage}</p>
                      <p className="text-sm font-medium text-slate-500">{med.frequency}</p>
                    </div>

                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Duration</p>
                      <p className="font-bold text-slate-700 mb-1">{med.duration}</p>
                      <p className="text-sm font-medium text-slate-500">{med.route}</p>
                    </div>
                    
                    {med.instructions && (
                      <div className="sm:col-span-2 md:col-span-4 bg-white p-4 rounded-xl border border-slate-200 mt-2">
                        <p className="text-xs font-bold text-orange-500 uppercase tracking-widest mb-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3"/> Instructions
                        </p>
                        <p className="text-slate-700 font-medium text-sm">{med.instructions}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-500">No medicines found in this prescription.</p>
            )}
          </div>

          {/* General Instructions */}
          {pres.instructions && (
            <div className="mt-8 bg-blue-50 p-6 rounded-2xl border border-blue-100">
              <h4 className="text-sm font-bold text-blue-800 uppercase tracking-widest mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4"/> Doctor's General Instructions
              </h4>
              <p className="text-blue-900 font-medium leading-relaxed">{pres.instructions}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
