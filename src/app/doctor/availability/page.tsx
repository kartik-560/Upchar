'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function DoctorAvailability() {
  const [user, setUser] = useState<any>(null);
  const [availabilities, setAvailabilities] = useState<any[]>([]);
  
  const [dayOfWeek, setDayOfWeek] = useState('1');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [slotDuration, setSlotDuration] = useState('15');
  
  const router = useRouter();

  useEffect(() => {
    const u = localStorage.getItem('user');
    if (!u) { router.push('/login'); return; }
    const parsed = JSON.parse(u);
    if(parsed.role !== 'DOCTOR') { router.push('/login'); return; }
    setUser(parsed);
    loadAvailabilities(parsed.id);
  }, []);

  const loadAvailabilities = async (docId: string) => {
    try {
      const res = await axios.get(`http://localhost:4000/api/doctors/${docId}/availability`);
      setAvailabilities(res.data);
    } catch(e) {}
  };

  const addAvailability = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:4000/api/doctors/${user.id}/availability`, {
        dayOfWeek: parseInt(dayOfWeek),
        startTime,
        endTime,
        slotDuration: parseInt(slotDuration)
      });
      loadAvailabilities(user.id);
      setDayOfWeek('1'); setStartTime('09:00'); setEndTime('17:00'); setSlotDuration('15');
    } catch(e) {
      alert('Failed to add availability');
    }
  };

  const deleteAvailability = async (id: string) => {
    try {
      await axios.delete(`http://localhost:4000/api/doctors/availability/${id}`);
      loadAvailabilities(user.id);
    } catch(e) {
      alert('Failed to delete availability');
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">
        <h2 className="text-2xl font-bold mb-6">Manage Availability</h2>
        
        <form onSubmit={addAvailability} className="grid md:grid-cols-5 gap-4 mb-8">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Day</label>
            <select value={dayOfWeek} onChange={e=>setDayOfWeek(e.target.value)} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-brand-500 outline-none">
              <option value="1">Monday</option>
              <option value="2">Tuesday</option>
              <option value="3">Wednesday</option>
              <option value="4">Thursday</option>
              <option value="5">Friday</option>
              <option value="6">Saturday</option>
              <option value="0">Sunday</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Start Time</label>
            <input type="time" value={startTime} onChange={e=>setStartTime(e.target.value)} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">End Time</label>
            <input type="time" value={endTime} onChange={e=>setEndTime(e.target.value)} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Slot Mins</label>
            <input type="number" value={slotDuration} onChange={e=>setSlotDuration(e.target.value)} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" required />
          </div>
          <div className="flex items-end">
            <button type="submit" className="w-full p-2 bg-brand-600 text-white rounded-lg font-semibold hover:bg-brand-700">Add Rule</button>
          </div>
        </form>

        <div>
          <h3 className="font-semibold mb-4 text-slate-700">Current Availability Rules</h3>
          {availabilities.length === 0 && <p className="text-slate-500">No availability configured.</p>}
          <div className="space-y-3">
            {availabilities.map(a => (
              <div key={a.id} className="p-4 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <p className="font-bold">
                    {['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][a.dayOfWeek]}
                  </p>
                  <p className="text-sm text-slate-500">{a.startTime} - {a.endTime} ({a.slotDuration} min slots)</p>
                </div>
                <button onClick={() => deleteAvailability(a.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg text-sm font-semibold transition-colors">Remove</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
