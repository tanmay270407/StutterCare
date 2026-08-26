export type UserRole = 'patient' | 'therapist' | 'admin';

export type PatientConnectionStatus = 'connected' | 'ai_fallback' | 'waitlisted';

export type SessionTag = 'AI-guided — needs review' | 'Reviewed' | 'Flagged by patient';

export interface Exercise {
  id: string;
  title: string;
  tier: 1 | 2; // 1 = Individualized/Clinician assigned, 2 = General/Safe AI-fallback
  category: 'gentle_onset' | 'paced_speech' | 'prolonged_speech' | 'breathing' | 'reading' | 'custom';
  description: string;
  instructions: string[];
  samplePrompt: string;
  approvedForUnsupervised: boolean;
  approvedBy?: string;
  approvalDate?: string;
  targetFrequency?: string; // e.g. "3x / week"
  assignedByTherapist?: string;
  durationMinutes: number;
}

export interface SpeechMetrics {
  pauses: number;
  repetitions: number;
  prolongations: number;
  speechRateWpm: number;
}

export interface SessionRating {
  comfort: number; // 1-5
  effort: number; // 1-5
  confidence: number; // 1-5
  anxiety: number; // 1-5
}

export interface PracticeSessionRecord {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  exerciseId: string;
  exerciseTitle: string;
  promptText: string;
  durationSeconds: number;
  source: 'plan' | 'library';
  aiFeedbackSummary: string;
  aiObservations: string[];
  originalMetrics: SpeechMetrics;
  correctedMetrics?: SpeechMetrics;
  correctedBy?: string;
  correctedAt?: string;
  status: SessionTag;
  ratings: SessionRating;
  isFlagged: boolean;
  flagReason?: string;
  audioDuration: string;
}

export interface PatientProfile {
  id: string;
  name: string;
  age: number;
  preferredLanguage: string;
  therapyGoals: string[];
  intakeAnswers: Record<string, string>;
  hasConsent: boolean;
  consentTimestamp?: string;
  isMinor: boolean;
  guardianName?: string;
  guardianEmail?: string;
  guardianConsentTimestamp?: string;
  status: PatientConnectionStatus;
  assignedTherapistId?: string;
  assignedTherapistName?: string;
  lastSessionDate?: string;
  weeklyGoalTarget: number;
  weeklyGoalCompleted: number;
}

export interface TherapistProfile {
  id: string;
  name: string;
  title: string;
  licenseNumber: string;
  licenseBody: string;
  verificationStatus: 'verified' | 'pending_verification' | 'rejected';
  bio: string;
  specialization: string;
  assignedPatientCount: number;
  pendingReviewCount: number;
}

export interface ClinicalNote {
  id: string;
  patientId: string;
  therapistId: string;
  therapistName: string;
  timestamp: string;
  noteType: 'SOAP' | 'Observation' | 'Check-in' | 'Milestone';
  content: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  therapistId: string;
  therapistName: string;
  date: string;
  time: string;
  type: 'Video Telehealth' | 'Plan Consultation' | 'Monthly Review';
  status: 'upcoming' | 'completed' | 'cancelled';
  meetLink?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: UserRole | 'system';
  action: string;
  details: string;
  severity: 'info' | 'notice' | 'attention';
}

export interface AppNotification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'amber';
  timestamp: string;
}
