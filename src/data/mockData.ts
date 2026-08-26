import {
  PatientProfile,
  TherapistProfile,
  Exercise,
  PracticeSessionRecord,
  ClinicalNote,
  Appointment,
  AuditLogEntry
} from '../types';

export const INITIAL_TIER_2_EXERCISES: Exercise[] = [
  {
    id: 't2-1',
    title: 'Gentle-Onset Practice',
    tier: 2,
    category: 'gentle_onset',
    description: 'Focus on initiating sound with soft vocal fold vibration before speaking initial vowels and consonants.',
    instructions: [
      'Take a comfortable, relaxed breath.',
      'Begin the first sound of the phrase with a gentle, whispering breath that softly transitions into voice.',
      'Maintain an easy, unhurried pace throughout the sentence.'
    ],
    samplePrompt: 'Autumn leaves gently fall across the quiet stone pathway.',
    approvedForUnsupervised: true,
    approvedBy: 'Dr. Kavya Rao, PhD, CCC-SLP',
    approvalDate: '2026-08-10',
    durationMinutes: 5
  },
  {
    id: 't2-2',
    title: 'Comfortable Paced Speech',
    tier: 2,
    category: 'paced_speech',
    description: 'Practice rhythmic, unhurried phrasing with natural pauses between idea clusters.',
    instructions: [
      'Speak in 3 to 4 word thought groups.',
      'Allow a full, natural breath during punctuation marks without rushing to the next word.',
      'Focus on keeping your shoulders and jaw relaxed.'
    ],
    samplePrompt: 'When we take our time to express ideas, conversation feels more spacious and open.',
    approvedForUnsupervised: true,
    approvedBy: 'Dr. Kavya Rao, PhD, CCC-SLP',
    approvalDate: '2026-08-10',
    durationMinutes: 5
  },
  {
    id: 't2-3',
    title: 'Prolonged Speech Practice',
    tier: 2,
    category: 'prolonged_speech',
    description: 'Use light articulatory contact and smooth, continuous phonation across connected words.',
    instructions: [
      'Allow your articulators (lips, tongue) to touch lightly without pressing.',
      'Slightly lengthen vowel sounds to sustain continuous vocal airflow.',
      'Notice any physical sensation of ease in your throat.'
    ],
    samplePrompt: 'Morning sunlight warms the calm surface of the mountain lake.',
    approvedForUnsupervised: true,
    approvedBy: 'Arjun Verma, MS, CCC-SLP',
    approvalDate: '2026-08-12',
    durationMinutes: 6
  },
  {
    id: 't2-4',
    title: 'Breathing & Vocal Relaxation',
    tier: 2,
    category: 'breathing',
    description: 'Calm diaphragmatic breathing cycles to release pre-speech muscular tension in the neck and shoulders.',
    instructions: [
      'Inhale softly through your nose for 4 counts, letting your belly expand.',
      'Exhale smoothly on a gentle "shhh" or voiced "mmm" sound for 6 counts.',
      'Release any tightness in the jaw and forehead before vocalizing.'
    ],
    samplePrompt: 'Deep, steady breaths help release holding patterns and create space for speech.',
    approvedForUnsupervised: true,
    approvedBy: 'Dr. Kavya Rao, PhD, CCC-SLP',
    approvalDate: '2026-08-14',
    durationMinutes: 4
  },
  {
    id: 't2-5',
    title: 'Unhurried Reading Aloud',
    tier: 2,
    category: 'reading',
    description: 'Read descriptive narrative passages in a safe, non-evaluative space with intentional pauses.',
    instructions: [
      'Read aloud at half your customary conversational tempo.',
      'If you encounter tension or a block, pause gently, release breath, and resume softly.',
      'Remember there is zero requirement for speed or fluency.'
    ],
    samplePrompt: 'The old botanical garden had quiet benches shaded by cedar trees, where people often sat to read in the afternoon breeze.',
    approvedForUnsupervised: true,
    approvedBy: 'Arjun Verma, MS, CCC-SLP',
    approvalDate: '2026-08-15',
    durationMinutes: 7
  }
];

