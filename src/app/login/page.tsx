'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Activity, ArrowRight, Loader2 } from 'lucide-react';
import axios from 'axios';
import Link from 'next/link';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('PATIENT');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const payload = isLogin ? { email, password } : { email, password, name, role };
      
      const res = await axios.post(`http://localhost:4000${endpoint}`, payload);
      
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      
      const userRole = res.data.user.role;
      if (userRole === 'PATIENT') router.push('/patient');
      else if (userRole === 'RECEPTION') router.push('/reception');
      else if (userRole === 'DOCTOR') router.push('/doctor');
      else if (userRole === 'ADMIN') router.push('/admin');
      
    } catch (err: any) {
      setError(err.response?.data?.error || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  // Pre-fill demo accounts
  const fillDemo = (demoRole: string) => {
    setIsLogin(true);
    setPassword('password123');
    if (demoRole === 'PATIENT') setEmail('rahul@example.com');
    if (demoRole === 'DOCTOR') setEmail('ananya@example.com');
    if (demoRole === 'RECEPTION') setEmail('reception@example.com');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex justify-center items-center gap-2 mb-6">
          <Activity className="w-10 h-10 text-brand-600" />
          <span className="text-2xl font-bold tracking-tight text-slate-900">UPCHAAR</span>
        </Link>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
          {isLogin ? 'Sign in to your account' : 'Create new account'}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-slate-200/50 sm:rounded-3xl sm:px-10 border border-slate-100">
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm font-medium border border-red-100">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-slate-700">Full Name</label>
                <div className="mt-1">
                  <input required value={name} onChange={e=>setName(e.target.value)} type="text" className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm" />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700">Email address</label>
              <div className="mt-1">
                <input required value={email} onChange={e=>setEmail(e.target.value)} type="email" className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Password</label>
              <div className="mt-1">
                <input required value={password} onChange={e=>setPassword(e.target.value)} type="password" className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm" />
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-slate-700">Role (Demo)</label>
                <select value={role} onChange={e=>setRole(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm rounded-xl">
                  <option value="PATIENT">Patient</option>
                  <option value="DOCTOR">Doctor</option>
                  <option value="RECEPTION">Reception</option>
                </select>
              </div>
            )}

            <div>
              <button disabled={loading} type="submit" className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-colors disabled:opacity-70">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isLogin ? 'Sign in' : 'Register')}
              </button>
            </div>
          </form>
          
          <div className="mt-6 text-center">
            <button onClick={() => setIsLogin(!isLogin)} className="text-sm font-medium text-brand-600 hover:text-brand-500">
              {isLogin ? "Don't have an account? Register" : "Already have an account? Sign in"}
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-200">
            <p className="text-sm text-slate-500 text-center mb-4">Demo Accounts</p>
            <div className="flex gap-2 justify-center">
              <button onClick={() => fillDemo('PATIENT')} className="px-3 py-1 text-xs font-medium rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700">Patient</button>
              <button onClick={() => fillDemo('RECEPTION')} className="px-3 py-1 text-xs font-medium rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700">Reception</button>
              <button onClick={() => fillDemo('DOCTOR')} className="px-3 py-1 text-xs font-medium rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700">Doctor</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
