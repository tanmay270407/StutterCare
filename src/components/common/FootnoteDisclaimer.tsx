import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';

interface FootnoteDisclaimerProps {
  compact?: boolean;
  className?: string;
}

export const FootnoteDisclaimer: React.FC<FootnoteDisclaimerProps> = ({ compact = false, className = '' }) => {
  if (compact) {
    return (
      <div id="ai-disclaimer-compact" className={`flex items-center gap-2 text-xs text-slate-500 bg-slate-50 border border-slate-200/80 rounded-lg px-3 py-2 ${className}`}>
        <Info className="w-4 h-4 text-teal-700 shrink-0" aria-hidden="true" />
        <span>
          <strong className="font-medium text-slate-700">Notice:</strong> This app does not replace professional care. Speech metrics are automated estimates, not a clinical diagnosis.
        </span>
      </div>
    );
  }

  return (
    <footer
      id="ai-disclaimer-full"
      className={`mt-10 pt-4 pb-6 border-t border-slate-200 text-slate-600 text-xs leading-relaxed ${className}`}
      role="contentinfo"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-emerald-50/50 border border-emerald-100 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-teal-800 shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <p className="font-medium text-slate-800">
              Clinical & Privacy Notice
            </p>
            <p className="text-slate-600 mt-0.5">
              This app does not replace professional care. All feedback and rhythm observations are non-diagnostic, automated estimations intended for personal practice and clinician collaboration.
            </p>
          </div>
        </div>
        <span className="text-[11px] font-medium text-teal-800 bg-teal-100/70 border border-teal-200/60 px-2.5 py-1 rounded-full whitespace-nowrap self-start sm:self-center">
          Non-Diagnostic Standard
        </span>
      </div>
    </footer>
  );
};
