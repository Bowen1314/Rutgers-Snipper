import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import { updateSettings } from '../api';
import { useToast } from '../contexts/ToastContext';
import { useLanguage } from '../contexts/LanguageContext';

const Settings = ({ isOpen, onClose, currentInterval, onUpdate }) => {
    const { t } = useLanguage();
    const [interval, setInterval] = useState(currentInterval);
    const [loading, setLoading] = useState(false);
    const { addToast } = useToast();

    if (!isOpen) return null;

    const handleSave = async () => {
        setLoading(true);
        try {
            await updateSettings(parseInt(interval));
            onUpdate();
            addToast(t('settingsSaved'), 'success');
            onClose();
        } catch (error) {
            addToast(t('settingsUpdateFailed'), 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100]">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 w-full max-w-md shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-slate-100">{t('settings')}</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            {t('scanInterval')}
                        </label>
                        <input
                            type="number"
                            min="1"
                            value={interval}
                            onChange={(e) => setInterval(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                        <p className="text-xs text-slate-500 mt-1">
                            {t('intervalHint')}
                        </p>
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                        >
                            {t('cancel')}
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                        >
                            <Save className="w-4 h-4" />
                            {loading ? t('saving') : t('save')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
