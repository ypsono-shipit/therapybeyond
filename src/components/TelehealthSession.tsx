import React, { useState, useEffect } from 'react';
import { 
  Video, VideoOff, Mic, MicOff, PhoneOff, Shield, 
  Sparkles, CheckSquare, Clipboard, AlertCircle, RefreshCw, Layers
} from 'lucide-react';
import { Patient } from '../types';

interface TelehealthSessionProps {
  patient: Patient;
  onEndSession: (sessionNotes: string) => void;
  onCancel: () => void;
}

export default function TelehealthSession({ patient, onEndSession, onCancel }: TelehealthSessionProps) {
  const [micActive, setMicActive] = useState<boolean>(true);
  const [videoActive, setVideoActive] = useState<boolean>(true);
  const [duration, setDuration] = useState<number>(145); // in seconds, starting near 2 mins
  
  // Intake checklist states
  const [somaticPresent, setSomaticPresent] = useState<boolean>(true);
  const [cognitiveDistortions, setCognitiveDistortions] = useState<boolean>(true);
  const [riskAssessment, setRiskAssessment] = useState<boolean>(false);
  const [pillCompliance, setPillCompliance] = useState<boolean>(true);
  
  // Custom draft notes
  const [sessionNotes, setSessionNotes] = useState<string>(
    `Patient attended the session. We addressed recent workplace conflicts. Commute-related panic represents the primary somatic trigger. Developed an exposure-response hierarchy for subways...`
  );

  // Live dialogue subtitles simulator
  interface Subtitle {
    sender: 'clinician' | 'patient';
    text: string;
  }
  const [dialogue, setDialogue] = useState<Subtitle[]>([
    { sender: 'clinician', text: 'Thank you for joining today, Alex. I reviewed your weekly mood logs. It looks like Wednesday was a bit challenging?' },
    { sender: 'patient', text: 'Yes, Wednesday was when the workplace conflict happened and I had that severe panic episode on the subway.' },
    { sender: 'clinician', text: 'I saw that in your daily check-in. Tell me, did you try the 5-4-3-2-1 grounding technique when you felt the sidewalk tilting?' },
    { sender: 'patient', text: 'I did. It did help ground me, but my heart was still racing so fast I had to step off the subway train.' }
  ]);

  // Dialogue pool
  const dialogPool: Subtitle[] = [
    { sender: 'clinician', text: 'Stepping off was a wise self-containment step. Recognizing when your nervous system is overloaded is progress.' },
    { sender: 'patient', text: 'That makes me feel better. I was worried I failed because I could not finish the train ride.' },
    { sender: 'clinician', text: 'Not at all. Recovery is a spiral, not a straight line. Let us review the SSRI dose timing to anchor your morning routines.' },
    { sender: 'patient', text: 'I usually take it with coffee, but since my sleep has been fragmented, I missed two doses. I will try setting a phone alarm.' },
    { sender: 'clinician', text: 'Excellent idea. Anchoring is key. Let us practice a deep diaphragmatic cycle right now to regulate.' }
  ];

  // Increment duration counter every second
  useEffect(() => {
    const timer = setInterval(() => {
      setDuration(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Dialog pool typing generator
  useEffect(() => {
    let index = 0;
    const stream = setInterval(() => {
      if (index < dialogPool.length) {
        setDialogue(prev => [...prev, dialogPool[index]]);
        index++;
      }
    }, 7000); // add new dialogue bubble every 7 seconds
    return () => clearInterval(stream);
  }, []);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    const completeSOAP = `
[TELEHEALTH SESSION SOAP NOTE]
Date: ${new Date().toLocaleDateString()}
Duration: ${formatTime(duration)}
Clinician: Dr. Sarah Chen, PsyD
Patient: ${patient.name} (ID: ${patient.id})

Somatic Symptoms present: ${somaticPresent ? 'Yes' : 'No'}
Cognitive Distortions present: ${cognitiveDistortions ? 'Yes' : 'No'}
Medication Compliance barriers noted: ${!pillCompliance ? 'Yes' : 'No'}
Risk Levels Evaluated: ${riskAssessment ? 'CRITICAL - HIGH RISK' : 'STABLE - MEDIUM RISK'}

Clinical Notes & Observations:
${sessionNotes}
`;
    onEndSession(completeSOAP);
  };

  return (
    <div className="bg-zinc-950 text-white rounded-3xl p-6 shadow-2xl relative border-4 border-zinc-900 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[580px]">
      
      {/* LEFT COLUMN: Dynamic Video calling screen (7 cols) */}
      <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
        
        {/* Call header */}
        <div className="flex items-center justify-between bg-zinc-900/60 backdrop-blur-md p-3.5 rounded-2xl border border-white/5">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-ping"></span>
            <span className="text-xs uppercase font-mono tracking-widest font-semibold text-zinc-100">Live Video Session</span>
          </div>
          
          <div className="flex items-center gap-2.5 font-mono text-xs">
            <span className="bg-brand-burgundy text-white px-2.5 py-1 rounded-md text-[11px] font-bold">
              {formatTime(duration)}
            </span>
            <span className="text-zinc-400">HIPAA Protected</span>
          </div>
        </div>

        {/* Dynamic streams container */}
        <div className="flex-1 bg-zinc-900 rounded-3xl overflow-hidden relative min-h-[340px] flex flex-col justify-between p-4 border border-zinc-800">
          
          {/* Main big display: Patient Alex */}
          {videoActive ? (
            <div className="absolute inset-0 bg-cover bg-center transition-all opacity-80" style={{ backgroundImage: `url(${patient.avatar})` }}>
              {/* Overlay shading */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/35"></div>
            </div>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-800">
              <div className="w-20 h-20 bg-brand-burgundy rounded-full flex items-center justify-center text-xl font-bold font-display shadow-lg">
                {patient.name[0]}
              </div>
              <span className="text-xs text-zinc-400 mt-2 font-mono">CLIENT CAMERA DISABLED</span>
            </div>
          )}

          {/* Clinician Sarah Thumbnail in corner */}
          <div className="absolute bottom-4 right-4 w-32 h-24 bg-zinc-950 rounded-2xl overflow-hidden border-2 border-brand-gold shadow-lg z-20 flex items-center justify-center">
            <div className="absolute inset-0 bg-cover bg-center opacity-70" style={{ backgroundImage: `url(https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200)` }}></div>
            <div className="absolute inset-0 bg-black/10"></div>
            <span className="absolute bottom-1 left-2 text-[8px] font-semibold text-white/90 bg-black/50 px-1 py-0.2 rounded">Dr. Chen (You)</span>
          </div>

          {/* Connection badge Top Left */}
          <div className="z-10 bg-black/60 backdrop-blur-md px-3 py-1 rounded-xl border border-white/10 text-[10px] w-fit flex items-center gap-1.5 font-mono font-medium">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
            <span>98ms Pin / 24fps E2EE</span>
          </div>

          {/* Subtitles Overlay bottom left */}
          <div className="z-10 bg-black/75 backdrop-blur-sm p-3.5 rounded-2xl max-w-[80%] border border-white/5 space-y-1">
            <span className="text-[9px] text-brand-gold font-bold font-mono tracking-wider">REALTIME DIALOGUE CAPTURE</span>
            <div className="max-h-[60px] overflow-y-auto text-xs space-y-1">
              {dialogue.slice(-2).map((dl, i) => (
                <p key={i} className="text-zinc-200">
                  <strong className={`${dl.sender === 'clinician' ? 'text-brand-gold' : 'text-zinc-400'}`}>
                    {dl.sender === 'clinician' ? 'Dr. Chen' : patient.name.split(' ')[0]}:
                  </strong>{' '}
                  <span className="italic">"{dl.text}"</span>
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Video Call controls */}
        <div className="flex justify-center items-center gap-3 bg-zinc-900 border border-white/5 p-3 rounded-2xl shrink-0">
          <button
            onClick={() => setMicActive(!micActive)}
            className={`p-3 rounded-xl transition-all active:scale-95 cursor-pointer ${
              micActive ? 'bg-zinc-800 text-white hover:bg-zinc-700' : 'bg-red-950 text-red-500 border border-red-900'
            }`}
          >
            {micActive ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
          </button>

          <button
            onClick={() => setVideoActive(!videoActive)}
            className={`p-3 rounded-xl transition-all active:scale-95 cursor-pointer ${
              videoActive ? 'bg-zinc-800 text-white hover:bg-zinc-700' : 'bg-red-950 text-red-500 border border-red-900'
            }`}
          >
            {videoActive ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
          </button>

          <button
            onClick={handleEndCall}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold text-xs flex items-center gap-2 shadow-lg hover:shadow-red-900/10 active:scale-95 cursor-pointer transition-all"
          >
            <PhoneOff className="h-4 w-4" />
            <span>End Call & Sync SOAP Note</span>
          </button>

          <button
            onClick={onCancel}
            className="text-zinc-400 hover:text-zinc-200 text-xs px-2.5 font-medium transition-colors"
          >
            Go Back
          </button>
        </div>

      </div>

      {/* RIGHT COLUMN: Interactive SOAP Notepad & Assessments (5 cols) */}
      <div className="lg:col-span-5 bg-zinc-900 rounded-3xl p-5 border border-white/5 flex flex-col justify-between space-y-4">
        
        {/* Intake assessment header */}
        <div className="space-y-1 border-b border-white/5 pb-3">
          <div className="flex items-center gap-1.5 text-brand-gold">
            <Clipboard className="h-4 w-4" />
            <h3 className="font-semibold text-sm">Clinical SOAP Intake Notekeeper</h3>
          </div>
          <p className="text-[10px] text-zinc-400">HIPAA compliant logging. Summaries are fed securely back to patient timeline records.</p>
        </div>

        {/* High-speed checklist items */}
        <div className="space-y-2.5">
          <span className="text-[10px] text-zinc-500 font-bold uppercase font-mono tracking-wider block">Intake Observations Checkins</span>
          
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setSomaticPresent(!somaticPresent)}
              className={`p-2.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                somaticPresent 
                  ? 'bg-brand-burgundy/20 border-brand-burgundy text-white' 
                  : 'bg-zinc-950 border-white/5 text-zinc-400 hover:bg-zinc-850'
              }`}
            >
              <span className="font-medium">Somatic Somatic Anxiety</span>
              <CheckSquare className={`h-4.5 w-4.5 ${somaticPresent ? 'text-brand-gold' : 'text-zinc-600'}`} />
            </button>

            <button
              onClick={() => setCognitiveDistortions(!cognitiveDistortions)}
              className={`p-2.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                cognitiveDistortions 
                  ? 'bg-brand-burgundy/20 border-brand-burgundy text-white' 
                  : 'bg-zinc-950 border-white/5 text-zinc-400 hover:bg-zinc-850'
              }`}
            >
              <span className="font-medium">Cognitive Distortions</span>
              <CheckSquare className={`h-4.5 w-4.5 ${cognitiveDistortions ? 'text-brand-gold' : 'text-zinc-600'}`} />
            </button>

            <button
              onClick={() => setRiskAssessment(!riskAssessment)}
              className={`p-2.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                riskAssessment 
                  ? 'bg-red-950/40 border-red-600 text-white' 
                  : 'bg-zinc-950 border-white/5 text-zinc-400 hover:bg-zinc-850'
              }`}
            >
              <span className="font-medium">Risk Concerns Spike</span>
              <AlertCircle className={`h-4.5 w-4.5 ${riskAssessment ? 'text-red-500' : 'text-zinc-600'}`} />
            </button>

            <button
              onClick={() => setPillCompliance(!pillCompliance)}
              className={`p-2.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                pillCompliance 
                  ? 'bg-brand-burgundy/20 border-brand-burgundy text-white' 
                  : 'bg-zinc-950 border-white/5 text-zinc-400 hover:bg-zinc-850'
              }`}
            >
              <span className="font-medium">SSRI Compliance ok</span>
              <CheckSquare className={`h-4.5 w-4.5 ${pillCompliance ? 'text-brand-gold' : 'text-zinc-600'}`} />
            </button>
          </div>
        </div>

        {/* Notebook editor */}
        <div className="flex-1 flex flex-col space-y-1 text-xs">
          <span className="text-[10px] text-zinc-500 font-bold uppercase font-mono tracking-wider block">Clinical Sessions Narrative Notes</span>
          <textarea
            value={sessionNotes}
            onChange={(e) => setSessionNotes(e.target.value)}
            className="flex-1 w-full bg-zinc-950 border border-white/10 rounded-2xl p-4 text-xs font-sans text-zinc-200 focus:outline-none focus:ring-1 focus:ring-brand-gold resize-none leading-relaxed min-h-[160px]"
            placeholder="Type observations, progress milestones, therapy homework assigned..."
          />
        </div>

        {/* Active AI Dialogue recommendation engine widget */}
        <div className="bg-brand-burgundy-light/5 border border-brand-burgundy/20 p-3.5 rounded-2xl text-[11px] text-zinc-300">
          <p className="font-semibold text-brand-gold flex items-center gap-1.5 mb-1 text-[11px]">
            <Sparkles className="h-4 w-4" />
            <span>AI Guided Call Interventions</span>
          </p>
          <ul className="space-y-1 list-disc list-inside text-zinc-400">
            <li>Suggest a subway anxiety exposure hierarchy blueprint.</li>
            <li>Inquire client if work boundaries draft is shared.</li>
          </ul>
        </div>

      </div>

    </div>
  );
}
