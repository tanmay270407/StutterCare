import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  UserRole,
  PatientProfile,
  TherapistProfile,
  Exercise,
  PracticeSessionRecord,
  ClinicalNote,
  Appointment,
  AuditLogEntry,
  AppNotification,
  PatientConnectionStatus,
  SpeechMetrics
} from '../types';
import {
  INITIAL_PATIENTS,
  INITIAL_THERAPISTS,
  INITIAL_TIER_1_EXERCISES,
  INITIAL_TIER_2_EXERCISES,
  INITIAL_SESSIONS,
  INITIAL_CLINICAL_NOTES,
  INITIAL_APPOINTMENTS,
  INITIAL_AUDIT_LOGS
} from '../data/mockData';

interface AppContextType {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  activePatientId: string;
  setActivePatientId: (id: string) => void;
  activeTherapistId: string;
  setActiveTherapistId: (id: string) => void;
  
  // Data lists
  patients: PatientProfile[];
  currentPatient: PatientProfile;
  therapists: TherapistProfile[];
  currentTherapist: TherapistProfile;
  tier1Exercises: Exercise[];
  tier2Exercises: Exercise[];
  sessions: PracticeSessionRecord[];
  clinicalNotes: ClinicalNote[];
  appointments: Appointment[];
  auditLogs: AuditLogEntry[];
  notifications: AppNotification[];
  
  // Patient sub-view navigation
  patientActiveTab: 'home' | 'practice' | 'library' | 'plan' | 'progress' | 'appointments' | 'settings';
  setPatientActiveTab: (tab: 'home' | 'practice' | 'library' | 'plan' | 'progress' | 'appointments' | 'settings') => void;
  
  // Actions
  switchRole: (role: UserRole) => void;
  setPatientConnectionStatus: (patientId: string, status: PatientConnectionStatus) => void;
  checkTherapistAvailability: (patientId: string) => void;
  addPracticeSession: (sessionData: Omit<PracticeSessionRecord, 'id'>) => string;
  flagSession: (sessionId: string, reason?: string) => void;
  correctSessionMetrics: (sessionId: string, metrics: SpeechMetrics, correctedBy: string) => void;
  addClinicalNote: (note: Omit<ClinicalNote, 'id' | 'timestamp'>) => void;
  addTier1Exercise: (exercise: Omit<Exercise, 'id' | 'tier'>) => void;
  removeTier1Exercise: (id: string) => void;
  toggleTier2Approval: (id: string, approved: boolean, signerName: string) => void;
  verifyTherapistCredential: (therapistId: string, status: 'verified' | 'rejected') => void;
  bookAppointment: (data: Omit<Appointment, 'id' | 'status'>) => void;
  cancelAppointment: (id: string) => void;
  updatePatientConsent: (patientId: string, hasConsent: boolean, guardian?: { name: string; email: string }) => void;
  updatePatientProfile: (patientId: string, updates: Partial<PatientProfile>) => void;
  deletePatientData: (patientId: string) => void;
  
  // Toast & Notifications
  addNotification: (message: string, type?: 'info' | 'success' | 'amber') => void;
  removeNotification: (id: string) => void;
  
  // Active practice launcher helper
  selectedExerciseForPractice: Exercise | null;
  setSelectedExerciseForPractice: (exercise: Exercise | null) => void;
  
  // Reset demo
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>('patient');
  const [activePatientId, setActivePatientId] = useState<string>('pat-1');
  const [activeTherapistId, setActiveTherapistId] = useState<string>('th-1');
  const [patientActiveTab, setPatientActiveTab] = useState<'home' | 'practice' | 'library' | 'plan' | 'progress' | 'appointments' | 'settings'>('home');
  const [selectedExerciseForPractice, setSelectedExerciseForPractice] = useState<Exercise | null>(null);

  // Entities stored in state
  const [patients, setPatients] = useState<PatientProfile[]>(() => {
    const saved = localStorage.getItem('stuttercare_patients');
    return saved ? JSON.parse(saved) : INITIAL_PATIENTS;
  });

