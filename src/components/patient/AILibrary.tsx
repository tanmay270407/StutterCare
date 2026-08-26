import React from 'react';
import { useApp } from '../../context/AppContext';
import { Exercise } from '../../types';
import {
  ShieldCheck,
  Clock,
  Play,
  Sparkles,
  BookOpen,
  Wind,
  Layers,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { FootnoteDisclaimer } from '../common/FootnoteDisclaimer';

export const AILibrary: React.FC = () => {
  const {
    tier2Exercises,
    setSelectedExerciseForPractice,
    setPatientActiveTab
  } = useApp();

  const handleStartExercise = (exercise: Exercise) => {
    setSelectedExerciseForPractice(exercise);
    setPatientActiveTab('practice');
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'breathing':
        return <Wind className="w-5 h-5 text-teal-700" />;
      case 'reading':
        return <BookOpen className="w-5 h-5 text-teal-700" />;
      default:
        return <Layers className="w-5 h-5 text-teal-700" />;
    }
  };

  return (
    <div id="ai-fallback-library-view" className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-teal-100 p-6 sm:p-8 space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
            Tier 2 General Safe Practice Library
          </span>
          <span className="text-xs text-slate-500">
            Open for self-paced practice anytime
          </span>
        </div>

        <h2 className="text-2xl font-bold text-slate-900 font-serif">
          Clinician-Approved Speech Practices
        </h2>

        <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
          These five core evidence-based exercises have been formally verified by licensed Speech-Language Pathologists for safe, unsupervised self-practice. Automated observations are strictly non-diagnostic.
        </p>
      </div>

      {/* Grid of 5 Tier 2 Exercises */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {tier2Exercises.map(ex => (
          <article
            key={ex.id}
            id={`exercise-card-${ex.id}`}
            className="bg-white rounded-2xl border border-slate-200/80 hover:border-teal-300 p-6 flex flex-col justify-between shadow-xs hover:shadow-sm transition space-y-4"
          >
            <div className="space-y-3">
              {/* Badge: Clinician-Approved for Unsupervised Use */}
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-800 bg-emerald-50/90 border border-emerald-200 px-2.5 py-1 rounded-full">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                  Clinician-approved for unsupervised use
                </span>
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {ex.durationMinutes}m
                </span>
              </div>

              <div className="flex items-start gap-3 pt-1">
                <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center shrink-0">
                  {getCategoryIcon(ex.category)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-serif">
                    {ex.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed line-clamp-3">
                    {ex.description}
                  </p>
                </div>
              </div>

              {/* Sample Prompt Preview */}
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-xs text-slate-700">
                <span className="text-[10px] uppercase font-semibold text-slate-600 block mb-1">
                  Sample passage:
                </span>
                <p className="italic text-slate-800">
                  "{ex.samplePrompt}"
                </p>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <div className="text-[11px] text-slate-600">
                <span>Verified by: </span>
                <span className="text-slate-800 font-medium">{ex.approvedBy || 'SLP Board'}</span>
              </div>

              <button
                id={`start-tier2-btn-${ex.id}`}
                onClick={() => handleStartExercise(ex)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-800 hover:bg-teal-900 text-white rounded-xl text-xs font-semibold shadow-xs transition"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Practice</span>
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* Footnote */}
      <FootnoteDisclaimer />
    </div>
  );
};
