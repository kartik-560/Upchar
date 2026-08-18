'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Activity, Users, CalendarCheck, Clock, TrendingUp, LogOut } from 'lucide-react';
import { getDemand } from '../../api/ai';
import clsx from 'clsx';
import { Skeleton } from '../../components/Skeleton';

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [demand, setDemand] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const u = localStorage.getItem('user');
    if (!u) { router.push('/login'); return; }
    const parsed = JSON.parse(u);
    if(parsed.role !== 'ADMIN') { router.push('/login'); return; }
    setUser(parsed);
    
    // Fetch AI Demand prediction
    getDemand()
      .then(data => setDemand(data))
      .catch(e => console.log(e));
  }, []);

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    router.push('/');
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-12">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-6 h-6 text-brand-600" />
          <span className="font-bold text-lg tracking-tight">Admin System Dashboard</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-slate-600 hidden sm:block">Administrator</span>
          <button onClick={logout} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 mt-8">
        <h2 className="text-2xl font-bold mb-6">Overview Metrics</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <StatCard icon={<Users />} title="Total Patients Today" value="124" trend="+12%" />
          <StatCard icon={<CalendarCheck />} title="Appointments" value="89" trend="+5%" />
          <StatCard icon={<Clock />} title="Avg Wait Time" value="14 mins" trend="-3 mins" good />
          <StatCard icon={<TrendingUp />} title="Completed Consults" value="42" trend="+18%" />
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
            <h3 className="font-bold text-lg mb-6">Hospitals & Departments</h3>
            <ul className="space-y-4">
              <li className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                <span className="font-semibold">General Medicine</span>
                <span className="text-sm bg-brand-100 text-brand-700 px-2 py-1 rounded-full font-medium">Active</span>
              </li>
              <li className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                <span className="font-semibold">Pediatrics</span>
                <span className="text-sm bg-brand-100 text-brand-700 px-2 py-1 rounded-full font-medium">Active</span>
              </li>
              <li className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                <span className="font-semibold">Orthopedics</span>
                <span className="text-sm bg-brand-100 text-brand-700 px-2 py-1 rounded-full font-medium">Active</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col">
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 text-purple-600" />
              AI Demand Prediction
            </h3>
            
            {demand ? (
              <div className="space-y-4">
                <p className="text-sm text-slate-500 mb-2">Predicted patient volume for the upcoming week based on historical data.</p>
                <div className="grid grid-cols-2 gap-4">
                  <DemandCard day="Monday" level={demand.Monday} />
                  <DemandCard day="Tuesday" level={demand.Tuesday} />
                  <DemandCard day="Wednesday" level={demand.Wednesday} />
                  <DemandCard day="Thursday" level={demand.Thursday} />
                  <DemandCard day="Friday" level={demand.Friday} />
                </div>
                <p className="text-xs text-slate-400 mt-4 text-center font-mono">Model Confidence: {(demand.confidence * 100).toFixed(0)}%</p>
              </div>
            ) : (
              <div className="space-y-4">
                <Skeleton className="w-full h-4 mb-2" />
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="h-10 rounded-xl" />
                  <Skeleton className="h-10 rounded-xl" />
                  <Skeleton className="h-10 rounded-xl" />
                  <Skeleton className="h-10 rounded-xl" />
                  <Skeleton className="h-10 rounded-xl" />
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ icon, title, value, trend, good }: any) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
      <div className="w-10 h-10 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center mb-4">
        {icon}
      </div>
      <p className="text-sm text-slate-500 font-medium">{title}</p>
      <div className="flex items-end gap-3 mt-1">
        <h4 className="text-3xl font-bold text-slate-900">{value}</h4>
        <span className={clsx("text-sm font-medium mb-1", good || trend.startsWith('+') ? "text-green-600" : "text-red-600")}>
          {trend}
        </span>
      </div>
    </div>
  );
}

function DemandCard({ day, level }: { day: string, level: string }) {
  return (
    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center">
      <span className="font-medium text-slate-700 text-sm">{day}</span>
      <span className={clsx(
        "px-2 py-0.5 rounded text-xs font-bold uppercase",
        level === 'High' ? "bg-red-100 text-red-700" :
        level === 'Medium' ? "bg-amber-100 text-amber-700" :
        "bg-green-100 text-green-700"
      )}>
        {level}
      </span>
    </div>
  );
}