  const [therapists, setTherapists] = useState<TherapistProfile[]>(() => {
    const saved = localStorage.getItem('stuttercare_therapists');
    return saved ? JSON.parse(saved) : INITIAL_THERAPISTS;
  });

  const [tier1Exercises, setTier1Exercises] = useState<Exercise[]>(() => {
    const saved = localStorage.getItem('stuttercare_tier1');
    if (saved) {
      try {
        const parsed: Exercise[] = JSON.parse(saved);
        return parsed.map(ex => (ex.id === 't1-1' ? INITIAL_TIER_1_EXERCISES[0] : ex));
      } catch (e) {
        return INITIAL_TIER_1_EXERCISES;
      }
    }
    return INITIAL_TIER_1_EXERCISES;
  });

  const [tier2Exercises, setTier2Exercises] = useState<Exercise[]>(() => {
    const saved = localStorage.getItem('stuttercare_tier2');
    return saved ? JSON.parse(saved) : INITIAL_TIER_2_EXERCISES;
  });

  const [sessions, setSessions] = useState<PracticeSessionRecord[]>(() => {
    const saved = localStorage.getItem('stuttercare_sessions');
    return saved ? JSON.parse(saved) : INITIAL_SESSIONS;
  });

  const [clinicalNotes, setClinicalNotes] = useState<ClinicalNote[]>(() => {
    const saved = localStorage.getItem('stuttercare_notes');
    return saved ? JSON.parse(saved) : INITIAL_CLINICAL_NOTES;
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('stuttercare_appointments');
    if (saved) {
      try {
        const parsed: Appointment[] = JSON.parse(saved);
        return parsed.filter(a => a.id !== 'apt-1');
      } catch (e) {
        return INITIAL_APPOINTMENTS;
      }
    }
    return INITIAL_APPOINTMENTS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => {
    const saved = localStorage.getItem('stuttercare_audit_logs');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'init-notif',
      message: 'Welcome to StutterCare. Calm, non-diagnostic speech support environment ready.',
      type: 'info',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  // Persist to local storage
  useEffect(() => {
    localStorage.setItem('stuttercare_patients', JSON.stringify(patients));
  }, [patients]);
  useEffect(() => {
    localStorage.setItem('stuttercare_therapists', JSON.stringify(therapists));
  }, [therapists]);
  useEffect(() => {
    localStorage.setItem('stuttercare_tier1', JSON.stringify(tier1Exercises));
  }, [tier1Exercises]);
  useEffect(() => {
    localStorage.setItem('stuttercare_tier2', JSON.stringify(tier2Exercises));
  }, [tier2Exercises]);
  useEffect(() => {
    localStorage.setItem('stuttercare_sessions', JSON.stringify(sessions));
  }, [sessions]);
  useEffect(() => {
    localStorage.setItem('stuttercare_notes', JSON.stringify(clinicalNotes));
  }, [clinicalNotes]);
  useEffect(() => {
    localStorage.setItem('stuttercare_appointments', JSON.stringify(appointments));
  }, [appointments]);
  useEffect(() => {
    localStorage.setItem('stuttercare_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  const currentPatient = patients.find(p => p.id === activePatientId) || patients[0];
  const currentTherapist = therapists.find(t => t.id === activeTherapistId) || therapists[0];

  const addNotification = (message: string, type: 'info' | 'success' | 'amber' = 'info') => {
    const newNotif: AppNotification = {
      id: 'notif-' + Date.now() + Math.random().toString(36).substring(2, 5),
      message,
      type,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setNotifications(prev => [newNotif, ...prev.slice(0, 5)]);

    // Auto dismiss after 6 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== newNotif.id));
    }, 6000);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const logAudit = (actor: string, actorRole: UserRole | 'system', action: string, details: string, severity: 'info' | 'notice' | 'attention' = 'info') => {
    const entry: AuditLogEntry = {
      id: 'aud-' + Date.now(),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actor,
      actorRole,
      action,
      details,
      severity
    };
    setAuditLogs(prev => [entry, ...prev]);
  };

  const switchRole = (role: UserRole) => {
    setCurrentRole(role);
    const roleLabels = {
      patient: 'Patient Portal',
      therapist: 'Therapist & SLP Portal',
      admin: 'Administration Portal'
    };
    addNotification(`Switched view to ${roleLabels[role]}.`, 'info');
  };

  const setPatientConnectionStatus = (patientId: string, status: PatientConnectionStatus) => {
    setPatients(prev =>
      prev.map(p => {
        if (p.id === patientId) {
          const isNowConnected = status === 'connected';
          const therapist = therapists.find(t => t.verificationStatus === 'verified');
          const updated = {
            ...p,
            status,
            assignedTherapistId: isNowConnected ? (therapist?.id || 'th-1') : undefined,
            assignedTherapistName: isNowConnected ? (therapist?.name || 'Dr. Kavya Rao, PhD, CCC-SLP') : undefined
          };
          return updated;
        }
        return p;
      })
    );

    const statusDescriptions: Record<PatientConnectionStatus, string> = {
      connected: 'Connected to Clinician (Dr. Kavya Rao)',
      ai_fallback: 'AI-Guided Practice Mode (Clinician Unavailable)',
      waitlisted: 'Waitlist Registered (Awaiting Matching)'
    };

    addNotification(`Mode updated: ${statusDescriptions[status]}`, status === 'connected' ? 'success' : 'amber');
    logAudit(`System / User Switch`, 'system', 'MODE_TRANSITION', `Patient ${patientId} mode shifted to ${status}`);
  };

  const checkTherapistAvailability = (patientId: string) => {
    const target = patients.find(p => p.id === patientId);
    if (!target) return;

    if (target.status === 'ai_fallback' || target.status === 'waitlisted') {
      // Simulate finding a clinician
      setPatientConnectionStatus(patientId, 'connected');
      addNotification('Therapist match found! You are now connected with Dr. Kavya Rao, PhD, CCC-SLP.', 'success');
    } else {
      // Toggle to AI fallback to demonstrate the change
      setPatientConnectionStatus(patientId, 'ai_fallback');
      addNotification('Switched to AI-guided safe practice mode.', 'amber');
    }
  };

  const addPracticeSession = (sessionData: Omit<PracticeSessionRecord, 'id'>) => {
    const newId = 'sess-' + (sessions.length + 101) + '-' + Math.floor(Math.random() * 100);
    const newSession: PracticeSessionRecord = {
      ...sessionData,
      id: newId
    };

    setSessions(prev => [newSession, ...prev]);

    // Update patient's weekly goal completion and last session date
    setPatients(prev =>
      prev.map(p => {
        if (p.id === sessionData.patientId) {
          return {
            ...p,
            lastSessionDate: new Date().toISOString().substring(0, 10),
            weeklyGoalCompleted: Math.min(p.weeklyGoalTarget, p.weeklyGoalCompleted + 1)
          };
        }
        return p;
      })
    );

    logAudit(
      sessionData.patientName,
      'patient',
      'PRACTICE_RECORDED',
      `Recorded audio session for exercise "${sessionData.exerciseTitle}" (${sessionData.source === 'plan' ? 'Tier 1 Plan' : 'Tier 2 Library'}).`
    );

    return newId;
  };

  const flagSession = (sessionId: string, reason: string = 'User requested clinical review of AI feedback metrics.') => {
    setSessions(prev =>
      prev.map(s => {
        if (s.id === sessionId) {
          return {
            ...s,
            isFlagged: true,
            status: 'Flagged by patient',
            flagReason: reason
          };
        }
        return s;
      })
    );

    addNotification('Feedback flagged and sent to a human reviewer (Speech-Language Pathologist).', 'info');
    logAudit('Patient', 'patient', 'FEEDBACK_FLAGGED', `Session ${sessionId} flagged with reason: "${reason}"`, 'notice');
  };

  const correctSessionMetrics = (sessionId: string, metrics: SpeechMetrics, correctedBy: string) => {
    setSessions(prev =>
      prev.map(s => {
        if (s.id === sessionId) {
          return {
            ...s,
            correctedMetrics: metrics,
            correctedBy,
            correctedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
            status: 'Reviewed'
          };
        }
        return s;
      })
    );

    addNotification(`Session #${sessionId} metrics adjusted by ${correctedBy}. Original AI data preserved for audit.`, 'success');
    logAudit(
      correctedBy,
      'therapist',
      'METRIC_OVERWRITE',
      `Corrected speech metrics for session ${sessionId}. Original AI metrics retained in record.`
    );
  };

  const addClinicalNote = (note: Omit<ClinicalNote, 'id' | 'timestamp'>) => {
    const newNote: ClinicalNote = {
      ...note,
      id: 'note-' + Date.now(),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    setClinicalNotes(prev => [newNote, ...prev]);
    addNotification('Clinical progress note saved to patient file.', 'success');
    logAudit(note.therapistName, 'therapist', 'CLINICAL_NOTE_SAVED', `Added ${note.noteType} note for patient ${note.patientId}.`);
  };

  const addTier1Exercise = (exercise: Omit<Exercise, 'id' | 'tier'>) => {
    const newEx: Exercise = {
      ...exercise,
      id: 't1-' + Date.now(),
      tier: 1,
      approvedForUnsupervised: false
    };

    setTier1Exercises(prev => [...prev, newEx]);
    addNotification(`Added individualized exercise "${exercise.title}" to patient plan.`, 'success');
    logAudit(exercise.assignedByTherapist || 'Therapist', 'therapist', 'TIER1_EXERCISE_ADDED', `Created individualized exercise "${exercise.title}".`);
  };

  const removeTier1Exercise = (id: string) => {
    const ex = tier1Exercises.find(e => e.id === id);
    setTier1Exercises(prev => prev.filter(e => e.id !== id));
    addNotification(`Removed exercise "${ex?.title || id}" from plan.`, 'info');
    logAudit('Therapist', 'therapist', 'TIER1_EXERCISE_REMOVED', `Removed individualized exercise ID: ${id}`);
  };

  const toggleTier2Approval = (id: string, approved: boolean, signerName: string) => {
    setTier2Exercises(prev =>
      prev.map(e => {
        if (e.id === id) {
          return {
            ...e,
            approvedForUnsupervised: approved,
            approvedBy: approved ? signerName : undefined,
            approvalDate: approved ? new Date().toISOString().substring(0, 10) : undefined
          };
        }
        return e;
      })
    );

    addNotification(
      approved
        ? `Tier 2 Exercise marked as "Approved for unsupervised AI use".`
        : `Tier 2 Exercise approval revoked.`,
      approved ? 'success' : 'amber'
    );

    logAudit(
      signerName,
      'admin',
      'TIER2_APPROVAL_CHANGE',
      `Exercise ${id} unsupervised approval set to ${approved} by ${signerName}.`,
      approved ? 'info' : 'notice'
    );
  };

  const verifyTherapistCredential = (therapistId: string, status: 'verified' | 'rejected') => {
    setTherapists(prev =>
      prev.map(t => {
        if (t.id === therapistId) {
          return { ...t, verificationStatus: status };
        }
        return t;
      })
    );

    const therapist = therapists.find(t => t.id === therapistId);
    addNotification(
      status === 'verified'
        ? `Therapist ${therapist?.name} has been verified.`
        : `Therapist ${therapist?.name} application marked as rejected.`,
      status === 'verified' ? 'success' : 'amber'
    );

    logAudit('Admin Portal', 'admin', 'THERAPIST_VERIFICATION', `Therapist ${therapistId} verification set to ${status}.`);
  };

  const bookAppointment = (data: Omit<Appointment, 'id' | 'status'>) => {
    const newApt: Appointment = {
      ...data,
      id: 'apt-' + Date.now(),
      status: 'upcoming',
      meetLink: 'https://stuttercare.health/telehealth/room-' + Math.random().toString(36).substring(2, 8)
    };

    setAppointments(prev => [newApt, ...prev]);
    addNotification(`Appointment booked for ${data.date} at ${data.time}.`, 'success');
    logAudit(data.patientName, 'patient', 'APPOINTMENT_BOOKED', `Booked ${data.type} with ${data.therapistName}.`);
  };

  const cancelAppointment = (id: string) => {
    const apt = appointments.find(a => a.id === id);
    setAppointments(prev => prev.filter(a => a.id !== id));
    addNotification('Session removed from schedule.', 'info');
    if (apt) {
      logAudit(apt.patientName, 'patient', 'APPOINTMENT_CANCELLED', `Cancelled session with ${apt.therapistName} on ${apt.date}.`);
    }
  };

  const updatePatientConsent = (patientId: string, hasConsent: boolean, guardian?: { name: string; email: string }) => {
    setPatients(prev =>
      prev.map(p => {
        if (p.id === patientId) {
          const isMinor = p.isMinor || p.age < 18;
          return {
            ...p,
            hasConsent,
            consentTimestamp: hasConsent ? new Date().toISOString() : undefined,
            guardianName: guardian?.name || p.guardianName,
            guardianEmail: guardian?.email || p.guardianEmail,
            guardianConsentTimestamp: (isMinor && hasConsent) ? new Date().toISOString() : p.guardianConsentTimestamp
          };
        }
        return p;
      })
    );

    addNotification('Consent and privacy preferences updated.', 'success');
    logAudit(
      patientId,
      'patient',
      hasConsent ? 'CONSENT_GRANTED' : 'CONSENT_REVOKED',
      `Audio processing and storage consent state: ${hasConsent}${guardian ? ` (Guardian: ${guardian.name})` : ''}`
    );
  };

  const updatePatientProfile = (patientId: string, updates: Partial<PatientProfile>) => {
    setPatients(prev =>
      prev.map(p => {
        if (p.id === patientId) {
          return { ...p, ...updates };
        }
        return p;
      })
    );
    addNotification('Patient profile preferences saved.', 'info');
  };

  const deletePatientData = (patientId: string) => {
    // Remove all session audio records for this patient
    setSessions(prev => prev.filter(s => s.patientId !== patientId));
    // Clear clinical notes
    setClinicalNotes(prev => prev.filter(n => n.patientId !== patientId));
    // Clear appointments
    setAppointments(prev => prev.filter(a => a.patientId !== patientId));

    // Reset patient progress metrics
    setPatients(prev =>
      prev.map(p => {
        if (p.id === patientId) {
          return {
            ...p,
            lastSessionDate: undefined,
            weeklyGoalCompleted: 0
          };
        }
        return p;
      })
    );

    addNotification('All audio recordings and session logs deleted permanently.', 'info');
    logAudit(patientId, 'patient', 'DATA_PURGE_REQUESTED', `Patient requested permanent purge of audio recordings and speech metrics.`, 'attention');
  };

  const resetAllData = () => {
    localStorage.clear();
    setPatients(INITIAL_PATIENTS);
    setTherapists(INITIAL_THERAPISTS);
    setTier1Exercises(INITIAL_TIER_1_EXERCISES);
    setTier2Exercises(INITIAL_TIER_2_EXERCISES);
    setSessions(INITIAL_SESSIONS);
    setClinicalNotes(INITIAL_CLINICAL_NOTES);
    setAppointments(INITIAL_APPOINTMENTS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setActivePatientId('pat-1');
    setActiveTherapistId('th-1');
    setCurrentRole('patient');
    setPatientActiveTab('home');
    addNotification('Application restored to initial calm demonstration state.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        activePatientId,
        setActivePatientId,
        activeTherapistId,
        setActiveTherapistId,
        patients,
        currentPatient,
        therapists,
        currentTherapist,
        tier1Exercises,
        tier2Exercises,
        sessions,
        clinicalNotes,
        appointments,
        auditLogs,
        notifications,
        patientActiveTab,
        setPatientActiveTab,
        switchRole,
        setPatientConnectionStatus,
        checkTherapistAvailability,
        addPracticeSession,
        flagSession,
        correctSessionMetrics,
        addClinicalNote,
        addTier1Exercise,
        removeTier1Exercise,
        toggleTier2Approval,
        verifyTherapistCredential,
        bookAppointment,
        cancelAppointment,
        updatePatientConsent,
        updatePatientProfile,
        deletePatientData,
        addNotification,
        removeNotification,
        selectedExerciseForPractice,
        setSelectedExerciseForPractice,
        resetAllData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
