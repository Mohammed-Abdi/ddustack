import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, ChevronLeft, ChevronRight, Plus, X } from 'lucide-react';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';

import { Desktop } from '@/assets/icons/Error';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  SearchInput,
} from '@/components/ui';
import { Error, Forbidden, Loader, NoContent } from '@/features/app';
import {
  CourseCard,
  useCreateCourseMutation,
  useDeleteCourseMutation,
  useGetCoursesQuery,
  useUpdateCourseMutation,
  type Course,
} from '@/features/course';
import { useMediaQuery } from '@/hooks';
import { cn } from '@/lib/utils';
import type { RootState } from '@/store/store';
import { formatNumber } from '@/utils/numerals';
import { CourseModal } from '../components/CourseModal';

export const Courses: React.FC = () => {
  const { accessToken, user: currentUser } = useSelector(
    (state: RootState) => state.auth
  );
  const isMobile = useMediaQuery('mobile');
  const [page, setPage] = React.useState(1);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [debouncedSearch, setDebouncedSearch] = React.useState('');
  const [modal, setModal] = React.useState<'new' | Course | null>(null);
  const [selectedCourse, setSelectedCourse] = React.useState<Course | null>(
    null
  );
  const [formData, setFormData] = React.useState<Partial<Course>>({});
  const [editedData, setEditedData] = React.useState<Partial<Course>>({});
  const [originalData, setOriginalData] = React.useState<Partial<Course>>({});
  const [currentTag, setCurrentTag] = React.useState('');
  const [deleteCourse] = useDeleteCourseMutation();
  const [createCourse] = useCreateCourseMutation();
  const [editCourse] = useUpdateCourseMutation();

  const newTagInputRef = React.useRef<HTMLInputElement>(null);
  const editTagInputRef = React.useRef<HTMLInputElement>(null);

  const {
    data,
    isLoading: isFetchingCourses,
    refetch,
  } = useGetCoursesQuery(
    { page, search: debouncedSearch },
    { skip: !accessToken }
  );

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  React.useEffect(() => {
    if (!modal || modal === 'new') return;
    setEditedData(modal);
    setOriginalData(modal);
  }, [modal]);

  const handleFocus = (type: 'new' | 'edit') => {
    if (type === 'edit') editTagInputRef.current?.focus();
    if (type === 'new') newTagInputRef.current?.focus();
  };

  const handleNewForm = React.useCallback(
    (key: keyof Course, value: string | number | boolean | null) =>
      setFormData((prev) => ({ ...(prev ?? {}), [key]: value })),
    []
  );

  const handleEditForm = React.useCallback(
    (key: keyof Course, value: string | number | boolean | null) =>
      setEditedData((prev) => ({ ...(prev ?? {}), [key]: value })),
    []
  );

  const hasChanges = React.useMemo(() => {
    if (!editedData || !originalData) return false;

    return (Object.keys(editedData) as (keyof Course)[]).some((key) => {
      const editedValue = editedData[key];
      const originalValue = originalData[key];
      return editedValue !== originalValue;
    });
  }, [editedData, originalData]);

  const handleEdit = async () => {
    if (!editedData || !hasChanges) return;

    if (!editedData.name?.trim()) {
      toast.error('Name is required');
      return;
    }
    if (!editedData.code?.trim()) {
      toast.error('Code is required');
      return;
    }
    if (!editedData.credit_points) {
      toast.error('Credit Points is required');
      return;
    }
    if (!editedData.lab_hours) {
      toast.error('Lab Hours is required');
      return;
    }
    if (!editedData.lecture_hours) {
      toast.error('Lecture Hours is required');
      return;
    }
    if (!editedData.credit_hours) {
      toast.error('Credit Hours is required');
      return;
    }
    if (!editedData.tutorial_hours) {
      toast.error('Tutorial Hours is required');
      return;
    }
    if (!editedData.homework_hours) {
      toast.error('Homework Hours is required');
      return;
    }
    if (!(editedData.tags?.length || 0 > 0)) {
      toast.error('At least one tag is required');
      return;
    }

    try {
      await editCourse({
        id: editedData.id as string,

        name: editedData.name,
        code: editedData.code,
        abbreviation: editedData.abbreviation,
        description: editedData.description,
        status: editedData.status,
        credit_points: editedData.credit_points,
        lab_hours: editedData.lab_hours,
        lecture_hours: editedData.lecture_hours,
        credit_hours: editedData.credit_hours,
        tutorial_hours: editedData.tutorial_hours,
        homework_hours: editedData.homework_hours,
        tags: editedData.tags,
      }).unwrap();
      toast.success('Course updated successfully');
      setModal(null);
      refetch();
    } catch {
      toast.error('Failed to update course');
    }
  };

  const handleNew = async () => {
    if (!formData) return;

    if (!formData.name?.trim()) {
      toast.error('Name is required');
      return;
    }
    if (!formData.code?.trim()) {
      toast.error('Code is required');
      return;
    }
    if (formData.code?.trim().length > 10) {
      toast.error('Course code cannot exceed 10 characters');
      return;
    }
    if (!formData.credit_points) {
      toast.error('Credit Points is required');
      return;
    }
    if (!formData.lab_hours) {
      toast.error('Lab Hours is required');
      return;
    }
    if (!formData.lecture_hours) {
      toast.error('Lecture Hours is required');
      return;
    }
    if (!formData.credit_hours) {
      toast.error('Credit Hours is required');
      return;
    }
    if (!formData.tutorial_hours) {
      toast.error('Tutorial Hours is required');
      return;
    }
    if (!formData.homework_hours) {
      toast.error('Homework Hours is required');
      return;
    }
    if (!(formData.tags?.length || 0 > 0)) {
      toast.error('At least one tag is required');
      return;
    }

    try {
      console.log(formData);
      await createCourse(formData).unwrap();
      toast.success('Course created successfully');
      setModal(null);
      setFormData({});
      refetch();
    } catch {
      toast.error('Failed to create course');
    }
  };

  const handleDelete = async (course: Course) => {
    try {
      await deleteCourse(course.id).unwrap();
      toast.dismiss();
      toast.success('Course has been removed successfully.');
      refetch();
    } catch {
      toast.error('Failed to delete course');
    }
  };

  const handleAddTagNew = () => {
    if (!currentTag.trim()) return;
    setFormData((cur) => ({
      ...(cur ?? {}),
      tags: [...((cur?.tags as string[]) ?? []), currentTag.trim()],
    }));
    setCurrentTag('');
    newTagInputRef.current?.focus();
  };

  const handleAddTagEdit = () => {
    if (!currentTag.trim()) return;
    setEditedData((cur) => ({
      ...(cur ?? {}),
      tags: [...((cur?.tags as string[]) ?? []), currentTag.trim()],
    }));
    setCurrentTag('');
    editTagInputRef.current?.focus();
  };

  const handleRemoveTagNew = (tag: string) =>
    setFormData((cur) => ({
      ...(cur ?? {}),
      tags: ((cur?.tags as string[]) ?? []).filter((t) => t !== tag),
    }));

  const handleRemoveTagEdit = (tag: string) =>
    setEditedData((cur) => ({
      ...(cur ?? {}),
      tags: ((cur?.tags as string[]) ?? []).filter((t) => t !== tag),
    }));

  if (!['ADMIN'].includes(currentUser?.role as string)) return <Forbidden />;

  if (isMobile)
    return (
      <Error
        icon={<Desktop className="w-20 h-20 opacity-80" />}
        message={{
          main: 'Not available on mobile',
          sub: 'Please use a desktop or laptop to manage courses.',
        }}
      />
    );

  return (
    <main className="flex flex-col h-[87dvh]">
      <div className="flex items-center justify-between p-5">
        <div className="flex items-center">
          Course List
          <div className="font-medium text-[15px] text-center w-10 ml-1">
            ({formatNumber(data?.count || 0)})
          </div>
        </div>

        <article className="flex items-center gap-5">
          {(data?.count ?? 0) > 20 && (
            <div className="flex justify-center items-center gap-2">
              <Button
                variant="outline"
                disabled={!data?.previous}
                onClick={() => setPage(Math.max(page - 1, 1))}
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </Button>

              <motion.span
                className="inline-block w-[1.25rem] text-center"
                animate={{
                  scale: data?.previous && page > 1 ? 1 : 0,
                  opacity: data?.previous && page > 1 ? 1 : 0,
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                •••
              </motion.span>

              <Button variant="outline" onClick={() => setPage(page)}>
                {page}
              </Button>

              <motion.span
                className="inline-block w-[1.25rem] text-center"
                animate={{
                  scale: data?.next ? 1 : 0,
                  opacity: data?.next ? 1 : 0,
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                •••
              </motion.span>

              <Button
                variant="outline"
                disabled={!data?.next}
                onClick={() => setPage(page + 1)}
              >
                Next <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search Course..."
          />

          <Button onClick={() => setModal('new')}>
            <Plus className="size-4" /> Add new Course
          </Button>
        </article>
      </div>

      {data?.results?.length ? (
        <div className="flex items-center pl-5 p-2.5 gap-5 justify-between border-y border-[var(--color-container)] text-sm font-medium">
          <p className="w-50">Name</p>
          <p className="w-20">Short</p>
          <p className="w-20">Code</p>
          <p className="w-20">Status</p>
          <p className="w-13 text-center"></p>
        </div>
      ) : null}

      <ul className="relative overflow-y-scroll h-[75dvh]">
        {isFetchingCourses ? (
          <Loader />
        ) : data?.results?.length ? (
          data.results.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              setModal={setModal}
              onDelete={handleDelete}
              onClick={() => setSelectedCourse(course)}
            />
          ))
        ) : (
          <NoContent message="No courses found" />
        )}
      </ul>

      <AnimatePresence>
        {modal && (
          <motion.div
            onClick={() => setModal(null)}
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
              className="bg-[var(--color-background)] p-5 md:rounded-2xl shadow-lg w-full max-w-[720px] min-h-[60dvh] flex flex-col gap-4"
            >
              <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
                {modal === 'new' ? 'New Course' : 'Edit Course'}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-[var(--color-text-muted)]">
                    Name*
                  </label>
                  <input
                    required
                    className={cn(
                      'p-2 border border-[var(--color-border)] rounded-lg w-full bg-[var(--color-surface)] text-[var(--color-text-primary)] text-[15px]'
                    )}
                    value={
                      modal === 'new'
                        ? formData?.name || ''
                        : editedData?.name || ''
                    }
                    onChange={(e) => {
                      if (modal === 'new') {
                        handleNewForm('name', e.target.value);
                      } else {
                        handleEditForm('name', e.target.value);
                      }
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-[var(--color-text-muted)]">
                    Code*
                  </label>
                  <input
                    required
                    className={cn(
                      'p-2 border border-[var(--color-border)] rounded-lg w-full bg-[var(--color-surface)] text-[var(--color-text-primary)] text-[15px]'
                    )}
                    value={
                      modal === 'new'
                        ? formData?.code || ''
                        : editedData?.code || ''
                    }
                    onChange={(e) => {
                      if (modal === 'new') {
                        handleNewForm('code', e.target.value);
                      } else {
                        handleEditForm('code', e.target.value);
                      }
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-[var(--color-text-muted)]">
                    Abbreviation*
                  </label>
                  <input
                    required
                    className={cn(
                      'p-2 border border-[var(--color-border)] rounded-lg w-full bg-[var(--color-surface)] text-[var(--color-text-primary)] text-[15px]'
                    )}
                    value={
                      modal === 'new'
                        ? formData?.abbreviation || ''
                        : editedData?.abbreviation || ''
                    }
                    onChange={(e) => {
                      if (modal === 'new') {
                        handleNewForm('abbreviation', e.target.value);
                      } else {
                        handleEditForm('abbreviation', e.target.value);
                      }
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-[var(--color-text-muted)]">
                    Status*
                  </label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-between bg-[var(--color-surface)] text-[var(--color-text-primary)]"
                      >
                        {modal === 'new'
                          ? formData?.status || 'Select Status'
                          : editedData?.status || 'Select Status'}
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="max-h-60 overflow-y-auto"
                      align="end"
                    >
                      <DropdownMenuLabel>Select Status</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuRadioGroup
                        value={
                          modal === 'new'
                            ? formData?.status || ''
                            : editedData?.status || ''
                        }
                        onValueChange={(value) => {
                          if (modal === 'new') {
                            handleNewForm('status', value);
                          } else {
                            handleEditForm('status', value);
                          }
                        }}
                      >
                        {['COMPULSORY', 'SUPPORTIVE', 'COMMON', 'ELECTIVE'].map(
                          (status) => (
                            <DropdownMenuRadioItem key={status} value={status}>
                              {status}
                            </DropdownMenuRadioItem>
                          )
                        )}
                      </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm text-[var(--color-text-muted)]">
                    Description*
                  </label>
                  <textarea
                    required
                    className={cn(
                      'p-2 border border-[var(--color-border)] rounded-lg w-full bg-[var(--color-surface)] text-[var(--color-text-primary)] text-[15px] min-h-[80px]'
                    )}
                    value={
                      modal === 'new'
                        ? formData?.description || ''
                        : editedData?.description || ''
                    }
                    onChange={(e) => {
                      if (modal === 'new') {
                        handleNewForm('description', e.target.value);
                      } else {
                        handleEditForm('description', e.target.value);
                      }
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-[var(--color-text-muted)]">
                    Credit Pts*
                  </label>
                  <input
                    required
                    type="number"
                    className={cn(
                      'p-2 border border-[var(--color-border)] rounded-lg w-full bg-[var(--color-surface)] text-[var(--color-text-primary)] text-[15px]'
                    )}
                    value={
                      modal === 'new'
                        ? formData?.credit_points || ''
                        : editedData?.credit_points || ''
                    }
                    onChange={(e) => {
                      if (modal === 'new') {
                        handleNewForm('credit_points', Number(e.target.value));
                      } else {
                        handleEditForm('credit_points', Number(e.target.value));
                      }
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-[var(--color-text-muted)]">
                    Lab Hrs*
                  </label>
                  <input
                    required
                    type="number"
                    className={cn(
                      'p-2 border border-[var(--color-border)] rounded-lg w-full bg-[var(--color-surface)] text-[var(--color-text-primary)] text-[15px]'
                    )}
                    value={
                      modal === 'new'
                        ? formData?.lab_hours || ''
                        : editedData?.lab_hours || ''
                    }
                    onChange={(e) => {
                      if (modal === 'new') {
                        handleNewForm('lab_hours', Number(e.target.value));
                      } else {
                        handleEditForm('lab_hours', Number(e.target.value));
                      }
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-[var(--color-text-muted)]">
                    Lecture Hrs*
                  </label>
                  <input
                    required
                    type="number"
                    className={cn(
                      'p-2 border border-[var(--color-border)] rounded-lg w-full bg-[var(--color-surface)] text-[var(--color-text-primary)] text-[15px]'
                    )}
                    value={
                      modal === 'new'
                        ? formData?.lecture_hours || ''
                        : editedData?.lecture_hours || ''
                    }
                    onChange={(e) => {
                      if (modal === 'new') {
                        handleNewForm('lecture_hours', Number(e.target.value));
                      } else {
                        handleEditForm('lecture_hours', Number(e.target.value));
                      }
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-[var(--color-text-muted)]">
                    Credit Hrs*
                  </label>
                  <input
                    required
                    type="number"
                    className={cn(
                      'p-2 border border-[var(--color-border)] rounded-lg w-full bg-[var(--color-surface)] text-[var(--color-text-primary)] text-[15px]'
                    )}
                    value={
                      modal === 'new'
                        ? formData?.credit_hours || ''
                        : editedData?.credit_hours || ''
                    }
                    onChange={(e) => {
                      if (modal === 'new') {
                        handleNewForm('credit_hours', Number(e.target.value));
                      } else {
                        handleEditForm('credit_hours', Number(e.target.value));
                      }
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-[var(--color-text-muted)]">
                    Tutorial Hrs*
                  </label>
                  <input
                    required
                    type="number"
                    className={cn(
                      'p-2 border border-[var(--color-border)] rounded-lg w-full bg-[var(--color-surface)] text-[var(--color-text-primary)] text-[15px]'
                    )}
                    value={
                      modal === 'new'
                        ? formData?.tutorial_hours || ''
                        : editedData?.tutorial_hours || ''
                    }
                    onChange={(e) => {
                      if (modal === 'new') {
                        handleNewForm('tutorial_hours', Number(e.target.value));
                      } else {
                        handleEditForm(
                          'tutorial_hours',
                          Number(e.target.value)
                        );
                      }
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-[var(--color-text-muted)]">
                    Homework Hrs*
                  </label>
                  <input
                    required
                    type="number"
                    className={cn(
                      'p-2 border border-[var(--color-border)] rounded-lg w-full bg-[var(--color-surface)] text-[var(--color-text-primary)] text-[15px]'
                    )}
                    value={
                      modal === 'new'
                        ? formData?.homework_hours || ''
                        : editedData?.homework_hours || ''
                    }
                    onChange={(e) => {
                      if (modal === 'new') {
                        handleNewForm('homework_hours', Number(e.target.value));
                      } else {
                        handleEditForm(
                          'homework_hours',
                          Number(e.target.value)
                        );
                      }
                    }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-[var(--color-text-muted)]">
                  Tags*
                </label>
                <div
                  className="flex flex-wrap gap-1 p-2.5 w-full min-h-16 bg-[var(--color-surface)] outline outline-[var(--color-container)] rounded-lg"
                  onClick={() => {
                    if (modal === 'new') {
                      handleFocus('new');
                    } else {
                      handleFocus('edit');
                    }
                  }}
                >
                  {(modal === 'new'
                    ? formData?.tags ?? []
                    : editedData?.tags ?? []
                  ).map((tag) => (
                    <div
                      key={tag}
                      className="flex items-center h-fit px-2 py-0.5 text-sm bg-[var(--color-info-muted)] text-[var(--color-info)] gap-1 rounded-full"
                    >
                      {tag}
                      <X
                        onClick={(e) => {
                          e.stopPropagation();
                          if (modal === 'new') {
                            handleRemoveTagNew(tag);
                          } else {
                            handleRemoveTagEdit(tag);
                          }
                        }}
                        className="rounded-full text-white bg-[var(--color-info)] w-3 h-3"
                      />
                    </div>
                  ))}
                  <input
                    ref={modal === 'new' ? newTagInputRef : editTagInputRef}
                    className={cn(
                      'rounded-sm h-fit w-30 text-[var(--color-text-primary)] text-[15px]'
                    )}
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (modal === 'new') {
                          handleAddTagNew();
                        } else {
                          handleAddTagEdit();
                        }
                      }
                    }}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setModal(null)}>
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    if (modal === 'new') {
                      handleNew();
                    } else {
                      handleEdit();
                    }
                  }}
                  disabled={modal !== 'new' && !hasChanges}
                >
                  Save
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <CourseModal
        isOpen={Boolean(selectedCourse)}
        course={selectedCourse}
        fullDetail
        onClose={() => setSelectedCourse(null)}
      />
    </main>
  );
};
