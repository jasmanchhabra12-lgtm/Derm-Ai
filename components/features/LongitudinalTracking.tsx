"use client";

import { useState } from "react";
import {
  UploadCloud,
  Loader2,
  AlertCircle,
  Plus,
  Trash2,
  Calendar,
  Clock,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { analyzeLongitudinal } from "@/lib/gemini";
import Referrals from "./Referrals"; // import Referrals component

export default function LongitudinalTracking() {
  const [view, setView] = useState<"tracking" | "referrals">("tracking"); // NEW view state
  const [images, setImages] = useState<
    { id: string; base64: string; date: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // SWITCH TO REFERRALS VIEW
  if (view === "referrals") {
    return <Referrals />;
  }

  const handleAddImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages([
          ...images,
          {
            id: Math.random().toString(36).substring(7),
            base64: reader.result as string,
            date: new Date().toISOString().split("T")[0],
          },
        ]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (id: string) => {
    setImages(images.filter((img) => img.id !== id));
  };

  const handleDateChange = (id: string, newDate: string) => {
    setImages(
      images.map((img) => (img.id === id ? { ...img, date: newDate } : img)),
    );
  };

  const handleAnalyze = async () => {
    if (images.length < 2) {
      setError("Please upload at least two images to track evolution.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const sortedImages = [...images].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      );
      const analysis = await analyzeLongitudinal(sortedImages);
      setResult(analysis);
    } catch (err: any) {
      setError(err.message || "Failed to analyze the images.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">
          Longitudinal Tracking
        </h1>
        <p className="text-slate-500 mt-1">
          Upload multiple photos of the same lesion over time to track evolution
          and flag concerning changes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Timeline Upload */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900">
                Lesion Timeline
              </h2>
              <span className="text-xs font-medium bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                {images.length} Image{images.length !== 1 && "s"}
              </span>
            </div>

            <div className="space-y-4">
              {images.map((img, index) => (
                <div
                  key={img.id}
                  className="flex gap-4 items-start p-4 border border-slate-100 rounded-xl bg-slate-50 relative group"
                >
                  <div className="w-24 h-24 rounded-lg overflow-hidden border border-slate-200 shrink-0 relative">
                    <img
                      src={img.base64}
                      alt={`Lesion ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <label className="block text-xs font-medium text-slate-500">
                      Date Taken
                    </label>
                    <div className="relative">
                      <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="date"
                        className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        value={img.date}
                        onChange={(e) =>
                          handleDateChange(img.id, e.target.value)
                        }
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveImage(img.id)}
                    className="absolute top-2 right-2 p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              <div className="relative border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleAddImage}
                />
                <Plus className="w-6 h-6 text-slate-400 mb-2" />
                <span className="text-sm font-medium text-slate-600">
                  Add Timeline Image
                </span>
              </div>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-red-700 text-sm">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <button
              onClick={handleAnalyze}
              disabled={loading || images.length < 2}
              className="w-full mt-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing Evolution...
                </>
              ) : (
                "Compare & Analyze"
              )}
            </button>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-7">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-full min-h-[600px] flex flex-col">
            <h2 className="text-lg font-semibold text-slate-900 mb-4 border-b border-slate-100 pb-4">
              Evolution Report
            </h2>

            {result ? (
              <div className="prose prose-slate prose-sm max-w-none flex-1 overflow-y-auto pr-2">
                <ReactMarkdown>{result}</ReactMarkdown>

                <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-between">
                  <p className="text-xs text-slate-500 italic">
                    Disclaimer: This AI analysis is for informational purposes
                    only and does not constitute a medical diagnosis. Always
                    consult a qualified healthcare professional.
                  </p>

                  {/* NEW REFERRAL BUTTON */}
                  <button
                    onClick={() => setView("referrals")} // show Referrals component
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    Initiate Secure Referral
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                <Clock className="w-12 h-12 mb-3 opacity-20" />
                <p className="text-sm text-center max-w-xs">
                  Upload at least two images over time and run the analysis to
                  see the evolution report.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
// "use client";

// import { useState } from "react";
// import {
//   UploadCloud,
//   Loader2,
//   AlertCircle,
//   Plus,
//   Trash2,
//   Calendar,
//   Clock,
// } from "lucide-react";
// import ReactMarkdown from "react-markdown";
// import { analyzeLongitudinal } from "@/lib/gemini";

// export default function LongitudinalTracking() {
//   const [images, setImages] = useState<
//     { id: string; base64: string; date: string }[]
//   >([]);
//   const [loading, setLoading] = useState(false);
//   const [result, setResult] = useState<string | null>(null);
//   const [error, setError] = useState<string | null>(null);

//   const handleAddImage = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setImages([
//           ...images,
//           {
//             id: Math.random().toString(36).substring(7),
//             base64: reader.result as string,
//             date: new Date().toISOString().split("T")[0],
//           },
//         ]);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleRemoveImage = (id: string) => {
//     setImages(images.filter((img) => img.id !== id));
//   };

//   const handleDateChange = (id: string, newDate: string) => {
//     setImages(
//       images.map((img) => (img.id === id ? { ...img, date: newDate } : img)),
//     );
//   };

//   const handleAnalyze = async () => {
//     if (images.length < 2) {
//       setError("Please upload at least two images to track evolution.");
//       return;
//     }

//     setLoading(true);
//     setError(null);
//     try {
//       // Sort images by date
//       const sortedImages = [...images].sort(
//         (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
//       );
//       const analysis = await analyzeLongitudinal(sortedImages);
//       setResult(analysis);
//     } catch (err: any) {
//       setError(err.message || "Failed to analyze the images.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-8 max-w-6xl mx-auto">
//       <div className="mb-8">
//         <h1 className="text-2xl font-bold text-slate-900">
//           Longitudinal Tracking
//         </h1>
//         <p className="text-slate-500 mt-1">
//           Upload multiple photos of the same lesion over time to track evolution
//           and flag concerning changes.
//         </p>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
//         {/* Timeline Upload */}
//         <div className="lg:col-span-5 space-y-6">
//           <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="text-lg font-semibold text-slate-900">
//                 Lesion Timeline
//               </h2>
//               <span className="text-xs font-medium bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
//                 {images.length} Image{images.length !== 1 && "s"}
//               </span>
//             </div>

//             <div className="space-y-4">
//               {images.map((img, index) => (
//                 <div
//                   key={img.id}
//                   className="flex gap-4 items-start p-4 border border-slate-100 rounded-xl bg-slate-50 relative group"
//                 >
//                   <div className="w-24 h-24 rounded-lg overflow-hidden border border-slate-200 shrink-0 relative">
//                     <img
//                       src={img.base64}
//                       alt={`Lesion ${index + 1}`}
//                       className="w-full h-full object-cover"
//                     />
//                   </div>
//                   <div className="flex-1 space-y-2">
//                     <label className="block text-xs font-medium text-slate-500">
//                       Date Taken
//                     </label>
//                     <div className="relative">
//                       <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
//                       <input
//                         type="date"
//                         className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
//                         value={img.date}
//                         onChange={(e) =>
//                           handleDateChange(img.id, e.target.value)
//                         }
//                       />
//                     </div>
//                   </div>
//                   <button
//                     onClick={() => handleRemoveImage(img.id)}
//                     className="absolute top-2 right-2 p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md opacity-0 group-hover:opacity-100 transition-all"
//                   >
//                     <Trash2 className="w-4 h-4" />
//                   </button>
//                 </div>
//               ))}

//               <div className="relative border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
//                 <input
//                   type="file"
//                   accept="image/*"
//                   className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
//                   onChange={handleAddImage}
//                 />
//                 <Plus className="w-6 h-6 text-slate-400 mb-2" />
//                 <span className="text-sm font-medium text-slate-600">
//                   Add Timeline Image
//                 </span>
//               </div>
//             </div>

//             {error && (
//               <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-red-700 text-sm">
//                 <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
//                 <p>{error}</p>
//               </div>
//             )}

//             <button
//               onClick={handleAnalyze}
//               disabled={loading || images.length < 2}
//               className="w-full mt-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
//             >
//               {loading ? (
//                 <>
//                   <Loader2 className="w-4 h-4 animate-spin" />
//                   Analyzing Evolution...
//                 </>
//               ) : (
//                 "Compare & Analyze"
//               )}
//             </button>
//           </div>
//         </div>

//         {/* Results Panel */}
//         <div className="lg:col-span-7">
//           <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-full min-h-[600px] flex flex-col">
//             <h2 className="text-lg font-semibold text-slate-900 mb-4 border-b border-slate-100 pb-4">
//               Evolution Report
//             </h2>

//             {result ? (
//               <div className="prose prose-slate prose-sm max-w-none flex-1 overflow-y-auto pr-2">
//                 <ReactMarkdown>{result}</ReactMarkdown>

//                 <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-between">
//                   <p className="text-xs text-slate-500 italic">
//                     Disclaimer: This AI analysis is for informational purposes
//                     only and does not constitute a medical diagnosis. Always
//                     consult a qualified healthcare professional.
//                   </p>
//                   <button className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-lg transition-colors">
//                     Initiate Secure Referral
//                   </button>
//                 </div>
//               </div>
//             ) : (
//               <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
//                 <Clock className="w-12 h-12 mb-3 opacity-20" />
//                 <p className="text-sm text-center max-w-xs">
//                   Upload at least two images over time and run the analysis to
//                   see the evolution report.
//                 </p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
