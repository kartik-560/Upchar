'use client';

import { ReactNode, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Activity, LayoutDashboard, Search, Calendar, History, Pill, 
  Stethoscope, BrainCircuit, Bell, User, LogOut, Clock, 
  Scan, Menu, X
} from 'lucide-react';
import clsx from 'clsx';

export default function SidebarLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const u = localStorage.getItem('user');
    if (!u) {
      router.push('/login');
      return;
    }
    setUser(JSON.parse(u));
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    router.push('/');
  };

  if (!user) return null;

  let navItems: any[] = [];
  
  if (user.role === 'PATIENT') {
    navItems = [
      { href: '/patient/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5 shrink-0" /> },
      { href: '/patient/doctors', label: 'Find Doctors', icon: <Search className="w-5 h-5 shrink-0" /> },
      { href: '/patient/appointments', label: 'Appointments', icon: <Calendar className="w-5 h-5 shrink-0" /> },
      { href: '/patient/medical-history', label: 'Medical History', icon: <History className="w-5 h-5 shrink-0" /> },
      { href: '/patient/prescriptions', label: 'Prescriptions', icon: <Pill className="w-5 h-5 shrink-0" /> },
      { href: '/patient/diagnoses', label: 'Diagnoses', icon: <Stethoscope className="w-5 h-5 shrink-0" /> },
      { href: '/patient/ai-insights', label: 'AI Health Insights', icon: <BrainCircuit className="w-5 h-5 shrink-0" /> },
      { href: '/patient/notifications', label: 'Notifications', icon: <Bell className="w-5 h-5 shrink-0" /> },
      { href: '/patient/profile', label: 'Profile', icon: <User className="w-5 h-5 shrink-0" /> },
    ];
  } else if (user.role === 'DOCTOR') {
    navItems = [
      { href: '/doctor', label: 'Queue Dashboard', icon: <Activity className="w-5 h-5 shrink-0" /> },
      { href: '/doctor/availability', label: 'Manage Availability', icon: <Clock className="w-5 h-5 shrink-0" /> },
      { href: '/doctor/ai-insights', label: 'AI Health Insights', icon: <BrainCircuit className="w-5 h-5 shrink-0" /> },
    ];
  } else if (user.role === 'RECEPTION') {
    navItems = [
      { href: '/reception', label: 'Check-In & Queue', icon: <Scan className="w-5 h-5 shrink-0" /> },
    ];
  }

  return (
    <div className="flex flex-col h-screen bg-slate-50 text-slate-900 overflow-hidden">
      
      {/* Top Header */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 z-20 shrink-0 shadow-sm relative">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-1 text-slate-500 hover:text-slate-800 transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <Activity className="w-6 h-6 text-brand-600 hidden md:block" />
          <span className="font-bold text-lg tracking-tight text-brand-900">UPCHAAR</span>
          <span className="text-xs font-semibold px-2 py-1 bg-slate-100 text-slate-500 rounded-lg ml-2 hidden sm:block uppercase tracking-wider">
            {user.role}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-sm font-bold text-slate-900 leading-tight">{user.name}</span>
          </div>
          <button 
            onClick={logout} 
            className="p-2 text-slate-400 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Layout Area */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* Mobile Overlay */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-slate-900/50 z-30 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
        
        {/* Collapsible Hover Sidebar */}
        <aside className={clsx(
          "fixed md:relative z-40 md:z-30 h-full bg-white border-r border-slate-200 flex flex-col shadow-lg md:shadow-lg shrink-0 transition-all duration-300 ease-in-out",
          // Mobile state
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
          "w-64",
          // Desktop state
          "md:translate-x-0 md:w-16 md:hover:w-64 group"
        )}>
          <nav className="flex-1 overflow-y-auto p-3 space-y-2 overflow-x-hidden pt-6">
            {navItems.map((item) => {
              // Exact match for doctor/reception root, prefix match for everything else
              const isActive = (item.href === '/doctor' && pathname === '/doctor') || 
                               (item.href === '/reception' && pathname === '/reception') ||
                               (item.href !== '/doctor' && item.href !== '/reception' && pathname.startsWith(item.href));
              
              return (
                <Link 
                  key={item.href} 
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={clsx(
                    "flex items-center gap-4 px-3 py-3 rounded-xl font-medium transition-all whitespace-nowrap",
                    isActive 
                      ? "bg-brand-50 text-brand-700" 
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  )}
                  title={item.label}
                >
                  {item.icon}
                  <span className="md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50 transition-all duration-300 w-full">
          {children}
        </main>

      </div>
    </div>
  );
}
