'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MapPin, Star, UserRound, ArrowLeft, Calendar, Award, Clock } from 'lucide-react';
import { getDoctorById } from '../../../../api/doctors';
import { Skeleton } from '../../../../components/Skeleton';

export default function DoctorProfilePage({ params }: { params: Promise<{ doctorId: string }> }) {
  const router = useRouter();
  const { doctorId } = use(params);
  const [doctor, setDoctor] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDoctor();
  }, []);

  const fetchDoctor = async () => {
    try {
      const data = await getDoctorById(doctorId);
      setDoctor(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 pb-12">
        <Skeleton className="w-1/4 h-6 mb-8" />
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
          <div className="flex items-start gap-8 mb-8 pb-8 border-b border-slate-100">
            <Skeleton className="w-32 h-32 rounded-3xl" />
            <div className="flex-1 space-y-2">
              <Skeleton className="w-1/2 h-8" />
              <Skeleton className="w-1/3 h-5" />
              <Skeleton className="w-1/4 h-5" />
            </div>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            <Skeleton className="h-32 rounded-2xl" />
            <Skeleton className="h-32 rounded-2xl" />
            <Skeleton className="h-32 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }
  if (!doctor) return <div className="p-8 text-red-500">Doctor not found.</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-medium transition-colors">
        <ArrowLeft className="w-5 h-5" /> Back to Search
      </button>

      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-10">
        <div className="w-40 h-40 bg-slate-100 rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden border-4 border-white shadow-md mx-auto md:mx-0">
          <UserRound className="w-16 h-16 text-slate-400" />
        </div>
        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
          <h1 className="text-3xl font-black text-slate-900 mb-2">{doctor.name}</h1>
          <p className="text-xl text-brand-600 font-bold mb-4">{doctor.specialization || 'General Physician'}</p>
          
          <div className="flex flex-wrap gap-4 md:gap-8 text-sm text-slate-600 mb-8 justify-center md:justify-start">
            <span className="flex items-center gap-2"><MapPin className="w-5 h-5 text-slate-400"/> {doctor.department?.hospital?.name || 'Upchaar Hospital'}</span>
            <span className="flex items-center gap-2"><Star className="w-5 h-5 text-amber-500"/> 4.8 (120+ reviews)</span>
            <span className="flex items-center gap-2"><Award className="w-5 h-5 text-slate-400"/> MBBS, MD</span>
          </div>

          <div className="mt-auto w-full max-w-sm">
            <Link href={`/patient/doctors/${doctor.id}/schedule`} className="flex w-full items-center justify-center gap-2 py-4 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 transition-colors shadow-lg shadow-brand-500/20">
              <Calendar className="w-5 h-5" /> View Schedule & Book
            </Link>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
          <h2 className="text-xl font-bold mb-6">About Doctor</h2>
          <p className="text-slate-600 leading-relaxed">
            {doctor.name} is a highly experienced {doctor.specialization || 'physician'} dedicated to providing compassionate and comprehensive care. With a focus on patient well-being, the doctor employs the latest medical advancements to ensure optimal health outcomes.
          </p>
        </div>
        
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
          <h2 className="text-xl font-bold mb-6">Weekly Availability</h2>
          {doctor.availabilities && doctor.availabilities.length > 0 ? (
            <div className="space-y-4">
              {doctor.availabilities.map((a: any) => (
                <div key={a.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="font-bold text-slate-700">
                    {['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][a.dayOfWeek]}
                  </span>
                  <span className="text-sm font-medium text-slate-500 flex items-center gap-2">
                    <Clock className="w-4 h-4"/> {a.startTime} - {a.endTime}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 text-center py-8">No specific weekly schedule available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
