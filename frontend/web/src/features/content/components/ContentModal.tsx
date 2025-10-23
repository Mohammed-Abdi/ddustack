import { Download } from '@/assets/icons/Download';
import { Folder } from '@/assets/icons/Folder';
import { Box } from '@/assets/icons/Materials';
import { Badge, Button, Credit } from '@/components/ui';
import { formatNumber } from '@/utils/numerals';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import * as React from 'react';
import type { Content } from '../api/interfaces';

interface ContentModalProps {
  isOpen: boolean;
  content: Content | null;
  course?: { abbreviation?: string; code?: string };
  downloadLogData?: { count?: number };
  isReported?: { reported?: boolean };
  isReportedLoading?: boolean;
  fullDetail?: boolean;
  onDownload: (content: Content) => void;
  onReport?: (contentId: string) => void;
  onClose: () => void;
}

export const ContentModal: React.FC<ContentModalProps> = ({
  isOpen,
  content,
  course,
  downloadLogData,
  isReported,
  isReportedLoading,
  fullDetail,
  onDownload,
  onReport,
  onClose,
}) => {
  if (!isOpen || !content) return null;

  return (
    <motion.div
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      className="fixed inset-0 bg-black/30 flex justify-center p-5 items-center z-50"
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
        className="bg-[var(--color-background)] p-5 rounded-2xl shadow-lg w-full max-w-[420px] min-h-80 flex flex-col gap-4"
      >
        <h2 className="md:text-md font-medium w-full truncate">
          {content.title}
        </h2>
        <div className="flex items-center gap-2">
          <h1 className="text-sm font-medium">
            {course?.abbreviation}{' '}
            {content.type === 'LECTURE' && `CH-${content.chapter}`}
            {content.type === 'ASSIGNMENT' && '- ASSIGNMENT'}
            {content.type === 'LAB' && '- LAB'}
            {content.type === 'TUTORIAL' && '- TUTORIAL'}
          </h1>

          <Badge className="font-medium" color="var(--color-info-muted)">
            {course?.code}
          </Badge>
        </div>

        <div className="flex items-center flex-wrap gap-5 text-sm font-medium">
          {content.file.size && (
            <div className="flex items-center gap-1">
              <Box className="w-5 h-5" />
              {content.file.size} {content.file.unit}
            </div>
          )}
          {content.file.extension && (
            <div className="flex items-center gap-1">
              <Folder className="w-5 h-5" />
              {content.file.extension}
            </div>
          )}
          {downloadLogData?.count ? (
            <div className="flex items-center gap-1">
              <Download className="w-5 h-5" />
              {formatNumber(downloadLogData?.count || 0)}
            </div>
          ) : null}
        </div>

        {fullDetail && (
          <div className="flex items-center gap-5">
            <div className="flex flex-col gap-1.5">
              <span className="text-xs text-(--color-text-muted)">
                Created at
              </span>
              <span className="text-sm font-medium">
                {format(new Date(content.created_at), 'dd MMM yyyy, HH:mm')}
              </span>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-xs text-(--color-text-muted)">
                Updated at
              </span>
              <span className="text-sm font-medium">
                {format(new Date(content.updated_at), 'dd MMM yyyy, HH:mm')}
              </span>
            </div>
          </div>
        )}

        <div className="mt-auto">
          <div className="flex items-center justify-between gap-2">
            <Credit label="Uploaded by" user={content.uploaded_by} />
            {!content.uploaded_by &&
              !isReportedLoading &&
              !isReported?.reported &&
              onReport && (
                <Button onClick={() => onReport(content.id)} variant="outline">
                  Report
                </Button>
              )}
          </div>

          {content.uploaded_by ? (
            <div className="flex items-center justify-end pt-5">
              <Button onClick={() => onDownload(content)}>Download</Button>
            </div>
          ) : (
            <div className="text-sm font-medium text-[var(--color-error)] bg-[var(--color-error-muted)] p-2.5 rounded-md mt-5">
              Download disabled: Unknown uploader. This is a security precaution
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};
