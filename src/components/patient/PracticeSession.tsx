import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Exercise, SpeechMetrics, SessionRating } from '../../types';
import {
  Mic,
  Square,
  Sparkles,
  Flag,
  RotateCcw,
  CheckCircle2,
  Volume2,
  Shield,
  HelpCircle,
  Clock,
  ArrowRight
} from 'lucide-react';
import { FootnoteDisclaimer } from '../common/FootnoteDisclaimer';

export const PracticeSession: React.FC = () => {
  const {
    currentPatient,
    tier1Exercises,
    tier2Exercises,
    selectedExerciseForPractice,
    setSelectedExerciseForPractice,
    addPracticeSession,
    flagSession,
    setPatientActiveTab
  } = useApp();

  const isConnected = currentPatient.status === 'connected';

  // Current active exercise for this session
  const [exercise, setExercise] = useState<Exercise>(() => {
    if (selectedExerciseForPractice) return selectedExerciseForPractice;
    if (isConnected && tier1Exercises.length > 0) return tier1Exercises[0];
    return tier2Exercises[0];
  });

  useEffect(() => {
    if (selectedExerciseForPractice) {
      setExercise(selectedExerciseForPractice);
    }
  }, [selectedExerciseForPractice]);

  // Recording states: 'idle' | 'recording' | 'analyzing' | 'completed'
  const [recordState, setRecordState] = useState<'idle' | 'recording' | 'analyzing' | 'completed'>('idle');
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const timerRef = useRef<any>(null);

  // Simulated metrics & feedback state
  const [metrics, setMetrics] = useState<SpeechMetrics>({
    pauses: 2,
    repetitions: 1,
    prolongations: 1,
    speechRateWpm: 124
  });

  const [aiSummary, setAiSummary] = useState<string>(
    'Speech flow appeared steady and measured. Gentle pauses were observed across thought groups.'
  );

  const [aiObservations, setAiObservations] = useState<string[]>([
    'Possible sound repetition detected near the opening clause (estimated around 0:04).',
    'Vocal onset transitioned smoothly on following vowel segments.',
    'Pacing aligned well with comfortable conversational range (~124 WPM).'
  ]);

  // Flag reporting modal
  const [isFlagModalOpen, setIsFlagModalOpen] = useState(false);
  const [flagReason, setFlagReason] = useState('');
  const [flaggedSessionId, setFlaggedSessionId] = useState<string | null>(null);
  const [flagSubmitted, setFlagSubmitted] = useState(false);

  // Self-reflection ratings (1-5 scale)
  const [ratings, setRatings] = useState<SessionRating>({
    comfort: 4,
    effort: 3,
    confidence: 3,
    anxiety: 2
  });

  const [savedSessionId, setSavedSessionId] = useState<string | null>(null);

  // Timer simulation
  useEffect(() => {
    if (recordState === 'recording') {
      timerRef.current = setInterval(() => {
        setTimerSeconds(s => s + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [recordState]);

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleStartRecording = () => {
    setTimerSeconds(0);
    setRecordState('recording');
    setSavedSessionId(null);
    setFlagSubmitted(false);
  };

  const handleStopRecording = () => {
    setRecordState('analyzing');

    // Simulate non-diagnostic automated processing
    setTimeout(() => {
      // Generate realistic, strictly hedged observations based on duration and exercise
      const estWpm = Math.floor(110 + Math.random() * 25);
      const estPauses = Math.floor(1 + Math.random() * 3);
      const estReps = Math.floor(Math.random() * 2);
      const estProlongs = Math.floor(Math.random() * 2);

      const newMetrics: SpeechMetrics = {
        pauses: estPauses,
        repetitions: estReps,
        prolongations: estProlongs,
        speechRateWpm: estWpm
      };

      const hedgedPhrases = [
        'Speech pace appeared unhurried and comfortable.',
        'Subtle, possible sound elongation noted during initial phrase transition.',
        'Natural breath cadence observed with gentle pauses between idea clusters.',
        'Vocal initiation transitioned softly into connected speech.'
      ];

      const newObservations = [
        estReps > 0
          ? 'Possible syllable repetition detected in this recording snippet (estimated).'
          : 'No marked sound repetitions detected in this passage.',
        estProlongs > 0
          ? 'Possible brief sound prolongation noted near initial vocalization.'
          : 'Vocal airflow appeared continuous through vowel transitions.',
        `Pacing remained measured at an estimated rate of ~${estWpm} words per minute.`
      ];

      setMetrics(newMetrics);
      setAiSummary('Pacing was unhurried. Potential subtle variations in vocal onset were observed.');
      setAiObservations(newObservations);
      setRecordState('completed');

      // Automatically store preliminary session
      const sid = addPracticeSession({
        patientId: currentPatient.id,
        patientName: currentPatient.name,
        date: new Date().toISOString().replace('T', ' ').substring(0, 16),
        exerciseId: exercise.id,
        exerciseTitle: exercise.title,
        promptText: exercise.samplePrompt,
        durationSeconds: timerSeconds || 24,
        audioDuration: formatTimer(timerSeconds || 24),
        source: exercise.tier === 1 ? 'plan' : 'library',
        aiFeedbackSummary: 'Pacing was unhurried. Potential subtle variations in vocal onset were observed.',
        aiObservations: newObservations,
        originalMetrics: newMetrics,
        status: isConnected ? 'Reviewed' : 'AI-guided — needs review',
        ratings: ratings,
        isFlagged: false
      });

      setSavedSessionId(sid);
    }, 1400);
  };

  const handleReportFeedback = () => {
    setIsFlagModalOpen(true);
  };

  const submitFlagReport = () => {
    if (savedSessionId) {
      flagSession(savedSessionId, flagReason || 'Patient indicated metrics felt inaccurate or non-representative.');
      setFlaggedSessionId(savedSessionId);
      setFlagSubmitted(true);
      setIsFlagModalOpen(false);
    }
  };

  return (
    <div id="practice-session-view" className="space-y-6 max-w-4xl mx-auto">
      {/* Exercise Selection Header */}
      <section className="bg-white rounded-2xl border border-teal-100 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                  exercise.tier === 1
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-teal-50 text-teal-800 border border-teal-200'
                }`}
              >
                {exercise.tier === 1 ? 'From your individualized plan' : 'From general practice library'}
              </span>
              <span className="text-xs text-slate-500">
                Tier {exercise.tier} Practice
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif">
              {exercise.title}
            </h2>
          </div>

          {/* Quick exercise selector dropdown */}
          <div className="flex items-center gap-2">
            <label htmlFor="select-exercise" className="text-xs text-slate-500 font-medium whitespace-nowrap">
              Switch exercise:
            </label>
            <select
              id="select-exercise"
              value={exercise.id}
              onChange={e => {
                const found = [...tier1Exercises, ...tier2Exercises].find(ex => ex.id === e.target.value);
                if (found) {
                  setExercise(found);
                  setSelectedExerciseForPractice(found);
                  setRecordState('idle');
                  setTimerSeconds(0);
                  setSavedSessionId(null);
                }
              }}
              className="bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2 focus-visible:ring-2 focus-visible:ring-teal-700"
            >
              <optgroup label="Tier 1 — Individualized Plan">
                {tier1Exercises.map(ex => (
                  <option key={ex.id} value={ex.id}>
                    {ex.title}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Tier 2 — General Safe Library">
                {tier2Exercises.map(ex => (
                  <option key={ex.id} value={ex.id}>
                    {ex.title}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>
        </div>

        {/* Instructions */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
            Technique Guidance:
          </h3>
          <ul className="text-xs sm:text-sm text-slate-600 space-y-1.5 list-disc pl-5">
            {exercise.instructions.map((inst, i) => (
              <li key={i}>{inst}</li>
            ))}
          </ul>
        </div>

        {/* Speaking Prompt Card */}
        <div className="p-4 sm:p-5 bg-teal-50/60 border border-teal-100 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-teal-900 font-medium">
            <span className="flex items-center gap-1.5">
              <Volume2 className="w-4 h-4 text-teal-700" />
              Practice Passage (Read aloud at your comfortable pace):
            </span>
            <span className="text-[11px] text-teal-800 bg-white/80 px-2 py-0.5 rounded-md border border-teal-200/60">
              Zero rush • Pause anytime
            </span>
          </div>
          <p className="text-base sm:text-lg text-slate-900 font-medium leading-relaxed font-serif pt-1">
            "{exercise.samplePrompt}"
          </p>
        </div>
      </section>

      {/* Interactive Recording Deck */}
      <section className="bg-white rounded-2xl border border-teal-100 p-6 sm:p-8 shadow-xs text-center space-y-6">
        <div className="space-y-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Practice Audio Recorder
          </span>
          <div className="text-3xl sm:text-4xl font-mono font-bold text-slate-900">
            {formatTimer(timerSeconds)}
          </div>
          <p className="text-xs text-slate-500">
            {recordState === 'idle' && 'Press the microphone button when you are ready to begin.'}
            {recordState === 'recording' && 'Recording in progress... Speak easily without rushing.'}
            {recordState === 'analyzing' && 'Generating non-diagnostic rhythm observations...'}
            {recordState === 'completed' && 'Recording completed. Review your estimated feedback below.'}
          </p>
        </div>

        {/* Calm Visualizer Animation when Recording */}
        {recordState === 'recording' && (
          <div className="flex items-center justify-center gap-1.5 h-12 py-2" aria-label="Audio level indicator">
            {[40, 70, 30, 85, 55, 95, 60, 45, 80, 50, 65, 35].map((h, i) => (
              <div
                key={i}
                className="w-1.5 bg-teal-600 rounded-full animate-pulse transition-all"
                style={{
                  height: `${h}%`,
                  animationDelay: `${i * 80}ms`,
                  animationDuration: '900ms'
                }}
              />
            ))}
          </div>
        )}

        {/* Record / Stop Action Button */}
        <div className="flex items-center justify-center gap-4">
          {recordState === 'idle' && (
            <button
              id="mic-start-recording-btn"
              onClick={handleStartRecording}
              className="w-18 h-18 rounded-full bg-teal-800 hover:bg-teal-900 text-white flex items-center justify-center shadow-lg hover:shadow-xl transition transform active:scale-95 focus-visible:ring-4 focus-visible:ring-teal-700/40"
              aria-label="Start recording audio practice"
            >
              <Mic className="w-8 h-8" />
            </button>
          )}

          {recordState === 'recording' && (
            <button
              id="mic-stop-recording-btn"
              onClick={handleStopRecording}
              className="w-18 h-18 rounded-full bg-amber-700 hover:bg-amber-800 text-white flex items-center justify-center shadow-lg hover:shadow-xl transition transform active:scale-95 animate-pulse focus-visible:ring-4 focus-visible:ring-amber-700/40"
              aria-label="Stop recording audio practice"
            >
              <Square className="w-7 h-7 fill-white" />
            </button>
          )}

          {recordState === 'analyzing' && (
            <div className="w-16 h-16 rounded-full bg-slate-100 border border-teal-200 flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-teal-700 animate-spin" />
            </div>
          )}

          {recordState === 'completed' && (
            <button
              id="mic-record-again-btn"
              onClick={handleStartRecording}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs sm:text-sm font-medium transition"
            >
              <RotateCcw className="w-4 h-4 text-teal-700" />
              <span>Record Another Take</span>
            </button>
          )}
        </div>
      </section>

      {/* AI Feedback Card (Only hedged, non-diagnostic phrasing) */}
      {recordState === 'completed' && (
        <section
          id="ai-feedback-results-card"
          className="bg-white rounded-2xl border border-teal-200 p-6 sm:p-8 shadow-xs space-y-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 font-serif">
                  Automated Practice Observations
                </h3>
                <span className="text-xs text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200 inline-block mt-0.5">
                  Estimated metrics • Not a clinical diagnosis
                </span>
              </div>
            </div>

            {/* Small Flag Icon to Report Feedback */}
            <button
              id="report-feedback-btn"
              onClick={handleReportFeedback}
              disabled={flagSubmitted}
              className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition ${
                flagSubmitted
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200 cursor-default'
                  : 'bg-white text-slate-600 hover:text-amber-800 hover:bg-amber-50 border-slate-200'
              }`}
              aria-label="Report this feedback to a human reviewer"
            >
              <Flag className={`w-3.5 h-3.5 ${flagSubmitted ? 'text-emerald-700' : 'text-slate-500'}`} />
              <span>{flagSubmitted ? 'Sent to SLP Reviewer' : 'Report this feedback'}</span>
            </button>
          </div>

          {/* Feedback Summary (Hedging strictly enforced) */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
            <p className="text-xs text-slate-500 font-medium">Session Summary:</p>
            <p className="text-sm text-slate-800 leading-relaxed font-medium">
              {aiSummary}
            </p>
          </div>

          {/* Observations List */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Specific Acoustic Observations:
            </h4>
            <ul className="space-y-2">
              {aiObservations.map((obs, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 bg-teal-50/40 border border-teal-100 rounded-xl p-3"
                >
                  <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                  <span>{obs}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Estimated Metrics Grid */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Session Metrics (Automated Estimates)
              </h4>
              <span className="text-[11px] text-slate-500">
                Preserved for clinician review
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
                <span className="text-xs text-slate-500 block">Breath Pauses</span>
                <span className="text-lg font-bold text-slate-900">{metrics.pauses}</span>
                <span className="text-[10px] text-slate-400 block">instances</span>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
                <span className="text-xs text-slate-500 block">Possible Repetitions</span>
                <span className="text-lg font-bold text-slate-900">{metrics.repetitions}</span>
                <span className="text-[10px] text-slate-400 block">estimated</span>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
                <span className="text-xs text-slate-500 block">Prolongations</span>
                <span className="text-lg font-bold text-slate-900">{metrics.prolongations}</span>
                <span className="text-[10px] text-slate-400 block">estimated</span>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
                <span className="text-xs text-slate-500 block">Speech Rate</span>
                <span className="text-lg font-bold text-slate-900">{metrics.speechRateWpm}</span>
                <span className="text-[10px] text-slate-400 block">est. WPM</span>
              </div>
            </div>
          </div>

          {/* Post-Session Self-Reflection Rating Scales (1-5) */}
          <div className="border-t border-slate-100 pt-6 space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-slate-900 font-serif">
                How did speaking feel for you? (Self-Reflection)
              </h4>
              <p className="text-xs text-slate-500">
                Rate your internal experience. Your feelings matter more than automated numbers.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Comfort Scale */}
              <div className="space-y-1.5 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div className="flex justify-between text-xs font-medium text-slate-700">
                  <span>Physical Comfort:</span>
                  <span className="text-teal-900 font-bold">{ratings.comfort}/5</span>
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(val => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setRatings({ ...ratings, comfort: val })}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition ${
                        ratings.comfort === val
                          ? 'bg-teal-800 text-white'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between text-[10px] text-slate-500 pt-0.5">
                  <span>Tight / Strained</span>
                  <span>Very Relaxed</span>
                </div>
              </div>

              {/* Effort Scale */}
              <div className="space-y-1.5 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div className="flex justify-between text-xs font-medium text-slate-700">
                  <span>Speaking Effort:</span>
                  <span className="text-teal-900 font-bold">{ratings.effort}/5</span>
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(val => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setRatings({ ...ratings, effort: val })}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition ${
                        ratings.effort === val
                          ? 'bg-teal-800 text-white'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between text-[10px] text-slate-500 pt-0.5">
                  <span>Effortless</span>
                  <span>High Effort</span>
                </div>
              </div>

              {/* Confidence Scale */}
              <div className="space-y-1.5 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div className="flex justify-between text-xs font-medium text-slate-700">
                  <span>Self-Confidence:</span>
                  <span className="text-teal-900 font-bold">{ratings.confidence}/5</span>
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(val => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setRatings({ ...ratings, confidence: val })}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition ${
                        ratings.confidence === val
                          ? 'bg-teal-800 text-white'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between text-[10px] text-slate-500 pt-0.5">
                  <span>Hesitant</span>
                  <span>Grounding</span>
                </div>
              </div>

              {/* Anxiety Level Scale */}
              <div className="space-y-1.5 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div className="flex justify-between text-xs font-medium text-slate-700">
                  <span>Speaking Tension / Anxiety:</span>
                  <span className="text-teal-900 font-bold">{ratings.anxiety}/5</span>
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(val => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setRatings({ ...ratings, anxiety: val })}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition ${
                        ratings.anxiety === val
                          ? 'bg-teal-800 text-white'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between text-[10px] text-slate-500 pt-0.5">
                  <span>Peaceful / None</span>
                  <span>Noticeable Tension</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Links */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
            <button
              onClick={() => setPatientActiveTab('progress')}
              className="text-xs text-teal-800 hover:text-teal-950 font-medium inline-flex items-center gap-1.5"
            >
              <span>View your progress trend charts</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setPatientActiveTab('home')}
              className="px-4 py-2 bg-teal-800 hover:bg-teal-900 text-white rounded-xl text-xs font-medium transition"
            >
              Back to Home
            </button>
          </div>
        </section>
      )}

      {/* Flag Feedback Confirmation Modal */}
      {isFlagModalOpen && (
        <div
          id="flag-feedback-modal"
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 border border-teal-100 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                <Flag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 font-serif">
                  Report Feedback to a Human Reviewer
                </h3>
                <p className="text-xs text-slate-500">
                  A licensed SLP will review this recording and verify or adjust the automated observations.
                </p>
              </div>
            </div>

            <div>
              <label htmlFor="flag-reason-input" className="block text-xs font-medium text-slate-700 mb-1">
                Optional note for the clinician:
              </label>
              <textarea
                id="flag-reason-input"
                rows={3}
                value={flagReason}
                onChange={e => setFlagReason(e.target.value)}
                placeholder="e.g. The automated system counted my intentional breathing pause as a hesitation..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus-visible:ring-2 focus-visible:ring-teal-700"
              />
            </div>

            <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-xs text-emerald-950 flex items-start gap-2">
              <Shield className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
              <span>
                Your voice matters. Automated systems can misinterpret intentional techniques like voluntary pauses. Human SLPs prioritize your lived experience.
              </span>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsFlagModalOpen(false)}
                className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="button"
                id="submit-flag-report-btn"
                onClick={submitFlagReport}
                className="px-5 py-2 bg-teal-800 hover:bg-teal-900 text-white text-xs font-medium rounded-xl transition"
              >
                Send to Reviewer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Persistent Footnote */}
      <FootnoteDisclaimer />
    </div>
  );
};
