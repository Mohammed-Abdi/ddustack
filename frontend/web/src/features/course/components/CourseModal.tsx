import { Button, Detail } from '@/components/ui';
import { normalizeCapitalization } from '@/utils/format';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import type { Course } from '../api/interfaces';

interface CourseModalProps {
  isOpen: boolean;
  course: Course | null;
  fullDetail?: boolean;
  onClose: () => void;
}

export const CourseModal: React.FC<CourseModalProps> = ({
  isOpen,
  course,
  fullDetail = false,
  onClose,
}) => {
  if (!isOpen || !course) return null;

  return (
    <motion.div
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      className="fixed inset-0 bg-black/30 flex justify-center items-center z-50"
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
        className="bg-[var(--color-background)] p-5 md:rounded-2xl shadow-lg w-full max-w-[600px] flex flex-col gap-4"
      >
        <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
          Course Details
        </h2>

        <article>
          <label className="text-xs text-(--color-text-muted)">Name</label>
          <p className="text-sm font-medium">{course.name}</p>
        </article>

        <article>
          <label className="text-xs text-(--color-text-muted)">Code</label>
          <p className="text-sm font-medium">{course.code || '—'}</p>
        </article>

        {fullDetail && (
          <Detail label="ID" value={course.id} copyable className="text-sm" />
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <article>
            <label className="text-xs text-(--color-text-muted)">
              Credit Points
            </label>
            <p className="text-sm font-medium">{course.credit_points || '—'}</p>
          </article>

          <article>
            <label className="text-xs text-(--color-text-muted)">
              Lab Hours
            </label>
            <p className="text-sm font-medium">{course.lab_hours || '—'}</p>
          </article>

          <article>
            <label className="text-xs text-(--color-text-muted)">
              Lecture Hours
            </label>
            <p className="text-sm font-medium">{course.lecture_hours || '—'}</p>
          </article>

          <article>
            <label className="text-xs text-(--color-text-muted)">
              Credit Hours
            </label>
            <p className="text-sm font-medium">{course.credit_hours || '—'}</p>
          </article>

          <article>
            <label className="text-xs text-(--color-text-muted)">
              Tutorial Hours
            </label>
            <p className="text-sm font-medium">
              {course.tutorial_hours || '—'}
            </p>
          </article>

          <article>
            <label className="text-xs text-(--color-text-muted)">
              Homework Hours
            </label>
            <p className="text-sm font-medium">
              {course.homework_hours || '—'}
            </p>
          </article>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-(--color-text-muted)">Status</label>
            <p className="text-sm font-medium">
              {normalizeCapitalization(course.status) || '—'}
            </p>
          </div>

          {fullDetail && (
            <>
              <article>
                <label className="text-xs text-(--color-text-muted)">
                  Created at
                </label>
                <p className="text-sm font-medium">
                  {format(new Date(course.created_at), 'dd MMM yyyy, HH:mm')}
                </p>
              </article>
              <article>
                <label className="text-xs text-(--color-text-muted)">
                  Updated at
                </label>
                <p className="text-sm font-medium">
                  {format(new Date(course.updated_at), 'dd MMM yyyy, HH:mm')}
                </p>
              </article>
            </>
          )}
        </div>

        {fullDetail && course.tags && course.tags.length > 0 && (
          <div>
            <label className="text-xs text-(--color-text-muted)">Tags</label>
            <div className="flex flex-wrap gap-1 mt-1">
              {course.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 text-xs bg-[var(--color-info-muted)] text-[var(--color-info)] rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};
