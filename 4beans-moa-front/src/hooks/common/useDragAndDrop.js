import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * useDragAndDrop Hook
 * @param {Object} options
 * @param {Function} options.onFileDrop - 파일 드롭 시 호출될 콜백 (파일 객체 전달)
 * @param {Function} options.onOverlayDragEnter - (선택) 오버레이 진입 시 호출
 * @param {Function} options.onOverlayDragLeave - (선택) 오버레이 이탈 시 호출
 * @param {Array<String>} options.allowedTypes - 허용할 MIME 타입 목록 (예: ['image/'])
 * @param {Number} options.maxSize - 최대 파일 크기 (bytes)
 * @returns {Object} isDragging, dragHandlers
 */
export const useDragAndDrop = ({
    onFileDrop,
    allowedTypes = ['image/'],
    maxSize = 10 * 1024 * 1024,
    onError, // 에러 발생 시 콜백 (message 전달)
    enabled = true // 기본값 true
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const dragCounter = useRef(0);
    // 파일이 이미 있는지 여부를 외부에서 제어하기 어렵다면, 
    // 이 훅은 "드래그 상태"와 "파일 드롭 이벤트"만 순수하게 담당하는 것이 좋음.
    // 기존 로직의 'hasFileRef' 체크는 onFileDrop 내부 또는 훅 사용처에서 체크하도록 유도.

    const handleDragEnter = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        dragCounter.current++;
        if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
            setIsDragging(true);
        }
    }, []);

    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        dragCounter.current--;
        if (dragCounter.current === 0) {
            setIsDragging(false);
        }
    }, []);

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        dragCounter.current = 0;

        const file = e.dataTransfer.files[0];
        if (!file) return;

        // 타입 체크
        const isTypeValid = allowedTypes.some(type => {
            if (type.endsWith('/')) return file.type.startsWith(type.slice(0, -1)); // 예: 'image/'
            return file.type === type;
        });

        if (!isTypeValid) {
            // 조용히 무시하거나 에러 콜백
            if (onError) onError("허용되지 않는 파일 형식입니다.");
            return;
        }

        // 크기 체크
        if (maxSize && file.size > maxSize) {
            if (onError) onError(`파일 크기는 ${maxSize / 1024 / 1024}MB를 초과할 수 없습니다.`);
            return;
        }

        if (onFileDrop) {
            onFileDrop(file);
        }
    }, [allowedTypes, maxSize, onFileDrop, onError]);

    // Window 전역 이벤트 등록 (옵션에 따라 조정 가능하지만, 현재 요구사항은 전체 화면 드래그)
    useEffect(() => {
        // enabled가 false면 이벤트 등록하지 않음
        // (주의: enabled가 변경될 때마다 등록/해제됨)
        if (enabled === false) return;

        window.addEventListener('dragenter', handleDragEnter);
        window.addEventListener('dragleave', handleDragLeave);
        window.addEventListener('dragover', handleDragOver);
        window.addEventListener('drop', handleDrop);

        return () => {
            window.removeEventListener('dragenter', handleDragEnter);
            window.removeEventListener('dragleave', handleDragLeave);
            window.removeEventListener('dragover', handleDragOver);
            window.removeEventListener('drop', handleDrop);
        };
    }, [handleDragEnter, handleDragLeave, handleDragOver, handleDrop, enabled]);

    return {
        isDragging
    };
};
