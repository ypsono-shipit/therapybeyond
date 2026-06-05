import React, { useState, useRef } from 'react';
import { 
  Smile, Flame, BookOpen, Mic, MicOff, Play, Square, 
  Upload, History, Check, ShieldAlert, Award, Calendar, 
  ChevronRight, Brain, Send, Clock, Sparkles, MessageCircle, AlertCircle
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer 
} from 'recharts';
import { CheckIn, VoiceJournal, Patient, Message } from '../types';

interface PatientAppProps {
  patient: Patient;
  checkins: CheckIn[];
  journals: VoiceJournal[];
  onAddCheckIn: (checkIn: Omit<CheckIn, 'id' | 'timestamp'>) => void;
  onAddJournal: (transcript: string, duration: string) => void;
  messages: Message[];
  onSendMessage: (text: string) => void;
}

type PatientTab = 'dashboard' | 'checkin' | 'journal' | 'history' | 'chat';

export default function PatientApp({ 
  patient, 
  checkins, 
  journals, 
  onAddCheckIn, 
  onAddJournal,
  messages,
  onSendMessage
}: PatientAppProps) {
  const [activeTab, setActiveTab] = useState<PatientTab>('dashboard');
  
  // Check-In Form fields state
  const [mood, setMood] = useState<number>(6);
  const [anxiety, setAnxiety] = useState<number>(5);
  const [energy, setEnergy] = useState<number>(5);
  const [sleepDuration, setSleepDuration] = useState<number>(7.5);
  const [sleepQuality, setSleepQuality] = useState<CheckIn['sleepQuality']>('Good');
  const [medicationTaken, setMedicationTaken] = useState<boolean>(true);
  const [significantEvent, setSignificantEvent] = useState<string>('Work stress');
  const [notes, setNotes] = useState<string>('');
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);

  // Voice journal recording states
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingSuccess, setRecordingSuccess] = useState<boolean>(false);
  const [recordedDuration, setRecordedDuration] = useState<number>(0);
  const [recordingText, setRecordingText] = useState<string>('');
  const [manualTranscript, setManualTranscript] = useState<string>('');
  const recordTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Messenger State
  const [newMessageText, setNewMessageText] = useState<string>('');

  // Audio simulation state for preloaded recordings
  const [playingJournalId, setPlayingJournalId] = useState<string | null>(null);
  const [playTimeout, setPlayTimeout] = useState<NodeJS.Timeout | null>(null);

  // Format date helper
  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // CheckIn Form submission
  const handleCheckInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddCheckIn({
      patient_id: patient.id,
      mood,
      anxiety,
      energy,
      sleepDuration,
      sleepQuality,
      medicationTaken,
      significantEvent: significantEvent || "No significant event",
      notes: notes || "Daily standard check-in"
    });
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setActiveTab('dashboard');
    }, 1500);
  };

  // Start Voice Recording
  const startRecording = () => {
    setIsRecording(true);
    setRecordingSuccess(false);
    setRecordedDuration(0);
    
    // Simulate speech-to-text text expanding over time
    const sampleSentences = [
      "I woke up feeling pretty anxious about the 10am meeting...",
      "I took a walks at lunch which helped reduce the tightness in my chest.",
      "But tonight my manager sent another message and the work stress is creeping back.",
      "Doing my best to remember the relaxation exercises we brainstormed."
    ];
    let phraseIndex = 0;
    
    recordTimerRef.current = setInterval(() => {
      setRecordedDuration(prev => {
        const nextTime = prev + 1;
        if (nextTime % 4 === 0 && phraseIndex < sampleSentences.length) {
          setRecordingText(current => current + " " + sampleSentences[phraseIndex]);
          phraseIndex++;
        }
        return nextTime;
      });
    }, 1000);
  };

  // Stop Recording & save
  const stopRecording = () => {
    if (recordTimerRef.current) {
      clearInterval(recordTimerRef.current);
    }
    setIsRecording(false);
    
    const finalDurationText = `${Math.floor(recordedDuration / 60)}:${(recordedDuration % 60).toString().padStart(2, '0')}`;
    const finalTranscript = recordingText.trim() || manualTranscript || "Simulated checkin: Feeling slightly tired from working late tonight. Practiced CBT techniques.";
    
    onAddJournal(finalTranscript, finalDurationText);
    setRecordingSuccess(true);
    setRecordingText('');
    setManualTranscript('');
    
    setTimeout(() => {
      setRecordingSuccess(false);
      setActiveTab('history');
    }, 2000);
  };

  // Play audio simulation
  const playJournalAudio = (journalId: string) => {
    if (playingJournalId === journalId) {
      if (playTimeout) clearTimeout(playTimeout);
      setPlayingJournalId(null);
      return;
    }
    setPlayingJournalId(journalId);
    
    const timeout = setTimeout(() => {
      setPlayingJournalId(null);
    }, 6000); // simulate 6 sec preview
    setPlayTimeout(timeout);
  };

  // Chat Submission
  const handleChatSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageText.trim()) return;
    onSendMessage(newMessageText.trim());
    setNewMessageText('');
  };

  // Format Recharts data (reverse to ascending timeline order)
  const chartData = [...checkins]
    .filter(c => c.patient_id === patient.id)
    .slice(0, 7)
    .reverse()
    .map(c => ({
      date: new Date(c.timestamp).toLocaleDateString('en-US', { weekday: 'short' }),
      Mood: c.mood,
      Anxiety: c.anxiety,
      Energy: c.energy
    }));

  return (
    <div className="bg-[#FAF8F6] text-[#2C2C2C] font-sans flex flex-col lg:flex-row shadow-xl rounded-3xl overflow-hidden border border-neutral-200 min-h-[780px]">
      
      {/* 1. LEFT SIDEBAR / RAIL FOR PATIENT APP */}
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
              Patient Portal Space
            </div>

            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-semibold tracking-wide cursor-pointer transition-all ${
                activeTab === 'dashboard' 
                  ? 'bg-white/10 text-white shadow-sm font-bold' 
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
              id="btn-pat-dashboard"
            >
              <span className="flex items-center gap-3">
                <Smile className="h-4 w-4 text-[#DDAC5B]" />
                <span>My Dashboard</span>
              </span>
            </button>

            <button
              onClick={() => setActiveTab('checkin')}
              className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-semibold tracking-wide cursor-pointer transition-all ${
                activeTab === 'checkin' 
                  ? 'bg-white/10 text-white shadow-sm font-bold' 
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
              id="btn-pat-checkin"
            >
              <span className="flex items-center gap-3">
                <Smile className="h-4 w-4" />
                <span>Daily Check-In</span>
              </span>
            </button>

            <button
              onClick={() => setActiveTab('journal')}
              className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-semibold tracking-wide cursor-pointer transition-all ${
                activeTab === 'journal' 
                  ? 'bg-white/10 text-white shadow-sm font-bold' 
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
              id="btn-pat-journal"
            >
              <span className="flex items-center gap-3">
                <Mic className="h-4 w-4" />
                <span>Secure Voice Journal</span>
              </span>
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-semibold tracking-wide cursor-pointer transition-all ${
                activeTab === 'history' 
                  ? 'bg-white/10 text-white shadow-sm font-bold' 
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
              id="btn-pat-history"
            >
              <span className="flex items-center gap-3">
                <History className="h-4 w-4" />
                <span>My Healing History</span>
              </span>
              <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full text-white">{checkins.length + journals.length}</span>
            </button>

            <button
              onClick={() => setActiveTab('chat')}
              className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-semibold tracking-wide cursor-pointer transition-all ${
                activeTab === 'chat' 
                  ? 'bg-white/10 text-white shadow-sm font-bold' 
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
              id="btn-pat-chat"
            >
              <span className="flex items-center gap-3">
                <MessageCircle className="h-4 w-4" />
                <span>Secure Messenger</span>
              </span>
              <span className="text-[10px] bg-[#DDAC5B] text-[#863D4B] font-bold px-2 py-0.5 rounded-full shrink-0">
                ACTIVE
              </span>
            </button>
          </nav>
        </div>

        {/* Bottom Profile card containing stats */}
        <div className="pt-6 border-t border-white/10 flex items-center gap-3">
          <img 
            src={patient.avatar || "https://images.unsplash.com/photo-1544005313-94ddf0286df2"} 
            alt="Patient Logo" 
            className="w-10 h-10 rounded-full border-2 border-[#DDAC5B] object-cover shrink-0" 
          />
          <div className="text-xs overflow-hidden">
            <h4 className="font-semibold text-white truncate">{patient.name}</h4>
            <p className="text-white/50 text-[10px] truncate">Check-In Streak: {patient.streakDays} days</p>
          </div>
        </div>

      </aside>

      {/* 2. MAIN HUB WORKSPACE CONTENT */}
      <main className="flex-1 overflow-x-hidden p-8 space-y-8 bg-[#FAF8F6]">
        
        {/* UPPER STATUS STRIP */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-stone-200 pb-6 shrink-0">
          <div>
            <div className="text-stone-400 text-[10px] uppercase tracking-widest font-extrabold font-sans">Active Treatment Access</div>
            <h1 className="text-2xl font-bold text-[#2C2C2C] flex items-center gap-3.5 mt-1">
              <span>Patient Care Portal ({patient.name.split(' ')[0]})</span>
              <span className="px-2.5 py-0.5 rounded text-[9px] bg-green-50 text-green-700 border border-green-100 uppercase tracking-tight font-extrabold">
                AES-256 SECURED
              </span>
            </h1>
            <p className="text-xs text-stone-400 mt-1">Between-session qualitative symptom reflection pipeline directly mirrored to clinic EHR.</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <div className="text-right mr-4 border-r border-stone-200 pr-4 hidden md:block select-none">
              <div className="text-[9px] text-stone-400 uppercase tracking-widest font-extrabold">Self-Care Progress</div>
              <div className="text-xs font-bold text-[#863D4B]">Active Streak: {patient.streakDays} Days 🔥</div>
            </div>
            
            <button
              onClick={() => setActiveTab('checkin')}
              className="bg-[#863D4B] hover:opacity-95 text-white font-semibold text-xs py-2.5 px-5 rounded-xl shadow-sm transition-all active:scale-95 flex items-center gap-2 cursor-pointer animate-pulse"
              id="btn-quick-checkin"
            >
              <Smile className="h-4 w-4" />
              <span>Complete Daily Check-In</span>
            </button>
          </div>
        </div>

        {/* COMPONENT BODY SELECTOR */}
        <div id="patient-active-viewport" className="space-y-6">
          
          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
              
              {/* PRIMARY LEFT SIDE COLUMN SUMMARY CARDS (5 cols) */}
              <div className="xl:col-span-5 space-y-6">
                
                {/* Greeting Progress Banner Card */}
                <div className="bg-white p-6 rounded-[24px] border border-stone-200 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#863D4B]/5 rounded-full -mr-10 -mt-10"></div>
                  
                  <div className="space-y-1">
                    <span className="text-[9px] bg-[#863D4B] text-white font-bold font-sans px-2.5 py-1 rounded uppercase tracking-wider block w-fit select-none">
                      Continuous Care Loop
                    </span>
                    <h3 className="font-serif italic text-[#863D4B] text-xl mt-3">My Reflective Log Workspace</h3>
                  </div>

                  <p className="text-xs text-stone-500 leading-relaxed mt-2">
                    Keep your clinical providers updated between sessions by logging. Check-ins instantly train your somatic tracking dashboards. 
                  </p>

                  <div className="pt-4 flex gap-3">
                    <button 
                      onClick={() => setActiveTab('checkin')}
                      className="bg-[#863D4B] hover:opacity-95 text-white text-xs font-semibold py-2.5 px-5 rounded-xl shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
                      id="btn-banner-checkin"
                    >
                      <span>New Logging</span>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => setActiveTab('journal')}
                      className="bg-[#FEF7EA] hover:bg-[#FEF7EA]/85 border border-[#DDAC5B]/30 text-[#863D4B] text-xs font-bold py-2.5 px-5 rounded-xl transition-all cursor-pointer"
                      id="btn-banner-journal"
                    >
                      Voice Journal
                    </button>
                  </div>
                </div>

                {/* Healing Streak milestone card */}
                <div className="bg-white rounded-[24px] border border-stone-200 shadow-sm p-6 space-y-4 border-l-4 border-l-[#DDAC5B]">
                  <div className="flex items-center gap-4">
                    <div className="bg-[#FEF7EA] p-3 rounded-2xl text-brand-amber font-bold">
                      <Award className="h-6 w-6 text-[#DDAC5B]" />
                    </div>
                    <div>
                      <h4 className="text-[10px] text-stone-400 font-bold uppercase tracking-widest block font-sans">Self-Care Milestones</h4>
                      <p className="text-base font-bold text-[#863D4B] mt-0.5">{patient.streakDays}-Day Consistent Check-In Streak</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-stone-100 text-xs font-semibold">
                    <span className="text-stone-500">Weekly Achievement:</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <span key={i} className="text-base">🔥</span>
                      ))}
                      <span className="text-base opacity-25">🔥</span>
                    </div>
                  </div>
                </div>

                {/* Treatment Goals Checklist */}
                <div className="bg-white rounded-[24px] border border-stone-200 shadow-sm p-6 space-y-4">
                  <h4 className="font-sans font-bold text-xs uppercase tracking-widest text-[#863D4B] pb-2 border-b border-stone-150">Active Treatment Goals</h4>
                  
                  <div className="space-y-3.5">
                    <div className="flex items-start gap-3 text-xs">
                      <span className="bg-[#EBF5ED] text-[#6F9B7A] p-0.5 rounded-lg mt-0.5 shrink-0">
                        <Check className="h-3.5 w-3.5" strokeWidth={3} />
                      </span>
                      <div>
                        <span className="font-semibold block text-[#2C2C2C]">Cognitive Trigger Logs</span>
                        <span className="text-stone-400">Recording specific social tension events triggering somatic tightness</span>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 text-xs">
                      <span className="bg-[#EBF5ED] text-[#6F9B7A] p-0.5 rounded-lg mt-0.5 shrink-0">
                        <Check className="h-3.5 w-3.5" strokeWidth={3} />
                      </span>
                      <div>
                        <span className="font-semibold block text-[#2C2C2C]">Sustain SSRI Compliance</span>
                        <span className="text-stone-400">Re-stabilize consistent daily log variables tracking</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dr Advice Banner */}
                <div className="bg-[#FEF7EA] p-5 rounded-2xl border border-[#DDAC5B]/25 flex gap-3.5 text-xs text-neutral-800">
                  <Sparkles className="h-5 w-5 text-[#DDAC5B] shrink-0 mt-0.5 animate-pulse" />
                  <div>
                    <span className="font-bold text-[#863D4B] block text-sm">System Guidance Notice</span>
                    <p className="text-stone-600 mt-1.5 leading-relaxed">
                      Your sleep stability has degraded correlate with average Anxiety peaks &gt; 7. Consider dictating a brief Secure Voice Journal memo before bedtime to dump stress thoughts.
                    </p>
                  </div>
                </div>

              </div>

              {/* TIMELINE TREND ANALYTICS GRAPH (7 cols) */}
              <div className="xl:col-span-7 bg-white rounded-[24px] border border-stone-200 shadow-sm p-6 space-y-6">
                
                <div className="flex justify-between items-center border-b border-stone-150 pb-4">
                  <div>
                    <h3 className="font-serif italic text-[#863D4B] text-xl">My Emotional Landscape Trend</h3>
                    <p className="text-stone-400 text-xs mt-0.5">Continuous check-in analytics sync</p>
                  </div>
                  <span className="text-[10px] bg-stone-100 text-stone-500 font-bold px-3 py-1 rounded-full uppercase tracking-wider font-mono">
                    LATEST 7 ENTRIES
                  </span>
                </div>

                {chartData.length > 0 ? (
                  <div className="h-96 w-full min-h-[300px]" id="pat-chart-container">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData} margin={{ top: 10, right: 10, left: -22, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f2f2f2" />
                        <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#666' }} stroke="#999" />
                        <YAxis domain={[1, 10]} tick={{ fontSize: 11, fill: '#666' }} stroke="#999" />
                        <Tooltip contentStyle={{ fontSize: 12, borderRadius: 12 }} />
                        <Line type="monotone" dataKey="Mood" stroke="#863D4B" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                        <Line type="monotone" dataKey="Anxiety" stroke="#D9A441" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 3 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-64 flex items-center justify-center text-xs text-stone-400 font-mono">
                    Submit your first journal or check-in to compile telemetry trends.
                  </div>
                )}

                <div className="flex justify-center gap-6 text-xs pt-2">
                  <span className="flex items-center gap-2 text-[#863D4B] font-semibold">
                    <span className="h-3 w-3 rounded-full bg-[#863D4B]"></span>
                    <span>Mood Progression</span>
                  </span>
                  <span className="flex items-center gap-2 text-[#D9A441] font-semibold">
                    <span className="h-3 w-3 rounded-full bg-[#D9A441]"></span>
                    <span>Anxiety Peaks</span>
                  </span>
                </div>

              </div>

            </div>
          )}

          {/* CHECK-IN FORM WORKSPACE SCREEN */}
          {activeTab === 'checkin' && (
            <div className="max-w-3xl mx-auto bg-white rounded-[24px] border border-stone-200 shadow-sm p-8 space-y-6">
              
              <div className="flex justify-between items-center border-b border-stone-150 pb-4">
                <div>
                  <h3 className="font-serif italic text-[#863D4B] text-2xl">Daily Reflection Log</h3>
                  <p className="text-stone-400 text-xs mt-1">Somatic responses securely logged under continuous care plan</p>
                </div>
                <button 
                  type="button" 
                  onClick={() => setActiveTab('dashboard')} 
                  className="text-xs text-stone-400 hover:text-stone-700 font-bold uppercase tracking-wider font-sans cursor-pointer"
                  id="btn-pat-cancel-checkin"
                >
                  Cancel
                </button>
              </div>

              <form onSubmit={handleCheckInSubmit} className="space-y-6" id="form-pat-checkin">
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  <div className="space-y-2 bg-[#FAF8F6] p-4 rounded-xl border border-stone-150">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-[#2C2C2C]">Mood Index</span>
                      <span className="text-[#863D4B] bg-[#863D4B]/10 px-2.5 py-0.5 rounded-full font-mono">{mood}/10</span>
                    </div>
                    <input 
                      type="range" min="1" max="10" step="1" value={mood} 
                      onChange={(e) => setMood(Number(e.target.value))}
                      className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-[#863D4B] block mt-2"
                    />
                    <div className="flex justify-between text-[10px] text-stone-400">
                      <span>Low / Sad</span>
                      <span>Stable / Uplifted</span>
                    </div>
                  </div>

                  <div className="space-y-2 bg-[#FAF8F6] p-4 rounded-xl border border-stone-150">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-[#2C2C2C]">Anxiety Level</span>
                      <span className="text-[#D9A441] bg-[#FEF7EA] px-2.5 py-0.5 rounded-full font-mono">{anxiety}/10</span>
                    </div>
                    <input 
                      type="range" min="1" max="10" step="1" value={anxiety} 
                      onChange={(e) => setAnxiety(Number(e.target.value))}
                      className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-[#D9A441] block mt-2"
                    />
                    <div className="flex justify-between text-[10px] text-stone-400">
                      <span>Calm / Grounded</span>
                      <span>Severe Panic</span>
                    </div>
                  </div>

                  <div className="space-y-2 bg-[#FAF8F6] p-4 rounded-xl border border-stone-150">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-[#2C2C2C]">Energy Scale</span>
                      <span className="text-[#6F9B7A] bg-[#EBF5ED] px-2.5 py-0.5 rounded-full font-mono">{energy}/10</span>
                    </div>
                    <input 
                      type="range" min="1" max="10" step="1" value={energy} 
                      onChange={(e) => setEnergy(Number(e.target.value))}
                      className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-[#6F9B7A] block mt-2"
                    />
                    <div className="flex justify-between text-[10px] text-stone-400">
                      <span>Exhausted</span>
                      <span>High Vitality</span>
                    </div>
                  </div>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-stone-500 block">Sleep Duration</label>
                    <select 
                      value={sleepDuration} 
                      onChange={(e) => setSleepDuration(Number(e.target.value))}
                      className="w-full rounded-xl border border-stone-200 bg-[#FAF8F6] p-3 text-xs font-semibold focus:ring-1 focus:ring-[#863D4B] outline-none text-[#2C2C2C] cursor-pointer"
                    >
                      <option value="4">4.0 hrs or less (Disrupted)</option>
                      <option value="5">5.0 hrs</option>
                      <option value="5.5">5.5 hrs</option>
                      <option value="6">6.0 hrs</option>
                      <option value="6.5">6.5 hrs</option>
                      <option value="7">7.0 hrs</option>
                      <option value="7.5">7.5 hrs</option>
                      <option value="8">8.0 hrs</option>
                      <option value="9">9.0 hrs +</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-stone-500 block">Sleep Quality</label>
                    <select 
                      value={sleepQuality} 
                      onChange={(e) => setSleepQuality(e.target.value as any)}
                      className="w-full rounded-xl border border-stone-200 bg-[#FAF8F6] p-3 text-xs font-semibold focus:ring-1 focus:ring-[#863D4B] outline-none text-[#2C2C2C] cursor-pointer"
                    >
                      <option value="Poor">Poor 😔</option>
                      <option value="Fair">Fair 😐</option>
                      <option value="Good">Good 🙂</option>
                      <option value="Excellent">Excellent 😊</option>
                    </select>
                  </div>

                </div>

                {/* Medication Compliance Switcher */}
                <div className="flex items-center justify-between bg-[#FAF8F6] p-4 rounded-xl border border-stone-150">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-[#2C2C2C] block">SSRI Medication Taken Today</span>
                    <p className="text-[10px] text-stone-400 block font-mono">Continuous adherence telemetry tracker</p>
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => setMedicationTaken(!medicationTaken)}
                    className={`w-12 h-6 flex items-center rounded-full p-1 transition-all cursor-pointer ${
                      medicationTaken ? 'bg-[#863D4B]' : 'bg-stone-300'
                    }`}
                  >
                    <div 
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-all ${
                        medicationTaken ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    ></div>
                  </button>
                </div>

                {/* Event of day */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-500 block">Most Significant Incident or Trigger</label>
                  <input 
                    type="text"
                    value={significantEvent}
                    onChange={(e) => setSignificantEvent(e.target.value)}
                    placeholder="e.g. Challenging workplace conversation, subway transit delay..."
                    className="w-full rounded-xl border border-stone-200 bg-[#FAF8F6] p-3 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#863D4B] text-[#2C2C2C]"
                  />
                </div>

                {/* Reflection Notes */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-500 block">Qualitative Reflection Narrative</label>
                  <textarea 
                    rows={4}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Describe sensory tightness, grounding exercises, thoughts log..."
                    className="w-full rounded-xl border border-stone-200 bg-[#FAF8F6] p-3 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#863D4B] resize-none text-[#2C2C2C]"
                  ></textarea>
                </div>

                <div className="pt-2">
                  <button 
                    type="submit"
                    disabled={formSubmitted}
                    className="w-full bg-[#863D4B] hover:opacity-95 text-white font-semibold text-xs py-3.5 rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {formSubmitted ? (
                      <>
                        <Check className="h-4 w-4 animate-bounce" />
                        <span>Transmitted securely to clinician portal</span>
                      </>
                    ) : (
                      <span>Transmit Encrypted Check-In Log</span>
                    )}
                  </button>
                </div>

              </form>

            </div>
          )}

          {/* SECURE VOICE JOURNAL WORKSPACE SCREEN */}
          {activeTab === 'journal' && (
            <div className="max-w-2xl mx-auto bg-white rounded-[24px] border border-stone-200 shadow-sm p-8 space-y-6 animate-fade-in">
              
              <div className="text-center space-y-1.5 border-b border-stone-150 pb-5">
                <h3 className="font-serif italic text-[#863D4B] text-2xl">Cognitive Voice Journaling</h3>
                <p className="text-xs text-stone-400 leading-relaxed max-w-sm mx-auto">
                  Vocal stream processing is parsed into structured semantic weights database automatically. Securely protected.
                </p>
              </div>

              {/* Acoustic visualizer screen */}
              <div className="bg-neutral-900 rounded-[20px] p-8 flex flex-col items-center justify-center relative overflow-hidden min-h-[220px]">
                <div className="absolute inset-0 bg-[radial-gradient(#863d4b_1.5px,transparent_1.5px)] [background-size:20px_20px] opacity-15"></div>

                {isRecording ? (
                  <div className="flex items-center gap-2 h-16 mb-4 z-10">
                    <div className="w-1.5 bg-[#863D4B] rounded-full h-12 animate-wave-1"></div>
                    <div className="w-1.5 bg-[#DDAC5B] rounded-full h-8 animate-wave-2"></div>
                    <div className="w-1.5 bg-[#863D4B] rounded-full h-20 animate-wave-3"></div>
                    <div className="w-1.5 bg-[#DDAC5B] rounded-full h-6 animate-wave-4"></div>
                    <div className="w-1.5 bg-[#863D4B] rounded-full h-14 animate-wave-5"></div>
                    <div className="w-1.5 bg-[#DDAC5B] rounded-full h-10 animate-wave-6"></div>
                    <div className="w-1.5 bg-[#863D4B] rounded-full h-8 animate-wave-7"></div>
                  </div>
                ) : (
                  <div className="flex gap-1 h-3 mb-4 items-center opacity-30 z-10">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
                      <div key={i} className="w-1 h-3 bg-white/60 rounded-full"></div>
                    ))}
                  </div>
                )}

                <div className="z-10 text-center">
                  {isRecording ? (
                    <div className="space-y-1">
                      <span className="text-red-500 text-[10px] font-bold tracking-widest flex items-center justify-center gap-1.5 animate-pulse">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                        <span>LIVE CLINICAL TRANSCRIPTION HANDSHAKE</span>
                      </span>
                      <p className="text-white text-3xl font-mono font-bold">
                        {Math.floor(recordedDuration / 60)}:{(recordedDuration % 60).toString().padStart(2, '0')}
                      </p>
                    </div>
                  ) : (
                    <p className="text-[#DDAC5B]/60 text-xs font-mono tracking-wider">STANDBY - SECURED WITH SYMMETRIC CLIENT KEY</p>
                  )}
                </div>
              </div>

              {/* Action Trigger keys */}
              <div className="flex justify-center gap-4">
                {!isRecording ? (
                  <button
                    onClick={startRecording}
                    className="w-16 h-16 rounded-full bg-[#863D4B] hover:opacity-95 text-white flex items-center justify-center shadow-lg transition-all active:scale-95 hover:scale-105 cursor-pointer"
                    id="btn-trigger-mic"
                  >
                    <Mic className="h-7 w-7" />
                  </button>
                ) : (
                  <button
                    onClick={stopRecording}
                    className="w-16 h-16 rounded-full bg-red-600 animate-pulse text-white flex items-center justify-center shadow-lg transition-all active:scale-95 cursor-pointer"
                    id="btn-stop-recording"
                  >
                    <Square className="h-6 w-6" />
                  </button>
                )}
              </div>

              {isRecording && (
                <div className="bg-[#FAF8F6] p-4 rounded-xl border border-stone-200">
                  <span className="text-[10px] text-stone-400 font-bold block uppercase tracking-wider">Simulated STT Pipeline Stream</span>
                  <p className="text-xs text-stone-600 mt-2 italic leading-relaxed">
                    "{recordingText || "Connecting verbal sequence algorithms..."}"
                  </p>
                </div>
              )}

              {!isRecording && (
                <div className="space-y-4 pt-4 border-t border-stone-150">
                  <div className="text-xs text-center text-stone-400 font-bold uppercase tracking-widest">
                    -- Or Import Manual Journal logs --
                  </div>
                  
                  <textarea
                    rows={3}
                    value={manualTranscript}
                    onChange={(e) => setManualTranscript(e.target.value)}
                    placeholder="Type daily sensory log to transcribes directly without microphones..."
                    className="w-full rounded-xl border border-stone-200 bg-[#FAF8F6] p-3 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#863D4B] resize-none text-[#2C2C2C]"
                  ></textarea>

                  <button
                    onClick={stopRecording}
                    disabled={!manualTranscript.trim()}
                    className="w-full bg-stone-100 hover:bg-stone-200 hover:text-[#2C2C2C] disabled:opacity-40 text-stone-700 font-semibold text-xs py-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                    id="btn-vocal-transmit"
                  >
                    <Upload className="h-4 w-4" />
                    <span>Upload Text Journal Memo</span>
                  </button>
                </div>
              )}

              {recordingSuccess && (
                <div className="bg-[#EBF5ED] border border-[#6F9B7A]/20 p-4 rounded-xl text-[#6F9B7A] text-center text-xs font-semibold animate-pulse">
                  Unprocessed stream parsed! Transmitted to doctor EHR.
                </div>
              )}

            </div>
          )}

          {/* HISTORICAL RECOLLECTION SCREEN (MY HEALING HISTORY) */}
          {activeTab === 'history' && (
            <div className="max-w-4xl mx-auto space-y-6">
              
              <div className="flex justify-between items-center border-b border-stone-150 pb-4">
                <div>
                  <h3 className="font-serif italic text-[#863D4B] text-2xl">My Healing History</h3>
                  <p className="text-stone-400 text-xs mt-1">Reviewing telemetry records saved in continuous care portal</p>
                </div>
                <span className="text-xs font-mono font-bold text-stone-500 bg-stone-100 px-3 py-1 rounded-full select-none">
                  Total Log History: {checkins.length + journals.length} Logs
                </span>
              </div>

              {/* Chronological list timeline */}
              <div className="space-y-6 relative before:absolute before:left-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-[#863D4B]/10">
                
                {/* Check-ins list */}
                {checkins.map((entry) => (
                  <div key={entry.id} className="relative pl-10 space-y-1.5" id={`log-item-${entry.id}`}>
                    <div className="absolute left-2.5 top-2 w-3 h-3 rounded-full bg-[#863D4B] ring-4 ring-[#863D4B]/10"></div>
                    
                    <div className="bg-white rounded-[20px] p-6 shadow-sm border border-stone-200 text-xs space-y-4">
                      
                      <div className="flex justify-between items-center border-b border-stone-100 pb-2">
                        <span className="text-[10px] bg-[#863D4B]/10 text-[#863D4B] font-extrabold px-2.5 py-1 rounded">DAILY CHECK-IN SUMMARY</span>
                        <span className="text-stone-400 font-semibold font-mono">{formatDate(entry.timestamp)}</span>
                      </div>

                      {/* Display key metrics layout values */}
                      <div className="grid grid-cols-3 gap-4 py-3.5 bg-[#FAF8F6] rounded-xl text-center border border-stone-150">
                        <div>
                          <span className="text-[10px] text-stone-400 uppercase font-bold tracking-wider">Mood Index</span>
                          <span className="font-bold text-[#863D4B] text-base mt-0.5 block">{entry.mood}/10</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-stone-400 uppercase font-bold tracking-wider">Anxiety Peak</span>
                          <span className="font-bold text-[#D9A441] text-base mt-0.5 block">{entry.anxiety}/10</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-stone-400 uppercase font-bold tracking-wider">Sleep Hours</span>
                          <span className="font-medium text-stone-700 text-base mt-0.5 block">{entry.sleepDuration} hrs</span>
                        </div>
                      </div>

                      <div>
                        <span className="font-bold text-stone-500 uppercase tracking-widest text-[9px] block">Trigger context:</span>
                        <p className="text-stone-700 italic mt-1 leading-relaxed border-l-2 border-[#863D4B] pl-2.5 font-medium">"{entry.significantEvent}"</p>
                      </div>

                      {entry.notes && (
                        <div className="pt-2 border-t border-stone-100">
                          <span className="font-bold text-stone-500 uppercase tracking-widest text-[9px] block">CBT Narrative Context:</span>
                          <p className="text-[#2C2C2C] mt-1 leading-relaxed">{entry.notes}</p>
                        </div>
                      )}

                    </div>
                  </div>
                ))}

                {/* Voice journals list */}
                {journals.map((journal) => (
                  <div key={journal.id} className="relative pl-10 space-y-1.5" id={`log-memo-${journal.id}`}>
                    <div className="absolute left-2.5 top-2 w-3 h-3 rounded-full bg-[#DDAC5B] ring-4 ring-[#DDAC5B]/15"></div>
                    
                    <div className="bg-white rounded-[20px] p-6 shadow-sm border border-stone-200 text-xs space-y-4">
                      
                      <div className="flex justify-between items-center border-b border-stone-100 pb-2">
                        <span className="text-[10px] bg-[#FEF7EA] text-[#863D4B] font-extrabold px-2.5 py-1 rounded">SECURED VOICE ESSAY</span>
                        <span className="text-stone-400 font-semibold font-mono">{formatDate(journal.timestamp)}</span>
                      </div>

                      <div className="flex items-center justify-between bg-[#FAF8F6] border border-stone-150 p-4 rounded-xl">
                        <button
                          onClick={() => playJournalAudio(journal.id)}
                          className="bg-[#863D4B] text-white p-2.5 rounded-full flex items-center justify-center shadow transition-all active:scale-95 cursor-pointer shrink-0"
                        >
                          <Play className="h-4 w-4 fill-current" />
                        </button>
                        
                        {/* Audio timeline layout */}
                        <div className="flex-1 px-4">
                          {playingJournalId === journal.id ? (
                            <div className="flex gap-1.5 items-center justify-center h-8">
                              <div className="h-5 w-1 bg-[#863D4B] rounded animate-wave-1"></div>
                              <div className="h-8 w-1 bg-[#863D4B] rounded animate-wave-2"></div>
                              <div className="h-4 w-1 bg-[#863D4B] rounded animate-wave-3"></div>
                              <div className="h-7 w-1 bg-[#863D4B] rounded animate-wave-4"></div>
                              <div className="h-3 w-1 bg-[#863D4B] rounded animate-wave-5"></div>
                            </div>
                          ) : (
                            <div className="h-1.5 bg-stone-200 rounded-full w-full relative">
                              <div className="absolute left-0 top-0 bottom-0 bg-[#863D4B]/30 rounded-full w-1/4"></div>
                            </div>
                          )}
                        </div>

                        <span className="font-mono text-xs text-stone-500 flex items-center gap-1 shrink-0">
                          <Clock className="h-3.5 w-3.5 text-stone-400" />
                          <span>{journal.audioDuration}</span>
                        </span>
                      </div>

                      <div className="bg-[#FEF7EA] p-4 rounded-xl border border-[#DDAC5B]/20">
                        <span className="font-bold text-[#863D4B] uppercase tracking-wide text-[9px] block mb-1">STT Transcription parsing:</span>
                        <p className="text-stone-700 leading-relaxed italic">"{journal.transcript}"</p>
                      </div>

                    </div>
                  </div>
                ))}

              </div>

            </div>
          )}

          {/* MESSENGER CHAT CHANNELS SCREEN */}
          {activeTab === 'chat' && (
            <div className="max-w-4xl mx-auto bg-white rounded-[24px] border border-stone-200 shadow-sm overflow-hidden flex flex-col h-[620px]">
              
              <div className="bg-[#EBF5ED] border-b border-[#6F9B7A]/20 p-4 text-[#6F9B7A] flex items-start gap-3 select-none">
                <ShieldAlert className="h-5 w-5 text-[#6F9B7A] shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-bold block uppercase tracking-wider">HIPAA Cryptographic Tunnel Engaged</span>
                  <span className="block mt-0.5 text-[#547a5a]">Symmetric encrypted pathways logs communication directly with Dr. Chen's medical portal. Sessions logs audit: E2EE-CHAT-998.</span>
                </div>
              </div>

              {/* Thread frame */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#FAF8F6]">
                {messages.map((msg, idx) => {
                  const isPatient = msg.sender === 'patient';
                  return (
                    <div key={msg.id || idx} className={`flex ${isPatient ? 'justify-end' : 'justify-start'}`} id={`pat-msg-idx-${idx}`}>
                      <div className={`max-w-[70%] rounded-2xl p-4 text-xs shadow-sm ${
                        isPatient 
                          ? 'bg-[#863D4B] text-white rounded-br-none' 
                          : 'bg-white text-[#2C2C2C] border border-stone-200 rounded-bl-none'
                      }`}>
                        <div className={`text-[9px] font-mono mb-1 font-semibold ${isPatient ? 'text-white/60' : 'text-stone-400'}`}>
                          {isPatient ? patient.name : 'Dr. Sarah Chen'}
                        </div>
                        
                        <p className="leading-relaxed text-sm whitespace-pre-line">{msg.text}</p>
                        
                        {msg.isCompletedExercise && (
                          <div className="mt-2.5 p-2.5 bg-black/10 rounded-xl flex items-center gap-2">
                            <Check className="h-4 w-4 text-brand-gold" />
                            <span className="text-[10px] font-medium text-white">Attachment Complete: CBT_Grounding_Logs.pdf</span>
                          </div>
                        )}
                        
                        <span className={`text-[8px] block text-right font-mono mt-1.5 ${isPatient ? 'text-white/40' : 'text-stone-400'}`}>
                          {formatDate(msg.timestamp).split(',')[1]}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Input section form */}
              <form onSubmit={handleChatSend} className="p-4 bg-white border-t border-stone-200 flex gap-3" id="form-pat-chat">
                <input
                  type="text"
                  value={newMessageText}
                  onChange={(e) => setNewMessageText(e.target.value)}
                  placeholder="Enter encrypted text reply back to clinic..."
                  className="flex-1 rounded-xl border border-stone-200 bg-[#FAF8F6] px-4 py-3 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#863D4B] text-[#2C2C2C]"
                />
                
                <button
                  type="submit"
                  className="bg-[#863D4B] hover:opacity-95 text-white py-3 px-5 rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center cursor-pointer"
                  id="btn-pat-send-chat"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>

            </div>
          )}

        </div>

      </main>

    </div>
  );
}
