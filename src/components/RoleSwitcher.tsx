import React from 'react';
import { Shield, Activity, Users, Smartphone, Key } from 'lucide-react';
import { UserRole } from '../types';

interface RoleSwitcherProps {
  currentRole: UserRole;
  onChangeRole: (role: UserRole) => void;
  streakCount: number;
  alertsCount: number;
}

export default function RoleSwitcher({ currentRole, onChangeRole, streakCount, alertsCount }: RoleSwitcherProps) {
  return (
    <header className="bg-brand-burgundy text-white px-8 py-4 border-b border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 sticky top-0 z-50 shadow-sm">
      <div className="flex items-center gap-3">
        {/* Minimalist Monogram Logo from theme */}
        <div className="w-8 h-8 rounded-lg bg-brand-gold flex items-center justify-center shrink-0 select-none">
          <svg viewBox="0 0 20 20" className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            {/* Leaf */}
            <path d="M11 3 C14 3 17 6 17 10 C17 14 14 16 11 16 C8 10 11 3 11 3Z" fill="#863D4B"/>
            <path d="M11 3 L10.2 16" stroke="#DDAC5B" strokeWidth="1" fill="none"/>
            {/* Wind lines */}
            <path d="M2 10 Q5 8 8 10" stroke="#863D4B" strokeWidth="1.6" fill="none"/>
            <path d="M2 13 Q4.5 11.5 7 13" stroke="#863D4B" strokeWidth="1.2" fill="none" opacity="0.55"/>
          </svg>
        </div>
        <span className="text-white font-semibold text-lg tracking-tight italic font-serif">Therapy & Beyond</span>
        
        <span className="hidden sm:inline-block text-[9px] bg-white/10 text-white/80 font-mono tracking-wider px-2.5 py-1 rounded-full uppercase">
          Continuous Care Portal
        </span>
      </div>

      {/* Role Selector Controls */}
      <div className="flex items-center gap-1.5 bg-black/15 p-1 rounded-2xl border border-white/5">
        <button
          onClick={() => onChangeRole('patient')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            currentRole === 'patient'
              ? 'bg-white text-brand-burgundy shadow-sm'
              : 'text-white/80 hover:text-white hover:bg-white/5'
          }`}
          id="btn-switch-patient"
        >
          <Smartphone className="h-3.5 w-3.5" />
          <span>Patient App</span>
          {streakCount > 0 && (
            <span className="bg-brand-gold text-brand-burgundy text-[10px] px-1.5 py-0.5 rounded-md font-bold">
              🔥 {streakCount}
            </span>
          )}
        </button>

        <button
          onClick={() => onChangeRole('clinician')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            currentRole === 'clinician'
              ? 'bg-white text-brand-burgundy shadow-sm'
              : 'text-white/80 hover:text-white hover:bg-white/5'
          }`}
          id="btn-switch-clinician"
        >
          <Users className="h-3.5 w-3.5" />
          <span>Clinician Portal</span>
          {alertsCount > 0 && (
            <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold animate-pulse">
              {alertsCount}
            </span>
          )}
        </button>
      </div>

      {/* HIPAA Compliance Tag */}
      <div className="flex items-center gap-2.5 text-xs text-white/90">
        <div className="bg-[#FAF8F6]/10 text-white border border-white/20 px-3 py-1.5 rounded-xl flex items-center gap-1.5 font-semibold text-[11px]">
          <Shield className="h-3.5 w-3.5 text-brand-gold" />
          <span>HIPAA SECURE</span>
        </div>
        <div className="hidden lg:flex items-center gap-1 text-white/50 font-mono text-[10px]">
          <Key className="h-3 w-3" />
          <span>AES-256</span>
        </div>
      </div>
    </header>
  );
}
