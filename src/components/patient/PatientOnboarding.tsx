import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { INTAKE_QUESTIONS } from '../../data/mockData';
import { Shield, Lock, UserCheck, ArrowRight, ArrowLeft, Check, Sparkles } from 'lucide-react';

interface PatientOnboardingProps {
  onComplete: () => void;
  isOpen: boolean;
  onClose?: () => void;
}

export const PatientOnboarding: React.FC<PatientOnboardingProps> = ({ onComplete, isOpen, onClose }) => {
  const { currentPatient, updatePatientProfile, updatePatientConsent, addNotification } = useApp();

  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState({
    name: currentPatient.name,
    age: currentPatient.age || 25,
    preferredLanguage: currentPatient.preferredLanguage || 'English',
    therapyGoals: [...currentPatient.therapyGoals],
    intakeAnswers: { ...currentPatient.intakeAnswers },
    hasConsent: currentPatient.hasConsent,
    isMinor: (currentPatient.age || 25) < 18,
    guardianName: currentPatient.guardianName || '',
    guardianEmail: currentPatient.guardianEmail || '',
    guardianConfirmed: currentPatient.isMinor && currentPatient.hasConsent
  });

  const [newGoal, setNewGoal] = useState('');

  if (!isOpen) return null;

  const isMinor = Number(formData.age) < 18;

  const handleNext = () => {
    if (step === 1) {
      if (!formData.name.trim()) {
        addNotification('Please enter your preferred name.', 'amber');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      if (!formData.hasConsent) {
        addNotification('Audio consent is required to proceed with practice recordings.', 'amber');
        return;
      }
      if (isMinor && (!formData.guardianName || !formData.guardianEmail || !formData.guardianConfirmed)) {
        addNotification('Parent/Guardian verification details are required for members under 18.', 'amber');
        return;
      }

      // Finalize and save
      updatePatientProfile(currentPatient.id, {
        name: formData.name,
        age: Number(formData.age),
        preferredLanguage: formData.preferredLanguage,
        therapyGoals: formData.therapyGoals,
        intakeAnswers: formData.intakeAnswers,
        isMinor
      });

      updatePatientConsent(
        currentPatient.id,
        formData.hasConsent,
        isMinor ? { name: formData.guardianName, email: formData.guardianEmail } : undefined
      );

      addNotification('Onboarding & consent setup completed successfully.', 'success');
      onComplete();
    }
  };

  const handleAddGoal = () => {
    if (newGoal.trim() && !formData.therapyGoals.includes(newGoal.trim())) {
      setFormData(prev => ({
        ...prev,
        therapyGoals: [...prev.therapyGoals, newGoal.trim()]
      }));
      setNewGoal('');
    }
  };

  const handleRemoveGoal = (goal: string) => {
    setFormData(prev => ({
      ...prev,
      therapyGoals: prev.therapyGoals.filter(g => g !== goal)
    }));
  };

  return (
    <div
      id="patient-onboarding-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-modal-title"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
    >
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-teal-100 shadow-2xl p-6 sm:p-8 my-8">
        {/* Step Indicator */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-teal-800">
              Welcome to StutterCare • Step {step} of 3
            </span>
            <h2 id="onboarding-modal-title" className="text-xl font-bold text-slate-900 mt-1 font-serif">
              {step === 1 && 'Personal Profile & Goals'}
              {step === 2 && 'Non-Diagnostic Speech Reflections'}
              {step === 3 && 'Privacy, Audio Processing & Consent'}
            </h2>
          </div>
          <div className="flex gap-1.5" aria-hidden="true">
            {[1, 2, 3].map(s => (
              <div
                key={s}
                className={`w-8 h-2 rounded-full transition-all ${
                  s === step ? 'bg-teal-700 w-10' : s < step ? 'bg-teal-300' : 'bg-slate-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* STEP 1: Basic Info & Goals */}
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <label htmlFor="input-name" className="block text-sm font-medium text-slate-800 mb-1">
                Preferred Name
              </label>
              <input
                id="input-name"
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Aarav Sharma"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus-visible:ring-2 focus-visible:ring-teal-700"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="input-age" className="block text-sm font-medium text-slate-800 mb-1">
                  Age
                </label>
                <input
                  id="input-age"
                  type="number"
                  min="10"
                  max="100"
                  value={formData.age}
                  onChange={e => setFormData({ ...formData, age: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus-visible:ring-2 focus-visible:ring-teal-700"
                />
                {isMinor && (
                  <p className="text-xs text-amber-800 mt-1 flex items-center gap-1 font-medium">
                    Members under 18 require parent/guardian consent in Step 3.
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="input-language" className="block text-sm font-medium text-slate-800 mb-1">
                  Preferred Language
                </label>
                <select
                  id="input-language"
                  value={formData.preferredLanguage}
                  onChange={e => setFormData({ ...formData, preferredLanguage: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus-visible:ring-2 focus-visible:ring-teal-700"
                >
                  <option value="English">English</option>
                  <option value="Spanish">Español (Spanish)</option>
                  <option value="French">Français (French)</option>
                  <option value="German">Deutsch (German)</option>
                  <option value="Mandarin">中文 (Mandarin)</option>
                  <option value="Hindi">हिन्दी (Hindi)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-800 mb-1">
                Your Personal Therapy / Practice Goals
              </label>
              <p className="text-xs text-slate-500 mb-2">
                What would make speaking feel more comfortable and spacious for you?
              </p>

              <div className="flex flex-wrap gap-2 mb-3">
                {formData.therapyGoals.map((goal, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-50 border border-teal-200 text-teal-900 rounded-full text-xs"
                  >
                    <span>{goal}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveGoal(goal)}
                      className="hover:text-amber-800 p-0.5 rounded-full"
                      aria-label={`Remove goal: ${goal}`}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  id="input-new-goal"
                  type="text"
                  value={newGoal}
                  onChange={e => setNewGoal(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddGoal())}
                  placeholder="e.g. Feel calm when introducing myself"
                  className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus-visible:ring-2 focus-visible:ring-teal-700"
                />
                <button
                  type="button"
                  id="add-goal-btn"
                  onClick={handleAddGoal}
                  className="px-4 py-2 bg-teal-800 hover:bg-teal-900 text-white rounded-xl text-xs font-medium transition"
                >
                  Add Goal
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Non-Diagnostic Questionnaire */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="bg-teal-50/60 border border-teal-100 p-3.5 rounded-xl text-xs text-teal-900 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold">Non-Diagnostic Intake:</strong> These questions help customize your practice pacing and clinician collaboration. They are completely voluntary and never generate diagnostic labels.
              </div>
            </div>

            {INTAKE_QUESTIONS.map(q => (
              <div key={q.id} className="space-y-2">
                <label className="block text-sm font-medium text-slate-900">
                  {q.question}
                </label>
                <div className="space-y-1.5">
                  {q.options.map((opt, oIdx) => {
                    const isSelected = formData.intakeAnswers[q.id] === opt;
                    return (
                      <button
                        key={oIdx}
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            intakeAnswers: { ...formData.intakeAnswers, [q.id]: opt }
                          })
                        }
                        className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs sm:text-sm border transition flex items-center justify-between ${
                          isSelected
                            ? 'bg-teal-50 border-teal-600 text-teal-950 font-medium'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span>{opt}</span>
                        {isSelected && <Check className="w-4 h-4 text-teal-700 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* STEP 3: Consent & Audio Processing */}
        {step === 3 && (
          <div className="space-y-5">
            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-3">
              <div className="flex items-center gap-2 text-teal-950 font-semibold text-sm">
                <Lock className="w-4 h-4 text-teal-700" />
                <span>Plain-Language Audio & Privacy Policy</span>
              </div>
              <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-5 leading-relaxed">
                <li>
                  <strong>Microphone usage:</strong> Audio is recorded ONLY when you deliberately press "Start Recording" during an exercise.
                </li>
                <li>
                  <strong>Automated estimation:</strong> Feedback on rhythm and pauses uses non-diagnostic pattern detection. It does not replace clinical pathology evaluations.
                </li>
                <li>
                  <strong>Clinician access:</strong> If you are matched with a licensed SLP, your session audio is available in their secure portal for clinical verification.
                </li>
                <li>
                  <strong>Right to erase:</strong> You may permanently delete your recordings and speech logs anytime from Settings.
                </li>
              </ul>
            </div>

            {/* Explicit Consent Checkbox */}
            <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  id="consent-checkbox-main"
                  type="checkbox"
                  checked={formData.hasConsent}
                  onChange={e => setFormData({ ...formData, hasConsent: e.target.checked })}
                  className="mt-1 w-4 h-4 text-teal-700 rounded border-slate-300 focus:ring-teal-700 cursor-pointer"
                />
                <span className="text-xs sm:text-sm text-slate-800 leading-snug">
                  <strong>I give explicit consent</strong> for StutterCare to record and process practice audio for personal self-reflection and clinician review under non-diagnostic safety standards.
                </span>
              </label>
            </div>

            {/* Under-18 Parent/Guardian Verification */}
            {isMinor && (
              <div className="border border-amber-200 bg-amber-50/50 p-4 rounded-xl space-y-3">
                <div className="flex items-center gap-2 text-amber-950 font-medium text-xs sm:text-sm">
                  <UserCheck className="w-4 h-4 text-amber-700" />
                  <span>Parent / Legal Guardian Consent (Member is under 18)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="guardian-name" className="block text-xs font-medium text-slate-700 mb-1">
                      Guardian Full Name
                    </label>
                    <input
                      id="guardian-name"
                      type="text"
                      value={formData.guardianName}
                      onChange={e => setFormData({ ...formData, guardianName: e.target.value })}
                      placeholder="e.g. Suresh Reddy"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus-visible:ring-2 focus-visible:ring-teal-700"
                    />
                  </div>
                  <div>
                    <label htmlFor="guardian-email" className="block text-xs font-medium text-slate-700 mb-1">
                      Guardian Email Address
                    </label>
                    <input
                      id="guardian-email"
                      type="email"
                      value={formData.guardianEmail}
                      onChange={e => setFormData({ ...formData, guardianEmail: e.target.value })}
                      placeholder="e.g. parent@example.com"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus-visible:ring-2 focus-visible:ring-teal-700"
                    />
                  </div>
                </div>

                <label className="flex items-start gap-2.5 cursor-pointer pt-1">
                  <input
                    id="guardian-confirm-checkbox"
                    type="checkbox"
                    checked={formData.guardianConfirmed}
                    onChange={e => setFormData({ ...formData, guardianConfirmed: e.target.checked })}
                    className="mt-0.5 w-4 h-4 text-amber-700 rounded border-slate-300 focus:ring-amber-700 cursor-pointer"
                  />
                  <span className="text-xs text-slate-800">
                    I confirm that I am the legal parent/guardian and authorize speech practice sessions under these privacy terms.
                  </span>
                </label>
              </div>
            )}
          </div>
        )}

        {/* Footer Navigation */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-100 mt-6">
          {step > 1 ? (
            <button
              type="button"
              id="onboarding-back-btn"
              onClick={() => setStep(step - 1)}
              className="inline-flex items-center gap-1.5 px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-medium rounded-xl transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          ) : (
            <div>
              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="text-xs text-slate-500 hover:text-slate-700 underline"
                >
                  Review existing settings
                </button>
              )}
            </div>
          )}

          <button
            type="button"
            id="onboarding-next-btn"
            onClick={handleNext}
            disabled={step === 3 && (!formData.hasConsent || (isMinor && !formData.guardianConfirmed))}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-white transition shadow-sm ${
              step === 3 && (!formData.hasConsent || (isMinor && !formData.guardianConfirmed))
                ? 'bg-slate-300 cursor-not-allowed text-slate-500'
                : 'bg-teal-800 hover:bg-teal-900 focus-visible:ring-2 focus-visible:ring-teal-700'
            }`}
          >
            <span>{step === 3 ? 'Complete Setup' : 'Continue'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
