'use client';

import { useState } from 'react';
import { UploadCloud, Loader2, AlertCircle, Stethoscope } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { analyzeSkinLesion } from '@/lib/gemini';

export default function NewAssessment() {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    age: '',
    gender: 'Female',
    skinType: 'Type I',
    personalHistory: false,
    familyHistory: false,
    immunosuppressed: false,
    newOrChanging: false,
    notes: '',
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) {
      setError('Please upload an image of the lesion.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const analysis = await analyzeSkinLesion(image, formData);
      setResult(analysis);
    } catch (err: any) {
      setError(err.message || 'Failed to analyze the image.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">New Lesion Assessment</h1>
        <p className="text-slate-500 mt-1">Upload a high-resolution image and provide clinical context for AI-assisted differential diagnosis.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form and Upload */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Clinical Data</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Age</label>
                  <input
                    type="number"
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Biological Gender</label>
                  <select
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  >
                    <option>Female</option>
                    <option>Male</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Fitzpatrick Skin Type</label>
                <select
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  value={formData.skinType}
                  onChange={(e) => setFormData({ ...formData, skinType: e.target.value })}
                >
                  <option>Type I (Pale white, always burns)</option>
                  <option>Type II (White, usually burns)</option>
                  <option>Type III (Light brown, sometimes burns)</option>
                  <option>Type IV (Moderate brown, rarely burns)</option>
                  <option>Type V (Dark brown, very rarely burns)</option>
                  <option>Type VI (Deeply pigmented, never burns)</option>
                </select>
              </div>

              <div className="space-y-2 pt-2">
                {[
                  { id: 'personalHistory', label: 'Personal history of skin cancer' },
                  { id: 'familyHistory', label: 'Family history of skin cancer' },
                  { id: 'immunosuppressed', label: 'Immunosuppressed patient' },
                  { id: 'newOrChanging', label: 'New or rapidly changing lesion' },
                ].map((item) => (
                  <label key={item.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                      checked={formData[item.id as keyof typeof formData] as boolean}
                      onChange={(e) => setFormData({ ...formData, [item.id]: e.target.checked })}
                    />
                    <span className="text-sm text-slate-700">{item.label}</span>
                  </label>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Lab Results / Clinical Notes</label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                  placeholder="Enter relevant labs (e.g., WBC, CRP) or notes..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>

              <div className="pt-4 border-t border-slate-100">
                <label className="block text-sm font-medium text-slate-700 mb-2">Lesion Image</label>
                <div className="relative border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer overflow-hidden">
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleImageUpload}
                  />
                  {image ? (
                    <img src={image} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <>
                      <UploadCloud className="w-8 h-8 text-slate-400 mb-2" />
                      <span className="text-sm font-medium text-slate-600">Click or drag image here</span>
                      <span className="text-xs text-slate-400 mt-1">High-resolution JPEG/PNG</span>
                    </>
                  )}
                </div>
                {image && (
                  <button
                    type="button"
                    onClick={() => setImage(null)}
                    className="text-xs text-red-600 mt-2 font-medium hover:underline"
                  >
                    Remove image
                  </button>
                )}
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-red-700 text-sm">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  'Run AI Assessment'
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-7">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-full min-h-[600px] flex flex-col">
            <h2 className="text-lg font-semibold text-slate-900 mb-4 border-b border-slate-100 pb-4">Assessment Report</h2>
            
            {result ? (
              <div className="prose prose-slate prose-sm max-w-none flex-1 overflow-y-auto pr-2">
                <ReactMarkdown>{result}</ReactMarkdown>
                
                <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-between">
                  <p className="text-xs text-slate-500 italic">
                    Disclaimer: This AI analysis is for informational purposes only and does not constitute a medical diagnosis. Always consult a qualified healthcare professional.
                  </p>
                  <button className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-lg transition-colors">
                    Initiate Secure Referral
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                <Stethoscope className="w-12 h-12 mb-3 opacity-20" />
                <p className="text-sm">Upload an image and run the assessment to see the report.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
