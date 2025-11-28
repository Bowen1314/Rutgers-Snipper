
import React, { useState, useEffect } from 'react';
import { getStatus, addTarget, removeTarget, startMonitoring, stopMonitoring } from '../api';
import { Activity, Plus, Trash2, Play, Square, Search, AlertCircle, CheckCircle, XCircle, Settings as SettingsIcon, Clock, Timer } from 'lucide-react';
import Settings from './Settings';
import ConfirmModal from './ConfirmModal';
import { useToast } from '../contexts/ToastContext';
import { useLanguage } from '../contexts/LanguageContext';

const Dashboard = () => {
    const { t, language, toggleLanguage } = useLanguage();
    const [status, setStatus] = useState({ indices: [], courses: [], monitoring: false, last_scan_time: null, scan_interval: 30 });
    const [timeLeft, setTimeLeft] = useState(30);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

    // Confirmation Modal State
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [targetToRemove, setTargetToRemove] = useState(null);

    const { addToast } = useToast();

    const fetchStatus = async () => {
        try {
            const res = await getStatus();
            console.log("Status update:", res.data);
            setStatus(res.data);
            if (res.data.monitoring) {
                // Reset timer when we get a fresh status update
                // But only if last_scan_time actually changed, or just sync it roughly
                // Actually, simplest is to reset to interval whenever we fetch, 
                // but if we fetch every 3s, it might keep resetting.
                // Better: The backend scans every N seconds. 
                // We should just countdown locally. 
                // When status.last_scan_time changes, we know a scan happened.
            }
        } catch (error) {
            console.error(t('fetchStatusFailed'), error);
        }
    };

    useEffect(() => {
        fetchStatus();
        const interval = setInterval(fetchStatus, 3000);
        return () => clearInterval(interval);
    }, []);

    // Countdown Timer Logic
    useEffect(() => {
        if (!status.monitoring) {
            setTimeLeft(status.scan_interval);
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 0) return 0;
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [status.monitoring]);

    // Reset timer when scan_interval updates (regardless of monitoring status)
    useEffect(() => {
        setTimeLeft(status.scan_interval);
    }, [status.scan_interval]);

    // Reset timer when last_scan_time updates (only if monitoring)
    useEffect(() => {
        if (status.monitoring) {
            setTimeLeft(status.scan_interval);
        }
    }, [status.last_scan_time]);



    const handleAdd = async () => {
        if (!input) return;

        // Validation Logic
        if (/[a-zA-Z]/.test(input)) {
            // If it contains letters, it must be a course code (but user said course code cannot have letters? Wait, user said "If it is course code, it cannot have letters" - usually course codes like 198:111 don't have letters. But sometimes they might? The user requirement is strict: "If course code, cannot have letters". And "Index code must be pure numbers". So basically NO letters allowed at all.)
            // Re-reading user request: "如果是course code 就不能有字母" (If it's course code, it cannot have letters).
            // "index code 必须大于四 并且是纯数字" (Index code must be > 4 and pure numbers).
            // So effectively, NO letters are allowed in either case.
            addToast(t('validationNoLetters'), 'error');
            return;
        }

        // Check if it's an Index (no colons usually implies index, or just check if it's pure numbers)
        const isIndex = /^\d+$/.test(input);
        if (isIndex) {
            if (input.length <= 4) {
                addToast(t('validationIndex'), 'error');
                return;
            }
        }

        setLoading(true);
        try {
            await addTarget(input);
            setInput('');
            await fetchStatus();
            addToast(`${t('addedTarget')}${input}`, 'success');
        } catch (error) {
            addToast(t('addFailed'), 'error');
        } finally {
            setLoading(false);
        }
    };

    const confirmRemove = (target) => {
        setTargetToRemove(target);
        setConfirmOpen(true);
    };

    const handleRemove = async () => {
        if (!targetToRemove) return;
        try {
            await removeTarget(targetToRemove);
            await fetchStatus();
            addToast(`${t('removed')}${targetToRemove}`, 'success');
        } catch (error) {
            addToast(t('removeFailed'), 'error');
        }
    };

    const toggleMonitoring = async () => {
        try {
            if (status.monitoring) {
                await stopMonitoring();
                addToast(t('monitoringStopped'), 'info');
            } else {
                if (status.indices.length === 0 && status.courses.length === 0) {
                    addToast(t('listEmpty'), 'error');
                    return;
                }
                await startMonitoring();
                addToast(t('monitoringStarted'), 'success');
            }
            await fetchStatus();
        } catch (error) {
            addToast(t('operationFailed'), 'error');
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
            {/* Navbar */}
            <nav className="bg-slate-800/50 backdrop-blur-md border-b border-slate-700 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-3">
                            <div className="bg-indigo-500 p-2 rounded-lg">
                                <Activity className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                                {t('appTitle')}
                            </span>
                        </div>
                        <div className="flex items-center gap-4">
                            {status.last_scan_time && (
                                <div className="hidden md:flex items-center gap-2 text-sm text-slate-400 bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700">
                                    <Clock className="w-4 h-4" />
                                    <span>{t('lastScan')}{status.last_scan_time}</span>
                                </div>
                            )}

                            {status.monitoring && (
                                <div className="hidden md:flex items-center gap-2 text-sm text-indigo-300 bg-indigo-500/10 px-3 py-1.5 rounded-full border border-indigo-500/20 shadow-[0_0_10px_rgba(99,102,241,0.1)]">
                                    <Timer className="w-4 h-4 animate-pulse" />
                                    <span className="font-mono font-bold">{t('nextScan', { seconds: timeLeft })}</span>
                                </div>
                            )}

                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border ${status.monitoring
                                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                                : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                                } `}>
                                <span className={`w-2 h-2 rounded-full ${status.monitoring ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'} `} />
                                {status.monitoring ? t('monitoring') : t('stopped')}
                            </div>

                            <button
                                onClick={toggleLanguage}
                                className="px-3 py-1.5 text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition-colors"
                            >
                                {language === 'zh' ? 'EN' : '中'}
                            </button>

                            <button
                                onClick={() => setShowSettings(true)}
                                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                                title={t('settings')}
                            >
                                <SettingsIcon className="w-5 h-5" />
                            </button>

                            <button
                                onClick={toggleMonitoring}
                                disabled={!status.monitoring && status.indices.length === 0 && status.courses.length === 0}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${status.monitoring
                                    ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/20'
                                    : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400 disabled:shadow-none'
                                    } `}
                            >
                                {status.monitoring ? <Square className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                                {status.monitoring ? t('stopMonitoring') : t('startMonitoring')}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Input Section */}
                <div className="mb-12">
                    <div className="relative max-w-2xl mx-auto group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-200"></div>
                        <div className="relative flex bg-slate-800 rounded-xl p-2 shadow-2xl border border-slate-700 transition-all duration-300 focus-within:ring-2 focus-within:ring-indigo-500/50 focus-within:border-indigo-500 focus-within:shadow-[0_0_20px_rgba(99,102,241,0.3)]">
                            <div className="flex-1 flex items-center px-4 gap-3">
                                <Search className="w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder={t('inputPlaceholder')}
                                    className="w-full bg-transparent border-none focus:ring-0 outline-none text-slate-100 placeholder-slate-500"
                                    onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                                />
                            </div>
                            <button
                                onClick={handleAdd}
                                disabled={loading}
                                className="px-6 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                {loading ? t('adding') : t('add')}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Index List */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
                                <span className="w-1 h-6 bg-indigo-500 rounded-full"></span>
                                {t('indexWatchlist')}
                                <span className="text-xs font-normal text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">
                                    {status.indices.length}
                                </span>
                            </h2>
                        </div>

                        {status.indices.length === 0 ? (
                            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-8 text-center">
                                <div className="w-12 h-12 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <AlertCircle className="w-6 h-6 text-slate-500" />
                                </div>
                                <p className="text-slate-400">{t('noIndexItems')}</p>
                            </div>
                        ) : (
                            <div className="grid gap-3">
                                {status.indices.map((item) => (
                                    <div key={item.index} className="group bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-indigo-500/30 rounded-xl p-4 transition-all duration-200 shadow-sm hover:shadow-md">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-mono text-lg font-bold text-indigo-400">{item.index}</span>
                                                    <span className="text-slate-400 text-sm bg-slate-900/50 px-2 py-0.5 rounded">{item.code}</span>
                                                </div>
                                                <h3 className="font-medium text-slate-200 mb-1 line-clamp-1" title={item.title}>{item.title}</h3>
                                                <p className="text-sm text-slate-500 flex items-center gap-1">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span>
                                                    {item.instructors}
                                                </p>
                                            </div>
                                            <div className="flex flex-col items-end gap-3">
                                                <StatusBadge status={item.status} />
                                                <button
                                                    onClick={() => confirmRemove(item.index)}
                                                    className="text-slate-500 hover:text-rose-400 transition-colors p-1 hover:bg-rose-500/10 rounded"
                                                    title={t('remove')}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Course List */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
                                <span className="w-1 h-6 bg-cyan-500 rounded-full"></span>
                                {t('courseWatchlist')}
                                <span className="text-xs font-normal text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">
                                    {status.courses.length}
                                </span>
                            </h2>
                        </div>

                        {status.courses.length === 0 ? (
                            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-8 text-center">
                                <div className="w-12 h-12 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <AlertCircle className="w-6 h-6 text-slate-500" />
                                </div>
                                <p className="text-slate-400">{t('noCourseItems')}</p>
                            </div>
                        ) : (
                            <div className="grid gap-3">
                                {status.courses.map((item) => (
                                    <div key={item.code} className="group bg-slate-800 border border-slate-700 rounded-xl p-4 transition-all duration-200 shadow-sm hover:shadow-md">
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <div className="font-mono text-lg font-bold text-cyan-400 mb-1">{item.code}</div>
                                                <div className="text-sm text-slate-400">{item.title}</div>
                                            </div>
                                            <button
                                                onClick={() => confirmRemove(item.code)}
                                                className="text-slate-500 hover:text-rose-400 transition-colors p-1 hover:bg-rose-500/10 rounded"
                                                title={t('remove')}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>

                                        {/* Sections List */}
                                        <div className="space-y-2 mt-3 pt-3 border-t border-slate-700/50">
                                            {item.sections && item.sections.length > 0 ? (
                                                item.sections.map((section) => (
                                                    <div key={section.index} className="flex items-center justify-between text-sm bg-slate-900/30 p-2 rounded-lg">
                                                        <div className="flex items-center gap-3">
                                                            <span className="font-mono text-slate-300">{section.index}</span>
                                                            <span className="text-slate-500 text-xs truncate max-w-[120px]" title={section.instructors}>
                                                                {section.instructors}
                                                            </span>
                                                        </div>
                                                        <StatusBadge status={section.status} />
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="text-center text-slate-500 text-sm py-2">
                                                    {t('waitingForData')}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Settings
                isOpen={showSettings}
                onClose={() => setShowSettings(false)}
                currentInterval={status.scan_interval}
                onUpdate={fetchStatus}
            />

            <ConfirmModal
                isOpen={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={handleRemove}
                title={t('confirmRemove')}
                message={t('confirmRemoveMessage', { target: targetToRemove })}
                confirmText={t('remove')}
                isDangerous={true}
            />
        </div>
    );
};

const StatusBadge = ({ status }) => {
    const isOpen = status === '开启' || status === 'OPEN';
    const isClosed = status === '关闭' || status === 'CLOSED';

    if (isOpen) {
        return (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                <CheckCircle className="w-3.5 h-3.5" />
                <TranslatedStatus status="open" />
            </span>
        );
    }

    if (isClosed) {
        return (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <XCircle className="w-3.5 h-3.5" />
                <TranslatedStatus status="closed" />
            </span>
        );
    }

    return (
        <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-700 text-slate-300">
            {status}
        </span>
    );
};

const TranslatedStatus = ({ status }) => {
    const { t } = useLanguage();
    return t(status) || status;
};

export default Dashboard;
