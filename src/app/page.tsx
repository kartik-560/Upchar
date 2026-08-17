import Link from 'next/link';
import { ArrowRight, Activity, CalendarCheck, Clock, Users } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-brand-200">
      <nav className="fixed w-full z-50 glass px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-8 h-8 text-brand-600" />
          <span className="text-xl font-bold tracking-tight text-slate-900">UPCHAAR</span>
        </div>
        <div className="flex gap-4">
          <Link href="/login" className="px-5 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
            Login
          </Link>
          <Link href="/login?register=true" className="px-5 py-2 text-sm font-medium text-white bg-brand-600 rounded-full hover:bg-brand-700 transition-colors shadow-md shadow-brand-500/20">
            Get Started
          </Link>
        </div>
      </nav>

      <main className="pt-32 pb-16 px-6 max-w-6xl mx-auto flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100 text-brand-700 text-xs font-semibold mb-8 border border-brand-200">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-600"></span>
          </span>
          SmartFlow OPD System
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 max-w-4xl leading-[1.1] mb-6">
          The future of <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-teal-400">patient flow</span> is dynamic.
        </h1>
        
        <p className="text-lg md:text-xl text-slate-500 max-w-2xl mb-12 leading-relaxed">
          UPCHAAR ends the frustration of rigid appointments. Our AI-assisted queue adapts in real-time to actual arrivals and doctor delays.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-24">
          <Link href="/login" className="group px-8 py-4 bg-slate-900 text-white rounded-full font-semibold flex items-center gap-2 hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20">
            Enter Dashboard
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href="/login?role=DOCTOR" className="px-8 py-4 bg-white text-slate-700 rounded-full font-semibold flex items-center gap-2 hover:bg-slate-50 transition-all border border-slate-200 shadow-sm">
            Doctor Portal
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8 text-left max-w-5xl w-full">
          <FeatureCard 
            icon={<Clock className="w-6 h-6 text-brand-500" />}
            title="Real-Time Updates"
            desc="No more guessing. Patients see their live queue position and accurate estimated wait times."
          />
          <FeatureCard 
            icon={<Users className="w-6 h-6 text-brand-500" />}
            title="Dynamic Queue"
            desc="Late arrivals automatically move behind eligible on-time patients to keep the flow moving."
          />
          <FeatureCard 
            icon={<CalendarCheck className="w-6 h-6 text-brand-500" />}
            title="QR Check-In"
            desc="Instant verification. Scan QR upon arrival and instantly appear in the doctor's live queue."
          />
        </div>
      </main>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="w-12 h-12 rounded-2xl bg-brand-50 flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-500 leading-relaxed">{desc}</p>
    </div>
  );
}
