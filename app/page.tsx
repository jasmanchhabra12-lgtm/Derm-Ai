'use client';

import { useState } from 'react';
import { Activity, Clock, FileText, ShieldCheck, Stethoscope } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import NewAssessment from '@/components/features/NewAssessment';
import LongitudinalTracking from '@/components/features/LongitudinalTracking';
import Referrals from '@/components/features/Referrals';
import AuditTrail from '@/components/features/AuditTrail';

type Tab = 'assessment' | 'longitudinal' | 'referrals' | 'audit';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('assessment');

  const tabs = [
    { id: 'assessment', label: 'New Assessment', icon: Activity },
    { id: 'longitudinal', label: 'Longitudinal Tracking', icon: Clock },
    { id: 'referrals', label: 'Secure Referrals', icon: FileText },
    { id: 'audit', label: 'Blockchain Audit', icon: ShieldCheck },
  ] as const;

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6 flex items-center gap-3 border-b border-slate-100">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Stethoscope className="w-5 h-5 text-white" />
          </div>
          <span className="font-semibold text-lg tracking-tight text-slate-900">DermAI</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                {tab.label}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-medium text-slate-600">
              DR
            </div>
            <div className="flex flex-col text-left">
              <span className="text-sm font-medium text-slate-900">Dr. Smith</span>
              <span className="text-xs text-slate-500">Dermatologist</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="h-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {activeTab === 'assessment' && <NewAssessment />}
              {activeTab === 'longitudinal' && <LongitudinalTracking />}
              {activeTab === 'referrals' && <Referrals />}
              {activeTab === 'audit' && <AuditTrail />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
