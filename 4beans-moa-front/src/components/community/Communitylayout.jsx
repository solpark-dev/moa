import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

const CommunityLayout = ({ title, children }) => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen" style={{ background: "var(--theme-bg, #f8fafc)" }}>
            {/* Header */}
            <div style={{ borderBottom: "1px solid var(--glass-border)" }}>
                <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="flex items-center justify-center w-8 h-8 rounded-xl"
                        style={{
                            border: "1px solid var(--glass-border)",
                            background: "var(--glass-bg-overlay)",
                            color: "var(--theme-text)",
                        }}
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    {title && (
                        <h1 className="text-[18px] font-black" style={{ color: "var(--theme-text)" }}>
                            {title}
                        </h1>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="max-w-3xl mx-auto px-4 py-6">
                {children}
            </div>
        </div>
    );
};

export default CommunityLayout;