export const INITIAL_TIER_1_EXERCISES: Exercise[] = [
  {
    id: 't1-1',
    title: 'Breathing & Relaxation: Pre-Meeting Reset',
    tier: 1,
    category: 'custom',
    description: 'Individualized clinician drill designed for Aarav to lower physical tension before a meeting using a short diaphragmatic breathing sequence.',
    instructions: [
      'Find an upright, comfortable posture and take 3 deep diaphragmatic breaths through your nose.',
      'Release physical tension across your shoulders, jaw, and tongue as you exhale slowly.',
      'Transition gently into your introductory meeting sentence on a relaxed, continuous stream of air.'
    ],
    samplePrompt: 'Good morning everyone, I would like to quickly outline our key milestones for today\'s discussion.',
    approvedForUnsupervised: false,
    assignedByTherapist: 'Dr. Kavya Rao, PhD, CCC-SLP',
    targetFrequency: 'Daily (pre-meeting reset)',
    durationMinutes: 4
  },
  {
    id: 't1-2',
    title: 'Voluntary Stuttering & Desensitization Loop',
    tier: 1,
    category: 'custom',
    description: 'Clinician-supervised practice to gently produce easy, voluntary prolongations on non-feared words to reduce anticipatory tension.',
    instructions: [
      'Choose the first word of each sentence to deliberately glide through with an easy, relaxed slide.',
      'Observe your emotional response with curiosity rather than self-judgment.',
      'Record 3 sample reflections for your upcoming Friday review.'
    ],
    samplePrompt: 'Coffee in the quiet morning brings a sense of calm and clarity.',
    approvedForUnsupervised: false,
    assignedByTherapist: 'Dr. Kavya Rao, PhD, CCC-SLP',
    targetFrequency: '3x / week',
    durationMinutes: 8
  }
];

export const INITIAL_THERAPISTS: TherapistProfile[] = [
  {
    id: 'th-1',
    name: 'Dr. Kavya Rao',
    title: 'Senior Speech-Language Pathologist, PhD, CCC-SLP',
    licenseNumber: 'ASHA #1409281',
    licenseBody: 'American Speech-Language-Hearing Association (ASHA)',
    verificationStatus: 'verified',
    bio: '14+ years specializing in fluency disorders, acceptance-focused therapy, and gentle-onset integration for teens and adults.',
    specialization: 'Fluency & Acceptance Therapy',
    assignedPatientCount: 4,
    pendingReviewCount: 2
  },
  {
    id: 'th-2',
    name: 'Arjun Verma',
    title: 'Licensed Speech-Language Pathologist, MS, CCC-SLP',
    licenseNumber: 'RCSLT #983210',
    licenseBody: 'Royal College of Speech and Language Therapists (UK)',
    verificationStatus: 'verified',
    bio: 'Focuses on cognitive-behavioral fluency approaches, workplace communication comfort, and pediatric speech confidence.',
    specialization: 'Adult Fluency & Cognitive Coaching',
    assignedPatientCount: 3,
    pendingReviewCount: 1
  },
  {
    id: 'th-3',
    name: 'Priya Menon',
    title: 'Clinical SLP Fellow, M.S. Communication Sciences',
    licenseNumber: 'HCPC #SLP44810',
    licenseBody: 'Health and Care Professions Council',
    verificationStatus: 'pending_verification',
    bio: 'Fellowship applicant specializing in telehealth speech modifications and biofeedback monitoring.',
    specialization: 'Telepractice & Speech Physiology',
    assignedPatientCount: 0,
    pendingReviewCount: 0
  }
];

