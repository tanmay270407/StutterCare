import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { ToastContainer } from './components/common/ToastContainer';
import { PatientPortal } from './components/patient/PatientPortal';
import { TherapistPortal } from './components/therapist/TherapistPortal';
import { AdminPortal } from './components/admin/AdminPortal';

const AppContent: React.FC = () => {
  const { currentRole } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col selection:bg-teal-100 selection:text-teal-900 font-sans">
      {/* Top Navbar & Portal Switcher */}
      <Navbar />

      {/* Global Notifications & Mode Switch Toasts */}
      <ToastContainer />

      {/* Main Container */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentRole === 'patient' && <PatientPortal />}
        {currentRole === 'therapist' && <TherapistPortal />}
        {currentRole === 'admin' && <AdminPortal />}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
