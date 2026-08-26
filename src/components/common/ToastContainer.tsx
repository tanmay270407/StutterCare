import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { Info, CheckCircle2, AlertCircle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { notifications, removeNotification } = useApp();

  return (
    <aside
      id="toast-notification-area"
      aria-live="polite"
      aria-label="System notifications"
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none px-4 sm:px-0"
    >
      <AnimatePresence>
        {notifications.map(notif => {
          const isAmber = notif.type === 'amber';
          const isSuccess = notif.type === 'success';

          return (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
              id={`toast-${notif.id}`}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-lg border text-sm transition-colors ${
                isSuccess
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                  : isAmber
                  ? 'bg-amber-50 border-amber-200 text-amber-950'
                  : 'bg-teal-900 border-teal-800 text-teal-50'
              }`}
            >
              <div className="shrink-0 mt-0.5">
                {isSuccess ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                ) : isAmber ? (
                  <AlertCircle className="w-5 h-5 text-amber-700" />
                ) : (
                  <Info className="w-5 h-5 text-teal-300" />
                )}
              </div>

              <div className="flex-1">
                <p className="font-medium leading-snug">{notif.message}</p>
                <span className={`text-[11px] opacity-75 mt-1 inline-block ${isSuccess || isAmber ? 'text-slate-600' : 'text-teal-200'}`}>
                  {notif.timestamp}
                </span>
              </div>

              <button
                id={`toast-close-${notif.id}`}
                onClick={() => removeNotification(notif.id)}
                className="shrink-0 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg focus-visible:ring-2 focus-visible:ring-teal-600 transition"
                aria-label="Dismiss notification"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </aside>
  );
};