export const INITIAL_PATIENTS: PatientProfile[] = [
  {
    id: 'pat-1',
    name: 'Aarav Sharma',
    age: 26,
    preferredLanguage: 'English',
    therapyGoals: [
      'Feel more comfortable participating in team meetings',
      'Learn gentle vocal onset techniques',
      'Reduce physical shoulder and jaw tension when speaking'
    ],
    intakeAnswers: {
      difficultyMost: 'During work video calls and spontaneous introductions',
      currentNav: 'Pausing, breathing out, and substituting words occasionally',
      comfortableEnv: 'One-on-one conversations with close friends or family',
      impactLevel: 'Moderate — sometimes causes hesitation to speak up'
    },
    hasConsent: true,
    consentTimestamp: '2026-08-18 10:30 UTC',
    isMinor: false,
    status: 'connected',
    assignedTherapistId: 'th-1',
    assignedTherapistName: 'Dr. Kavya Rao, PhD, CCC-SLP',
    lastSessionDate: '2026-08-25',
    weeklyGoalTarget: 4,
    weeklyGoalCompleted: 3
  },
  {
    id: 'pat-2',
    name: 'Ishita Reddy',
    age: 16,
    preferredLanguage: 'English',
    therapyGoals: [
      'Build confidence for classroom presentations',
      'Practice paced breathing before speaking'
    ],
    intakeAnswers: {
      difficultyMost: 'Answering unexpected questions in class',
      currentNav: 'Holding breath or looking down',
      comfortableEnv: 'Quiet study sessions and reading alone',
      impactLevel: 'High anxiety in group settings'
    },
    hasConsent: true,
    consentTimestamp: '2026-08-20 14:15 UTC',
    isMinor: true,
    guardianName: 'Suresh Reddy',
    guardianEmail: 'sreddy.parent@example.com',
    guardianConsentTimestamp: '2026-08-20 14:18 UTC',
    status: 'ai_fallback',
    assignedTherapistId: undefined,
    assignedTherapistName: undefined,
    lastSessionDate: '2026-08-24',
    weeklyGoalTarget: 3,
    weeklyGoalCompleted: 2
  },
  {
    id: 'pat-3',
    name: 'Rohan Mehta',
    age: 34,
    preferredLanguage: 'English',
    therapyGoals: [
      'Navigate phone calls without rushing',
      'Develop self-compassion around speech variations'
    ],
    intakeAnswers: {
      difficultyMost: 'Ordering food and calling customer service',
      currentNav: 'Taking deep breaths and restarting phrases',
      comfortableEnv: 'Casual text chats and casual conversations',
      impactLevel: 'Moderate'
    },
    hasConsent: true,
    consentTimestamp: '2026-08-22 09:00 UTC',
    isMinor: false,
    status: 'waitlisted',
    assignedTherapistId: undefined,
    assignedTherapistName: undefined,
    lastSessionDate: '2026-08-23',
    weeklyGoalTarget: 3,
    weeklyGoalCompleted: 1
  },
  {
    id: 'pat-4',
    name: 'Meera Rai',
    age: 29,
    preferredLanguage: 'English',
    therapyGoals: [
      'Present clearly in client meetings',
      'Gentle breath pacing and light articulatory contact'
    ],
    intakeAnswers: {
      difficultyMost: 'Client presentations and impromptu questions',
      currentNav: 'Pausing and resetting breathing',
      comfortableEnv: 'One-on-one reviews and written communication',
      impactLevel: 'Moderate'
    },
    hasConsent: true,
    consentTimestamp: '2026-08-20 11:00 UTC',
    isMinor: false,
    status: 'connected',
    assignedTherapistId: 'th-1',
    assignedTherapistName: 'Dr. Kavya Rao, PhD, CCC-SLP',
    lastSessionDate: '2026-08-25',
    weeklyGoalTarget: 4,
    weeklyGoalCompleted: 3
  },
  {
    id: 'pat-5',
    name: 'Vihaan Patel',
    age: 22,
    preferredLanguage: 'English',
    therapyGoals: [
      'Overcome telephone anxiety and customer ordering tension',
      'Prolonged vowel smooth flow'
    ],
    intakeAnswers: {
      difficultyMost: 'Phone calls and ordering food in noisy cafes',
      currentNav: 'Taking deep breaths',
      comfortableEnv: 'Quiet discussions with peers',
      impactLevel: 'Moderate to High'
    },
    hasConsent: true,
    consentTimestamp: '2026-08-21 16:20 UTC',
    isMinor: false,
    status: 'connected',
    assignedTherapistId: 'th-2',
    assignedTherapistName: 'Arjun Verma, MS, CCC-SLP',
    lastSessionDate: '2026-08-24',
    weeklyGoalTarget: 3,
    weeklyGoalCompleted: 2
  },
  {
    id: 'pat-6',
    name: 'Ananya Nair',
    age: 31,
    preferredLanguage: 'English',
    therapyGoals: [
      'Group discussion confidence',
      'Diaphragmatic breath support before speaking'
    ],
    intakeAnswers: {
      difficultyMost: 'Unscheduled conference calls',
      currentNav: 'Pausing and relaxing jaw muscles',
      comfortableEnv: 'Direct messaging and small team syncs',
      impactLevel: 'Moderate'
    },
    hasConsent: true,
    consentTimestamp: '2026-08-22 13:40 UTC',
    isMinor: false,
    status: 'ai_fallback',
    assignedTherapistId: undefined,
    assignedTherapistName: undefined,
    lastSessionDate: '2026-08-23',
    weeklyGoalTarget: 3,
    weeklyGoalCompleted: 1
  },
  {
    id: 'pat-7',
    name: 'Kabir Singh',
    age: 27,
    preferredLanguage: 'English',
    therapyGoals: [
      'Interview preparation without rushing',
      'Desensitization and voluntary stuttering exercises'
    ],
    intakeAnswers: {
      difficultyMost: 'Job interviews and introduction rounds',
      currentNav: 'Re-framing tension as normal communication rhythm',
      comfortableEnv: 'Familiar friends and family gatherings',
      impactLevel: 'Moderate'
    },
    hasConsent: true,
    consentTimestamp: '2026-08-23 08:15 UTC',
    isMinor: false,
    status: 'waitlisted',
    assignedTherapistId: undefined,
    assignedTherapistName: undefined,
    lastSessionDate: '2026-08-22',
    weeklyGoalTarget: 4,
    weeklyGoalCompleted: 0
  }
];

