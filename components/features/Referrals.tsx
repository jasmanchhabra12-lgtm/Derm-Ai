/////Test code////
"use client";

import { useState } from "react";
import {
  FileText,
  Search,
  Filter,
  MoreVertical,
  Send,
  CheckCircle2,
  Clock,
} from "lucide-react";

const initialReferrals = [
  {
    id: "REF-2023-089",
    patient: "Anonymized-A9B2",
    date: "2023-10-24",
    status: "Pending",
    priority: "High",
    condition: "Suspected Melanoma",
  },
  {
    id: "REF-2023-088",
    patient: "Anonymized-C4F1",
    date: "2023-10-22",
    status: "Scheduled",
    priority: "Medium",
    condition: "Atypical Nevus",
  },
  {
    id: "REF-2023-087",
    patient: "Anonymized-X9P0",
    date: "2023-10-18",
    status: "Completed",
    priority: "Low",
    condition: "Seborrheic Keratosis",
  },
  {
    id: "REF-2023-086",
    patient: "Anonymized-M2N5",
    date: "2023-10-15",
    status: "Pending",
    priority: "High",
    condition: "Basal Cell Carcinoma",
  },
];

export default function Referrals() {
  const [searchTerm, setSearchTerm] = useState("");
  const [referrals, setReferrals] = useState(initialReferrals);
  const [showModal, setShowModal] = useState(false);

  const [patient, setPatient] = useState("");
  const [condition, setCondition] = useState("");
  const [priority, setPriority] = useState("Medium");

  function handleCreateReferral() {
    const newReferral = {
      id: `REF-${Date.now()}`,
      patient,
      condition,
      priority,
      status: "Pending",
      date: new Date().toISOString().split("T")[0],
    };

    setReferrals([newReferral, ...referrals]);
    setShowModal(false);
    setPatient("");
    setCondition("");
  }

  const filtered = referrals.filter(
    (r) =>
      r.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.condition.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Secure Referrals
          </h1>
          <p className="text-slate-500 mt-1">
            Manage and track patient referrals to specialized dermatologists.
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

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between gap-4 bg-slate-50/50">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search referrals..."
              className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg border border-slate-300">
            <Filter className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Referral ID</th>
                <th className="px-6 py-4">Patient ID</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Condition</th>
                <th className="px-6 py-4">Priority</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filtered.map((ref) => (
                <tr key={ref.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-900">
                    {ref.id}
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-slate-500">
                    {ref.patient}
                  </td>
                  <td className="px-6 py-4 text-slate-600">{ref.date}</td>
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

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-96 space-y-4">
            <h2 className="text-lg font-semibold">Create Referral</h2>

            <input
              placeholder="Patient ID"
              className="w-full border p-2 rounded"
              value={patient}
              onChange={(e) => setPatient(e.target.value)}
            />

            <input
              placeholder="Condition"
              className="w-full border p-2 rounded"
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
            />

            <select
              className="w-full border p-2 rounded"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-3 py-2 text-sm"
              >
                Cancel
              </button>

              <button
                onClick={handleCreateReferral}
                className="px-3 py-2 bg-blue-600 text-white rounded"
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
