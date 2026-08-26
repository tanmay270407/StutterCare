import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Upload, FileText, CheckCircle2, AlertCircle, Building2 } from 'lucide-react';

interface TherapistVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TherapistVerificationModal: React.FC<TherapistVerificationModalProps> = ({ isOpen, onClose }) => {
  const { currentTherapist, verifyTherapistCredential, addNotification } = useApp();

  const [licenseNumber, setLicenseNumber] = useState(currentTherapist.licenseNumber);
  const [licenseBody, setLicenseBody] = useState(currentTherapist.licenseBody);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>('license_certificate_2026.pdf');
  const [isUploading, setIsUploading] = useState(false);

  if (!isOpen) return null;

  const handleSimulateUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setUploadedFileName('slp_board_credentials_verified.pdf');
      addNotification('Credential certificate file uploaded for administrative audit.', 'info');
    }, 800);
  };

  const handleToggleStatus = (newStatus: 'verified' | 'pending_verification') => {
    verifyTherapistCredential(currentTherapist.id, newStatus);
  };

  return (
    <div
      id="therapist-verification-modal"
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-5 border border-teal-100 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-800">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-serif">
                SLP Licensure & Credential Verification
              </h3>
              <p className="text-xs text-slate-500">
                Regulatory compliance for clinical supervision
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg p-1">
            ×
          </button>
        </div>

        {/* Current status pill */}
        <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
          <div className="text-xs">
            <span className="text-slate-500 block">Verification Status:</span>
            <span className="font-semibold text-slate-900 capitalize">
              {currentTherapist.verificationStatus.replace('_', ' ')}
            </span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => handleToggleStatus('verified')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                currentTherapist.verificationStatus === 'verified'
                  ? 'bg-emerald-800 text-white'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              Verified
            </button>
            <button
              onClick={() => handleToggleStatus('pending_verification')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                currentTherapist.verificationStatus === 'pending_verification'
                  ? 'bg-amber-700 text-white'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              Pending
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Licensing Board / Body
            </label>
            <input
              type="text"
              value={licenseBody}
              onChange={e => setLicenseBody(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus-visible:ring-2 focus-visible:ring-teal-700 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              License / Registration Number
            </label>
            <input
              type="text"
              value={licenseNumber}
              onChange={e => setLicenseNumber(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus-visible:ring-2 focus-visible:ring-teal-700 font-medium"
            />
          </div>

          {/* Certificate File Upload Mock */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Verification Certificate Document
            </label>
            <div className="p-4 border-2 border-dashed border-slate-200 hover:border-teal-400 rounded-xl text-center space-y-2 bg-slate-50">
              <FileText className="w-8 h-8 text-teal-700 mx-auto" />
              <p className="text-xs text-slate-700 font-medium">
                {uploadedFileName || 'No certificate uploaded yet'}
              </p>
              <button
                type="button"
                onClick={handleSimulateUpload}
                disabled={isUploading}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg text-xs font-medium text-slate-700 transition"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{isUploading ? 'Uploading...' : 'Upload Updated Credential (PDF)'}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-teal-800 hover:bg-teal-900 text-white rounded-xl text-xs font-semibold transition"
          >
            Close & Save
          </button>
        </div>
      </div>
    </div>
  );
};
