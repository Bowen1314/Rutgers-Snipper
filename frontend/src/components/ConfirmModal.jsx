import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText, cancelText, isDangerous = false }) => {
    const { t } = useLanguage();
    const finalConfirmText = confirmText || t('confirm');
    const finalCancelText = cancelText || t('cancel');

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100]">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 w-full max-w-sm shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-start gap-4 mb-6">
                    <div className={`p-3 rounded-full ${isDangerous ? 'bg-rose-500/10 text-rose-400' : 'bg-indigo-500/10 text-indigo-400'}`}>
                        <AlertTriangle className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-slate-100 mb-1">{title}</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">{message}</p>
                    </div>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-300 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors font-medium text-sm"
                    >
                        {finalCancelText}
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className={`px-4 py-2 text-white rounded-lg font-medium text-sm transition-colors shadow-lg ${isDangerous
                            ? 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/20'
                            : 'bg-indigo-500 hover:bg-indigo-600 shadow-indigo-500/20'
                            }`}
                    >
                        {finalConfirmText}
                    </button>
                </div>
            </div>
        </div >
    );
};

export default ConfirmModal;
