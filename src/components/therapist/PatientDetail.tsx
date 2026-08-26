import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  PatientProfile,
  SpeechMetrics,
  SessionTag
} from '../../types';
import {
  ArrowLeft,
  User,
  FileText,
  Mic,
  Target,
  TrendingUp,
  Clock,
  Play,
  Pause,
  Edit2,
  Check,
  Plus,
  Trash2,
  Shield,
  Flag,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Lock
} from 'lucide-react';
import { FootnoteDisclaimer } from '../common/FootnoteDisclaimer';

interface PatientDetailProps {
  patientId: string;
  onBack: () => void;
}

export const PatientDetail: React.FC<PatientDetailProps> = ({ patientId, onBack }) => {
  const {
    patients,
    sessions,
    clinicalNotes,
    tier1Exercises,
    addClinicalNote,
    addTier1Exercise,
    removeTier1Exercise,
    correctSessionMetrics,
    updatePatientProfile,
    currentTherapist,
    setPatientConnectionStatus
  } = useApp();

  const patient = patients.find(p => p.id === patientId) || patients[0];
  const patientSessions = sessions.filter(s => s.patientId === patient.id);
  const patientNotes = clinicalNotes.filter(n => n.patientId === patient.id);

  const [activeTab, setActiveTab] = useState<'overview' | 'recordings' | 'plan' | 'notes' | 'progress'>('recordings');

  // Audio Playback Mock
  const [playingSessionId, setPlayingSessionId] = useState<string | null>(null);

  // Metric Correction State
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [metricForm, setMetricForm] = useState<SpeechMetrics>({
    pauses: 0,
    repetitions: 0,
    prolongations: 0,
    speechRateWpm: 0
  });

  // Clinical Note State
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [noteType, setNoteType] = useState<'SOAP' | 'Observation' | 'Check-in' | 'Milestone'>('SOAP');
  const [noteContent, setNoteContent] = useState('');

  // New Exercise Modal State
  const [isAddingExercise, setIsAddingExercise] = useState(false);
  const [newExTitle, setNewExTitle] = useState('');
  const [newExDesc, setNewExDesc] = useState('');
  const [newExPrompt, setNewExPrompt] = useState('');
  const [newExFreq, setNewExFreq] = useState('3x / week');
  const [newExInstructions, setNewExInstructions] = useState('1. Focus on soft vocal fold vibration.\n2. Maintain an easy breath release.');

  const handleStartEditMetrics = (sess: any) => {
    setEditingSessionId(sess.id);
    const base = sess.correctedMetrics || sess.originalMetrics;
    setMetricForm({ ...base });
  };

  const handleSaveMetrics = (sessionId: string) => {
    correctSessionMetrics(sessionId, metricForm, currentTherapist.name);
    setEditingSessionId(null);
  };

  const handleSaveNote = () => {
    if (!noteContent.trim()) return;
    addClinicalNote({
      patientId: patient.id,
      therapistId: currentTherapist.id,
      therapistName: currentTherapist.name,
      noteType,
      content: noteContent
    });
    setNoteContent('');
    setIsAddingNote(false);
  };

  const handleCreateExercise = () => {
    if (!newExTitle.trim()) return;
    addTier1Exercise({
      title: newExTitle,
      category: 'custom',
      description: newExDesc,
      samplePrompt: newExPrompt || 'Sample spoken passage tailored for clinical goals.',
      instructions: newExInstructions.split('\n').filter(i => i.trim().length > 0),
      approvedForUnsupervised: false,
      assignedByTherapist: currentTherapist.name,
      targetFrequency: newExFreq,
      durationMinutes: 5
    });
    setNewExTitle('');
    setNewExDesc('');
    setNewExPrompt('');
    setIsAddingExercise(false);
  };

  return (
    <div id="patient-detail-chart" className="space-y-6">
      {/* Patient Header & Quick Bar */}
      <div className="bg-white rounded-2xl border border-teal-100 p-6 sm:p-8 space-y-4 shadow-xs">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-teal-900 font-medium mb-1 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Patient Roster</span>
        </button>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-800 text-white flex items-center justify-center font-bold text-lg font-serif">
              {patient.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif">
                  {patient.name}
                </h2>
                <span className="text-xs text-slate-500">
                  ({patient.age} yrs • {patient.preferredLanguage})
                </span>
                {patient.isMinor && (
                  <span className="text-[11px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-medium">
                    Minor / Guardian Verified
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Clinical ID: #{patient.id} • Assigned to {patient.assignedTherapistName || 'None (AI Sandbox)'}
              </p>
            </div>
          </div>

          {/* Connection Status Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Caseload Status:</span>
            <select
              value={patient.status}
              onChange={e => setPatientConnectionStatus(patient.id, e.target.value as any)}
              className="bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-xl px-3 py-2 focus-visible:ring-2 focus-visible:ring-teal-700 font-medium"
            >
              <option value="connected">Connected (Assigned)</option>
              <option value="ai_fallback">AI-Guided Sandbox</option>
              <option value="waitlisted">Waitlisted Intake</option>
            </select>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pt-1">
          {[
            { id: 'recordings', label: 'Recordings & AI Review', icon: Mic },
            { id: 'plan', label: 'Individualized Plan (Tier 1)', icon: Target },
            { id: 'notes', label: 'Clinical SOAP Notes', icon: FileText },
            { id: 'progress', label: 'Ease & Progress Trends', icon: TrendingUp },
            { id: 'overview', label: 'Intake & Consent Overview', icon: User }
          ].map(tab => {
            const Icon = tab.icon;
            const isCurrent = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition ${
                  isCurrent
                    ? 'bg-teal-800 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: RECORDINGS & AI METRICS REVIEW (With Editable Metric Overwrite & Audit Retention) */}
      {activeTab === 'recordings' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-teal-100 p-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-serif">
                Practice Audio Sessions & Telemetry
              </h3>
              <p className="text-xs text-slate-500">
                Review patient audio, validate automated AI observations, and correct rhythm telemetry.
              </p>
            </div>
            <span className="text-xs text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full font-medium">
              {patientSessions.length} Total Sessions Recorded
            </span>
          </div>

          {patientSessions.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500 text-sm">
              No practice recordings submitted by this patient yet.
            </div>
          ) : (
            <div className="space-y-4">
              {patientSessions.map(sess => {
                const isEditing = editingSessionId === sess.id;
                const isPlaying = playingSessionId === sess.id;

                return (
                  <article
                    key={sess.id}
                    id={`session-record-${sess.id}`}
                    className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setPlayingSessionId(isPlaying ? null : sess.id)}
                          className="w-10 h-10 rounded-xl bg-teal-800 text-white flex items-center justify-center hover:bg-teal-900 transition shadow-xs"
                          aria-label={isPlaying ? 'Pause audio playback' : 'Play mock audio'}
                        >
                          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-white" />}
                        </button>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-base font-bold text-slate-900 font-serif">
                              {sess.exerciseTitle}
                            </h4>
                            <span className="text-xs text-slate-500 font-mono">
                              ({sess.audioDuration})
                            </span>
                          </div>
                          <span className="text-xs text-slate-500">
                            {sess.date} • {sess.source === 'plan' ? 'Tier 1 Plan Drill' : 'Tier 2 General Library'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {sess.isFlagged && (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-900 bg-amber-100 border border-amber-300 px-2.5 py-1 rounded-full">
                            <Flag className="w-3.5 h-3.5 text-amber-800" />
                            Flagged for Review
                          </span>
                        )}
                        <span
                          className={`text-xs font-medium px-2.5 py-1 rounded-full border ${
                            sess.status === 'Reviewed'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-amber-50 text-amber-800 border-amber-200'
                          }`}
                        >
                          {sess.status}
                        </span>
                      </div>
                    </div>

                    {/* Patient's Spoken Passage */}
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-700">
                      <span className="text-[10px] uppercase font-semibold text-slate-500 block mb-1">
                        Spoken Prompt:
                      </span>
                      <p className="italic text-slate-900 font-medium font-serif">
                        "{sess.promptText}"
                      </p>
                    </div>

                    {/* AI Observations Card (Strictly Hedged) */}
                    <div className="bg-teal-50/50 border border-teal-100 rounded-xl p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-teal-950 uppercase tracking-wider">
                          Automated Non-Diagnostic Observations
                        </span>
                        <span className="text-[10px] text-teal-800 bg-teal-100/80 px-2 py-0.5 rounded-md">
                          AI Baseline
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed font-medium">
                        {sess.aiFeedbackSummary}
                      </p>
                      <ul className="text-xs text-slate-600 space-y-1 list-disc pl-4 pt-1">
                        {sess.aiObservations.map((obs, i) => (
                          <li key={i}>{obs}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Flag Reason if flagged */}
                    {sess.isFlagged && sess.flagReason && (
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-950 space-y-1">
                        <strong className="font-semibold block">Patient Flag Note:</strong>
                        <p>{sess.flagReason}</p>
                      </div>
                    )}

                    {/* Speech Metrics: AI Original vs Clinician Corrected */}
                    <div className="border-t border-slate-100 pt-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                            Speech Metrics Audit Trail
                          </h5>
                          <p className="text-[11px] text-slate-500">
                            Clinician corrections adjust patient records while preserving original AI estimations.
                          </p>
                        </div>

                        {!isEditing && (
                          <button
                            id={`edit-metrics-btn-${sess.id}`}
                            onClick={() => handleStartEditMetrics(sess)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-medium transition"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span>Correct Metrics</span>
                          </button>
                        )}
                      </div>

                      {/* Display or Edit Grid */}
                      {isEditing ? (
                        <div className="bg-slate-50 border border-teal-300 rounded-xl p-4 space-y-3">
                          <span className="text-xs font-semibold text-teal-900 block">
                            Correcting Session #{sess.id} Metrics:
                          </span>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <div>
                              <label className="text-[11px] text-slate-600 block mb-1">Pauses</label>
                              <input
                                type="number"
                                value={metricForm.pauses}
                                onChange={e => setMetricForm({ ...metricForm, pauses: Number(e.target.value) })}
                                className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                              />
                            </div>
                            <div>
                              <label className="text-[11px] text-slate-600 block mb-1">Repetitions</label>
                              <input
                                type="number"
                                value={metricForm.repetitions}
                                onChange={e => setMetricForm({ ...metricForm, repetitions: Number(e.target.value) })}
                                className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                              />
                            </div>
                            <div>
                              <label className="text-[11px] text-slate-600 block mb-1">Prolongations</label>
                              <input
                                type="number"
                                value={metricForm.prolongations}
                                onChange={e => setMetricForm({ ...metricForm, prolongations: Number(e.target.value) })}
                                className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                              />
                            </div>
                            <div>
                              <label className="text-[11px] text-slate-600 block mb-1">Speech Rate (WPM)</label>
                              <input
                                type="number"
                                value={metricForm.speechRateWpm}
                                onChange={e => setMetricForm({ ...metricForm, speechRateWpm: Number(e.target.value) })}
                                className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                              />
                            </div>
                          </div>

                          <div className="flex justify-end gap-2 pt-2">
                            <button
                              onClick={() => setEditingSessionId(null)}
                              className="px-3 py-1.5 border border-slate-300 text-slate-700 text-xs rounded-lg hover:bg-slate-100"
                            >
                              Cancel
                            </button>
                            <button
                              id={`save-metrics-btn-${sess.id}`}
                              onClick={() => handleSaveMetrics(sess.id)}
                              className="px-4 py-1.5 bg-teal-800 hover:bg-teal-900 text-white text-xs font-semibold rounded-lg"
                            >
                              Save Clinical Overwrite
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {/* Pauses */}
                          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                            <span className="text-[11px] text-slate-500 block">Breath Pauses</span>
                            <div className="flex items-baseline gap-2 mt-0.5">
                              <span className="text-base font-bold text-slate-900">
                                {sess.correctedMetrics ? sess.correctedMetrics.pauses : sess.originalMetrics.pauses}
                              </span>
                              {sess.correctedMetrics && sess.correctedMetrics.pauses !== sess.originalMetrics.pauses && (
                                <span className="text-[10px] text-slate-400 line-through">
                                  (AI: {sess.originalMetrics.pauses})
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Repetitions */}
                          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                            <span className="text-[11px] text-slate-500 block">Repetitions</span>
                            <div className="flex items-baseline gap-2 mt-0.5">
                              <span className="text-base font-bold text-slate-900">
                                {sess.correctedMetrics ? sess.correctedMetrics.repetitions : sess.originalMetrics.repetitions}
                              </span>
                              {sess.correctedMetrics && sess.correctedMetrics.repetitions !== sess.originalMetrics.repetitions && (
                                <span className="text-[10px] text-slate-400 line-through">
                                  (AI: {sess.originalMetrics.repetitions})
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Prolongations */}
                          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                            <span className="text-[11px] text-slate-500 block">Prolongations</span>
                            <div className="flex items-baseline gap-2 mt-0.5">
                              <span className="text-base font-bold text-slate-900">
                                {sess.correctedMetrics ? sess.correctedMetrics.prolongations : sess.originalMetrics.prolongations}
                              </span>
                              {sess.correctedMetrics && sess.correctedMetrics.prolongations !== sess.originalMetrics.prolongations && (
                                <span className="text-[10px] text-slate-400 line-through">
                                  (AI: {sess.originalMetrics.prolongations})
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Speech Rate */}
                          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                            <span className="text-[11px] text-slate-500 block">Speech Rate</span>
                            <div className="flex items-baseline gap-2 mt-0.5">
                              <span className="text-base font-bold text-slate-900">
                                {sess.correctedMetrics ? sess.correctedMetrics.speechRateWpm : sess.originalMetrics.speechRateWpm} WPM
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Verification Audit Note */}
                      {sess.correctedMetrics && (
                        <p className="text-[11px] text-emerald-800 bg-emerald-50/70 border border-emerald-200 rounded-lg p-2 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                          <span>
                            Metrics clinically reviewed by {sess.correctedBy} on {sess.correctedAt}.
                          </span>
                        </p>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: INDIVIDUALIZED PLAN (Tier 1 Drill Management) */}
      {activeTab === 'plan' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-teal-100 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-serif">
                Individualized Exercises & Weekly Targets
              </h3>
              <p className="text-xs text-slate-500">
                Customized clinician drills assigned specifically to {patient.name}.
              </p>
            </div>

            <button
              id="add-custom-exercise-btn"
              onClick={() => setIsAddingExercise(true)}
              className="px-4 py-2.5 bg-teal-800 hover:bg-teal-900 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs transition"
            >
              <Plus className="w-4 h-4" />
              <span>Create Individualized Drill</span>
            </button>
          </div>

          {/* New Exercise Form Modal / Drawer */}
          {isAddingExercise && (
            <div className="bg-slate-50 border-2 border-teal-600 rounded-2xl p-6 space-y-4">
              <h4 className="text-sm font-bold text-teal-950 font-serif">
                Create New Tier 1 Individualized Exercise
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Exercise Title:
                  </label>
                  <input
                    type="text"
                    value={newExTitle}
                    onChange={e => setNewExTitle(e.target.value)}
                    placeholder="e.g. Gentle Onset with Meeting Slide Openers"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Target Frequency:
                  </label>
                  <input
                    type="text"
                    value={newExFreq}
                    onChange={e => setNewExFreq(e.target.value)}
                    placeholder="e.g. 3x / week (morning)"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Clinical Rationale / Description:
                </label>
                <input
                  type="text"
                  value={newExDesc}
                  onChange={e => setNewExDesc(e.target.value)}
                  placeholder="e.g. Desensitization drill for team introductions"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Custom Practice Passage (Sample Prompt):
                </label>
                <textarea
                  rows={2}
                  value={newExPrompt}
                  onChange={e => setNewExPrompt(e.target.value)}
                  placeholder="e.g. Good morning team, today we are walking through the quarterly roadmap..."
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Technique Instructions (one per line):
                </label>
                <textarea
                  rows={3}
                  value={newExInstructions}
                  onChange={e => setNewExInstructions(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingExercise(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 text-xs rounded-xl hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  id="confirm-create-drill-btn"
                  onClick={handleCreateExercise}
                  className="px-5 py-2 bg-teal-800 hover:bg-teal-900 text-white text-xs font-semibold rounded-xl"
                >
                  Assign to Patient
                </button>
              </div>
            </div>
          )}

          {/* List of Tier 1 Exercises */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tier1Exercises.map(ex => (
              <div
                key={ex.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 relative shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-emerald-900 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                    Tier 1 • Individualized
                  </span>
                  <button
                    onClick={() => removeTier1Exercise(ex.id)}
                    className="text-slate-400 hover:text-rose-700 p-1 rounded-lg transition"
                    title="Remove drill"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <h4 className="text-base font-bold text-slate-900 font-serif">
                  {ex.title}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {ex.description}
                </p>

                <div className="bg-slate-50 rounded-xl p-3 text-xs text-slate-700">
                  <span className="text-[10px] uppercase font-semibold text-slate-500 block mb-1">
                    Passage:
                  </span>
                  <p className="italic">"{ex.samplePrompt}"</p>
                </div>

                <div className="text-[11px] text-slate-500 pt-1 flex justify-between">
                  <span>Assigned by: {ex.assignedByTherapist || 'Clinician'}</span>
                  <span>Target: {ex.targetFrequency || '3x / week'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: CLINICAL SOAP NOTES */}
      {activeTab === 'notes' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-teal-100 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-serif">
                Clinical Progress & SOAP Notes
              </h3>
              <p className="text-xs text-slate-500">
                Document session observations, technique internalization, and treatment adjustments.
              </p>
            </div>

            <button
              id="new-soap-note-btn"
              onClick={() => setIsAddingNote(true)}
              className="px-4 py-2.5 bg-teal-800 hover:bg-teal-900 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs transition"
            >
              <Plus className="w-4 h-4" />
              <span>Add Clinical Note</span>
            </button>
          </div>

          {/* New Note Creator Form */}
          {isAddingNote && (
            <div className="bg-slate-50 border-2 border-teal-600 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-teal-950 font-serif">
                  New Clinical Note Entry
                </h4>
                <div className="flex gap-2">
                  {(['SOAP', 'Observation', 'Check-in', 'Milestone'] as const).map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setNoteType(type)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                        noteType === type
                          ? 'bg-teal-800 text-white'
                          : 'bg-white border border-slate-200 text-slate-700'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                rows={5}
                value={noteContent}
                onChange={e => setNoteContent(e.target.value)}
                placeholder="S: Subjective patient reports...&#10;O: Objective acoustic review and metric verification...&#10;A: Assessment of fluency and acceptance...&#10;P: Plan for upcoming week..."
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus-visible:ring-2 focus-visible:ring-teal-700"
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingNote(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 text-xs rounded-xl hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  id="save-clinical-note-btn"
                  onClick={handleSaveNote}
                  className="px-5 py-2 bg-teal-800 hover:bg-teal-900 text-white text-xs font-semibold rounded-xl"
                >
                  Save to Patient Chart
                </button>
              </div>
            </div>
          )}

          {/* Notes List */}
          <div className="space-y-4">
            {patientNotes.map(note => (
              <div
                key={note.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 shadow-xs"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                      {note.noteType}
                    </span>
                    <span className="text-xs text-slate-700 font-semibold">
                      {note.therapistName}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 font-mono">
                    {note.timestamp}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-800 whitespace-pre-line leading-relaxed">
                  {note.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: PROGRESS TRENDS */}
      {activeTab === 'progress' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-teal-100 p-6 space-y-2">
            <h3 className="text-lg font-bold text-slate-900 font-serif">
              Longitudinal Ease & Self-Report Trends ({patient.name})
            </h3>
            <p className="text-xs text-slate-500">
              Tracking subjective physical ease, speaking confidence, and situational anxiety over time.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
                <span className="text-xs text-slate-500 block">Avg Comfort</span>
                <span className="text-xl font-bold text-teal-900">3.8 / 5</span>
                <span className="text-[11px] text-emerald-700 block">Trending upward</span>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
                <span className="text-xs text-slate-500 block">Avg Confidence</span>
                <span className="text-xl font-bold text-teal-900">3.9 / 5</span>
                <span className="text-[11px] text-emerald-700 block">Significant increase</span>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
                <span className="text-xs text-slate-500 block">Speaking Anxiety</span>
                <span className="text-xl font-bold text-teal-900">2.1 / 5</span>
                <span className="text-[11px] text-emerald-700 block">Decreased from 4.2</span>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
                <span className="text-xs text-slate-500 block">Session Frequency</span>
                <span className="text-xl font-bold text-teal-900">{patientSessions.length} total</span>
                <span className="text-[11px] text-slate-500 block">Steady engagement</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: INTAKE & CONSENT OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-teal-100 p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 font-serif">
              Intake Questionnaire & Consent Verification
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 text-xs">
                <span className="text-[11px] font-semibold text-slate-500 uppercase block">
                  Consent Verification:
                </span>
                <p>
                  Audio Consent: <strong>{patient.hasConsent ? 'Granted' : 'Denied'}</strong>
                </p>
                <p>Timestamp: {patient.consentTimestamp || 'N/A'}</p>
                {patient.isMinor && (
                  <p>Guardian: {patient.guardianName} ({patient.guardianEmail})</p>
                )}
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 text-xs">
                <span className="text-[11px] font-semibold text-slate-500 uppercase block">
                  Stated Therapy Goals:
                </span>
                <ul className="list-disc pl-4 space-y-1">
                  {patient.therapyGoals.map((g, idx) => (
                    <li key={idx}>{g}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Detailed intake answers */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Questionnaire Responses:
              </h4>
              <div className="space-y-2 text-xs">
                {Object.entries(patient.intakeAnswers).map(([k, v]) => (
                  <div key={k} className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="font-semibold text-slate-800 block capitalize mb-1">
                      {k.replace(/([A-Z])/g, ' $1')}:
                    </span>
                    <span className="text-slate-700">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <FootnoteDisclaimer />
    </div>
  );
};
