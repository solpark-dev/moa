import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { NeoCard, NeoButton } from '@/components/common/neo';
import { formatDate, getCategoryName } from '../../utils/communityUtils';
import { useThemeStore } from '@/store/themeStore';

// 테마별 스타일
const communityThemeStyles = {
  pop: {
    // Neo/Pop 스타일 - 핑크, 시안 계열
    categoryBadge: 'bg-pink-500 text-white',
    focusRing: 'focus:ring-pink-500',
    submitButton: 'bg-pink-500 hover:bg-pink-600 text-white',
  },
  classic: {
    categoryBadge: 'bg-[#635bff] text-white',
    focusRing: 'focus:ring-[#635bff]',
    submitButton: 'bg-[#635bff] hover:bg-indigo-600 text-white',
  },
  dark: {
    categoryBadge: 'bg-[#635bff] text-white',
    focusRing: 'focus:ring-[#635bff]',
    submitButton: 'bg-[#635bff] hover:bg-indigo-600 text-white',
  },
  christmas: {
    categoryBadge: 'bg-[#c41e3a] text-white',
    focusRing: 'focus:ring-[#c41e3a]',
    submitButton: 'bg-[#c41e3a] hover:bg-red-700 text-white',
  },
};

const InquiryAnswerModalContent = ({ inquiry, onClose, onAnswerSubmit }) => {
  const [answerContent, setAnswerContent] = useState(inquiry?.answerContent || '');
  const { theme } = useThemeStore();
  const themeStyle = communityThemeStyles[theme] || communityThemeStyles.pop;

  const handleSubmit = async () => {
    if (!answerContent.trim()) {
      alert("답변 내용을 입력하세요.");
      return;
    }

    await onAnswerSubmit(inquiry.communityId, answerContent);
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-2xl font-black text-black">
          {inquiry.answerContent ? "답변 수정" : "답변 작성"}
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-6">
        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-3">
          <span className={`px-3 py-1 text-xs font-black rounded-lg ${themeStyle.categoryBadge} border border-gray-200 shadow-[4px_4px_12px_rgba(0,0,0,0.08)]`}>
            {getCategoryName(inquiry.communityCodeId)}
          </span>
          <span className="text-sm font-bold text-gray-500">
            {formatDate(inquiry.createdAt)}
          </span>
        </div>

        {/* Title & Author */}
        <div>
          <h3 className="font-black text-xl text-black mb-1">
            {inquiry.title}
          </h3>
          <p className="text-sm font-bold text-gray-500">
            작성자: {inquiry.userId}
          </p>
        </div>

        {/* Inquiry Content */}
        <NeoCard
          color="bg-slate-50"
          hoverable={false}
          className="rounded-xl p-5"
        >
          <p className="text-sm font-black text-gray-500 mb-2">문의 내용</p>
          <p className="text-black font-medium whitespace-pre-wrap leading-relaxed">
            {inquiry.content}
          </p>
        </NeoCard>

        {/* Attached Image */}
        {inquiry.fileOriginal && (
          <div>
            <p className="text-sm font-black text-gray-500 mb-3">첨부 이미지</p>
            <img
              src={`/uploads/community/inquiry/${inquiry.fileUuid}`}
              alt={inquiry.fileOriginal}
              className="max-w-full max-h-64 rounded-xl border border-gray-200 object-contain shadow-[4px_4px_12px_rgba(0,0,0,0.08)]"
            />
            <p className="text-xs font-bold text-gray-500 mt-2">
              {inquiry.fileOriginal}
            </p>
          </div>
        )}

        {/* Answer Input */}
        <div className="border-t border-gray-200 pt-6">
          <label className="block text-sm font-black text-black mb-3">
            답변 작성
          </label>
          <textarea
            value={answerContent}
            onChange={(e) => setAnswerContent(e.target.value)}
            placeholder="답변 내용을 입력하세요"
            rows={8}
            className={`w-full px-4 py-3 border border-gray-200 rounded-xl font-bold focus:outline-none focus:ring-2 ${themeStyle.focusRing} placeholder-gray-400 resize-none`}
          />
        </div>
      </div>

      <DialogFooter className="gap-3">
        <NeoButton
          color="bg-white"
          size="sm"
          onClick={onClose}
        >
          취소
        </NeoButton>
        <NeoButton
          color={themeStyle.submitButton}
          size="sm"
          onClick={handleSubmit}
        >
          {inquiry.answerContent ? '수정' : '등록'}
        </NeoButton>
      </DialogFooter>
    </>
  );
};

const InquiryAnswerModal = ({ isOpen, onClose, inquiry, onAnswerSubmit }) => {
  if (!inquiry) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto border border-gray-200 rounded-2xl shadow-[4px_4px_12px_rgba(0,0,0,0.08)]">
        <InquiryAnswerModalContent
          key={inquiry.communityId}
          inquiry={inquiry}
          onClose={onClose}
          onAnswerSubmit={onAnswerSubmit}
        />
      </DialogContent>
    </Dialog>
  );
};

export default InquiryAnswerModal;