export const INITIAL_SESSIONS: PracticeSessionRecord[] = [
  {
    id: 'sess-101',
    patientId: 'pat-1',
    patientName: 'Aarav Sharma',
    date: '2026-08-25 14:30',
    exerciseId: 't1-1',
    exerciseTitle: 'Breathing & Relaxation: Pre-Meeting Reset',
    promptText: 'Today we are presenting our quarterly project timelines to the product team.',
    durationSeconds: 42,
    audioDuration: '0:42',
    source: 'plan',
    aiFeedbackSummary: 'Speech pace appeared steady and comfortable. Subtle tension was noted near the initial consonant onset in the opening phrase.',
    aiObservations: [
      'Possible gentle sound repetition noted at 0:08 on initial syllable "to-".',
      'Pacing was measured, averaging 128 words per minute.',
      'Sustained natural phonation throughout the remainder of the sentence.'
    ],
    originalMetrics: {
      pauses: 2,
      repetitions: 1,
      prolongations: 1,
      speechRateWpm: 128
    },
    correctedMetrics: {
      pauses: 2,
      repetitions: 1,
      prolongations: 0,
      speechRateWpm: 128
    },
    correctedBy: 'Dr. Kavya Rao, PhD, CCC-SLP',
    correctedAt: '2026-08-25 16:00',
    status: 'Reviewed',
    ratings: {
      comfort: 4,
      effort: 3,
      confidence: 4,
      anxiety: 2
    },
    isFlagged: false
  },
  {
    id: 'sess-102',
    patientId: 'pat-1',
    patientName: 'Aarav Sharma',
    date: '2026-08-24 11:15',
    exerciseId: 't2-1',
    exerciseTitle: 'Gentle-Onset Practice',
    promptText: 'Autumn leaves gently fall across the quiet stone pathway.',
    durationSeconds: 36,
    audioDuration: '0:36',
    source: 'library',
    aiFeedbackSummary: 'Estimated speaking flow was smooth with natural pauses. A potential brief hesitation was detected during the second clause.',
    aiObservations: [
      'Possible brief prolongation observed around 0:14 on vowel sound.',
      'Comfortable breath cadence maintained across all three phrases.'
    ],
    originalMetrics: {
      pauses: 3,
      repetitions: 0,
      prolongations: 2,
      speechRateWpm: 120
    },
    status: 'AI-guided — needs review',
    ratings: {
      comfort: 3,
      effort: 3,
      confidence: 3,
      anxiety: 3
    },
    isFlagged: true,
    flagReason: 'I felt the automated system marked a prolongation where I was actually just taking an intentional relaxation breath.'
  },
  {
    id: 'sess-103',
    patientId: 'pat-2',
    patientName: 'Ishita Reddy',
    date: '2026-08-24 16:45',
    exerciseId: 't2-2',
    exerciseTitle: 'Comfortable Paced Speech',
    promptText: 'When we take our time to express ideas, conversation feels more spacious and open.',
    durationSeconds: 48,
    audioDuration: '0:48',
    source: 'library',
    aiFeedbackSummary: 'Pacing was measured with consistent spacing between thought groups. Potential sound repetition noticed on the third word.',
    aiObservations: [
      'Possible syllable repetition noted around 0:06 ("ex-express").',
      'Speech rate remained comfortable at approximately 115 WPM.'
    ],
    originalMetrics: {
      pauses: 4,
      repetitions: 2,
      prolongations: 1,
      speechRateWpm: 115
    },
    status: 'AI-guided — needs review',
    ratings: {
      comfort: 4,
      effort: 2,
      confidence: 4,
      anxiety: 2
    },
    isFlagged: false
  },
  {
    id: 'sess-104',
    patientId: 'pat-3',
    patientName: 'Rohan Mehta',
    date: '2026-08-23 18:20',
    exerciseId: 't2-4',
    exerciseTitle: 'Breathing & Vocal Relaxation',
    promptText: 'Deep, steady breaths help release holding patterns and create space for speech.',
    durationSeconds: 55,
    audioDuration: '0:55',
    source: 'library',
    aiFeedbackSummary: 'Steady vocal initiation observed with gentle onset throughout the reading passage.',
    aiObservations: [
      'Pauses appeared well-distributed with breath cycles.',
      'No marked repetitions detected in this recording snippet.'
    ],
    originalMetrics: {
      pauses: 5,
      repetitions: 0,
      prolongations: 1,
      speechRateWpm: 110
    },
    status: 'AI-guided — needs review',
    ratings: {
      comfort: 4,
      effort: 2,
      confidence: 4,
      anxiety: 2
    },
    isFlagged: false
  }
];

