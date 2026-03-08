/////Test code////
"use client";

import { useState, useEffect } from "react";
import { Search, MoreVertical, Send, CheckCircle2, Clock } from "lucide-react";
import CryptoJS from "crypto-js";

// --- Types ---
interface Referral {
  id: string;
  patient: string;
  doctorId: string;
  date: string;
  status: string;
  priority: string;
  condition: string;
}

// --- Constants ---
const LOCAL_STORAGE_KEY = "referrals_demo_v3";
const ENCRYPTION_KEY = "hackathon-secret-key-2024";

const initialReferrals: Referral[] = [
  {
    id: "REF-2023-089",
    patient: "ANONYMIZED-A9B2",
    doctorId: "DOC-V721",
    date: "2023-10-24",
    status: "Pending",
    priority: "High",
    condition: "Suspected Melanoma",
  },
  {
    id: "REF-2023-088",
    patient: "ANONYMIZED-C4F1",
    doctorId: "DOC-K029",
    date: "2023-10-22",
    status: "Scheduled",
    priority: "Medium",
    condition: "Atypical Nevus",
  },
  {
    id: "REF-2023-087",
    patient: "ANONYMIZED-X9P0",
    doctorId: "DOC-R832",
    date: "2023-10-18",
    status: "Completed",
    priority: "Low",
    condition: "Seborrheic Keratosis",
  },
  {
    id: "REF-2023-086",
    patient: "ANONYMIZED-M2N5",
    doctorId: "DOC-W401",
    date: "2023-10-15",
    status: "Pending",
    priority: "High",
    condition: "Basal Cell Carcinoma",
  },
];

