import React, { useState } from 'react';
import { 
  Users, Calendar, AlertTriangle, BarChart3, Settings, ShieldAlert,
  Brain, FileText, CheckCircle2, AlertOctagon, Clock, UserCheck, Search,
  CornerDownRight, ArrowUpRight, Play, MessageSquare, ArrowDownRight, CheckSquare, Sparkles, Send, Download
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, BarChart, Bar, Cell, AreaChart, Area 
} from 'recharts';
import { Patient, CheckIn, VoiceJournal, Insight, Session, Message, Alert } from '../types';
import { CURRENT_CLINICIAN } from '../mockData';

interface ClinicianDashboardProps {
  patients: Patient[];
  checkins: CheckIn[];
  journals: VoiceJournal[];
  insights: Insight[];
  sessions: Session[];
  alerts: Alert[];
  messages: Message[];
  selectedPatientId: string;
  onSelectPatient: (id: string) => void;
  onResolveAlert: (alertId: string) => void;
  onStartTelehealth: (patient: Patient) => void;
  onSendClinicianMessage: (patientId: string, text: string) => void;
  onAddSessionNote: (patientId: string, noteText: string) => void;
}

type ClinicianTab = 'dashboard' | 'patients' | 'alerts' | 'analytics' | 'messaging';
type ProfileTab = 'overview' | 'timeline' | 'checkins' | 'sessions' | 'documents';

