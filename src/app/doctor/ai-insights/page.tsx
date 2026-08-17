'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { io } from 'socket.io-client';
import { Activity } from 'lucide-react';
import clsx from 'clsx';

export default function DoctorAI() {
  const [user, setUser] = useState<any>(null);
  const [queue, setQueue] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [vitals, setVitals] = useState({ age: '', bmi: '', systolic: '' });
  const [prediction, setPrediction] = useState<any>(null);
  
  const router = useRouter();

  useEffect(() => {
    const u = localStorage.getItem('user');
    if (!u) { router.push('/login'); return; }
    const parsed = JSON.parse(u);
    if(parsed.role !== 'DOCTOR') { router.push('/login'); return; }
    setUser(parsed);
    loadQueue(parsed.id);

    const socket = io('http://localhost:4000');
    socket.on('queueUpdate', (data) => {
      if (data.doctorId === parsed.id) {
        setQueue(data.queue);
      }
    });

    return () => { socket.disconnect(); };
  }, []);

  const loadQueue = async (docId: string) => {
    try {
      const q = await axios.get(`http://localhost:4000/api/queue/${docId}`);
      setQueue(q.data);
    } catch(e) {}
  };

  const generatePrediction = async (e: React.FormEvent) => {
    e.preventDefault();
    const currentAppt = queue.find(q => q.status === 'IN_CONSULTATION');
    if (!currentAppt) {
      alert('No active consultation to predict for');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('http://localhost:4000/api/ai/predict', {
        patientId: currentAppt.patientId,
        doctorId: user.id,
        vitals: {
          age: Number(vitals.age),
          bmi: Number(vitals.bmi),
          systolic: Number(vitals.systolic)
        }
      });
      setPrediction(res.data);
    } catch(err) {
      alert('Failed to generate prediction');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  const currentPatient = queue.find(q => q.status === 'IN_CONSULTATION');

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Activity className="w-6 h-6 text-purple-600" /> AI Patient Assessment
        </h2>
        
        {currentPatient ? (
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-slate-700 mb-4">Enter Patient Vitals for {currentPatient.patientName}</h3>
              <form onSubmit={generatePrediction} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Age</label>
                  <input type="number" required value={vitals.age} onChange={e=>setVitals({...vitals, age: e.target.value})} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">BMI</label>
                  <input type="number" step="0.1" required value={vitals.bmi} onChange={e=>setVitals({...vitals, bmi: e.target.value})} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Systolic BP</label>
                  <input type="number" required value={vitals.systolic} onChange={e=>setVitals({...vitals, systolic: e.target.value})} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" />
                </div>
                <button type="submit" disabled={loading} className="w-full py-3 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-70">
                  Generate AI Prediction
                </button>
              </form>
            </div>
            
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col items-center justify-center min-h-[300px]">
              {prediction ? (
                <div className="text-center w-full">
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Risk Assessment Result</p>
                  <div className={clsx(
                    "inline-block px-6 py-2 rounded-full text-2xl font-black uppercase mb-4",
                    prediction.prediction === 'High' ? "bg-red-100 text-red-700" :
                    prediction.prediction === 'Moderate' ? "bg-amber-100 text-amber-700" :
                    "bg-green-100 text-green-700"
                  )}>
                    {prediction.prediction} Risk
                  </div>
                  <p className="text-slate-600 mb-4">{prediction.explanation}</p>
                  <p className="font-mono text-sm text-slate-400">Model Confidence: {(prediction.confidenceScore * 100).toFixed(0)}%</p>
                </div>
              ) : (
                <p className="text-slate-400 text-center">Run the AI Assessment to view predictive insights regarding the patient's health risk.</p>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-slate-400">
            <p>Start a consultation to run an AI assessment for the patient.</p>
          </div>
        )}
      </div>
    </div>
  );
}
