'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, MapPin, Star, UserRound } from 'lucide-react';
import { getDoctors } from '../../../api/doctors';
import { Skeleton } from '../../../components/Skeleton';

export default function FindDoctorsPage() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDoctors();
  }, [search]);

  const fetchDoctors = async () => {
    try {
      const data = await getDoctors(search);
      setDoctors(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Find Doctors</h1>
        <p className="text-slate-500">Search for specialists and book appointments.</p>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-2xl">
        <input 
          type="text" 
          placeholder="Search by doctor name..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-brand-500 outline-none text-slate-700 font-medium"
        />
        <Search className="absolute left-4 top-4 text-slate-400 w-6 h-6" />
      </div>

      {/* Results */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton className="h-64 rounded-3xl w-full" />
          <Skeleton className="h-64 rounded-3xl w-full" />
          <Skeleton className="h-64 rounded-3xl w-full" />
        </div>
      ) : doctors.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-500 shadow-sm">
          No doctors found.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {doctors.map(doc => (
            <div key={doc.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-6 hover:shadow-md transition-shadow">
              <div className="w-24 h-24 bg-slate-100 rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden border-4 border-white shadow-sm">
                <UserRound className="w-10 h-10 text-slate-400" />
              </div>
              <div className="flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-slate-900 mb-1">{doc.name}</h3>
                <p className="text-brand-600 font-medium mb-3">{doc.specialization || 'General Physician'}</p>
                <div className="flex flex-col gap-2 text-sm text-slate-500 mb-6">
                  <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4"/> {doc.department?.hospital?.name || 'Upchaar Hospital'}</span>
                  <span className="flex items-center gap-1.5"><Star className="w-4 h-4 text-amber-500"/> 10+ Years Experience</span>
                </div>
                <div className="flex gap-3 mt-auto">
                  <Link href={`/patient/doctors/${doc.id}`} className="flex-1 py-2 text-center border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-colors">Profile</Link>
                  <Link href={`/patient/doctors/${doc.id}/schedule`} className="flex-1 py-2 text-center bg-brand-600 text-white font-medium rounded-xl hover:bg-brand-700 transition-colors">Schedule</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