export const INITIAL_CLINICAL_NOTES: ClinicalNote[] = [
  {
    id: 'note-1',
    patientId: 'pat-1',
    therapistId: 'th-1',
    therapistName: 'Dr. Kavya Rao, PhD, CCC-SLP',
    timestamp: '2026-08-25 16:30',
    noteType: 'SOAP',
    content: 'S: Aarav reported feeling more at ease during yesterday\'s standup meeting. Felt less urgency to start speaking before inhaling.\nO: Reviewed recording #sess-101. Confirmed light contact on plosives. Overwrote AI prolongation metric (was a natural breath pause).\nA: Patient demonstrating strong internalization of gentle onset. Anxiety ratings trended down from 4/5 to 2/5 over the past two weeks.\nP: Continue Tier 1 custom drill 3x weekly. Next telehealth scheduled for Sept 1st.'
  },
  {
    id: 'note-2',
    patientId: 'pat-1',
    therapistId: 'th-1',
    therapistName: 'Dr. Kavya Rao, PhD, CCC-SLP',
    timestamp: '2026-08-18 11:00',
    noteType: 'Observation',
    content: 'Initial consultation intake completed. Established non-avoidance therapy goals. Aarav expresses desire to feel calm rather than chasing artificial 100% fluency. Tier 1 plan configured.'
  }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-2',
    patientId: 'pat-1',
    patientName: 'Aarav Sharma',
    therapistId: 'th-1',
    therapistName: 'Dr. Kavya Rao, PhD, CCC-SLP',
    date: '2026-08-18',
    time: '10:00 - 10:45',
    type: 'Plan Consultation',
    status: 'completed'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'aud-1',
    timestamp: '2026-08-25 16:00:12',
    actor: 'Dr. Kavya Rao (th-1)',
    actorRole: 'therapist',
    action: 'METRIC_OVERWRITE',
    details: 'Corrected prolongation count from 1 to 0 on session #sess-101 for patient Aarav Sharma (preserved AI baseline for audit).',
    severity: 'info'
  },
  {
    id: 'aud-2',
    timestamp: '2026-08-24 11:16:04',
    actor: 'Aarav Sharma (pat-1)',
    actorRole: 'patient',
    action: 'AI_FEEDBACK_FLAGGED',
    details: 'Flagged session #sess-102 feedback for clinician manual validation.',
    severity: 'notice'
  },
  {
    id: 'aud-3',
    timestamp: '2026-08-20 14:18:22',
    actor: 'Suresh Reddy (Guardian)',
    actorRole: 'patient',
    action: 'PARENT_CONSENT_GRANTED',
    details: 'Explicit parental consent provided for minor Ishita Reddy (Age 16).',
    severity: 'info'
  },
  {
    id: 'aud-4',
    timestamp: '2026-08-15 09:30:00',
    actor: 'Admin Neha Kapoor',
    actorRole: 'admin',
    action: 'TIER2_CONTENT_SIGNOFF',
    details: 'Signed off "Unhurried Reading Aloud" as Approved for Unsupervised AI Use.',
    severity: 'info'
  }
];

export const INTAKE_QUESTIONS = [
  {
    id: 'difficultyMost',
    question: 'When do you notice speech moments or tension most frequently?',
    options: [
      'During unexpected questions or high-stakes introductions',
      'On phone calls or video conferencing',
      'When speaking with authority figures or large groups',
      'Evenly distributed across everyday speaking contexts',
      'When fatigued or under time pressure'
    ]
  },
  {
    id: 'currentNav',
    question: 'How do you currently navigate speech blocks or moments of holding?',
    options: [
      'I pause, take a breath, and continue gently',
      'I push through the physical tension',
      'I sometimes substitute words or rearrange phrases',
      'I wait quietly until the tension releases naturally'
    ]
  },
  {
    id: 'comfortableEnv',
    question: 'What speaking environments feel most grounding and safe for you?',
    options: [
      'One-on-one with trusted family or friends',
      'Writing or reading aloud in private',
      'Small collaborative group settings',
      'When there is no strict conversational time limit'
    ]
  },
  {
    id: 'impactLevel',
    question: 'How would you describe the current emotional impact on daily communication?',
    options: [
      'Mild — occasional awareness, but generally comfortable',
      'Moderate — sometimes holds me back from sharing ideas',
      'Significant — frequent hesitation and anticipatory worry'
    ]
  }
];
