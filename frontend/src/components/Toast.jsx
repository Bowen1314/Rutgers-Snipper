import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const Toast = ({ id, message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose(id);
        }, 3000);

        return () => clearTimeout(timer);
    }, [id, onClose]);

    const icons = {
        success: <CheckCircle className="w-5 h-5 text-emerald-400" />,
        error: <AlertCircle className="w-5 h-5 text-rose-400" />,
        info: <Info className="w-5 h-5 text-indigo-400" />
    };

    const styles = {
        success: "bg-slate-800 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]",
        error: "bg-slate-800 border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.1)]",
        info: "bg-slate-800 border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.1)]"
    };

    return (
        <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg backdrop-blur-md transition-all duration-300 animate-in slide-in-from-top-2 fade-in ${styles[type]}`}>
            {icons[type]}
            <p className="text-sm font-medium text-slate-200">{message}</p>
            <button
                onClick={() => onClose(id)}
                className="ml-2 text-slate-500 hover:text-slate-300 transition-colors"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
};

export default Toast;
