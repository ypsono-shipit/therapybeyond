import { Patient, CheckIn, VoiceJournal, Insight, Session, Message, Alert } from './types';

// Clinic Clinician (Sarah Chen, PsyD)
export const CURRENT_CLINICIAN = {
  name: "Dr. Sarah Chen",
  title: "Clinical Psychologist, Psy.D.",
  avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200",
  email: "sarah.chen@therapyandbeyond.com",
  clinic: "Therapy & Beyond Downtown Practice"
};

// Initial Patient Set
export const INITIAL_PATIENTS: Patient[] = [
  {
    id: "pat_84219",
    clinician_id: "clin_01",
    name: "Alex Johnson",
    email: "alex.johnson@gmail.com",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200",
    age: 28,
    gender: "Male",
    demographics: {
      pronouns: "He / Him",
      occupation: "Software Engineer",
      maritalStatus: "Single",
      phone: "+1 (555) 381-9021",
      emergencyContact: "Clara Johnson (Mother) - +1 (555) 381-9022"
    },
    streakDays: 12,
    lastCheckInDate: "2026-06-04"
  },
  {
    id: "pat_70341",
    clinician_id: "clin_01",
    name: "Elena Garcia",
    email: "elena.garcia@outlook.com",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
    age: 34,
    gender: "Female",
    demographics: {
      pronouns: "She / Her",
      occupation: "Marketing Director",
      maritalStatus: "Married",
      phone: "+1 (555) 293-8411",
      emergencyContact: "Roberto Garcia (Spouse) - +1 (555) 293-8412"
    },
    streakDays: 5,
    lastCheckInDate: "2026-06-04"
  },
  {
    id: "pat_52914",
    clinician_id: "clin_01",
    name: "Michael Chang",
    email: "michael.chang@gmail.com",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    age: 42,
    gender: "Male",
    demographics: {
      pronouns: "He / Him",
      occupation: "High School Teacher",
      maritalStatus: "Divorced",
      phone: "+1 (555) 732-1592",
      emergencyContact: "Sania Chang (Sister) - +1 (555) 732-1598"
    },
    streakDays: 18,
    lastCheckInDate: "2026-06-05"
  }
];

