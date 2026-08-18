'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UserRound, Mail, Phone, Calendar as CalendarIcon, ShieldCheck, MapPin, KeyRound, Clock, Edit2, Check, X } from 'lucide-react';
import clsx from 'clsx';
import { Skeleton } from '../../../components/Skeleton';
import { Spinner } from '../../../components/Spinner';
import { getProfile, updateProfile } from '../../../api/auth';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ name: '', email: '', phone: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const u = localStorage.getItem('user');
    if (!u) {
      router.push('/login');
      return;
    }
    const { id } = JSON.parse(u);
    fetchProfile(id);
  }, []);

  const fetchProfile = async (id: string) => {
    try {
      const data = await getProfile(id);
      setUser(data);
      setEditData({ name: data.name || '', email: data.email || '', phone: data.phone || '' });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updatedUser = await updateProfile(user.id, editData);
      setUser(updatedUser);
      setIsEditing(false);
      // Update local storage user name
      const u = localStorage.getItem('user');
      if (u) {
        const parsed = JSON.parse(u);
        localStorage.setItem('user', JSON.stringify({ ...parsed, name: updatedUser.name }));
      }
    } catch (err) {
      console.error(err);
      alert('Error updating profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-8 xl:p-12">
        <Skeleton className="w-1/3 h-10 mb-2" />
        <Skeleton className="w-1/2 h-6 mb-8" />
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-6 mb-8 pb-8 border-b border-slate-100">
            <Skeleton className="w-24 h-24 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="w-48 h-8" />
              <Skeleton className="w-32 h-5" />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <Skeleton className="w-full h-12" />
              <Skeleton className="w-full h-12" />
              <Skeleton className="w-full h-12" />
            </div>
            <div className="space-y-4">
              <Skeleton className="w-full h-12" />
              <Skeleton className="w-full h-12" />
              <Skeleton className="w-full h-12" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex-1 p-8 xl:p-12">
        <div className="p-8 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3">
          Error loading profile.
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 xl:p-12 overflow-y-auto bg-slate-50/50">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Profile</h1>
          <p className="text-slate-500 mt-2">Manage your personal information and account settings.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Avatar & Quick Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col items-center text-center">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg shadow-brand-500/20 mb-4 ring-4 ring-brand-50">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-xl font-bold text-slate-900">{user.name}</h2>
              <div className="flex items-center gap-1.5 text-sm font-medium text-brand-600 mt-1 bg-brand-50 px-3 py-1 rounded-full">
                <ShieldCheck className="w-4 h-4" />
                <span>{user.role}</span>
              </div>
              
              <div className="w-full h-px bg-slate-100 my-6"></div>
              
              <div className="w-full space-y-3 text-left">
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>Joined {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                </div>
              </div>
              
              <button className="w-full mt-6 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium rounded-xl transition-colors flex items-center justify-center gap-2 text-sm border border-slate-200">
                <Edit2 className="w-4 h-4" />
                Edit Avatar
              </button>
            </div>
          </div>

          {/* Right Column: Detailed Info */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Personal Information */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-900">Personal Information</h3>
                {!isEditing ? (
                  <button onClick={() => setIsEditing(true)} className="text-brand-600 hover:text-brand-700 text-sm font-medium transition-colors">Edit</button>
                ) : (
                  <div className="flex items-center gap-3">
                    <button onClick={() => setIsEditing(false)} className="text-slate-500 hover:text-slate-700 text-sm font-medium transition-colors">Cancel</button>
                    <button type="button" onClick={handleSave} disabled={saving} className="py-2 px-4 bg-brand-600 text-white text-sm font-bold rounded-xl hover:bg-brand-700 transition-colors disabled:opacity-70 flex items-center gap-2 shadow-sm shadow-brand-500/30">
                      {saving ? <><Spinner size={16} /> Saving...</> : 'Save Changes'}
                    </button>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Full Name</label>
                  <div className="flex items-center gap-3">
                    <UserRound className="w-5 h-5 text-slate-400" />
                    {isEditing ? (
                      <input 
                        type="text" 
                        value={editData.name} 
                        onChange={(e) => setEditData({...editData, name: e.target.value})}
                        className="w-full border-b border-brand-300 focus:border-brand-600 outline-none pb-1 bg-transparent text-slate-700" 
                      />
                    ) : (
                      <span className="text-slate-700 font-medium">{user.name}</span>
                    )}
                  </div>
                </div>
                
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Email Address</label>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-slate-400" />
                    {isEditing ? (
                      <input 
                        type="email" 
                        value={editData.email} 
                        onChange={(e) => setEditData({...editData, email: e.target.value})}
                        className="w-full border-b border-brand-300 focus:border-brand-600 outline-none pb-1 bg-transparent text-slate-700" 
                      />
                    ) : (
                      <span className="text-slate-700 font-medium">{user.email || 'Not provided'}</span>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Phone Number</label>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-slate-400" />
                    {isEditing ? (
                      <input 
                        type="tel" 
                        value={editData.phone} 
                        onChange={(e) => setEditData({...editData, phone: e.target.value})}
                        className="w-full border-b border-brand-300 focus:border-brand-600 outline-none pb-1 bg-transparent text-slate-700" 
                      />
                    ) : (
                      <span className="text-slate-700 font-medium">{user.phone || 'Not provided'}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Security Settings */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 mb-6">Security Settings</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:border-slate-200 transition-colors bg-slate-50/50">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      <KeyRound className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-900">Password</h4>
                      <p className="text-sm text-slate-500">Change your password to keep your account secure</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                    Change
                  </button>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
