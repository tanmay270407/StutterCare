import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  CheckCircle2,
  Sparkles,
  Clock,
  ArrowRight,
  Play,
  Calendar,
  Shield,
  Layers,
  Heart,
  ChevronRight
} from 'lucide-react';
import { FootnoteDisclaimer } from '../common/FootnoteDisclaimer';

export const PatientHome: React.FC = () => {
  const {
    currentPatient,
    tier1Exercises,
    tier2Exercises,
    checkTherapistAvailability,
    setPatientActiveTab,
    setSelectedExerciseForPractice,
    appointments
  } = useApp();

  const isConnected = currentPatient.status === 'connected';
  const isAIFallback = currentPatient.status === 'ai_fallback';
  const isWaitlisted = currentPatient.status === 'waitlisted';

  // Determine Today's Practice Card
  // If connected and has Tier 1 exercise assigned, suggest Tier 1; otherwise Tier 2
  const todaysExercise = isConnected && tier1Exercises.length > 0
    ? tier1Exercises[0]
    : tier2Exercises[0];

  const handleStartPractice = (exercise = todaysExercise) => {
    setSelectedExerciseForPractice(exercise);
    setPatientActiveTab('practice');
  };

  const nextAppointment = appointments.find(
    a => a.patientId === currentPatient.id && a.status === 'upcoming'
  );

  return (
    <div id="patient-home-view" className="space-y-6">
      {/* 1. PERSISTENT STATUS BANNER (Cannot be dismissed) */}
      <section
        id="persistent-status-banner"
        aria-label="Therapist Connection Status"
        className={`p-5 rounded-2xl border transition-all ${
          isConnected
            ? 'bg-emerald-50/90 border-emerald-200 text-emerald-950'
            : isAIFallback
            ? 'bg-amber-50/90 border-amber-200 text-amber-950'
            : 'bg-slate-100 border-slate-300 text-slate-900'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                isConnected
                  ? 'bg-emerald-700 text-white'
                  : isAIFallback
                  ? 'bg-amber-700 text-white'
                  : 'bg-slate-700 text-white'
              }`}
            >
              {isConnected ? (
                <CheckCircle2 className="w-6 h-6" />
              ) : isAIFallback ? (
                <Sparkles className="w-6 h-6" />
              ) : (
                <Clock className="w-6 h-6" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider opacity-80">
                  {isConnected
                    ? 'Clinician Connection Active'
                    : isAIFallback
                    ? 'AI-Guided Practice Mode'
                    : 'Matching Waitlist'}
                </span>
                <span className="w-2 h-2 rounded-full animate-pulse bg-current opacity-75" />
              </div>

              <h2 className="text-lg font-bold font-serif mt-0.5">
                {isConnected && `Connected to ${currentPatient.assignedTherapistName || 'Dr. Kavya Rao, PhD, CCC-SLP'}`}
                {isAIFallback && 'AI-guided mode — no therapist currently available'}
                {isWaitlisted && "You're on the waitlist — we'll match you as soon as possible"}
              </h2>

              <p className="text-xs sm:text-sm opacity-90 mt-0.5 max-w-xl">
                {isConnected &&
                  'Your clinician reviews your recordings, tailors individualized exercises in My Plan, and collaborates on your goals.'}
                {isAIFallback &&
                  'Practicing with Tier 2 clinician-approved unsupervised exercises. Non-diagnostic audio estimations active.'}
                {isWaitlisted &&
                  'Our clinical team is reviewing your intake preferences to pair you with a licensed Speech-Language Pathologist.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              id="check-therapist-availability-btn"
              onClick={() => checkTherapistAvailability(currentPatient.id)}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition flex items-center gap-2 shadow-xs focus-visible:ring-2 focus-visible:ring-teal-700 ${
                isConnected
                  ? 'bg-white text-emerald-900 border border-emerald-300 hover:bg-emerald-100'
                  : 'bg-amber-800 text-white hover:bg-amber-900'
              }`}
            >
              <span>
                {isConnected ? 'Switch to AI Sandbox' : 'Check for therapist availability now'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 2. TODAY'S PRACTICE CARD */}
      <section
        id="todays-practice-card"
        className="bg-white rounded-2xl border border-teal-100 p-6 sm:p-8 shadow-xs relative overflow-hidden"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                Recommended Daily Practice
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {todaysExercise.tier === 1 ? 'From your individualized plan' : 'From general practice library'}
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif">
              {todaysExercise.title}
            </h3>

            <p className="text-sm text-slate-600 leading-relaxed">
              {todaysExercise.description}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-teal-700" />
                ~{todaysExercise.durationMinutes} minutes
              </span>
              <span className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-teal-700" />
                Clinician safety verified
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              id="start-practice-hero-btn"
              onClick={() => handleStartPractice(todaysExercise)}
              className="px-6 py-3.5 bg-teal-800 hover:bg-teal-900 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2.5 shadow-sm hover:shadow transition transform active:scale-98 focus-visible:ring-2 focus-visible:ring-teal-700"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Start Practice Session</span>
            </button>

            <button
              id="browse-library-quick-btn"
              onClick={() => setPatientActiveTab(isConnected ? 'plan' : 'library')}
              className="px-4 py-3.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-sm font-medium transition flex items-center justify-center gap-1"
            >
              <span>{isConnected ? 'View My Plan' : 'Explore Library'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 3. CALM PROGRESS & APPOINTMENTS OVERVIEW (No streaks, no badges) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Weekly Engagement (Pressure-free intention) */}
        <section
          id="weekly-intention-card"
          className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-teal-700" />
              <h4 className="font-semibold text-slate-900 font-serif">Weekly Gentle Rhythm</h4>
            </div>
            <span className="text-xs text-slate-500">
              {currentPatient.weeklyGoalCompleted} of {currentPatient.weeklyGoalTarget} completed
            </span>
          </div>

          <p className="text-xs text-slate-600">
            A flexible intention to practice at your own comfort level. There are no penalties or streaks.
          </p>

          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-teal-700 h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, (currentPatient.weeklyGoalCompleted / currentPatient.weeklyGoalTarget) * 100)}%`
              }}
            />
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <button
              onClick={() => setPatientActiveTab('progress')}
              className="text-teal-800 hover:text-teal-950 font-medium inline-flex items-center gap-1"
            >
              <span>Review Comfort & Confidence Trends</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </section>

        {/* Clinician Collaboration / Telehealth */}
        <section
          id="clinician-collab-card"
          className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-teal-700" />
              <h4 className="font-semibold text-slate-900 font-serif">
                {isConnected ? 'Clinician Collaboration' : 'Telehealth Sessions'}
              </h4>
            </div>
            {isConnected && (
              <span className="text-[11px] font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                Active Match
              </span>
            )}
          </div>

          {nextAppointment ? (
            <div className="bg-teal-50/50 border border-teal-100 rounded-xl p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-teal-950">
                  {nextAppointment.type}
                </span>
                <span className="text-xs text-slate-500">
                  {nextAppointment.date} at {nextAppointment.time}
                </span>
              </div>
              <p className="text-xs text-slate-600">
                With {nextAppointment.therapistName}
              </p>
              <button
                onClick={() => setPatientActiveTab('appointments')}
                className="text-xs text-teal-800 hover:underline font-medium block"
              >
                View appointment room details →
              </button>
            </div>
          ) : (
            <div className="text-xs text-slate-600 space-y-2">
              <p>
                {isConnected
                  ? 'You are matched with Dr. Rao. You can schedule 1:1 clinical reviews and video check-ins.'
                  : 'While in AI-guided mode, you can still request a consultation booking or check availability.'}
              </p>
              <button
                id="book-session-quick-btn"
                onClick={() => setPatientActiveTab('appointments')}
                className="text-teal-800 hover:text-teal-950 font-medium inline-flex items-center gap-1 pt-1"
              >
                <span>Book a session with an SLP</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </section>
      </div>

      {/* Persistent Footnote */}
      <FootnoteDisclaimer />
    </div>
  );
};
