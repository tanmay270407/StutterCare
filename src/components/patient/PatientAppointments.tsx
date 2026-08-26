import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar,
  Video,
  Clock,
  UserCheck,
  CheckCircle2,
  PhoneCall,
  Plus,
  Shield,
  ExternalLink,
  Mic,
  Camera
} from 'lucide-react';
import { FootnoteDisclaimer } from '../common/FootnoteDisclaimer';

export const PatientAppointments: React.FC = () => {
  const { currentPatient, therapists, appointments, bookAppointment, cancelAppointment } = useApp();

  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedTherapistId, setSelectedTherapistId] = useState(therapists[0]?.id || 'th-1');
  const [bookingDate, setBookingDate] = useState('2026-09-08');
  const [bookingTime, setBookingTime] = useState('14:00 - 14:45');
  const [bookingType, setBookingType] = useState<'Video Telehealth' | 'Plan Consultation' | 'Monthly Review'>('Video Telehealth');

  // Telehealth Video Room Simulator Modal
  const [activeVideoRoom, setActiveVideoRoom] = useState<string | null>(null);

  const patientAppointments = appointments.filter(a => a.patientId === currentPatient.id);

  const handleBook = () => {
    const therapist = therapists.find(t => t.id === selectedTherapistId) || therapists[0];
    bookAppointment({
      patientId: currentPatient.id,
      patientName: currentPatient.name,
      therapistId: therapist.id,
      therapistName: therapist.name,
      date: bookingDate,
      time: bookingTime,
      type: bookingType
    });
    setIsBookingModalOpen(false);
  };

  return (
    <div id="patient-appointments-view" className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-teal-100 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
              Clinical Telehealth
            </span>
            <span className="text-xs text-slate-500">
              1:1 Speech-Language Pathology Consultations
            </span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 font-serif">
            Sessions & Appointments
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Meet with licensed SLPs for personalized goal setting, technique coaching, and supportive check-ins.
          </p>
        </div>

        <button
          id="book-session-main-btn"
          onClick={() => setIsBookingModalOpen(true)}
          className="px-5 py-3 bg-teal-800 hover:bg-teal-900 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-xs transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Book a Session</span>
        </button>
      </div>

      {/* Upcoming Appointments */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900 font-serif flex items-center gap-2">
          <Calendar className="w-5 h-5 text-teal-700" />
          <span>Your Scheduled Sessions</span>
        </h3>

        {patientAppointments.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
            <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-medium text-slate-700">No sessions currently scheduled</p>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Book a video check-in with your clinician whenever you feel ready to review your recordings together.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {patientAppointments.map(apt => (
              <div
                key={apt.id}
                id={`appointment-card-${apt.id}`}
                className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                    {apt.type}
                  </span>
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-md ${
                      apt.status === 'upcoming'
                        ? 'bg-emerald-50 text-emerald-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {apt.status === 'upcoming' ? 'Confirmed' : 'Completed'}
                  </span>
                </div>

                <div>
                  <h4 className="text-base font-bold text-slate-900 font-serif">
                    {apt.therapistName}
                  </h4>
                  <div className="flex items-center gap-3 text-xs text-slate-600 mt-1.5">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-teal-700" />
                      {apt.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-teal-700" />
                      {apt.time}
                    </span>
                  </div>
                </div>

                {/* Video Room Launch Button Placeholder */}
                {apt.status === 'upcoming' && (
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      id={`cancel-appointment-btn-${apt.id}`}
                      onClick={() => cancelAppointment(apt.id)}
                      className="text-xs text-slate-500 hover:text-rose-700 underline font-medium transition"
                    >
                      Cancel Session
                    </button>
                    <button
                      id={`join-video-room-btn-${apt.id}`}
                      onClick={() => setActiveVideoRoom(apt.id)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold transition shadow-xs"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Enter Video Room</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Future Telehealth Video Room Demo Modal */}
      {activeVideoRoom && (
        <div
          id="video-room-modal"
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full p-6 sm:p-8 text-white space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-800 flex items-center justify-center text-teal-100">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-serif">
                    Secure Speech Telehealth Room
                  </h3>
                  <p className="text-xs text-slate-400">
                    Encrypted WebRTC Session • Session with Dr. Kavya Rao
                  </p>
                </div>
              </div>

              <span className="text-xs bg-emerald-900/60 text-emerald-300 border border-emerald-700 px-3 py-1 rounded-full font-medium">
                Audio & Video Ready
              </span>
            </div>

            {/* Video Placeholder Stage */}
            <div className="bg-slate-950 rounded-2xl border border-slate-800 aspect-video flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
              <div className="w-20 h-20 rounded-full bg-teal-900/60 border border-teal-600 flex items-center justify-center text-teal-200 mb-3 animate-pulse">
                <Video className="w-10 h-10" />
              </div>
              <p className="text-sm font-semibold text-slate-200">
                Waiting for Dr. Kavya Rao to join...
              </p>
              <p className="text-xs text-slate-500 max-w-sm mt-1">
                Your microphone and speaker check passed. Take a slow, relaxing breath while the room connects.
              </p>

              {/* Local Self View Thumbnail */}
              <div className="absolute bottom-4 right-4 w-32 h-24 bg-slate-800 rounded-xl border border-slate-700 flex flex-col items-center justify-center text-[10px] text-slate-400">
                <Camera className="w-4 h-4 mb-1 text-slate-300" />
                <span>You (Self-View)</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>End-to-end encrypted healthcare stream</span>
              </div>

              <button
                type="button"
                onClick={() => setActiveVideoRoom(null)}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition"
              >
                Leave Room
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Book a Session Modal */}
      {isBookingModalOpen && (
        <div
          id="book-session-modal"
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-5 border border-teal-100 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900 font-serif">
                Schedule a Clinical Session
              </h3>
              <button
                onClick={() => setIsBookingModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg p-1"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Select Speech-Language Pathologist:
                </label>
                <select
                  value={selectedTherapistId}
                  onChange={e => setSelectedTherapistId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus-visible:ring-2 focus-visible:ring-teal-700 font-medium"
                >
                  {therapists
                    .filter(t => t.verificationStatus === 'verified')
                    .map(t => (
                      <option key={t.id} value={t.id}>
                        {t.name} — {t.specialization} ({t.licenseNumber})
                      </option>
                    ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Date:
                  </label>
                  <input
                    type="date"
                    value={bookingDate}
                    onChange={e => setBookingDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus-visible:ring-2 focus-visible:ring-teal-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Time Slot:
                  </label>
                  <select
                    value={bookingTime}
                    onChange={e => setBookingTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus-visible:ring-2 focus-visible:ring-teal-700"
                  >
                    <option value="10:00 - 10:45">10:00 AM - 10:45 AM</option>
                    <option value="14:00 - 14:45">2:00 PM - 2:45 PM</option>
                    <option value="16:30 - 17:15">4:30 PM - 5:15 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Consultation Purpose:
                </label>
                <div className="space-y-2">
                  {[
                    { type: 'Video Telehealth', desc: '1:1 live practice review and coaching' },
                    { type: 'Plan Consultation', desc: 'Customize drills for specific work or school events' },
                    { type: 'Monthly Review', desc: 'Review long-term comfort trends and goals' }
                  ].map(item => (
                    <label
                      key={item.type}
                      className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition ${
                        bookingType === item.type
                          ? 'bg-teal-50 border-teal-600 text-teal-950'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="consultationType"
                        checked={bookingType === item.type}
                        onChange={() => setBookingType(item.type as any)}
                        className="mt-1 text-teal-700 focus:ring-teal-700"
                      />
                      <div>
                        <span className="text-xs sm:text-sm font-semibold block">
                          {item.type}
                        </span>
                        <span className="text-xs text-slate-500 block">
                          {item.desc}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsBookingModalOpen(false)}
                className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="button"
                id="confirm-booking-btn"
                onClick={handleBook}
                className="px-5 py-2.5 bg-teal-800 hover:bg-teal-900 text-white text-xs font-semibold rounded-xl transition shadow-xs"
              >
                Confirm Appointment
              </button>
            </div>
          </div>
        </div>
      )}

      <FootnoteDisclaimer />
    </div>
  );
};
