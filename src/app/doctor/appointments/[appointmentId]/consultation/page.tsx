'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Stethoscope, Pill, AlertCircle, Save, Plus, Trash2 } from 'lucide-react';
import clsx from 'clsx';

export default function DoctorConsultationForm() {
  const { appointmentId } = useParams() as { appointmentId: string };
  const router = useRouter();
  const [appt, setAppt] = useState<any>(null);
  
  // Consultation Fields
  const [symptoms, setSymptoms] = useState('');
  const [notes, setNotes] = useState('');
  const [treatmentPlan, setTreatmentPlan] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  
  // Diagnosis Fields
  const [diagnosisName, setDiagnosisName] = useState('');
  const [diagnosisNotes, setDiagnosisNotes] = useState('');

  // Prescription Fields
  const [prescriptionInstructions, setPrescriptionInstructions] = useState('');
  const [medicines, setMedicines] = useState<any[]>([]);

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAppt();
  }, []);

  const fetchAppt = async () => {
    try {
      const res = await fetch(`http://localhost:4000/api/appointments/${appointmentId}`);
      setAppt(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  const addMedicine = () => {
    setMedicines([...medicines, { name: '', strength: '', dosage: '', frequency: '', duration: '', route: '', instructions: '' }]);
  };

  const updateMedicine = (index: number, field: string, value: string) => {
    const newMeds = [...medicines];
    newMeds[index][field] = value;
    setMedicines(newMeds);
  };

  const removeMedicine = (index: number) => {
    const newMeds = [...medicines];
    newMeds.splice(index, 1);
    setMedicines(newMeds);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appt?.consultation?.id) {
      alert("Consultation hasn't been started yet.");
      return;
    }
    
    setSaving(true);
    try {
      const payload = {
        symptoms, notes, treatmentPlan, followUpDate,
        diagnosisName, diagnosisNotes,
        medicines, prescriptionInstructions
      };

      const res = await fetch(`http://localhost:4000/api/consultations/${appt.consultation.id}/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) throw new Error('Failed to save');
      
      // Also end the consultation if desired, but for MVP we just redirect back to queue.
      router.push('/doctor');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!appt) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-12">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 bg-slate-50 rounded-full hover:bg-slate-100 transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <span className="font-bold text-lg tracking-tight">Clinical Consultation Form</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 mt-8 space-y-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Patient</p>
            <h2 className="text-2xl font-black text-slate-900">{appt.bookingReference}</h2>
            <p className="text-slate-500 font-medium">Slot: {appt.slotTime}</p>
          </div>
          <span className="px-4 py-2 bg-brand-100 text-brand-700 font-bold rounded-full uppercase text-sm">
            In Progress
          </span>
        </div>

        <form onSubmit={handleSave} className="space-y-8">
          
          {/* Clinical Notes Section */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-slate-900 p-6 text-white flex items-center gap-3">
              <Stethoscope className="w-6 h-6 text-brand-400" />
              <h3 className="text-xl font-bold">Clinical Assessment</h3>
            </div>
            <div className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Symptoms (Patient Reported)</label>
                <textarea rows={3} value={symptoms} onChange={e=>setSymptoms(e.target.value)} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-500 resize-none" placeholder="e.g. Headache for 3 days, mild fever..."/>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Doctor's Clinical Notes</label>
                <textarea rows={4} value={notes} onChange={e=>setNotes(e.target.value)} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-500 resize-none" placeholder="Observations, vitals..."/>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Diagnosis Name</label>
                  <input type="text" value={diagnosisName} onChange={e=>setDiagnosisName(e.target.value)} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-500" placeholder="e.g. Viral Pharyngitis" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Follow-up Date</label>
                  <input type="date" value={followUpDate} onChange={e=>setFollowUpDate(e.target.value)} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-500" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Treatment Plan</label>
                <textarea rows={3} value={treatmentPlan} onChange={e=>setTreatmentPlan(e.target.value)} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-500 resize-none" placeholder="Rest, hydration, medications as prescribed..."/>
              </div>
            </div>
          </div>

          {/* Prescription Section */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-orange-500 p-6 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Pill className="w-6 h-6 text-orange-200" />
                <h3 className="text-xl font-bold">Prescription & Medications</h3>
              </div>
              <button type="button" onClick={addMedicine} className="flex items-center gap-2 px-4 py-2 bg-white text-orange-600 font-bold rounded-lg hover:bg-orange-50 transition-colors">
                <Plus className="w-4 h-4"/> Add Medicine
              </button>
            </div>
            
            <div className="p-8">
              {medicines.length === 0 ? (
                <div className="text-center py-8 text-slate-400 font-medium border-2 border-dashed border-slate-200 rounded-2xl">
                  Click 'Add Medicine' to prescribe medication.
                </div>
              ) : (
                <div className="space-y-6 mb-8">
                  {medicines.map((med, index) => (
                    <div key={index} className="relative bg-slate-50 p-6 rounded-2xl border border-slate-200">
                      <button type="button" onClick={() => removeMedicine(index)} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-5 h-5"/>
                      </button>
                      <h4 className="font-bold text-slate-700 mb-4">Medicine #{index + 1}</h4>
                      
                      <div className="grid md:grid-cols-4 gap-4">
                        <div className="md:col-span-2">
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Name</label>
                          <input required type="text" value={med.name} onChange={e=>updateMedicine(index, 'name', e.target.value)} className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:border-brand-500" placeholder="Paracetamol" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Strength</label>
                          <input required type="text" value={med.strength} onChange={e=>updateMedicine(index, 'strength', e.target.value)} className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:border-brand-500" placeholder="500mg" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Dosage</label>
                          <input required type="text" value={med.dosage} onChange={e=>updateMedicine(index, 'dosage', e.target.value)} className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:border-brand-500" placeholder="1 tablet" />
                        </div>
                        
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Frequency</label>
                          <input required type="text" value={med.frequency} onChange={e=>updateMedicine(index, 'frequency', e.target.value)} className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:border-brand-500" placeholder="Twice daily" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Duration</label>
                          <input required type="text" value={med.duration} onChange={e=>updateMedicine(index, 'duration', e.target.value)} className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:border-brand-500" placeholder="5 days" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Route (Optional)</label>
                          <input type="text" value={med.route} onChange={e=>updateMedicine(index, 'route', e.target.value)} className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:border-brand-500" placeholder="Oral" />
                        </div>
                        <div className="md:col-span-4 mt-2">
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Specific Instructions</label>
                          <input type="text" value={med.instructions} onChange={e=>updateMedicine(index, 'instructions', e.target.value)} className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:border-brand-500" placeholder="Take after meals" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">General Prescription Instructions</label>
                <textarea rows={2} value={prescriptionInstructions} onChange={e=>setPrescriptionInstructions(e.target.value)} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:border-orange-500 focus:ring-orange-500 resize-none" placeholder="Any general instructions for the pharmacist or patient..."/>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button type="submit" disabled={saving} className="w-full py-5 bg-brand-600 text-white font-bold rounded-2xl hover:bg-brand-700 transition-colors disabled:opacity-70 flex items-center justify-center gap-3 text-lg shadow-xl shadow-brand-500/30">
              <Save className="w-6 h-6" /> {saving ? 'Saving Consultation...' : 'Save & Complete Consultation'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