// Rich History of CheckIns for Alex Johnson (to build recharts graphs)
export const INITIAL_CHECKINS: CheckIn[] = [
  // Alex Johnson (pat_84219) Check-ins (latest 7 days)
  {
    id: "ch_alex_01",
    patient_id: "pat_84219",
    mood: 4,
    anxiety: 8,
    energy: 5,
    sleepDuration: 5.5,
    sleepQuality: "Poor",
    medicationTaken: false,
    significantEvent: "Workplace conflict with manager regarding project deadlines",
    notes: "Had a tense meeting with my manager. Felt singled out and stressed. My heart was pounding for an hour afterwards.",
    timestamp: "2026-06-04T09:30:00Z"
  },
  {
    id: "ch_alex_02",
    patient_id: "pat_84219",
    mood: 5,
    anxiety: 7,
    energy: 4,
    sleepDuration: 6.0,
    sleepQuality: "Fair",
    medicationTaken: true,
    significantEvent: "Woke up early with sudden breathing tightness",
    notes: "Felt. okay but tired. Busy day at work but grateful for lunch with Sam. Trying to practice deep breathing.",
    timestamp: "2026-06-03T09:20:00Z"
  },
  {
    id: "ch_alex_03",
    patient_id: "pat_84219",
    mood: 4,
    anxiety: 8,
    energy: 4,
    sleepDuration: 5.0,
    sleepQuality: "Poor",
    medicationTaken: false,
    significantEvent: "Missed morning alarm, felt rushed",
    notes: "Spiked panic episode on the subway today. Too crowded. Had to exit two stops early and walk in the cold.",
    timestamp: "2026-06-02T08:45:00Z"
  },
  {
    id: "ch_alex_04",
    patient_id: "pat_84219",
    mood: 5,
    anxiety: 6,
    energy: 5,
    sleepDuration: 6.5,
    sleepQuality: "Fair",
    medicationTaken: true,
    significantEvent: "Dinner with family",
    notes: "A bit better. Talked to my mom which calmed me down. Still dreading logging into work tomorrow.",
    timestamp: "2026-06-01T09:15:00Z"
  },
  {
    id: "ch_alex_05",
    patient_id: "pat_84219",
    mood: 6,
    anxiety: 5,
    energy: 6,
    sleepDuration: 7.0,
    sleepQuality: "Good",
    medicationTaken: true,
    significantEvent: "Went for a run",
    notes: "Sunday run helped clear my head. Slept slightly better last night.",
    timestamp: "2026-05-31T10:00:00Z"
  },
  {
    id: "ch_alex_06",
    patient_id: "pat_84219",
    mood: 4,
    anxiety: 9,
    energy: 3,
    sleepDuration: 4.5,
    sleepQuality: "Poor",
    medicationTaken: true,
    significantEvent: "Panic attack late night",
    notes: "Had a terrible panic episode at 2 AM. Thought I couldn't breathe. Took some water and tried ground exercise.",
    timestamp: "2026-05-30T09:00:00Z"
  },
  {
    id: "ch_alex_07",
    patient_id: "pat_84219",
    mood: 5,
    anxiety: 7,
    energy: 5,
    sleepDuration: 6.0,
    sleepQuality: "Fair",
    medicationTaken: true,
    significantEvent: "Late-night bug in system",
    notes: "Stayed up until midnight resolving a deployment bug. Brain was buzzing, couldn't power off easily.",
    timestamp: "2026-05-29T08:50:00Z"
  },

  // Elena Garcia (pat_70341) Check-ins
  {
    id: "ch_elena_01",
    patient_id: "pat_70341",
    mood: 3,
    anxiety: 9,
    energy: 4,
    sleepDuration: 4.0,
    sleepQuality: "Poor",
    medicationTaken: true,
    significantEvent: "Major presentation scheduled next week",
    notes: "Extremely overwhelmed with the upcoming corporate marketing launch. Feeling physically sick from tension.",
    timestamp: "2026-06-04T07:15:00Z"
  },
  {
    id: "ch_elena_02",
    patient_id: "pat_70341",
    mood: 4,
    anxiety: 8,
    energy: 5,
    sleepDuration: 5.0,
    sleepQuality: "Fair",
    medicationTaken: true,
    significantEvent: "Conflict with partner",
    notes: "Husband tried to support me but I snapped. Feeling guilty and isolated now.",
    timestamp: "2026-06-03T07:45:00Z"
  },
  {
    id: "ch_elena_03",
    patient_id: "pat_70341",
    mood: 3,
    anxiety: 10,
    energy: 3,
    sleepDuration: 3.5,
    sleepQuality: "Poor",
    medicationTaken: false,
    significantEvent: "Severe panic attack during a meeting",
    notes: "Had to turn off my camera during the QBR because my chest clamped up and I started shaking.",
    timestamp: "2026-06-02T08:00:00Z"
  },

  // Michael Chang (pat_52914) Check-ins (Steady/Optimistic recovery)
  {
    id: "ch_michael_01",
    patient_id: "pat_52914",
    mood: 8,
    anxiety: 3,
    energy: 7,
    sleepDuration: 7.5,
    sleepQuality: "Excellent",
    medicationTaken: true,
    significantEvent: "Graded finals, semester winding down",
    notes: "Spoke with my students today; felt highly connected and useful. Practiced CBT thought records in the evening.",
    timestamp: "2026-06-05T08:30:00Z"
  },
  {
    id: "ch_michael_02",
    patient_id: "pat_52914",
    mood: 7,
    anxiety: 4,
    energy: 8,
    sleepDuration: 7.0,
    sleepQuality: "Good",
    medicationTaken: true,
    significantEvent: "Dinner with fellow teachers",
    notes: "Pleasant social contact. Felt minimal hesitation or depressive withdrawal. Sleep has stabilized completely.",
    timestamp: "2026-06-04T09:10:00Z"
  }
];

// Voice journals
export const INITIAL_JOURNALS: VoiceJournal[] = [
  {
    id: "vj_01",
    patient_id: "pat_84219",
    transcript: "I've been feeling this constant pressure at the center of my chest, especially around 2 PM when my manager messages me on Slack. It's like my brain automatically jumps to 'you are about to be fired' even though I completed my deliverables. Trying to use the box breathing we talked about during the last session. It helps for a few minutes but then the racing thoughts return.",
    audioDuration: "1:15",
    timestamp: "2026-06-04T20:45:00Z"
  },
  {
    id: "vj_02",
    patient_id: "pat_84219",
    transcript: "Had a difficult talk with Clara today. She wants to visit but I feel so drained that the thought of playing host feels completely impossible. I don't want to hurt her feelings so I just made an excuse. I feel extremely guilty about avoiding people.",
    audioDuration: "0:45",
    timestamp: "2026-06-02T22:10:00Z"
  },
  {
    id: "vj_03",
    patient_id: "pat_70341",
    transcript: "The launch is consuming absolutely every second of my life. I haven't cooked a proper meal in almost two weeks. I survived on energy drinks and takeout. I can literally hear my heartbeat in my ears when I try to lay down to sleep. I'm afraid I'm breaking down.",
    audioDuration: "2:05",
    timestamp: "2026-06-04T11:30:00Z"
  }
];

