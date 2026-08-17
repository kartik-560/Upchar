'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { ArrowLeft, History, Pill, Stethoscope, Activity, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function PatientHistoryPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const patientId = params.patientId as string;
  const patientName = searchParams.get('name') || 'Patient';

  const [diagnoses, setDiagnoses] = useState<any[]>([]);
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const u = localStorage.getItem('user');
    if (!u) {
      router.push('/login');
      return;
    }
    const user = JSON.parse(u);
    if (user.role !== 'DOCTOR') {
      router.push('/login');
      return;
    }

    if (patientId) {
      fetchPatientHistory();
    }
  }, [patientId, router]);

  const fetchPatientHistory = async () => {
    setLoading(true);
    try {
      const [diagRes, presRes] = await Promise.all([
        axios.get(`http://localhost:4000/api/diagnoses/patient/${patientId}`),
        axios.get(`http://localhost:4000/api/prescriptions/patient/${patientId}`)
      ]);
      setDiagnoses(diagRes.data);
      setPrescriptions(presRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 shrink-0">
        <Link href="/doctor" className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500 hover:text-slate-900">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            <History className="w-8 h-8 text-brand-600" />
            Medical History
          </h1>
          <p className="text-slate-500 mt-2 text-lg">Viewing past records for <span className="font-semibold text-slate-700">{patientName}</span>.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-8 flex-1 min-h-0">
          {/* Left Col: Diagnoses */}
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 flex flex-col h-full overflow-hidden">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 shrink-0">
              <Stethoscope className="w-6 h-6 text-purple-600" />
              Past Diagnoses
            </h2>
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 pb-2">
              {diagnoses.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <Activity className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p>No past diagnoses found.</p>
                </div>
              ) : (
                diagnoses.map((diag) => (
                  <div key={diag.id} className="p-5 bg-slate-50 border border-slate-100 rounded-2xl">
                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-2 font-medium">
                      <Calendar className="w-4 h-4" />
                      {new Date(diag.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                    <h3 className="font-bold text-lg text-slate-900 mb-2">{diag.condition}</h3>
                    <div className="space-y-2">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Symptoms</span>
                        <p className="text-sm text-slate-700">{diag.symptoms}</p>
                      </div>
                      {diag.notes && (
                        <div>
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Doctor Notes</span>
                          <p className="text-sm text-slate-700">{diag.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Col: Prescriptions */}
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 flex flex-col h-full overflow-hidden">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 shrink-0">
              <Pill className="w-6 h-6 text-orange-600" />
              Past Prescriptions
            </h2>
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 pb-2">
              {prescriptions.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <Pill className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p>No past prescriptions found.</p>
                </div>
              ) : (
                prescriptions.map((pres) => (
                  <div key={pres.id} className="p-5 bg-slate-50 border border-slate-100 rounded-2xl">
                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-3 font-medium">
                      <Calendar className="w-4 h-4" />
                      {new Date(pres.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                    
                    <div className="space-y-3">
                      {pres.medicines?.map((med: any, i: number) => (
                        <div key={i} className="flex justify-between items-center p-3 bg-white border border-slate-200 rounded-xl">
                          <div>
                            <p className="font-bold text-slate-900">{med.name}</p>
                            <p className="text-sm text-slate-500">{med.dosage} • {med.frequency}</p>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-bold px-2 py-1 bg-orange-100 text-orange-700 rounded-md">
                              {med.durationDays} Days
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {pres.instructions && (
                      <div className="mt-4 pt-4 border-t border-slate-200">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Instructions</span>
                        <p className="text-sm text-slate-700 mt-1">{pres.instructions}</p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
