import React, { useState } from 'react';
import { 
  INITIAL_PATIENTS, 
  INITIAL_CHECKINS, 
  INITIAL_JOURNALS, 
  INITIAL_INSIGHTS, 
  INITIAL_SESSIONS, 
  INITIAL_ALERTS, 
  INITIAL_MESSAGES 
} from './mockData';
import { Patient, CheckIn, VoiceJournal, Insight, Session, Message, Alert, UserRole } from './types';
import RoleSwitcher from './components/RoleSwitcher';
import PatientApp from './components/PatientApp';
import ClinicianDashboard from './components/ClinicianDashboard';
import TelehealthSession from './components/TelehealthSession';
import { Sparkles, Brain, Shield, Info } from 'lucide-react';

export default function App() {
  // Simulator state context
  const [currentRole, setCurrentRole] = useState<UserRole>('clinician'); // default to clinician dashboard for presentation
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [checkins, setCheckins] = useState<CheckIn[]>(INITIAL_CHECKINS);
  const [journals, setJournals] = useState<VoiceJournal[]>(INITIAL_JOURNALS);
  const [insights, setInsights] = useState<Insight[]>(INITIAL_INSIGHTS);
  const [sessions, setSessions] = useState<Session[]>(INITIAL_SESSIONS);
  const [alerts, setAlerts] = useState<Alert[]>(INITIAL_ALERTS);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  
  const [selectedPatientId, setSelectedPatientId] = useState<string>('pat_84219'); // Default: Alex Johnson
  const [activeTelehealthPatient, setActiveTelehealthPatient] = useState<Patient | null>(null);

  // Active metrics count
  const unhandledAlerts = alerts.filter(a => !a.resolved).length;
  const currentPatient = patients.find(p => p.id === selectedPatientId) || patients[0];

  // STREAK COUNTERS
  const alexStreak = patients.find(p => p.id === 'pat_84219')?.streakDays || 12;

  // 1. ADD PATIENT DAILY CHECK-IN (DYNAMIC PROPAGATION)
  const handleAddCheckIn = (newCheck: Omit<CheckIn, 'id' | 'timestamp'>) => {
    const newId = `chk_${Date.now()}`;
    const timestamp = new Date().toISOString();
    const finalCheck: CheckIn = {
      ...newCheck,
      id: newId,
      timestamp
    };

    // 1. Update checkins timeline
    setCheckins(prev => [finalCheck, ...prev]);

    // 2. Increment streak days & update last check-in date
    setPatients(prev => prev.map(p => {
      if (p.id === newCheck.patient_id) {
        return {
          ...p,
          streakDays: p.streakDays + 1,
          lastCheckInDate: new Date().toLocaleDateString('en-CA') // YYYY-MM-DD
        };
      }
      return p;
    }));

    // 3. Trigger clinical warning system alerts automatically!
    if (newCheck.anxiety >= 8) {
      const anxietyAlert: Alert = {
        id: `alt_auto_${Date.now()}_anx`,
        patient_id: newCheck.patient_id,
        patientName: patients.find(p => p.id === newCheck.patient_id)?.name || "Alex Johnson",
        type: 'anxiety_spike',
        message: `High alarm anxiety rating (${newCheck.anxiety}/10) reported during daily check-in. Event: "${newCheck.significantEvent}"`,
        severity: 'high',
        timestamp,
        resolved: false
      };
      setAlerts(prev => [anxietyAlert, ...prev]);
    }

    if (!newCheck.medicationTaken) {
      const medAlert: Alert = {
        id: `alt_auto_${Date.now()}_med`,
        patient_id: newCheck.patient_id,
        patientName: patients.find(p => p.id === newCheck.patient_id)?.name || "Alex Johnson",
        type: 'missed_med',
        message: `SSRI medication non-adherence reported by patient during check-in.`,
        severity: 'medium',
        timestamp,
        resolved: false
      };
      setAlerts(prev => [medAlert, ...prev]);
    }

    // 4. Update the AI summarize overview live inside the corresponding clinical insight!
    setInsights(prev => prev.map(ins => {
      if (ins.patient_id === newCheck.patient_id) {
        return {
          ...ins,
          summary: `Clinical AI Note (Updated ${new Date().toLocaleDateString()}): Patient submitted a check-in. Mood was recorded at ${newCheck.mood}/10, anxiety at ${newCheck.anxiety}/10, and sleep duration at ${newCheck.sleepDuration} hours. Noted trigger event: "${newCheck.significantEvent}". Immediate somatic processing is suggested.`,
          legend: "AI Telemetry update successfully synchronized."
        };
      }
      return ins;
    }));
  };

  // 2. ADD SECURE VOICE JOURNAL FILE RECORD (STT ANALYTICS)
  const handleAddJournal = (transcript: string, duration: string) => {
    const timestamp = new Date().toISOString();
    const finalJournal: VoiceJournal = {
      id: `vj_${Date.now()}`,
      patient_id: 'pat_84219', // Default selected simulation patient
      transcript,
      audioDuration: duration,
      timestamp
    };

    setJournals(prev => [finalJournal, ...prev]);

    // Perform clinical sentiment telemetry alert automatically
    if (transcript.toLowerCase().includes('panic') || transcript.toLowerCase().includes('breathing') || transcript.toLowerCase().includes('tightness')) {
      const voiceTriggerAlert: Alert = {
        id: `alt_auto_${Date.now()}_vj`,
        patient_id: 'pat_84219',
        patientName: 'Alex Johnson',
        type: 'anxiety_spike',
        message: `Somatic voice transcript alerts triggered by respiratory keywords. Selected draft: "${transcript.slice(0, 80)}..."`,
        severity: 'high',
        timestamp,
        resolved: false
      };
      setAlerts(prev => [voiceTriggerAlert, ...prev]);
    }

    // Update AI summaries
    setInsights(prev => prev.map(ins => {
      if (ins.patient_id === 'pat_84219') {
        return {
          ...ins,
          summary: `Clinical AI Note (Updated ${new Date().toLocaleDateString()} via Voice Journal STT): ${transcript.slice(0, 180)}... Continuous hypervigilance observed regarding workday deadlines.`,
          lastUpdated: timestamp
        };
      }
      return ins;
    }));
  };

  // 3. CLINICIAN TELEHEALTH CALL COMPLETION SOAP LOADER
  const handleFinishTelehealth = (completeSoapNote: string) => {
    const targetPatient = activeTelehealthPatient || currentPatient;
    const timestamp = new Date().toISOString();
    
    // Create completed session record
    const newSession: Session = {
      id: `ses_add_${Date.now()}`,
      patient_id: targetPatient.id,
      clinician_id: 'clin_01',
      date: new Date().toLocaleDateString('en-CA'),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      notes: completeSoapNote,
      status: 'completed',
      type: 'Telehealth'
    };

    setSessions(prev => [newSession, ...prev]);

    // Create a clinician secure confirmation message to the patient chat!
    const confirmMessage: Message = {
      id: `msg_sys_${Date.now()}`,
      patient_id: targetPatient.id,
      sender: 'clinician',
      text: `Hi ${targetPatient.name.split(' ')[0]}, thank you for attending today's secure video session. I've successfully synchronized our SOAP clinical record. Please review the homework material we set regarding exposure exercises before Wednesday.`,
      timestamp
    };

    setMessages(prev => [...prev, confirmMessage]);

    // Close telehealth frame
    setActiveTelehealthPatient(null);
    setCurrentRole('clinician'); // return to portal
  };

  // 4. MESSAGE TRANSLATION
  const handleClientMessage = (text: string) => {
    const timestamp = new Date().toISOString();
    const clientMsg: Message = {
      id: `msg_pat_${Date.now()}`,
      patient_id: 'pat_84219',
      sender: 'patient',
      text,
      timestamp
    };
    setMessages(prev => [...prev, clientMsg]);

    // Simulate direct therapist AI automatic handshake responses
    setTimeout(() => {
      const clinicianAutoReply: Message = {
        id: `msg_auto_reply_${Date.now()}`,
        patient_id: 'pat_84219',
        sender: 'clinician',
        text: `Secure HIPAA Auto-Reply: Dr. Sarah Chen has received your encrypted log. "Thank you Alex. I am tracking your subway grounding practice. Let us analyze this during Monday's video call."`,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, clinicianAutoReply]);
    }, 2500);
  };

  const handleClinicianMessage = (patientId: string, text: string) => {
    const timestamp = new Date().toISOString();
    const clinMsg: Message = {
      id: `msg_clin_${Date.now()}`,
      patient_id: patientId,
      sender: 'clinician',
      text,
      timestamp
    };
    setMessages(prev => [...prev, clinMsg]);

    // Simulate clinical patient recognition responses
    setTimeout(() => {
      const patientAutoResponse: Message = {
        id: `msg_pat_resp_${Date.now()}`,
        patient_id: patientId,
        sender: 'patient',
        text: `Got it, Dr. Chen. I appreciate the guidance. I'll make sure to practice standard anchoring before logging into work tomorrow morning.`,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, patientAutoResponse]);
    }, 3000);
  };

  // 5. RESOLVE TELEMETRY ALERTS
  const handleResolveAlert = (alertId: string) => {
    setAlerts(prev => prev.map(a => {
      if (a.id === alertId) {
        return { ...a, resolved: true };
      }
      return a;
    }));
  };

  // 6. ADD MANUAL CONSOLE SOAP NOTE
  const handleAddManualSessionNote = (patientId: string, noteText: string) => {
    const newManualSession: Session = {
      id: `ses_manual_${Date.now()}`,
      patient_id: patientId,
      clinician_id: 'clin_01',
      date: new Date().toLocaleDateString('en-CA'),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      notes: `[EHR MANUAL ENTRY]\n${noteText}`,
      status: 'completed',
      type: 'In-Hand'
    };
    setSessions(prev => [newManualSession, ...prev]);
  };

  return (
    <div className="bg-[#FAF8F6] min-h-screen pb-16 flex flex-col font-sans">
      
      {/* GLOBAL SYSTEM SIMULATOR BANNER */}
      <div className="bg-[#101010] text-zinc-300 py-1.8 px-4 flex justify-between items-center text-[11px] font-mono border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          <span>SANDBOX MODE: Patients & Clinicians unified state</span>
        </div>
        <div className="hidden md:flex items-center gap-4">
          <span className="text-zinc-500">HIPAA Protected Audit Trail Active</span>
          <span className="text-brand-gold">Click Roles below to toggle perspectives</span>
        </div>
      </div>

      {/* PERSPECTIVES CONTROLLER */}
      <RoleSwitcher 
        currentRole={currentRole} 
        onChangeRole={setCurrentRole}
        streakCount={alexStreak}
        alertsCount={unhandledAlerts}
      />

      <div className="max-w-7xl mx-auto w-full px-4 pt-6 flex-1">
        
        {/* INTERACTIVE COMPONENT SWITCHBOARD */}
        {activeTelehealthPatient ? (
          /* TELEHEALTH VIDEO SCREEN */
          <div className="animate-fade-in">
            <div className="bg-[#DDAC5B]/10 border border-[#DDAC5B]/35 px-4 py-2.5 rounded-2xl mb-4 text-xs text-brand-charcoal flex items-center gap-2">
              <Sparkles className="h-4.5 w-4.5 text-[#D9A441] animate-bounce shrink-0" />
              <span>You are currently inside a live Telehealth consultation with <strong>{activeTelehealthPatient.name}</strong>. Talk openly, compile intake checks on the right side, and submit when finished to auto-compile SOAP.</span>
            </div>
            
            <TelehealthSession 
              patient={activeTelehealthPatient}
              onEndSession={handleFinishTelehealth}
              onCancel={() => setActiveTelehealthPatient(null)}
            />
          </div>
        ) : currentRole === 'patient' ? (
          /* PATIENT SIMULATION FRAME */
          <div className="space-y-4">
            <div className="bg-[#863D4B]/5 border border-[#863D4B]/15 p-4 rounded-2xl text-xs max-w-[420px] mx-auto">
              <p className="font-semibold text-brand-burgundy flex items-center gap-1.5 mb-1">
                <Info className="h-4 w-4" />
                <span>Patient Sandbox Tips</span>
              </p>
              <p className="text-neutral-500">
                You are playing as <strong>Alex Johnson</strong> (28 y/o Software Engineer). 
              </p>
              <ul className="list-disc list-inside mt-1.5 space-y-1 text-neutral-400">
                <li>Submit a <strong>Check-In</strong> with very high anxiety (e.g. 9/10) or miss your medication to trigger alerts.</li>
                <li>Tap to record a <strong>Voice Journal</strong> and watch the waveform bounce.</li>
                <li>Flip role back to <strong>Clinician Portal</strong> to inspect telemetry.</li>
              </ul>
            </div>

            <PatientApp 
              patient={currentPatient}
              checkins={checkins}
              journals={journals}
              onAddCheckIn={handleAddCheckIn}
              onAddJournal={handleAddJournal}
              messages={messages}
              onSendMessage={handleClientMessage}
            />
          </div>
        ) : (
          /* CLINICIAN REST SUITE PANEL */
          <div className="space-y-4">
            {/* Quick Sandbox Guide alert */}
            <div className="bg-brand-burgundy text-white p-4 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-3 shadow-md">
              <div className="flex gap-3">
                <Brain className="h-10 w-10 text-brand-gold shrink-0" />
                <div className="text-xs">
                  <h3 className="font-semibold font-display tracking-wide text-sm flex items-center gap-1">
                    <span>Clinical Continuity Sandbox Overview</span>
                    <span className="text-brand-gold">✨</span>
                  </h3>
                  <p className="text-white/80 mt-0.5">This platform helps doctors inspect between-session telemetry. When patients complete their mobile check-ins, medical summaries automatically re-align. Try launching telehealth calls or messaging to verify HIPAA parameters.</p>
                </div>
              </div>
              
              <button
                onClick={() => {
                  setCurrentRole('patient');
                }}
                className="bg-brand-gold text-brand-burgundy hover:bg-white text-xs font-bold py-2 px-3.5 rounded-xl transition-all uppercase whitespace-nowrap"
              >
                Simulate Patient check-ins
              </button>
            </div>

            <ClinicianDashboard 
              patients={patients}
              checkins={checkins}
              journals={journals}
              insights={insights}
              sessions={sessions}
              alerts={alerts}
              messages={messages}
              selectedPatientId={selectedPatientId}
              onSelectPatient={setSelectedPatientId}
              onResolveAlert={handleResolveAlert}
              onStartTelehealth={setActiveTelehealthPatient}
              onSendClinicianMessage={handleClinicianMessage}
              onAddSessionNote={handleAddManualSessionNote}
            />
          </div>
        )}

      </div>

      {/* FOOTER */}
      <footer className="mt-16 border-t border-neutral-200 py-6 text-center text-xs text-neutral-400 font-sans">
        <div className="max-w-7xl mx-auto px-4 space-y-1.5 flex flex-col items-center">
          <div className="flex items-center gap-1.5">
            <Shield className="h-4.5 w-4.5 text-brand-gold fill-current opacity-80" />
            <p className="font-semibold text-neutral-600">Therapy & Beyond Clinical Practice Solutions</p>
          </div>
          <p className="max-w-md text-neutral-500">Fully compliant with Health Insurance Portability and Accountability Act (HIPAA) security guidelines. Under clinical sandbox governance. Cryptographic Handshakes secured with SHA-256 and AES E2EE.</p>
          <p className="text-[10px] text-zinc-300 font-mono pt-1">BUILD REVISION ID: BND-88912-SAAS • PERSISTENT ENVELOPE: LOCAL_DATASTORE</p>
        </div>
      </footer>

    </div>
  );
}
