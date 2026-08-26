import React from 'react';
import { useApp } from '../../context/AppContext';
import { Exercise } from '../../types';
import {
  Stethoscope,
  Target,
  Clock,
  Play,
  CheckCircle2,
  Calendar,
  Sparkles,
  Award,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { FootnoteDisclaimer } from '../common/FootnoteDisclaimer';

export const MyPlan: React.FC = () => {
  const {
    currentPatient,
    tier1Exercises,
    setSelectedExerciseForPractice,
    setPatientActiveTab,
    setPatientConnectionStatus
  } = useApp();

  const isConnected = currentPatient.status === 'connected';

  const handleStartExercise = (exercise: Exercise) => {
    setSelectedExerciseForPractice(exercise);
    setPatientActiveTab('practice');
  };

  if (!isConnected) {
    return (
      <div id="my-plan-disconnected-view" className="bg-white rounded-2xl border border-amber-200 p-8 text-center space-y-4 max-w-2xl mx-auto">
        <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
          <Stethoscope className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 font-serif">
          Individualized Clinician Plan (Path A)
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          "My Plan" is unlocked when you are actively connected to a licensed Speech-Language Pathologist. Your therapist crafts custom drills tailored specifically to your communication environments (e.g. meetings, phone calls).
        </p>
        <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
          <button
            id="connect-now-plan-btn"
            onClick={() => setPatientConnectionStatus(currentPatient.id, 'connected')}
            className="px-5 py-2.5 bg-teal-800 hover:bg-teal-900 text-white rounded-xl text-xs sm:text-sm font-semibold transition flex items-center justify-center gap-2"
          >
            <span>Simulate Connecting to Dr. Kavya Rao</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => setPatientActiveTab('library')}
            className="px-4 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs sm:text-sm font-medium transition"
          >
            Browse General Library (Tier 2)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div id="my-plan-view" className="space-y-6">
      {/* Clinician Seal Header */}
      <div className="bg-gradient-to-r from-emerald-900 to-teal-900 text-white rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-teal-800/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-800/80 border border-emerald-600 flex items-center justify-center text-emerald-100">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider text-emerald-300 font-semibold">
                Tier 1 Individualized Plan
              </span>
              <h2 className="text-xl sm:text-2xl font-bold font-serif">
                Clinician-Assigned Practice Goals
              </h2>
            </div>
          </div>

          <div className="bg-emerald-950/60 border border-emerald-700/60 px-3.5 py-2 rounded-xl text-xs text-emerald-200 flex items-center gap-2 self-start sm:self-auto">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Assigned by {currentPatient.assignedTherapistName || 'Dr. Kavya Rao, PhD, CCC-SLP'}</span>
          </div>
        </div>

        {/* Weekly Goals Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          <div className="bg-white/10 rounded-xl p-3.5 backdrop-blur-xs">
            <span className="text-xs text-emerald-200 block">Weekly Target</span>
            <span className="text-xl font-bold">{currentPatient.weeklyGoalTarget} sessions</span>
            <span className="text-[11px] text-emerald-300 block mt-0.5">Gentle pacing</span>
          </div>
          <div className="bg-white/10 rounded-xl p-3.5 backdrop-blur-xs">
            <span className="text-xs text-emerald-200 block">Completed This Week</span>
            <span className="text-xl font-bold">{currentPatient.weeklyGoalCompleted} completed</span>
            <span className="text-[11px] text-emerald-300 block mt-0.5">Zero pressure</span>
          </div>
          <div className="bg-white/10 rounded-xl p-3.5 backdrop-blur-xs">
            <span className="text-xs text-emerald-200 block">Therapist Review</span>
            <span className="text-xl font-bold">Synchronized</span>
            <span className="text-[11px] text-emerald-300 block mt-0.5">Last note: Aug 25</span>
          </div>
        </div>
      </div>

      {/* Individualized Exercises (Visually distinct with custom clinician seals) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 font-serif flex items-center gap-2">
            <Target className="w-5 h-5 text-teal-700" />
            <span>Assigned Exercises for {currentPatient.name}</span>
          </h3>
          <span className="text-xs text-slate-500 font-medium">
            {tier1Exercises.length} Custom Drills Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {tier1Exercises.map(ex => (
            <article
              key={ex.id}
              id={`plan-exercise-${ex.id}`}
              className="bg-white rounded-2xl border-2 border-emerald-700/20 hover:border-emerald-700/40 p-6 flex flex-col justify-between shadow-xs space-y-4 relative"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-900 bg-emerald-100/90 px-3 py-1 rounded-full border border-emerald-300/80">
                    <Award className="w-3.5 h-3.5 text-emerald-800" />
                    Individualized Clinician Drill
                  </span>
                  <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {ex.targetFrequency || `${ex.durationMinutes}m`}
                  </span>
                </div>

                <div>
                  <h4 className="text-base font-bold text-slate-900 font-serif">
                    {ex.title}
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {ex.description}
                  </p>
                </div>

                {/* Specific Clinician Guidance */}
                <div className="bg-emerald-50/60 border border-emerald-100 rounded-xl p-3 space-y-1.5">
                  <span className="text-[11px] font-semibold text-emerald-950 block">
                    Dr. Rao's Clinical Focus:
                  </span>
                  <ul className="text-xs text-slate-700 space-y-1 list-disc pl-4">
                    {ex.instructions.map((ins, i) => (
                      <li key={i}>{ins}</li>
                    ))}
                  </ul>
                </div>

                {/* Customized Prompt */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-700">
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">
                    Custom meeting passage:
                  </span>
                  <p className="italic text-slate-800 font-medium">
                    "{ex.samplePrompt}"
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  Target: {ex.targetFrequency || '3x / week'}
                </span>

                <button
                  id={`practice-plan-btn-${ex.id}`}
                  onClick={() => handleStartExercise(ex)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold shadow-xs transition"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Start Drill</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      <FootnoteDisclaimer />
    </div>
  );
};