// Professional clinical summaries & AI analysis
export const INITIAL_INSIGHTS: Insight[] = [
  {
    id: "in_01",
    patient_id: "pat_84219",
    summary: "Alex's mood has declined 18% over the last 2 weeks, showing high negative correlation with work stress and manager interaction. He experienced 3 severe panic episodes (specifically triggered on the subway and during midday Slack standups). He reported difficulty falling asleep and missed his prescribed SSRI medication twice due to severe sleep-schedule fragmentation.",
    themes: [
      { name: "Work Stress", percentage: 43 },
      { name: "Relationships", percentage: 28 },
      { name: "Anxiety & Somatic Spikes", percentage: 17 },
      { name: "Sleep Issues", percentage: 12 }
    ],
    recommendations: [
      "Process the May 12 manager confrontation and explore somatic containment tools (therapist-designed box breathing, ice-water sensory shock) for subway transit anxiety.",
      "Evaluate SSRI compliance barriers (pill box or automated phone notifications).",
      "Address systemic work boundaries (turning off Slack notifications past 7 PM)."
    ],
    suggestedDiscussionTopics: [
      "Subway subway panic & step-by-step physical ground checklist.",
      "Workplace boundaries: managing catastrophic thoughts aroundSlack communication.",
      "Medication routine anchoring with morning coffee."
    ],
    lastUpdated: "2026-06-04T22:00:00Z"
  },
  {
    id: "in_02",
    patient_id: "pat_70341",
    summary: "Elena is exhibiting severe somatic symptoms of stress overload. Sleep quality has decayed to 'Poor' with average sleep duration dropping to 4.1 hours. High anxiety spikes are strongly coupled with partner withdrawal and launch preparation. Immediate intervention for burnout prevention and panic de-escalation is indicated.",
    themes: [
      { name: "Workplace Burnout", percentage: 55 },
      { name: "Relational Tension", percentage: 25 },
      { name: "Panic Vulnerability", percentage: 20 }
    ],
    recommendations: [
      "Review urgent somatic downregulation protocols (5-4-3-2-1 technique).",
      "Draft a strict daily rest period outline with her partner Roberto to re-establish secure conversational space.",
      "Explore clinical leave options if project load does not diminish post-launch."
    ],
    suggestedDiscussionTopics: [
      "Hyperarousal & physical warning signs of an impending panic attack.",
      "Healthy boundary setting with the management team regarding timeline extensions.",
      "Co-regulation exercises to share with her husband."
    ],
    lastUpdated: "2026-06-04T12:00:00Z"
  },
  {
    id: "in_03",
    patient_id: "pat_52914",
    summary: "Michael is showing highly favorable therapeutic response. Clinical scores reflect high mood stability (average 7.5), excellent therapeutic Homework compliance, and balanced sleep. Anxious thoughts around summer empty-nest syndrome are present but actively managed via CBT logs.",
    themes: [
      { name: "CBT Skill Integration", percentage: 45 },
      { name: "Social Connection", percentage: 35 },
      { name: "Existential Purpose", percentage: 20 }
    ],
    recommendations: [
      "Reinforce active cognitive restructuring techniques.",
      "Encourage continued local volunteer and teaching community engagement during empty-nest transition.",
      "Spindle down to bi-weekly sessions if progress persists through July."
    ],
    suggestedDiscussionTopics: [
      "Reflecting on the successful graduation cycle and teacher community dinners.",
      "Expanding on CBT logs to address occasional future-oriented worry loops.",
      "Transition planning for bi-weekly check-ins."
    ],
    lastUpdated: "2026-06-05T09:00:00Z"
  }
];

