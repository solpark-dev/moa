import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';

// 은행 목록 (로고 색상 포함)
const BANKS = [
    { code: '088', name: '신한은행', color: '#0046FF', logo: '신한' },
    { code: '004', name: 'KB국민은행', color: '#FFBC00', logo: 'KB' },
    { code: '020', name: '우리은행', color: '#0066B3', logo: '우리' },
    { code: '081', name: '하나은행', color: '#009490', logo: '하나' },
    { code: '011', name: 'NH농협은행', color: '#00AB4E', logo: 'NH' },
    { code: '023', name: 'SC제일은행', color: '#00AB84', logo: 'SC' },
    { code: '090', name: '카카오뱅크', color: '#FFEB00', logo: '카뱅', textColor: '#3C1E1E' },
    { code: '089', name: '케이뱅크', color: '#5A4AE3', logo: 'K' },
    { code: '092', name: '토스뱅크', color: '#0064FF', logo: '토스' },
];

/**
 * 은행 선택 드롭다운 컴포넌트
 */
export default function BankSelector({ value, onChange, disabled = false, theme = 'classic' }) {
    const [isOpen, setIsOpen] = useState(false);

    const selectedBank = BANKS.find(bank => bank.code === value);

    const handleSelect = (bank) => {
        onChange({
            bankCode: bank.code,
            bankName: bank.name
        });
        setIsOpen(false);
    };

    const isDark = theme === 'dark';

    return (
        <div className="relative">
            {/* 선택 버튼 */}
            <button
                type="button"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
                className={`
                    w-full px-4 py-3 rounded-xl border-2 text-left
                    flex items-center justify-between
                    transition-all duration-200
                    ${disabled
                        ? isDark ? 'bg-gray-800 cursor-not-allowed' : 'bg-slate-100 cursor-not-allowed'
                        : isDark ? 'bg-[#1E293B] hover:border-[#635bff] cursor-pointer' : 'bg-white hover:border-orange-300 cursor-pointer'
                    }
                    ${isOpen 
                        ? isDark ? 'border-[#635bff] ring-4 ring-[#635bff]/20' : 'border-orange-500 ring-4 ring-orange-100' 
                        : isDark ? 'border-gray-700' : 'border-slate-200'}
                `}
            >
                {selectedBank ? (
                    <div className="flex items-center gap-3">
                        {/* 은행 로고 */}
                        <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                            style={{
                                backgroundColor: selectedBank.color,
                                color: selectedBank.textColor || '#ffffff'
                            }}
                        >
                            {selectedBank.logo}
                        </div>
                        <span className={`font-medium ${isDark ? 'text-gray-200' : 'text-slate-800'}`}>{selectedBank.name}</span>
                    </div>
                ) : (
                    <span className={isDark ? 'text-gray-500' : 'text-slate-400'}>은행을 선택하세요</span>
                )}
                <ChevronDown
                    className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''} ${isDark ? 'text-gray-500' : 'text-slate-400'}`}
                />
            </button>

            {/* 드롭다운 메뉴 */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* 백드롭 */}
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* 옵션 목록 */}
                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.15 }}
                            className={`absolute z-50 w-full mt-2 rounded-xl border shadow-xl overflow-hidden ${
                                isDark ? 'bg-[#1E293B] border-gray-700' : 'bg-white border-slate-200'
                            }`}
                        >
                            <div className="max-h-80 overflow-y-auto py-2">
                                {BANKS.map((bank) => (
                                    <button
                                        key={bank.code}
                                        type="button"
                                        onClick={() => handleSelect(bank)}
                                        className={`
                                            w-full px-4 py-3 flex items-center gap-3
                                            transition-colors
                                            ${isDark 
                                                ? `hover:bg-[#635bff]/20 ${value === bank.code ? 'bg-[#635bff]/20' : ''}`
                                                : `hover:bg-orange-50 ${value === bank.code ? 'bg-orange-50' : ''}`
                                            }
                                        `}
                                    >
                                        {/* 은행 로고 */}
                                        <div
                                            className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                                            style={{
                                                backgroundColor: bank.color,
                                                color: bank.textColor || '#ffffff'
                                            }}
                                        >
                                            {bank.logo}
                                        </div>
                                        <span className={`font-medium flex-1 text-left ${isDark ? 'text-gray-200' : 'text-slate-800'}`}>
                                            {bank.name}
                                        </span>
                                        {value === bank.code && (
                                            <Check className={`w-5 h-5 ${isDark ? 'text-[#635bff]' : 'text-orange-500'}`} />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}

// 은행 목록 export (다른 곳에서 사용 가능)
export { BANKS };
