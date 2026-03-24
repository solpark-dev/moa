import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getSettlements, getSettlementDetails } from '@/api/settlementApi';
import { useThemeStore } from '@/store/themeStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle 
} from '@/components/ui/dialog';
import { Loader2, Calendar, ChevronRight, AlertCircle, ArrowLeft, TrendingUp, Sparkles } from 'lucide-react';

// 정산 상태 배지
const StatusBadge = ({ status }) => {
    const variants = {
        PENDING: { label: '대기', className: 'bg-yellow-100 text-yellow-800' },
        IN_PROGRESS: { label: '처리중', className: 'bg-blue-100 text-blue-800' },
        COMPLETED: { label: '완료', className: 'bg-green-100 text-green-800' },
        FAILED: { label: '실패', className: 'bg-red-100 text-red-800' }
    };
    
    const variant = variants[status] || variants.PENDING;
    
    return (
        <Badge className={variant.className}>
            {variant.label}
        </Badge>
    );
};

export default function SettlementHistoryPage() {
    const navigate = useNavigate();
    const { theme } = useThemeStore();
    const [settlements, setSettlements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // 필터
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    
    // 상세 모달
    const [selectedSettlement, setSelectedSettlement] = useState(null);
    const [details, setDetails] = useState([]);
    const [detailsLoading, setDetailsLoading] = useState(false);
    
    useEffect(() => {
        fetchSettlements();
    }, []);
    
    const fetchSettlements = async () => {
        try {
            setLoading(true);
            setError('');
            const data = await getSettlements(startDate, endDate);
            setSettlements(data || []);
        } catch (err) {
            setError('정산 내역을 불러오는데 실패했습니다.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    
    const handleFilter = () => {
        fetchSettlements();
    };
    
    const handleViewDetails = async (settlement) => {
        setSelectedSettlement(settlement);
        setDetailsLoading(true);
        
        try {
            const data = await getSettlementDetails(settlement.settlementId);
            setDetails(data || []);
        } catch (err) {
            console.error('상세 조회 실패:', err);
        } finally {
            setDetailsLoading(false);
        }
    };
    
    // 금액 포맷
    const formatAmount = (amount) => {
        return new Intl.NumberFormat('ko-KR').format(amount) + '원';
    };
    
    // 날짜 포맷
    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleDateString('ko-KR');
    };
    
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }
    
    return (
        <div className={`min-h-screen pb-20 transition-colors duration-300 relative z-10 ${theme === "dark" ? "bg-transparent" : "bg-transparent"}`}>
            {/* Hero Header */}
            <div className={`relative overflow-hidden bg-transparent ${theme === "dark" ? "border-b border-gray-800" : ""}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">
                    <button
                        onClick={() => navigate(-1)}
                        className={`flex items-center gap-2 mb-6 transition-colors group ${theme === "dark"
                            ? "text-gray-400 hover:text-[#635bff]"
                            : theme === "pop"
                                ? "text-black hover:text-pink-500"
                                : theme === "christmas"
                                    ? "text-gray-500 hover:text-[#c41e3a]"
                                    : "text-gray-400 hover:text-[#635bff]"
                            }`}
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-semibold">뒤로가기</span>
                    </button>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-4 ${theme === "pop"
                            ? "bg-pink-100 text-pink-600 border border-pink-200"
                            : theme === "dark"
                                ? "bg-[#635bff]/20 text-[#635bff] border border-[#635bff]/30"
                                : theme === "christmas"
                                    ? "bg-[#c41e3a]/10 text-[#c41e3a] border border-[#c41e3a]/20"
                                    : "bg-[#635bff]/10 text-[#635bff]"
                            }`}>
                            <Sparkles className="w-4 h-4" />
                            정산 관리
                        </span>
                        <h1 className={`text-3xl sm:text-4xl font-bold mb-2 tracking-tight flex items-center gap-3 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                            <TrendingUp className={`w-7 h-7 sm:w-8 sm:h-8 ${theme === "pop" ? "text-pink-500" : theme === "christmas" ? "text-[#c41e3a]" : "text-[#635bff]"}`} />
                            정산 내역
                        </h1>
                        <p className={theme === "dark" ? "text-gray-400" : "text-gray-500"}>파티별 정산 내역을 확인하세요</p>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <Card className={theme === "dark" ? "bg-[#1E293B] border-gray-700" : ""}>
                <CardHeader>
                    <CardTitle className={theme === "dark" ? "text-white" : ""}>정산 내역</CardTitle>
                </CardHeader>
                <CardContent>
                    {/* 기간 필터 */}
                    <div className="flex gap-2 mb-6">
                        <div className="flex-1">
                            <Label className="text-xs">시작일</Label>
                            <Input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </div>
                        <div className="flex-1">
                            <Label className="text-xs">종료일</Label>
                            <Input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>
                        <div className="flex items-end">
                            <Button onClick={handleFilter}>조회</Button>
                        </div>
                    </div>
                    
                    {error && (
                        <div className="flex items-center gap-2 text-red-500 mb-4">
                            <AlertCircle className="h-4 w-4" />
                            <span>{error}</span>
                        </div>
                    )}
                    
                    {/* 정산 목록 */}
                    {settlements.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            정산 내역이 없습니다.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {settlements.map((settlement) => (
                                <div
                                    key={settlement.settlementId}
                                    className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                                    onClick={() => handleViewDetails(settlement)}
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-medium">
                                                {settlement.partyName || `파티 #${settlement.partyId}`}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {settlement.settlementMonth} 정산
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-lg">
                                                {formatAmount(settlement.netAmount)}
                                            </p>
                                            <StatusBadge status={settlement.settlementStatus} />
                                        </div>
                                    </div>
                                    
                                    <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            {formatDate(settlement.settlementDate || settlement.regDate)}
                                        </span>
                                        <ChevronRight className="h-4 w-4" />
                                    </div>
                                    
                                    {settlement.settlementStatus === 'FAILED' && settlement.failReason && (
                                        <p className="mt-2 text-sm text-red-500">
                                            실패 사유: {settlement.failReason}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
            
            </div>

            {/* 상세 모달 */}
            <Dialog open={!!selectedSettlement} onOpenChange={() => setSelectedSettlement(null)}>
                <DialogContent className={theme === "dark" ? "bg-[#1E293B] border-gray-700" : ""}>
                    <DialogHeader>
                        <DialogTitle>정산 상세</DialogTitle>
                    </DialogHeader>
                    
                    {selectedSettlement && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-gray-500">정산월</p>
                                    <p className="font-medium">{selectedSettlement.settlementMonth}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">상태</p>
                                    <StatusBadge status={selectedSettlement.settlementStatus} />
                                </div>
                                <div>
                                    <p className="text-gray-500">총 금액</p>
                                    <p className="font-medium">{formatAmount(selectedSettlement.totalAmount)}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">정산 금액</p>
                                    <p className="font-bold text-lg">{formatAmount(selectedSettlement.netAmount)}</p>
                                </div>
                            </div>
                            
                            <hr />
                            
                            <div>
                                <p className="font-medium mb-2">포함된 결제 내역</p>
                                {detailsLoading ? (
                                    <div className="flex justify-center py-4">
                                        <Loader2 className="h-6 w-6 animate-spin" />
                                    </div>
                                ) : details.length === 0 ? (
                                    <p className="text-gray-500 text-sm">결제 내역이 없습니다.</p>
                                ) : (
                                    <div className="space-y-2 max-h-60 overflow-y-auto">
                                        {details.map((payment) => (
                                            <div key={payment.paymentId} className="flex justify-between text-sm p-2 bg-gray-50 rounded">
                                                <span>{payment.userName || payment.userId}</span>
                                                <span>{formatAmount(payment.paymentAmount)}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