// Sessions (Scheduling & Clinical records)
export const INITIAL_SESSIONS: Session[] = [
  {
    id: "ses_01",
    patient_id: "pat_84219",
    clinician_id: "clin_01",
    date: "2026-06-08",
    time: "10:30 AM",
    notes: "Session scheduled to address recent workspace trigger, subway panic, and somatic coping strategies.",
    status: "scheduled",
    type: "Telehealth"
  },
  {
    id: "ses_02",
    patient_id: "pat_84219",
    clinician_id: "clin_01",
    date: "2026-05-25",
    time: "10:30 AM",
    notes: "Explored CBT thought challenging for catastrophic work fears. Patient agreed to complete breathing logs. SSRI restarted with mild nausea side effect.",
    status: "completed",
    type: "In-Hand"
  },
  {
    id: "ses_03",
    patient_id: "pat_70341",
    clinician_id: "clin_01",
    date: "2026-06-09",
    time: "02:00 PM",
    notes: "Urgent session setup for somatic feedback and work boundary mapping.",
    status: "scheduled",
    type: "Telehealth"
  },
  {
    id: "ses_04",
    patient_id: "pat_52914",
    clinician_id: "clin_01",
    date: "2026-06-11",
    time: "11:00 AM",
    notes: "Continuing maintenance therapy and transition planning.",
    status: "scheduled",
    type: "Telehealth"
  }
];

// Secure messages (HIPAA compliant E2EE)
export const INITIAL_MESSAGES: Message[] = [
  {
    id: "msg_alex_01",
    patient_id: "pat_84219",
    sender: "clinician",
    text: "Hi Alex, I reviewed your voice journal regarding the subway distress today. Let's make sure to explore the subway ground hierarchy first thing during our session on Monday. In the meantime, try to download and read the Grounding Exercise sheet I'm attaching here.",
    timestamp: "2026-06-04T14:30:00Z"
  },
  {
    id: "msg_alex_02",
    patient_id: "pat_84219",
    sender: "patient",
    text: "Thank you Dr. Chen. I downloaded the sheet and tried the 5-4-3-2-1 technique on my walk home. It helped me stay focused on my immediate surroundings instead of feeling like the sidewalk was tilting. I compiled the meditation log as well.",
    timestamp: "2026-06-04T16:15:00Z",
    isCompletedExercise: true
  },
  {
    id: "msg_alex_03",
    patient_id: "pat_84219",
    sender: "clinician",
    text: "That is marvelous pacing! Noticing the tilting sensation is a classic vestibular response to hypervigilance; you dealt with it perfectly. Try to anchor your visual focus on stationary poles or signs during subway travel tomorrow.",
    timestamp: "2026-06-04T17:00:00Z"
  },
  {
    id: "msg_elena_01",
    patient_id: "pat_70341",
    sender: "clinician",
    text: "Elena, I noticed a significant anxiety spike and sleep drop in your check-in today. We have a telehealth call scheduled for next Tuesday, but if you feel you need high-priority co-regulation, please send a message or request an earlier opening.",
    timestamp: "2026-06-04T12:35:00Z"
  },
  {
    id: "msg_elena_02",
    patient_id: "pat_70341",
    sender: "patient",
    text: "Thanks Dr. Chen. I am trying to push through this week since the final release is Wednesday. I might need a quick 15-minute phone check-in on Monday if things worsen.",
    timestamp: "2026-06-04T13:00:00Z"
  }
];

// Active Clinical alerts
export const INITIAL_ALERTS: Alert[] = [
  {
    id: "alt_01",
    patient_id: "pat_84219",
    patientName: "Alex Johnson",
    type: "anxiety_spike",
    message: "Reported subway somatic panic spike & severe heart racing episode on subway transit.",
    severity: "medium",
    timestamp: "2026-06-04T09:30:00Z",
    resolved: false
  },
  {
    id: "alt_02",
    patient_id: "pat_84219",
    patientName: "Alex Johnson",
    type: "missed_med",
    message: "Missed clinical medication adherence twice over a 3-day window.",
    severity: "medium",
    timestamp: "2026-06-04T09:30:00Z",
    resolved: false
  },
  {
    id: "alt_03",
    patient_id: "pat_70341",
    patientName: "Elena Garcia",
    type: "mood_drop",
    message: "Critical mood index decline (down 32%) followed by severe sleep decay (<4 hours).",
    severity: "high",
    timestamp: "2026-06-04T07:15:00Z",
    resolved: false
  },
  {
    id: "alt_04",
    patient_id: "pat_70341",
    patientName: "Elena Garcia",
    type: "anxiety_spike",
    message: "Severe corporate boardroom panic occurrence accompanied by rapid hyperventilation.",
    severity: "high",
    timestamp: "2026-06-02T08:00:00Z",
    resolved: false
  }
];
