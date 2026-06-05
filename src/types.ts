/**
 * Unified Types for Therapy & Beyond HIPAA-compliant SaaS
 */

export type UserRole = 'patient' | 'clinician';

export interface User {
  id: string;
  role: UserRole;
  email: string;
  name: string;
  clinician_id?: string;
  avatar?: string;
}

export interface PatientDemographics {
  pronouns: string;
  occupation: string;
  maritalStatus: string;
  phone: string;
  emergencyContact: string;
}

export interface Patient {
  id: string;
  clinician_id: string;
  name: string;
  email: string;
  avatar: string;
  age: number;
  gender: string;
  demographics: PatientDemographics;
  streakDays: number;
  lastCheckInDate: string;
}

export interface CheckIn {
  id: string;
  patient_id: string;
  mood: number;      // 1 to 10
  anxiety: number;   // 1 to 10
  energy: number;    // 1 to 10
  sleepDuration: number; // in hours
  sleepQuality: 'Poor' | 'Fair' | 'Good' | 'Excellent';
  medicationTaken: boolean;
  significantEvent: string;
  notes: string;
  timestamp: string; // ISO String
}

export interface VoiceJournal {
  id: string;
  patient_id: string;
  transcript: string;
  audioDuration: string; // e.g., "0:45"
  timestamp: string; // ISO String
}

export interface Insight {
  id: string;
  patient_id: string;
  summary: string;
  themes: { name: string; percentage: number }[];
  recommendations: string[];
  suggestedDiscussionTopics: string[];
  lastUpdated: string;
}

export interface Session {
  id: string;
  patient_id: string;
  clinician_id: string;
  date: string;
  time: string;
  notes: string;
  status: 'scheduled' | 'completed' | 'canceled';
  type: 'In-Hand' | 'Telehealth';
}

export interface Message {
  id: string;
  patient_id: string;
  sender: 'patient' | 'clinician';
  text: string;
  timestamp: string;
  isCompletedExercise?: boolean; // HIPAA homework attachment
}

export type AlertSeverity = 'low' | 'medium' | 'high';

export interface Alert {
  id: string;
  patient_id: string;
  patientName: string;
  type: 'mood_drop' | 'missed_med' | 'anxiety_spike' | 'missed_checkin';
  message: string;
  severity: AlertSeverity;
  timestamp: string;
  resolved: boolean;
}