export default function Referrals() {
  const [searchTerm, setSearchTerm] = useState("");
  const [referrals, setReferrals] = useState<Referral[]>(initialReferrals);
  const [showModal, setShowModal] = useState(false);
  const [condition, setCondition] = useState("");
  const [priority, setPriority] = useState("Medium");

  // --- Persistence Logic ---
  useEffect(() => {
    try {
      const encrypted = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (encrypted) {
        const bytes = CryptoJS.AES.decrypt(encrypted, ENCRYPTION_KEY);
        const decryptedStr = bytes.toString(CryptoJS.enc.Utf8);

        if (decryptedStr) {
          const storedData = JSON.parse(decryptedStr) as Referral[];
          // Safety: Map through to ensure doctorId exists even in old records
          const validatedData = storedData.map((ref) => ({
            ...ref,
            doctorId: ref.doctorId || "DOC-PREV",
          }));
          setReferrals(validatedData);
        }
      }
    } catch (e) {
      console.error("Decryption error:", e);
    }
  }, []);

  const saveToStorage = (data: Referral[]) => {
    try {
      const cipherText = CryptoJS.AES.encrypt(
        JSON.stringify(data),
        ENCRYPTION_KEY,
      ).toString();
      localStorage.setItem(LOCAL_STORAGE_KEY, cipherText);
    } catch (e) {
      console.error("Encryption error:", e);
    }
  };

  // --- Helper Functions ---
  function generateUppercaseId(prefix: string) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 4; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `${prefix.toUpperCase()}-${result}`;
  }

  function handleCreateReferral() {
    if (!condition) return;

    const newEntry: Referral = {
      id: `REF-${Math.floor(Math.random() * 10000)}`,
      patient: generateUppercaseId("ANONYMIZED"),
      doctorId: generateUppercaseId("DOC"),
      condition,
      priority,
      status: "Pending",
      date: new Date().toISOString().split("T")[0],
    };

    const updatedList = [newEntry, ...referrals];
    setReferrals(updatedList);
    saveToStorage(updatedList);

    setShowModal(false);
    setCondition("");
    setPriority("Medium");
  }

  const filtered = referrals.filter(
    (r) =>
      r.condition.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.doctorId.toUpperCase().includes(searchTerm.toUpperCase()) ||
      r.patient.toUpperCase().includes(searchTerm.toUpperCase()),
  );

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header Section */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Secure Referrals
          </h1>
          <p className="text-slate-500 mt-1">
            Manage and track anonymized patient and doctor referrals.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
        >
          <Send className="w-4 h-4" />
          New Referral
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between gap-4 bg-slate-50/50">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by condition or ID..."
              className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Referral ID</th>
                <th className="px-6 py-4">Patient ID</th>
                <th className="px-6 py-4">Doctor ID</th>
                <th className="px-6 py-4">Condition</th>
                <th className="px-6 py-4">Priority</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filtered.map((ref) => (
                <tr
                  key={ref.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-slate-900">
                    {ref.id}
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-slate-500 uppercase">
                    {ref.patient}
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-slate-500 uppercase">
                    {ref.doctorId}
                  </td>
                  <td className="px-6 py-4 text-slate-900">{ref.condition}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        ref.priority === "High"
                          ? "bg-red-100 text-red-700"
                          : ref.priority === "Medium"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {ref.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      {ref.status === "Completed" ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Clock className="w-4 h-4 text-amber-500" />
                      )}
                      <span className="text-slate-600 font-medium">
                        {ref.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-md">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Section */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-sm space-y-4 shadow-xl">
            <h2 className="text-lg font-semibold">Create Referral</h2>
            <p className="text-xs text-slate-500 italic">
              * Patient and Doctor IDs will be automatically generated in
              uppercase.
            </p>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase">
                Condition
              </label>
              <input
                placeholder="Medical Condition"
                className="w-full border border-slate-300 p-2 rounded text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase">
                Priority
              </label>
              <select
                className="w-full border border-slate-300 p-2 rounded text-sm outline-none"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>

              <button
                onClick={handleCreateReferral}
                disabled={!condition}
                className={`px-4 py-2 text-white text-sm font-medium rounded transition-all ${
                  !condition
                    ? "bg-slate-300 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
////Old code////
// 'use client';

// import { useState } from 'react';
// import { FileText, Search, Filter, MoreVertical, Send, CheckCircle2, Clock } from 'lucide-react';

// const mockReferrals = [
//   { id: 'REF-2023-089', patient: 'Anonymized-A9B2', date: '2023-10-24', status: 'Pending', priority: 'High', condition: 'Suspected Melanoma' },
//   { id: 'REF-2023-088', patient: 'Anonymized-C4F1', date: '2023-10-22', status: 'Scheduled', priority: 'Medium', condition: 'Atypical Nevus' },
//   { id: 'REF-2023-087', patient: 'Anonymized-X9P0', date: '2023-10-18', status: 'Completed', priority: 'Low', condition: 'Seborrheic Keratosis' },
//   { id: 'REF-2023-086', patient: 'Anonymized-M2N5', date: '2023-10-15', status: 'Pending', priority: 'High', condition: 'Basal Cell Carcinoma' },
// ];

// export default function Referrals() {
//   const [searchTerm, setSearchTerm] = useState('');

//   return (
//     <div className="p-8 max-w-6xl mx-auto">
//       <div className="mb-8 flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-bold text-slate-900">Secure Referrals</h1>
//           <p className="text-slate-500 mt-1">Manage and track patient referrals to specialized dermatologists.</p>
//         </div>
//         <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2">
//           <Send className="w-4 h-4" />
//           New Referral
//         </button>
//       </div>

//       <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
//         <div className="p-4 border-b border-slate-200 flex items-center justify-between gap-4 bg-slate-50/50">
//           <div className="relative flex-1 max-w-md">
//             <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
//             <input
//               type="text"
//               placeholder="Search referrals..."
//               className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>
//           <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg border border-slate-300 transition-colors">
//             <Filter className="w-4 h-4" />
//           </button>
//         </div>

//         <div className="overflow-x-auto">
//           <table className="w-full text-sm text-left">
//             <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
//               <tr>
//                 <th className="px-6 py-4 font-medium">Referral ID</th>
//                 <th className="px-6 py-4 font-medium">Patient ID</th>
//                 <th className="px-6 py-4 font-medium">Date</th>
//                 <th className="px-6 py-4 font-medium">Condition</th>
//                 <th className="px-6 py-4 font-medium">Priority</th>
//                 <th className="px-6 py-4 font-medium">Status</th>
//                 <th className="px-6 py-4 font-medium text-right">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-100">
//               {mockReferrals.map((ref) => (
//                 <tr key={ref.id} className="hover:bg-slate-50/50 transition-colors">
//                   <td className="px-6 py-4 font-medium text-slate-900">{ref.id}</td>
//                   <td className="px-6 py-4 font-mono text-xs text-slate-500">{ref.patient}</td>
//                   <td className="px-6 py-4 text-slate-600">{ref.date}</td>
//                   <td className="px-6 py-4 text-slate-900">{ref.condition}</td>
//                   <td className="px-6 py-4">
//                     <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
//                       ref.priority === 'High' ? 'bg-red-100 text-red-700' :
//                       ref.priority === 'Medium' ? 'bg-amber-100 text-amber-700' :
//                       'bg-emerald-100 text-emerald-700'
//                     }`}>
//                       {ref.priority}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4">
//                     <div className="flex items-center gap-1.5">
//                       {ref.status === 'Completed' ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Clock className="w-4 h-4 text-amber-500" />}
//                       <span className="text-slate-600 font-medium">{ref.status}</span>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 text-right">
//                     <button className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors">
//                       <MoreVertical className="w-4 h-4" />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }
