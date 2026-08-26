import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PracticeSessionRecord, SpeechMetrics } from '../../types';
import {
  ListChecks,
  Play,
  Pause,
  CheckCircle2,
  Edit2,
  Flag,
  Sparkles,
  Clock,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { FootnoteDisclaimer } from '../common/FootnoteDisclaimer';

export const ReviewQueue: React.FC = () => {
  const { sessions, correctSessionMetrics, currentTherapist } = useApp();

  // Filter unreviewed or flagged sessions, sorted oldest first
  const unreviewedSessions = [...sessions]
    .filter(s => s.status === 'AI-guided — needs review' || s.isFlagged)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const [playingId, setPlayingId] = useState<string | null>(null);
  const [editingSession, setEditingSession] = useState<PracticeSessionRecord | null>(null);
  const [metricForm, setMetricForm] = useState<SpeechMetrics>({
    pauses: 0,
    repetitions: 0,
    prolongations: 0,
    speechRateWpm: 0
  });

  const handleQuickApprove = (session: PracticeSessionRecord) => {
    correctSessionMetrics(
      session.id,
      session.correctedMetrics || session.originalMetrics,
      currentTherapist.name
    );
  };

  const handleOpenCorrect = (session: PracticeSessionRecord) => {
    setEditingSession(session);
    setMetricForm({ ...(session.correctedMetrics || session.originalMetrics) });
  };

  const handleSaveCorrection = () => {
    if (!editingSession) return;
    correctSessionMetrics(editingSession.id, metricForm, currentTherapist.name);
    setEditingSession(null);
  };

  return (
    <div id="therapist-review-queue" className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-teal-100 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
              Clinical Quality Assurance
            </span>
            <span className="text-xs text-slate-500">
              Oldest Unreviewed First
            </span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 font-serif">
            Global AI Review Queue
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Validate automated speech metrics, verify flagged patient passages, and sign off for audit transparency.
          </p>
        </div>

        <div className="text-right shrink-0">
          <span className="text-2xl font-bold text-teal-900 font-mono">
            {unreviewedSessions.length}
          </span>
          <span className="text-xs text-slate-500 block">pending clinical sign-off</span>
        </div>
      </div>

      {/* Queue List */}
      {unreviewedSessions.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900 font-serif">
            All AI-Guided Sessions Reviewed
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Great work! All automated speech observations have been validated by clinical staff.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {unreviewedSessions.map(sess => {
            const isPlaying = playingId === sess.id;

            return (
              <article
                key={sess.id}
                id={`queue-item-${sess.id}`}
                className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setPlayingId(isPlaying ? null : sess.id)}
                      className="w-10 h-10 rounded-xl bg-teal-800 text-white flex items-center justify-center hover:bg-teal-900 transition shadow-xs"
                      aria-label="Play recording audio"
                    >
                      {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-white" />}
                    </button>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-base font-serif">
                          {sess.patientName}
                        </span>
                        <span className="text-xs text-slate-500 font-mono">
                          • {sess.exerciseTitle} ({sess.audioDuration})
                        </span>
                      </div>
                      <span className="text-xs text-slate-500">
                        Recorded on: {sess.date}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {sess.isFlagged && (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-900 bg-amber-100 border border-amber-300 px-2.5 py-1 rounded-full">
                        <Flag className="w-3.5 h-3.5 text-amber-800" />
                        Patient Flagged
                      </span>
                    )}
                    <span className="text-xs font-medium text-amber-900 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                      Needs Clinician Sign-off
                    </span>
                  </div>
                </div>

                {/* Spoken Passage Prompt */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-700">
                  <span className="text-[10px] uppercase font-semibold text-slate-500 block mb-1">
                    Spoken Passage:
                  </span>
                  <p className="italic font-serif text-slate-900">
                    "{sess.promptText}"
                  </p>
                </div>

                {/* Flag note if available */}
                {sess.isFlagged && sess.flagReason && (
                  <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3 text-xs text-amber-950">
                    <strong>Patient Note:</strong> {sess.flagReason}
                  </div>
                )}

                {/* AI Metrics summary bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-center">
                    <span className="text-slate-500 block text-[11px]">Pauses</span>
                    <span className="font-bold text-slate-900 text-sm">{sess.originalMetrics.pauses}</span>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-center">
                    <span className="text-slate-500 block text-[11px]">Repetitions</span>
                    <span className="font-bold text-slate-900 text-sm">{sess.originalMetrics.repetitions}</span>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-center">
                    <span className="text-slate-500 block text-[11px]">Prolongations</span>
                    <span className="font-bold text-slate-900 text-sm">{sess.originalMetrics.prolongations}</span>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-center">
                    <span className="text-slate-500 block text-[11px]">Speech Rate</span>
                    <span className="font-bold text-slate-900 text-sm">{sess.originalMetrics.speechRateWpm} WPM</span>
                  </div>
                </div>

                {/* Quick actions */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    Self-Rating: Comfort {sess.ratings.comfort}/5 • Confidence {sess.ratings.confidence}/5
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      id={`queue-correct-btn-${sess.id}`}
                      onClick={() => handleOpenCorrect(sess)}
                      className="px-3 py-1.5 border border-slate-300 hover:bg-slate-100 text-slate-800 rounded-xl text-xs font-medium transition flex items-center gap-1"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Adjust Metrics</span>
                    </button>

                    <button
                      id={`queue-approve-btn-${sess.id}`}
                      onClick={() => handleQuickApprove(sess)}
                      className="px-4 py-1.5 bg-teal-800 hover:bg-teal-900 text-white rounded-xl text-xs font-semibold transition flex items-center gap-1.5 shadow-xs"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve AI Estimation</span>
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Adjust Metrics Modal */}
      {editingSession && (
        <div
          id="queue-adjust-modal"
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 border border-teal-100 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 font-serif">
              Correct Telemetry for {editingSession.patientName}
            </h3>
            <p className="text-xs text-slate-500">
              Original AI estimations will be retained in the audit record.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-700 font-semibold block mb-1">Pauses</label>
                <input
                  type="number"
                  value={metricForm.pauses}
                  onChange={e => setMetricForm({ ...metricForm, pauses: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                />
              </div>
              <div>
                <label className="text-xs text-slate-700 font-semibold block mb-1">Repetitions</label>
                <input
                  type="number"
                  value={metricForm.repetitions}
                  onChange={e => setMetricForm({ ...metricForm, repetitions: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                />
              </div>
              <div>
                <label className="text-xs text-slate-700 font-semibold block mb-1">Prolongations</label>
                <input
                  type="number"
                  value={metricForm.prolongations}
                  onChange={e => setMetricForm({ ...metricForm, prolongations: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                />
              </div>
              <div>
                <label className="text-xs text-slate-700 font-semibold block mb-1">Speech Rate (WPM)</label>
                <input
                  type="number"
                  value={metricForm.speechRateWpm}
                  onChange={e => setMetricForm({ ...metricForm, speechRateWpm: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingSession(null)}
                className="px-4 py-2 border border-slate-300 text-slate-700 text-xs rounded-xl hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveCorrection}
                className="px-5 py-2 bg-teal-800 hover:bg-teal-900 text-white text-xs font-semibold rounded-xl"
              >
                Save Overwrite
              </button>
            </div>
          </div>
        </div>
      )}

      <FootnoteDisclaimer />
    </div>
  );
};
