'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Brain, Activity, ShieldAlert, CheckCircle2, AlertTriangle, ArrowRight, ActivitySquare } from 'lucide-react';
import clsx from 'clsx';
import { getPredictions, selfPredict } from '../../../api/ai';
import { Skeleton } from '../../../components/Skeleton';
import { Spinner } from '../../../components/Spinner';

export default function AIInsightsPage() {
  const router = useRouter();
  const [predictions, setPredictions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [patientId, setPatientId] = useState('');

  // Self-assessment form
  const [vitals, setVitals] = useState({ age: '', bmi: '', systolic: '' });
  const [running, setRunning] = useState(false);
  const [currentPrediction, setCurrentPrediction] = useState<any>(null);

  useEffect(() => {
    const u = localStorage.getItem('user');
    if (!u) {
      router.push('/login');
      return;
    }
    const { id } = JSON.parse(u);
    setPatientId(id);
    fetchPredictions(id);
  }, [router]);

  const fetchPredictions = async (id: string) => {
    try {
      const data = await getPredictions(id);
      setPredictions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelfAssessment = async (e: React.FormEvent) => {
    e.preventDefault();
    setRunning(true);
    try {
      const pred = await selfPredict({
        patientId,
        vitals: {
          age: Number(vitals.age),
          bmi: Number(vitals.bmi),
          systolic: Number(vitals.systolic)
        }
      });
      setCurrentPrediction(pred);
      setPredictions(prev => [pred, ...prev]);
      setVitals({ age: '', bmi: '', systolic: '' });
    } catch (err) {
      console.error(err);
      alert('Failed to generate prediction');
    } finally {
      setRunning(false);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'low': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      case 'moderate': return 'text-amber-600 bg-amber-50 border-amber-100';
      case 'high': return 'text-rose-600 bg-rose-50 border-rose-100';
      default: return 'text-slate-600 bg-slate-50 border-slate-100';
    }
  };

  if (loading) {
    return (
      <div className="flex-1 p-8 xl:p-12 flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-8 pb-8 pt-4 xl:px-12 xl:pb-12 bg-slate-50/50">
      
      <div className="max-w-5xl mx-auto w-full space-y-6">

        {/* Header */}
        <div className="flex items-start justify-between shrink-0">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
              <Brain className="w-8 h-8 text-brand-600" />
              AI Health Insights
            </h1>
            <p className="text-slate-500 mt-2 text-lg">Predictive analysis based on your health metrics.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column: Self Assessment */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600">
                  <ActivitySquare className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900">Self Assessment</h2>
                  <p className="text-xs text-slate-500">Run an instant risk check</p>
                </div>
              </div>

              <form onSubmit={handleSelfAssessment} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Age</label>
                  <input
                    type="number"
                    required
                    value={vitals.age}
                    onChange={e => setVitals({ ...vitals, age: e.target.value })}
                    placeholder="e.g. 45"
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">BMI</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={vitals.bmi}
                    onChange={e => setVitals({ ...vitals, bmi: e.target.value })}
                    placeholder="e.g. 24.5"
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Systolic BP (mmHg)</label>
                  <input
                    type="number"
                    required
                    value={vitals.systolic}
                    onChange={e => setVitals({ ...vitals, systolic: e.target.value })}
                    placeholder="e.g. 120"
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={running}
                  className="w-full mt-2 bg-brand-600 hover:bg-brand-700 text-white font-medium py-2.5 rounded-xl transition-all disabled:opacity-70 flex items-center justify-center gap-2 shadow-sm shadow-brand-600/20"
                >
                  {running ? <><Spinner size={20} /> Analyzing...</> : <><Brain className="w-5 h-5" /> Run Prediction <ArrowRight className="w-4 h-4" /></>}
                </button>
              </form>

              {currentPrediction && (
                <div className="mt-6 p-4 bg-slate-50 border border-slate-100 rounded-2xl animate-in fade-in slide-in-from-bottom-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Result</p>
                  <div className={clsx("px-3 py-1.5 rounded-lg border font-bold text-center mb-3", getRiskColor(currentPrediction.prediction))}>
                    {currentPrediction.prediction} Risk
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed text-center">
                    {(currentPrediction.confidenceScore * 100).toFixed(0)}% Confidence
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: History */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Prediction History</h2>

              <div>
                {predictions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full py-10 text-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                      <Activity className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">No predictions yet</h3>
                    <p className="text-slate-500 max-w-sm mt-2">Run a self-assessment or visit a doctor to generate AI health insights.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {predictions.map((p) => (
                      <div key={p.id} className="p-5 rounded-2xl border border-slate-100 hover:border-brand-200 transition-colors group bg-slate-50/50">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3">
                              <span className={clsx("px-2.5 py-1 rounded-full text-xs font-bold border whitespace-nowrap", getRiskColor(p.prediction))}>
                                {p.prediction} Risk
                              </span>
                              <span className="text-sm text-slate-500 font-medium whitespace-nowrap">
                                {new Date(p.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </span>
                              {p.reviewedByDoctor && (
                                <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 whitespace-nowrap">
                                  <CheckCircle2 className="w-3 h-3" /> Reviewed
                                </span>
                              )}
                            </div>
                            <h4 className="font-bold text-slate-900">{p.modelType}</h4>
                            <p className="text-sm text-slate-600 mt-2 leading-relaxed">{p.explanation}</p>
                          </div>

                          <div className="flex sm:flex-col items-center sm:items-end gap-2 sm:gap-0 bg-white sm:bg-transparent p-3 sm:p-0 rounded-xl sm:rounded-none border sm:border-0 border-slate-100 shrink-0">
                            <div className="text-2xl font-black text-slate-900">
                              {(p.confidenceScore * 100).toFixed(0)}%
                            </div>
                            <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Confidence</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}