export default function ClinicianDashboard({
  patients,
  checkins,
  journals,
  insights,
  sessions,
  alerts,
  messages,
  selectedPatientId,
  onSelectPatient,
  onResolveAlert,
  onStartTelehealth,
  onSendClinicianMessage,
  onAddSessionNote
}: ClinicianDashboardProps) {
  
  const [activeRail, setActiveRail] = useState<ClinicianTab>('dashboard');
  const [activeProfileTab, setActiveProfileTab] = useState<ProfileTab>('overview');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Local Messaging state
  const [replyText, setReplyText] = useState<string>('');
  const [selectedPresetTopic, setSelectedPresetTopic] = useState<string>('');

  // Find currently selected patient info
  const currentPatient = patients.find(p => p.id === selectedPatientId) || patients[0];
  const currentPatientInsight = insights.find(i => i.patient_id === currentPatient.id) || insights[0];
  const currentPatientCheckins = checkins.filter(c => c.patient_id === currentPatient.id);
  const currentPatientJournals = journals.filter(v => v.patient_id === currentPatient.id);
  const currentPatientSessions = sessions.filter(s => s.patient_id === currentPatient.id);
  const currentPatientAlerts = alerts.filter(a => a.patient_id === currentPatient.id && !a.resolved);
  const currentPatientMessages = messages.filter(m => m.patient_id === currentPatient.id);

  // Filter patients based on search queries
  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.demographics.occupation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Active alerts count
  const unhandledAlertsCount = alerts.filter(a => !a.resolved).length;

  // Render Risk severity badge
  const renderRiskBadge = (severity: 'low' | 'medium' | 'high') => {
    const styles = {
      high: 'bg-red-50 text-red-700 border-red-200 uppercase font-mono tracking-wide',
      medium: 'bg-amber-50 text-amber-700 border-amber-200 uppercase font-mono tracking-wide',
      low: 'bg-[#EBF5ED] text-brand-green border-brand-green/30 uppercase font-mono tracking-wide'
    };
    return (
      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${styles[severity] || ''}`}>
        {severity} RISK
      </span>
    );
  };

  // SOAP Session Note Form
  const [manualNote, setManualNote] = useState<string>('');
  const [showNoteForm, setShowNoteForm] = useState<boolean>(false);

  const handleManualNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualNote.trim()) return;
    onAddSessionNote(currentPatient.id, manualNote.trim());
    setManualNote('');
    setShowNoteForm(false);
  };

  // Clinician chat send
  const handleClinicianChatSend = (e: React.FormEvent) => {
    e.preventDefault();
    const finalMsg = replyText.trim() || selectedPresetTopic;
    if (!finalMsg) return;
    onSendClinicianMessage(currentPatient.id, finalMsg);
    setReplyText('');
    setSelectedPresetTopic('');
  };

  // Recharts color mapping
  const COLORS = ['#863D4B', '#DDAC5B', '#6F9B7A', '#D9A441'];

  // Calculate Key metrics for Selected Patient to render Overview
  const averageMood = currentPatientCheckins.length > 0 
    ? (currentPatientCheckins.reduce((acc, c) => acc + c.mood, 0) / currentPatientCheckins.length).toFixed(1)
    : '4.8';
  const averageAnxiety = currentPatientCheckins.length > 0 
    ? (currentPatientCheckins.reduce((acc, c) => acc + c.anxiety, 0) / currentPatientCheckins.length).toFixed(1)
    : '7.1';
  const averageSleep = currentPatientCheckins.length > 0
    ? (currentPatientCheckins.reduce((acc, c) => acc + c.sleepDuration, 0) / currentPatientCheckins.length).toFixed(1)
    : '6.2';
  const averageEnergy = currentPatientCheckins.length > 0
    ? (currentPatientCheckins.reduce((acc, c) => acc + c.energy, 0) / currentPatientCheckins.length).toFixed(1)
    : '4.9';

  return (
    <div className="min-h-[780px] bg-brand-warmwhite font-sans flex flex-col lg:flex-row shadow-xl rounded-3xl overflow-hidden border border-neutral-200">
      
      {/* 1. LEFT SIDEBAR / RAIL */}
      <aside className="w-full lg:w-64 bg-[#863D4B] text-white shrink-0 flex flex-col justify-between p-8 border-r border-white/10">
        
        <div className="space-y-6">
          {/* Logo Brand / Clinic title */}
          <div className="flex items-center gap-2 mb-8 pb-6 border-b border-white/10">
            <div className="w-8 h-8 rounded-lg bg-[#DDAC5B] flex items-center justify-center text-[#863D4B] font-bold text-lg select-none shrink-0">
              &
            </div>
            <span className="text-white font-semibold text-lg tracking-tight italic font-serif">Therapy & Beyond</span>
          </div>

          {/* Rail items */}
          <nav className="space-y-2">
            <div className="text-white/45 text-[10px] uppercase tracking-widest font-extrabold pb-1 font-sans">
              Clinical Workspace
            </div>

            <button
              onClick={() => setActiveRail('dashboard')}
              className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-semibold tracking-wide cursor-pointer transition-all ${
                activeRail === 'dashboard' 
                  ? 'bg-white/10 text-white shadow-sm' 
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="flex items-center gap-3">
                <Users className="h-4 w-4" />
                <span>Dashboard Home</span>
              </span>
            </button>

            <button
              onClick={() => setActiveRail('patients')}
              className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-semibold tracking-wide cursor-pointer transition-all ${
                activeRail === 'patients' 
                  ? 'bg-white/10 text-white shadow-sm' 
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="flex items-center gap-3">
                <UserCheck className="h-4 w-4" />
                <span>Patient Profiles</span>
              </span>
              <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full text-white">{filteredPatients.length}</span>
            </button>

            <button
              onClick={() => setActiveRail('alerts')}
              className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-semibold tracking-wide cursor-pointer transition-all ${
                activeRail === 'alerts' 
                  ? 'bg-white/10 text-white shadow-sm' 
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="flex items-center gap-3">
                <AlertTriangle className="h-4 w-4" />
                <span>Risk Indicator Alerts</span>
              </span>
              {unhandledAlertsCount > 0 && (
                <span className="text-[10px] bg-red-500 font-bold px-2 py-0.5 rounded-full text-white animate-pulse">
                  {unhandledAlertsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveRail('analytics')}
              className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-semibold tracking-wide cursor-pointer transition-all ${
                activeRail === 'analytics' 
                  ? 'bg-white/10 text-white shadow-sm' 
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="flex items-center gap-3">
                <BarChart3 className="h-4 w-4" />
                <span>Clinic Analytics</span>
              </span>
            </button>

            <button
              onClick={() => setActiveRail('messaging')}
              className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-semibold tracking-wide cursor-pointer transition-all ${
                activeRail === 'messaging' 
                  ? 'bg-white/10 text-white shadow-sm' 
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="flex items-center gap-3">
                <MessageSquare className="h-4 w-4" />
                <span>Secure Messenger</span>
              </span>
              {currentPatientMessages.length > 0 && (
                <span className="text-[10px] bg-[#DDAC5B] text-[#863D4B] font-bold px-2 py-0.5 rounded-full shrink-0">
                  NEW
                </span>
              )}
            </button>
          </nav>
        </div>

        {/* Bottom Profile card */}
        <div className="pt-6 border-t border-white/10 flex items-center gap-3">
          <img 
            src={CURRENT_CLINICIAN.avatar} 
            alt="Clinician Avatar" 
            className="w-10 h-10 rounded-full border-2 border-[#DDAC5B] object-cover shrink-0" 
          />
          <div className="text-xs overflow-hidden">
            <h4 className="font-semibold text-white truncate">{CURRENT_CLINICIAN.name}</h4>
            <p className="text-white/50 text-[10px] truncate">{CURRENT_CLINICIAN.title}</p>
          </div>
        </div>

      </aside>

      {/* 2. DYNAMIC WORKSPACE (MIDDLE & RIGHT VIEWPORTS) */}
      <main className="flex-1 overflow-x-hidden p-8 space-y-8 bg-[#FAF8F6]">
        
        {/* UPPER STATUS STRIP */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-stone-200 pb-6 shrink-0">
          <div>
            <div className="text-stone-400 text-[10px] uppercase tracking-widest font-extrabold font-sans">Active Sandbox Platform</div>
            <h1 className="text-2xl font-bold text-[#2C2C2C] flex items-center gap-3.5 mt-1">
              <span>Clinician EHR Portal</span>
              <span className="px-2.5 py-0.5 rounded text-[9px] bg-red-50 text-red-600 border border-red-100 uppercase tracking-tight font-extrabold">
                HIPAA Secure
              </span>
            </h1>
            <p className="text-xs text-stone-400 mt-1">Between-session patient logs and telemetry synthesis</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <div className="text-right mr-4 border-r border-stone-200 pr-4 hidden md:block select-none">
              <div className="text-[9px] text-stone-400 uppercase tracking-widest font-extrabold">Next Treatment Window</div>
              <div className="text-xs font-bold text-[#863D4B]">Today @ 2:30 PM</div>
            </div>
            
            <div className="flex items-center bg-white border border-stone-200 rounded-xl p-1.5 shadow-sm">
              <span className="px-3 text-[10px] text-stone-400 font-extrabold uppercase tracking-wider font-sans">Patient Focus:</span>
              <select 
                value={selectedPatientId}
                onChange={(e) => onSelectPatient(e.target.value)}
                className="bg-stone-50 border-0 outline-none text-xs font-semibold py-1.5 px-3 rounded-lg text-[#863D4B] focus:ring-0 cursor-pointer"
              >
                {patients.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* WORKSPACE RAILS SWITCH */}

        {/* RAIL A: DASHBOARD HOME & PATIENTS MANAGER */}
        {(activeRail === 'dashboard' || activeRail === 'patients') && (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
            
            {/* COLUMN A: PATIENT QUICK SELECT HUB (4 cols) */}
            <div className="xl:col-span-4 bg-white p-6 rounded-[24px] border border-stone-200 shadow-sm space-y-5">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-[#2C2C2C] text-sm flex items-center gap-2">
                  <Users className="h-4 w-4 text-[#863D4B]" />
                  <span className="font-sans font-bold text-xs uppercase tracking-widest text-[#863D4B]">My Patient Roster</span>
                </h3>
                <span className="text-[10px] bg-stone-100 text-stone-500 px-2.5 py-0.5 rounded-full font-mono font-bold">
                  {filteredPatients.length} Active
                </span>
              </div>

              {/* Search filter input */}
              <div className="relative">
                <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-stone-400" />
                <input
                  type="text"
                  placeholder="Search name, job title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#FAF8F6] pl-10 pr-4 py-2 text-xs rounded-xl border border-stone-200 outline-none focus:ring-1 focus:ring-[#863D4B] transition-all text-[#2C2C2C]"
                />
              </div>

              {/* Patients List */}
              <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
                {filteredPatients.map((pat) => {
                  const patAlerts = alerts.filter(a => a.patient_id === pat.id && !a.resolved);
                  const isSelected = pat.id === currentPatient.id;

                  return (
                     <button
                      key={pat.id}
                      onClick={() => onSelectPatient(pat.id)}
                      className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected 
                          ? 'bg-[#FAF8F6] border-stone-300 border-l-4 border-l-[#863D4B] shadow-sm' 
                          : 'bg-white hover:bg-stone-50 border-stone-100 text-stone-600'
                      }`}
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <img 
                          src={pat.avatar} 
                          alt={pat.name} 
                          className="w-10 h-10 rounded-full border border-stone-200 object-cover shrink-0" 
                        />
                        <div className="overflow-hidden">
                          <h4 className="font-bold text-xs text-[#2C2C2C] truncate">{pat.name}</h4>
                          <p className="text-[10px] text-stone-400 truncate mt-0.5">{pat.demographics.occupation}</p>
                          <p className="text-[9px] text-stone-400 font-mono mt-1">Last Check-In: {pat.lastCheckInDate}</p>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1 shrink-0">
                        {patAlerts.length > 0 ? (
                          <span className="bg-red-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full animate-pulse tracking-tight">
                            {patAlerts.length} Alert
                          </span>
                        ) : (
                          <span className="text-[9px] text-[#6F9B7A] bg-[#EBF5ED] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 select-none">
                            <span className="w-1 h-1 rounded-full bg-[#6F9B7A]"></span>
                            <span>Stable</span>
                          </span>
                        )}
                        <span className="text-[9px] text-stone-400 font-mono">Streak: {pat.streakDays}d</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* COLUMN B: INTEGRATED PATIENT COMPREHENSIVE VIEW (8 cols) */}
            <div className="xl:col-span-8 space-y-5">
              
              {/* Selected Patient Personal banner header */}
              <div className="bg-white p-6 rounded-[24px] border border-stone-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img 
                    src={currentPatient.avatar} 
                    alt={currentPatient.name} 
                    className="w-14 h-14 rounded-full object-cover border-2 border-[#863D4B]/30 shadow-sm shrink-0" 
                  />
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h3 className="text-lg font-bold text-[#2C2C2C] font-display">{currentPatient.name}</h3>
                      <span className="bg-stone-50 border border-stone-200 px-2 py-0.5 rounded text-[9px] text-stone-500 font-mono tracking-wider">ID: {currentPatient.id.split('_')[1]}</span>
                    </div>
                    
                    <p className="text-xs text-stone-400 mt-0.5 font-medium">
                      {currentPatient.age} y/o • {currentPatient.gender} • {currentPatient.demographics.pronouns}
                    </p>
                    <p className="text-xs text-stone-500 font-medium mt-1">
                      Professional Role: <span className="font-semibold text-brand-burgundy">{currentPatient.demographics.occupation}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => onStartTelehealth(currentPatient)}
                    className="bg-[#863D4B] hover:opacity-95 text-white font-semibold text-xs py-2.5 px-5 rounded-xl shadow-sm transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
                  >
                    <Play className="h-4 w-4 fill-current" />
                    <span>Start Telehealth Session</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveRail('messaging');
                    }}
                    className="bg-[#FEF7EA] hover:bg-[#FEF7EA]/80 border border-[#DDAC5B]/30 text-[#863D4B] font-semibold text-xs py-2.5 px-5 rounded-xl transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span>Secure Chat</span>
                  </button>
                </div>
              </div>

              {/* Patient Profile Tabs Selector */}
              {/* Profile sub-navigation tabs list */}
              <div className="bg-stone-100/80 p-1.5 rounded-2xl flex gap-1.5 border border-stone-200 shadow-inner">
                {(['overview', 'timeline', 'checkins', 'sessions', 'documents'] as ProfileTab[]).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveProfileTab(tab)}
                    className={`flex-1 text-center py-2.5 text-xs font-semibold rounded-xl capitalize transition-all cursor-pointer ${
                      activeProfileTab === tab 
                        ? 'bg-white text-[#863D4B] shadow-sm font-bold' 
                        : 'text-stone-500 hover:text-stone-800'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* TAB CONTENT CARDS */}

              {/* OVERVIEW SUB-SCREEN: THE HIGHLIGHTED EXPERIENCE */}
              {activeProfileTab === 'overview' && (
                <div className="space-y-6">
                  
                  {/* SESSION PREP SUMMARY (AI REPORT CARD WITH GLOW ACCENTS) */}
                  <div className="bg-white rounded-[24px] border border-stone-200 shadow-sm p-6 flex flex-col border-l-4 border-l-[#DDAC5B] space-y-5">
                    
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <span className="text-[9px] bg-brand-burgundy text-white font-bold font-sans px-2.5 py-1 rounded uppercase tracking-wider block w-fit select-none">
                          Clinical AI Intelligence
                        </span>
                        <h4 className="font-serif italic text-[#863D4B] text-xl">Pre-Session AI Brief</h4>
                      </div>
                      <span className="bg-[#FEF7EA] text-brand-amber border border-brand-gold/30 text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1">
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>AI Synthesized</span>
                      </span>
                    </div>

                    <p className="text-xs text-neutral-600 leading-relaxed bg-[#FAF8F6] p-4 rounded-2xl border border-brand-gold/15 italic">
                      "{currentPatientInsight.summary}"
                    </p>

                    {/* Notable Events and key themes divided */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      {/* Sub-Column 1: Checklist Events list */}
                      <div className="bg-stone-50/50 p-5 rounded-[20px] border border-stone-200 flex flex-col justify-between">
                        <span className="text-[10px] text-stone-400 font-bold uppercase font-sans tracking-widest block mb-4">Somatic Events Pipeline</span>
                        
                        <div className="space-y-3 flex-1">
                          {currentPatientCheckins.slice(0, 4).map((chkVal, cidx) => (
                            <div key={chkVal.id || cidx} className="flex justify-between items-start text-xs border-b border-stone-100 pb-2 last:border-0 last:pb-0">
                              <div className="flex gap-2.5">
                                <span className={`w-2 h-2 rounded-full mt-1.5 ${chkVal.anxiety > 7 ? 'bg-red-500' : 'bg-brand-burgundy'}`}></span>
                                <div>
                                  <span className="font-semibold block text-[#2C2C2C]">{chkVal.significantEvent}</span>
                                  <span className="text-stone-400 text-[10px]">Anxiety index: {chkVal.anxiety}/10</span>
                                </div>
                              </div>
                              <span className="text-[9px] text-stone-400 font-mono font-bold">
                                {new Date(chkVal.timestamp).toLocaleDateString('en', {month: 'short', day: 'numeric'})}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Sub-Column 2: Dynamic Thematic graph */}
                      <div className="bg-stone-50/50 p-5 rounded-[20px] border border-stone-200">
                        <span className="text-[10px] text-stone-400 font-bold uppercase font-sans tracking-widest block mb-4">Recurring Thematic Weights</span>
                        
                        <div className="space-y-4">
                          {currentPatientInsight.themes.map((theme, tid) => (
                            <div key={tid} className="text-xs space-y-1.5">
                              <div className="flex justify-between text-[11px] font-semibold">
                                <span className="text-[#2C2C2C]">{theme.name}</span>
                                <span className="text-brand-burgundy">{theme.percentage}% weight</span>
                              </div>
                              <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
                                <div 
                                  className="bg-brand-burgundy h-full rounded-full" 
                                  style={{ width: `${theme.percentage}%` }}
                                ></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>

                    {/* Suggested Discussion topics and Goal lists */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      {/* Suggested Topics block */}
                      <div className="bg-white p-5 rounded-2xl border border-stone-200 space-y-3">
                        <span className="text-[10px] text-brand-burgundy font-bold uppercase font-sans tracking-widest block border-b border-stone-150 pb-1.5">Suggested Discussion Topics</span>
                        <ul className="space-y-2">
                          {currentPatientInsight.suggestedDiscussionTopics.map((topic, isIdx) => (
                            <li key={isIdx} className="text-xs text-stone-600 flex items-start gap-2">
                              <span className="text-brand-gold font-bold font-mono">{isIdx + 1}.</span>
                              <span className="leading-relaxed">{topic}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Goals Checklist block */}
                      <div className="bg-white p-5 rounded-2xl border border-stone-200 space-y-3">
                        <span className="text-[10px] text-brand-green font-bold uppercase font-sans tracking-widest block border-b border-stone-150 pb-1.5">Target Treatment Goals</span>
                        <div className="space-y-2.5 text-xs">
                          <label className="flex items-center gap-2.5 text-stone-600">
                            <span className="p-0.5 bg-brand-green-light rounded text-brand-green shrink-0">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                            </span>
                            <span>Reduce baseline anxiety peaks</span>
                          </label>

                          <label className="flex items-center gap-2.5 text-stone-600">
                            <span className="p-0.5 bg-brand-green-light rounded text-brand-green shrink-0">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                            </span>
                            <span>Re-establish medication compliance</span>
                          </label>

                          <label className="flex items-center gap-2.5 text-stone-400">
                            <span className="p-0.5 bg-stone-100 rounded text-stone-400 shrink-0">
                              <Clock className="h-3.5 w-3.5" />
                            </span>
                            <span className="line-through text-stone-400">Achieve continuous sleep pattern stability</span>
                          </label>
                        </div>
                      </div>

                    </div>

                  </div>

                  {/* KEY CLINICAL METRICS CARD */}
                  <div className="bg-white p-6 rounded-[24px] border border-stone-200 shadow-sm space-y-4">
                    <h4 className="font-sans font-bold text-xs uppercase tracking-widest text-[#863D4B]">Session Period Averages (14-Day Cycle)</h4>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                      <div className="bg-[#FAF8F6] p-4 rounded-xl border border-stone-150">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block">Average Mood</span>
                        <p className="text-xl font-bold text-[#863D4B] mt-1.5">{averageMood}</p>
                        <span className="text-[9px] text-red-600 font-bold flex items-center justify-center gap-0.5 mt-1.5">
                          <ArrowDownRight className="h-3 w-3" />
                          <span>18% decline</span>
                        </span>
                      </div>

                      <div className="bg-[#FAF8F6] p-4 rounded-xl border border-stone-150">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block">Anxiety Level</span>
                        <p className="text-xl font-bold text-[#D9A441] mt-1.5">{averageAnxiety}</p>
                        <span className="text-[9px] text-red-600 font-bold flex items-center justify-center gap-0.5 mt-1.5">
                          <ArrowUpRight className="h-3 w-3" />
                          <span>22% rise</span>
                        </span>
                      </div>

                      <div className="bg-[#FAF8F6] p-4 rounded-xl border border-stone-150">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block">Sleep Avg</span>
                        <p className="text-xl font-bold text-stone-750 mt-1.5">{averageSleep} hrs</p>
                        <span className="text-[9px] text-red-600 font-bold flex items-center justify-center gap-0.5 mt-1.5">
                          <ArrowDownRight className="h-3 w-3" />
                          <span>1.3h decay</span>
                        </span>
                      </div>

                      <div className="bg-[#FAF8F6] p-4 rounded-xl border border-stone-150">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block">Energy Index</span>
                        <p className="text-xl font-bold text-[#6F9B7A] mt-1.5">{averageEnergy}</p>
                        <span className="text-[9px] text-red-600 font-bold flex items-center justify-center gap-0.5 mt-1.5">
                          <ArrowDownRight className="h-3 w-3" />
                          <span>15% decline</span>
                        </span>
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* TIMELINE HISTORY TAB */}
              {activeProfileTab === 'timeline' && (
                <div className="space-y-4">
                  <h4 className="font-semibold text-brand-charcoal text-sm">Combined Clinical Experience Timeline</h4>
                  <div className="space-y-4 relative before:absolute before:left-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-brand-burgundy/10">
                    
                    {/* Map Checkins */}
                    {currentPatientCheckins.map((entry, eidx) => (
                      <div key={entry.id || eidx} className="relative pl-9">
                        <div className="absolute left-2 top-2 w-4 h-4 rounded-full bg-brand-burgundy flex items-center justify-center text-[10px] font-bold text-white shadow">C</div>
                        
                        <div className="bg-white p-4 rounded-xl border border-neutral-100 space-y-1 text-xs">
                          <div className="flex justify-between text-[10px] font-bold font-mono text-zinc-400">
                            <span>PATIENT DAILY METRICS</span>
                            <span>{new Date(entry.timestamp).toLocaleString()}</span>
                          </div>
                          
                          <p className="font-semibold text-brand-charcoal text-[13px]">{entry.significantEvent}</p>
                          <p className="text-neutral-500 leading-relaxed italic">"{entry.notes}"</p>
                          
                          <div className="flex gap-4 pt-2 text-[10px] font-semibold text-neutral-500 font-mono">
                            <span>Mood: <strong className="text-brand-burgundy">{entry.mood}/10</strong></span>
                            <span>Anxiety: <strong className="text-brand-amber">{entry.anxiety}/10</strong></span>
                            <span>Sleep: <strong className="text-neutral-700">{entry.sleepDuration}h</strong></span>
                            <span>SSRI adherence: <strong className={entry.medicationTaken ? 'text-brand-green' : 'text-red-500'}>{entry.medicationTaken ? 'Taken' : 'Missed'}</strong></span>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Map Voice Journals */}
                    {currentPatientJournals.map((vj, vidx) => (
                      <div key={vj.id || vidx} className="relative pl-9">
                        <div className="absolute left-2 top-2 h-4 w-4 rounded-full bg-brand-gold flex items-center justify-center text-[10px] font-semibold text-brand-burgundy shadow">V</div>
                        
                        <div className="bg-white p-4 rounded-xl border border-neutral-100 space-y-2 text-xs">
                          <div className="flex justify-between text-[10px] font-bold font-mono text-zinc-400">
                            <span>VOICE MEMO TRACE</span>
                            <span>{new Date(vj.timestamp).toLocaleString()}</span>
                          </div>

                          <div className="bg-neutral-50 p-3 rounded-lg border-l-4 border-brand-gold">
                            <span className="text-[9px] text-neutral-400 font-mono tracking-wider font-semibold uppercase">Voice XML Transcript</span>
                            <p className="text-neutral-600 leading-relaxed italic mt-1">"{vj.transcript}"</p>
                          </div>
                        </div>
                      </div>
                    ))}

                  </div>
                </div>
              )}

              {/* METRICS TABLE GRID */}
              {activeProfileTab === 'checkins' && (
                <div className="bg-white rounded-2xl border border-neutral-100 overflow-hidden shadow-sm">
                  <div className="px-4 py-3 bg-neutral-50 border-b border-neutral-100 flex justify-between items-center">
                    <span className="text-xs font-bold font-display uppercase tracking-wider text-neutral-600">Detailed Metric Logging Sheets</span>
                    <span className="text-[10px] text-zinc-400 font-mono">HIPAA compliant records</span>
                  </div>

                  <div className="overflow-x-auto text-xs">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-neutral-100 bg-neutral-100/50 text-neutral-500 font-mono text-[10px]">
                          <th className="p-3">Date</th>
                          <th className="p-3">Mood</th>
                          <th className="p-3">Anxiety</th>
                          <th className="p-3">Sleep hrs</th>
                          <th className="p-3">Med Taken</th>
                          <th className="p-3">Somatic Events</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentPatientCheckins.map((chk, cI) => (
                          <tr key={cI} className="border-b border-neutral-50 hover:bg-neutral-50/50">
                            <td className="p-3 font-semibold text-neutral-600">{new Date(chk.timestamp).toLocaleDateString()}</td>
                            <td className="p-3 font-bold text-brand-burgundy">{chk.mood}/10</td>
                            <td className="p-3 font-bold text-brand-amber">{chk.anxiety}/10</td>
                            <td className="p-3 font-mono">{chk.sleepDuration} hrs</td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                chk.medicationTaken ? 'bg-[#EBF5ED] text-brand-green' : 'bg-red-50 text-red-600'
                              }`}>
                                {chk.medicationTaken ? 'TAKEN' : 'MISSED'}
                              </span>
                            </td>
                            <td className="p-3 font-medium text-neutral-600 italic">"{chk.significantEvent}"</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* SESSIONS HISTORY TAB */}
              {activeProfileTab === 'sessions' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold text-brand-charcoal text-sm">Historical Clinical Session SOAP logs</h4>
                    <button
                      onClick={() => setShowNoteForm(!showNoteForm)}
                      className="text-xs bg-brand-burgundy hover:bg-brand-burgundy/90 text-white font-medium py-1.5 px-3 rounded-lg shadow-sm"
                    >
                      {showNoteForm ? 'Dismiss log note Form' : 'Write Manual SOAP Note'}
                    </button>
                  </div>

                  {showNoteForm && (
                    <form onSubmit={handleManualNoteSubmit} className="bg-[#FAF8F6] p-4 rounded-xl border border-neutral-200 shadow-inner space-y-3">
                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 mb-1">SOAP Clinical Notes text</label>
                        <textarea
                          rows={3}
                          value={manualNote}
                          onChange={(e) => setManualNote(e.target.value)}
                          placeholder="Target homework, assessment indices, plan restructuring details..."
                          className="w-full rounded-xl border border-neutral-200 bg-white p-3 text-xs focus:ring-1 focus:ring-brand-burgundy outline-none resize-none"
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setShowNoteForm(false)}
                          className="px-3 py-1.5 text-xs text-neutral-500 hover:text-neutral-700"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-1.5 text-xs bg-brand-burgundy text-white rounded-lg font-bold"
                        >
                          Encrypt & Append Log
                        </button>
                      </div>
                    </form>
                  )}

                  <div className="space-y-3">
                    {currentPatientSessions.map((session, sIdx) => (
                      <div key={session.id || sIdx} className="bg-white p-4 rounded-xl border border-neutral-100 shadow-sm text-xs space-y-2">
                        <div className="flex justify-between text-[10px] font-bold font-mono text-zinc-400">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>CLINICAL NOTE SESSION</span>
                          </span>
                          <span>{session.date} • {session.time}</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="font-bold text-brand-charcoal text-sm">Status: <span className="text-brand-green uppercase">{session.status}</span></span>
                          <span className="bg-neutral-100 px-2 py-0.5 rounded font-mono text-[10px] font-bold">{session.type}</span>
                        </div>

                        <div className="bg-neutral-50 p-3 rounded-lg text-neutral-600 font-mono whitespace-pre-line text-[11px] leading-relaxed border border-neutral-150">
                          {session.notes}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* documentos signed view list */}
              {activeProfileTab === 'documents' && (
                <div className="bg-white p-5 rounded-2xl border border-neutral-100 shadow-sm space-y-3 text-xs">
                  <h4 className="font-semibold text-brand-charcoal">HIPAA Release Records & Diagnostic Briefs</h4>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-3 rounded-lg bg-neutral-50 border border-neutral-100">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-5 text-brand-burgundy" />
                        <div>
                          <span className="font-bold block text-neutral-700">HIPAA_Release_Authorization_Signed.pdf</span>
                          <span className="text-[10px] text-zinc-400">AES-256 protected vault • Signed 2026-05-12</span>
                        </div>
                      </div>
                      <button className="bg-neutral-200 hover:bg-neutral-300 p-1.5 rounded-lg">
                        <Download className="h-4 w-4 text-neutral-600" />
                      </button>
                    </div>

                    <div className="flex justify-between items-center p-3 rounded-lg bg-neutral-50 border border-neutral-100">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-5 text-brand-burgundy" />
                        <div>
                          <span className="font-bold block text-neutral-700">Clinical_Intake_Assessment_Index.pdf</span>
                          <span className="text-[10px] text-zinc-400">DSM-5 indicators registered • Signed 2026-05-12</span>
                        </div>
                      </div>
                      <button className="bg-neutral-200 hover:bg-neutral-300 p-1.5 rounded-lg">
                        <Download className="h-4 w-4 text-neutral-600" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>

          </div>
        )}

        {/* RAIL B: RISK INDICATORS ALERTS HUB */}
        {activeRail === 'alerts' && (
          <div className="bg-white p-5 rounded-2xl border border-neutral-100 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
              <div>
                <h3 className="font-display font-medium text-brand-charcoal text-base">Active Clinical Risk Indicators</h3>
                <p className="text-xs text-neutral-500">Unresolved alert list flagged by daily patient telemetry analyses.</p>
              </div>
              <span className="text-xs bg-red-500 text-white font-bold px-3 py-1 rounded-full animate-pulse">
                {unhandledAlertsCount} Alerts Pending
              </span>
            </div>

            <div className="space-y-3">
              {alerts.filter(a => !a.resolved).map((alertItem) => (
                <div 
                  key={alertItem.id} 
                  className={`p-4 rounded-xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs transition-all ${
                    alertItem.severity === 'high' 
                      ? 'bg-red-50/50 border-red-200' 
                      : 'bg-amber-50/50 border-amber-200'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <img 
                        src={patients.find(p => p.id === alertItem.patient_id)?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'} 
                        alt="Patient Avatar" 
                        className="w-8 h-8 rounded-full border border-neutral-200 object-cover" 
                      />
                      <div>
                        <span className="font-bold text-neutral-800 text-[13px]">{alertItem.patientName}</span>
                        <span className="text-[10px] text-zinc-400 font-mono tracking-wide block">Alert flagged: {new Date(alertItem.timestamp).toLocaleString()}</span>
                      </div>
                    </div>

                    <p className="text-neutral-600 mt-2 font-medium leading-relaxed italic">
                      "{alertItem.message}"
                    </p>

                    <div className="flex gap-2.5 pt-1">
                      {renderRiskBadge(alertItem.severity)}
                      <span className="text-[10px] uppercase font-bold font-mono bg-neutral-100 text-neutral-500 rounded px-1.5 py-0.5">
                        {alertItem.type.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => onResolveAlert(alertItem.id)}
                      className="bg-[#6F9B7A] hover:bg-opacity-95 text-white font-bold text-[11px] px-3.5 py-1.8 rounded-lg shadow-sm cursor-pointer transition-all active:scale-95 flex items-center gap-1"
                    >
                      <UserCheck className="h-3.5 w-3.5" />
                      <span>Contacted / Resolve Alert</span>
                    </button>
                    
                    <button
                      onClick={() => {
                        onSelectPatient(alertItem.patient_id);
                        setActiveRail('patients');
                      }}
                      className="bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-semibold text-[11px] px-3.5 py-1.8 rounded-lg"
                    >
                      Inspect Profile
                    </button>
                  </div>
                </div>
              ))}

              {alerts.filter(a => !a.resolved).length === 0 && (
                <div className="text-center py-12 text-xs text-neutral-400">
                  <CheckSquare className="h-10 w-10 text-brand-green mx-auto mb-2 opacity-55" />
                  <p className="font-mono font-bold text-brand-green">ALL RISK CHANNELS SECURED</p>
                  <p className="text-neutral-500 mt-1">Excellent job! Your clinic telemetry has zero unhandled active alerts.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* RAIL C: METRICS ANALYTICS CHARTS */}
        {activeRail === 'analytics' && (
          <div className="space-y-6">
            
            {/* Upper grid details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-xl border border-neutral-100 shadow-sm">
                <span className="text-[10px] text-neutral-400 font-bold block uppercase font-mono">Therapeutic Response Rate</span>
                <p className="text-2xl font-bold font-display text-brand-green mt-1">84.2%</p>
                <span className="text-[10px] text-zinc-500 block mt-1">Calculated across homework compliance criteria.</span>
              </div>

              <div className="bg-white p-4 rounded-xl border border-neutral-100 shadow-sm">
                <span className="text-[10px] text-neutral-400 font-bold block uppercase font-mono">Somatic Incidents Triggers Count</span>
                <p className="text-2xl font-bold font-display text-brand-amber mt-1">7 Spikes</p>
                <span className="text-[10px] text-zinc-500 block mt-1">Primarily transit & workplace confrontation.</span>
              </div>

              <div className="bg-white p-4 rounded-xl border border-neutral-100 shadow-sm">
                <span className="text-[10px] text-neutral-400 font-bold block uppercase font-mono">Clinical SSRI Compliance index</span>
                <p className="text-2xl font-bold font-display text-brand-burgundy mt-1">94.8%</p>
                <span className="text-[10px] text-zinc-500 block mt-1">Based on active digital medical reports.</span>
              </div>
            </div>

            {/* Recharts Area analytics charts */}
            <div className="bg-white p-5 rounded-2xl border border-neutral-100 shadow-sm space-y-4">
              <span className="text-xs font-semibold text-brand-charcoal block">Continuous Mood & Anxiety Timeline Metrics</span>
              
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={checkins.filter(c => c.patient_id === currentPatient.id).slice(0, 10).reverse()} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                    <defs>
                      <linearGradient id="gradientMood" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#863D4B" stopOpacity={0.25}/>
                        <stop offset="95%" stopColor="#863D4B" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="gradientAnxiety" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#DDAC5B" stopOpacity={0.25}/>
                        <stop offset="95%" stopColor="#DDAC5B" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="significantEvent" stroke="#999" tick={{ fontSize: 10 }} truncate={true} />
                    <YAxis domain={[1, 10]} stroke="#999" tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="mood" name="Mood" stroke="#863D4B" fillOpacity={1} fill="url(#gradientMood)" />
                    <Area type="monotone" dataKey="anxiety" name="Anxiety" stroke="#DDAC5B" fillOpacity={1} fill="url(#gradientAnxiety)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Sleep duration analytics charting */}
            <div className="bg-white p-5 rounded-2xl border border-neutral-100 shadow-sm space-y-4">
              <span className="text-xs font-semibold text-brand-charcoal block">Sleep Durations & Anxiety Spikes Correlation (Latest 7 Entries)</span>
              
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={checkins.filter(c => c.patient_id === currentPatient.id).slice(0, 7).reverse()} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="significantEvent" stroke="#999" tick={{ fontSize: 10 }} />
                    <YAxis stroke="#999" tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="sleepDuration" name="Sleep Duration (hrs)" fill="#863D4B" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="anxiety" name="Anxiety Rating" fill="#6F9B7A" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        )}

        {/* RAIL D: SECURE CLINICAL MESSAGING PANEL */}
        {activeRail === 'messaging' && (
          <div className="bg-white p-5 rounded-2xl border border-neutral-100 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-6 h-[540px]">
            
            {/* Messenger sidebar panel selection */}
            <div className="lg:col-span-4 border-r border-neutral-50 pr-4 space-y-3 flex flex-col">
              <h4 className="font-bold text-xs text-neutral-400 font-mono tracking-widest uppercase">Secure Chats (E2EE Active)</h4>
              
              <div className="space-y-1 flex-1 overflow-y-auto">
                {patients.map(p => {
                  const patientMsgCount = messages.filter(m => m.patient_id === p.id).length;
                  const isCurrent = p.id === currentPatient.id;

                  return (
                    <button
                      key={p.id}
                      onClick={() => onSelectPatient(p.id)}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs ${
                        isCurrent ? 'bg-brand-burgundy-light font-bold text-brand-burgundy' : 'hover:bg-neutral-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <img src={p.avatar} alt="" className="w-8 h-8 rounded-full object-cover border" />
                        <div>
                          <span>{p.name}</span>
                          <span className="text-[9px] text-zinc-400 block font-mono">Channel: AES-256</span>
                        </div>
                      </div>
                      
                      {patientMsgCount > 0 && (
                        <span className="bg-brand-burgundy text-white font-bold rounded-full px-1.5 py-0.5 text-[8px]">
                          {patientMsgCount}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Messenger chat box dialog stream */}
            <div className="lg:col-span-8 flex flex-col justify-between h-full">
              
              {/* E2EE Certificate Header */}
              <div className="bg-brand-green-light border border-brand-green/20 p-2.5 rounded-xl text-[10px] text-brand-green flex items-start gap-1.5">
                <ShieldAlert className="h-4 w-4 text-brand-green shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block uppercase font-mono tracking-wider">E2EE Handshake Certified • HIPAA Validated</span>
                  <span>EHR direct routing logs. Secure payload handshake ID: C-E2EE-{currentPatient.id.split('_')[1]}. Handled securely by Practice SaaS.</span>
                </div>
              </div>

              {/* Speech bubble lists */}
              <div className="flex-1 overflow-y-auto py-4 space-y-3 my-1 pr-1 border-b border-neutral-50">
                {currentPatientMessages.map((msg, mId) => {
                  const isSelf = msg.sender === 'clinician';
                  
                  return (
                    <div key={mId} className={`flex ${isSelf ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] rounded-2xl p-3.5 text-xs shadow-sm ${
                        isSelf 
                          ? 'bg-brand-burgundy/95 text-white rounded-br-none' 
                          : 'bg-neutral-50 text-brand-charcoal border border-neutral-100 rounded-bl-none'
                      }`}>
                        <div className={`text-[9px] font-mono mb-1 font-semibold ${isSelf ? 'text-white/60' : 'text-neutral-400'}`}>
                          {isSelf ? CURRENT_CLINICIAN.name : currentPatient.name}
                        </div>
                        <p className="leading-relaxed whitespace-pre-line">{msg.text}</p>
                        
                        {msg.isCompletedExercise && (
                          <div className="mt-2.5 p-2 bg-black/10 rounded-xl flex items-center justify-between text-[11px] font-bold">
                            <span>Attachment: Transit_CBT_Logs.pdf</span>
                            <Download className="h-4 w-4 text-brand-gold animate-bounce" />
                          </div>
                        )}

                        <span className={`text-[8px] block text-right font-mono mt-1 ${isSelf ? 'text-white/40' : 'text-neutral-400'}`}>
                          {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* REPLY FORM WITH PRESETS */}
              <form onSubmit={handleClinicianChatSend} className="space-y-3.5 pt-3">
                <div className="flex flex-wrap gap-1">
                  <span className="text-[10px] text-neutral-400 font-bold uppercase font-mono tracking-wide flex items-center py-1 select-none">Assign Therapy Material:</span>
                  <button
                    type="button"
                    onClick={() => setSelectedPresetTopic("Hi Alex, please refer to the 'CBT Subway Grounding Card' I uploaded to help you counter subway hypervigilance. Let's study it Monday.")}
                    className="bg-brand-gold-light border border-brand-gold/30 hover:bg-neutral-200 text-brand-charcoal text-[9px] font-semibold px-2 py-1 rounded-md transition-all active:scale-95"
                  >
                    + Subway CBT Card
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedPresetTopic("Let's dedicate 10 minutes of our next appointment to addressing SSRI barriers. I recommend utilizing an automated morning notification alarm.")}
                    className="bg-brand-[#EBF5ED] border border-brand-green/30 hover:bg-neutral-200 text-brand-charcoal text-[9px] font-semibold px-2 py-1 rounded-md transition-all active:scale-95"
                  >
                    + Medication Anchor
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedPresetTopic("Hi Alex, great job logging these daily entries this week. Maintaining clinical continuity is incredibly crucial for progress.")}
                    className="bg-brand-burgundy-light border border-brand-burgundy/25 hover:bg-neutral-200 text-brand-charcoal text-[9px] font-semibold px-2 py-1 rounded-md transition-all active:scale-95"
                  >
                    + Compliance Praise
                  </button>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={replyText || selectedPresetTopic}
                    onChange={(e) => {
                      setReplyText(e.target.value);
                      setSelectedPresetTopic('');
                    }}
                    placeholder="Enter encrypted HIPAA correspondence to patient..."
                    className="flex-1 rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-brand-burgundy"
                  />
                  
                  <button
                    type="submit"
                    className="bg-brand-burgundy hover:bg-brand-burgundy/90 text-white font-bold text-xs py-3 px-5 rounded-xl shadow active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <Send className="h-4 w-4" />
                    <span>Send Message</span>
                  </button>
                </div>
              </form>

            </div>

          </div>
        )}

      </main>
    </div>
  );
}
