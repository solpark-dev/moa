import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { NeoCard } from '@/components/common/neo';
import InquiryStatusBadge from './InquiryStatusBadge';
import { formatDate, getCategoryName } from '../../utils/communityUtils';
import { useThemeStore } from '@/store/themeStore';

// 테마별 스타일
const communityThemeStyles = {
  pop: {
    // Neo/Pop 스타일 - 핑크, 시안 계열
    categoryBadge: 'bg-pink-500 text-white',
    answerCard: 'bg-pink-50',
    answerTextColor: 'text-pink-700',
  },
  classic: {
    categoryBadge: 'bg-[#635bff] text-white',
    answerCard: 'bg-indigo-50',
    answerTextColor: 'text-indigo-700',
  },
  dark: {
    categoryBadge: 'bg-[#635bff] text-white',
    answerCard: 'bg-gray-700',
    answerTextColor: 'text-gray-200',
  },
  christmas: {
    categoryBadge: 'bg-[#c41e3a] text-white',
    answerCard: 'bg-[#1a5f2a]',
    answerTextColor: 'text-white',
  },
};

const InquiryDetailModal = ({ isOpen, onClose, inquiry }) => {
  const { theme } = useThemeStore();
  const themeStyle = communityThemeStyles[theme] || communityThemeStyles.pop;

  if (!inquiry) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto overflow-x-hidden border border-gray-200 rounded-2xl shadow-[4px_4px_12px_rgba(0,0,0,0.08)]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-black">
            문의 상세
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 min-w-0">
          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-3">
            <span className={`px-3 py-1 text-xs font-black rounded-lg ${themeStyle.categoryBadge} border border-gray-200 shadow-[4px_4px_12px_rgba(0,0,0,0.08)]`}>
              {getCategoryName(inquiry.communityCodeId)}
            </span>
            <InquiryStatusBadge status={inquiry.answerStatus} />
            <span className="text-sm font-bold text-gray-500">
              {formatDate(inquiry.createdAt)}
            </span>
          </div>


          {/* Title */}
          <div className="w-full overflow-hidden">
            <h3
              className="font-black text-xl text-black whitespace-pre-wrap break-words"
              style={{ overflowWrap: 'anywhere', wordBreak: 'break-word' }}
            >
              {inquiry.title}
            </h3>
          </div>

          {/* Content */}
          <NeoCard
            color="bg-slate-50"
            hoverable={false}
            className="rounded-xl p-5 overflow-hidden w-full"
          >
            <div className="w-full overflow-hidden">
              <p className="text-sm font-black text-gray-500 mb-2">문의 내용</p>
              <p
                className="text-black font-medium whitespace-pre-wrap leading-relaxed break-words w-full max-w-full"
                style={{ overflowWrap: 'anywhere', wordBreak: 'break-word', wordWrap: 'break-word' }}
              >
                {inquiry.content}
              </p>
            </div>
          </NeoCard>

          {/* Attached Image */}
          {inquiry.fileOriginal && (
            <div>
              <p className="text-sm font-black text-gray-500 mb-3">
                첨부 이미지
              </p>
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

          {/* Answer */}
          {inquiry.answerContent && (
            <div className="border-t border-gray-200 pt-6">
              <NeoCard
                color={themeStyle.answerCard}
                hoverable={false}
                className="rounded-xl p-5 overflow-hidden w-full"
              >
                <div className="w-full overflow-hidden">
                  <p className={`text-sm font-black ${themeStyle.answerTextColor} mb-2`}>답변</p>
                  <p
                    className={`${theme === 'christmas' ? 'text-white' : 'text-black'} font-medium whitespace-pre-wrap leading-relaxed break-words w-full max-w-full`}
                    style={{ overflowWrap: 'anywhere', wordBreak: 'break-word', wordWrap: 'break-word' }}
                  >
                    {inquiry.answerContent}
                  </p>
                  {inquiry.answeredAt && (
                    <p className={`text-xs font-bold ${theme === 'christmas' ? 'text-green-200' : 'text-gray-500'} mt-4`}>
                      답변일: {formatDate(inquiry.answeredAt)}
                    </p>
                  )}
                </div>
              </NeoCard>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InquiryDetailModal;
