import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, ChevronLeft, ChevronRight, Plus, X } from 'lucide-react';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';

import { Desktop } from '@/assets/icons/Error';
import { Repo } from '@/assets/icons/Repo';
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
  SearchModal,
} from '@/components/ui';
import { Error, Forbidden, Loader, NoContent } from '@/features/app';
import {
  ContentCard,
  ContentModal,
  useCreateContentMutation,
  useCreateDownloadLogMutation,
  useDeleteContentMutation,
  useGetContentsQuery,
  useGetDownloadLogsQuery,
  useUpdateContentMutation,
  type Content,
  type ContentFile,
} from '@/features/content';
import { useGetCourseQuery, useGetCoursesQuery } from '@/features/course';
import { useMediaQuery } from '@/hooks';
import { cn } from '@/lib/utils';
import type { RootState } from '@/store/store';
import { formatNumber } from '@/utils/numerals';

export const Contents: React.FC = () => {
  const { accessToken, user: currentUser } = useSelector(
    (state: RootState) => state.auth
  );
  const isMobile = useMediaQuery('mobile');
  const [page, setPage] = React.useState(1);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [debouncedSearch, setDebouncedSearch] = React.useState('');
  const [query, setQuery] = React.useState('');
  const [debouncedCourseQuery, setDebouncedCourseQuery] = React.useState('');
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedContent, setSelectedContent] = React.useState<Content | null>(
    null
  );
  const [modal, setModal] = React.useState<'new' | Content | null>(null);
  const [formData, setFormData] = React.useState<Partial<Content>>({});
  const [editedData, setEditedData] = React.useState<Partial<Content>>({});
  const [originalData, setOriginalData] = React.useState<Partial<Content>>({});
  const [currentTag, setCurrentTag] = React.useState('');
  const [deleteContent] = useDeleteContentMutation();
  const [createContent] = useCreateContentMutation();
  const [editContent] = useUpdateContentMutation();
  const [registerDownloadLog] = useCreateDownloadLogMutation();

  const selectedCourseId = selectedContent
    ? (selectedContent.course as string)
    : modal === 'new'
    ? (formData.course as string | undefined)
    : (editedData.course as string | undefined);

  const { data: selectedCourse } = useGetCourseQuery(selectedCourseId ?? '', {
    skip: !accessToken || !selectedCourseId,
  });

  const {
    data,
    isLoading: isFetchingContents,
    refetch,
  } = useGetContentsQuery(
    { page, search: debouncedSearch },
    { skip: !accessToken }
  );

  const { data: courses, isLoading: isFetchingCourses } = useGetCoursesQuery(
    { search: debouncedCourseQuery },
    { skip: !accessToken }
  );
  const { data: downloadLogData } = useGetDownloadLogsQuery(
    { contentId: selectedContent?.id as string },
    {
      skip: !selectedContent,
    }
  );

  const editTagInputRef = React.useRef<HTMLInputElement>(null);
  const newTagInputRef = React.useRef<HTMLInputElement>(null);

  const handleFocus = (type: 'new' | 'edit') => {
    if (type === 'edit') editTagInputRef.current?.focus();
    if (type === 'new') newTagInputRef.current?.focus();
  };

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

  const handleNewForm = React.useCallback(
    (key: keyof Content, value: string | number | boolean | null) =>
      setFormData((prev) => ({ ...(prev ?? {}), [key]: value })),
    []
  );

  const handleEditForm = React.useCallback(
    (key: keyof Content, value: string | number | boolean | null) =>
      setEditedData((prev) => ({ ...(prev ?? {}), [key]: value })),
    []
  );

  const hasChanges = React.useMemo(() => {
    if (!editedData || !originalData) return false;

    return (Object.keys(editedData) as (keyof Content)[]).some((key) => {
      const editedValue = editedData[key];
      const originalValue = originalData[key];
      return editedValue !== originalValue;
    });
  }, [editedData, originalData]);

  const handleEdit = async () => {
    if (!editedData || !hasChanges) return;

    if (!editedData.title?.trim()) {
      toast.error('Title is required');
      return;
    }
    if (!editedData.path?.trim()) {
      toast.error('Path is required');
      return;
    }
    if (!editedData.course) {
      toast.error('Course must be selected');
      return;
    }
    if (!editedData.type) {
      toast.error('Content type must be selected');
      return;
    }
    if (!editedData.chapter?.toString().trim()) {
      toast.error('Chapter is required');
      return;
    }
    if (!editedData.file?.extension) {
      toast.error('File type must be selected');
      return;
    }
    if (!editedData.file?.size?.toString().trim()) {
      toast.error('File size is required');
      return;
    }
    if (!editedData.file?.unit) {
      toast.error('File unit must be selected');
      return;
    }
    if (!(editedData.tags?.length || 0 > 0)) {
      toast.error('At least one tag is required');
      return;
    }

    try {
      await editContent({
        id: editedData.id as string,
        data: {
          title: editedData.title,
          path: editedData.path,
          type: editedData.type,
          chapter: editedData.chapter,
          file: {
            extension: editedData.file?.extension as string,
            size: Number(editedData.file?.size),
            unit: editedData.file?.unit as string,
          },
          tags: editedData.tags,
          course: editedData.course,
        },
      }).unwrap();
      toast.success('Content updated successfully');
      setModal(null);
      refetch();
    } catch {
      toast.error('Failed to update content');
    }
  };

  const handleNew = async () => {
    if (!formData) return;

    if (!formData.title?.trim()) {
      toast.error('Title is required');
      return;
    }
    if (!formData.path?.trim()) {
      toast.error('Path is required');
      return;
    }
    if (!formData.course) {
      toast.error('Course must be selected');
      return;
    }
    if (!formData.type) {
      toast.error('Content type must be selected');
      return;
    }
    if (!formData.chapter?.toString().trim()) {
      toast.error('Chapter is required');
      return;
    }
    if (!formData.file?.extension) {
      toast.error('File type must be selected');
      return;
    }
    if (!formData.file?.size?.toString().trim()) {
      toast.error('File size is required');
      return;
    }
    if (!formData.file?.unit) {
      toast.error('File unit must be selected');
      return;
    }
    if (!(formData.tags?.length || 0 > 0)) {
      toast.error('At least one tag is required');
      return;
    }

    try {
      await createContent(formData).unwrap();
      toast.success('Content created successfully');
      setModal(null);
      setFormData({});
      refetch();
    } catch {
      toast.error('Failed to create content');
    }
  };

  const handleDownload = async (content: Content) => {
    const link = document.createElement('a');
    link.href = content.path;
    link.setAttribute('download', '');
    document.body.appendChild(link);
    link.click();
    link.remove();

    try {
      await registerDownloadLog({
        content: selectedContent?.id as string,
      }).unwrap();
      setSelectedContent(null);
    } catch {
      console.warn('Failed to register download log');
    }
  };

  const handleDelete = async (content: Content) => {
    try {
      await deleteContent(content.id).unwrap();
      toast.dismiss();
      toast.success('Content has been removed successfully.');
      refetch();
    } catch {
      toast.error('Failed to delete Content');
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
          sub: 'Please use a desktop or laptop to manage users.',
        }}
      />
    );

  return (
    <main className="flex flex-col h-[87dvh]">
      <div className="flex items-center justify-between p-5">
        <div className="flex items-center">
          Content List
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
            placeholder="Search Content..."
          />

          <Button onClick={() => setModal('new')}>
            <Plus className="size-4" /> Add new Content
          </Button>
        </article>
      </div>

      {data?.results?.length ? (
        <div className="flex items-center pl-5 p-2.5 gap-5 justify-between border-y border-[var(--color-container)] text-sm font-medium">
          <p className="w-50">Title</p>
          <p className="w-15">Type</p>
          <p className="w-12">Course</p>
          <p className="w-12">Chapter</p>
          <p className="w-50">Path</p>
          <p className="w-13 text-center"></p>
        </div>
      ) : null}

      <ul className="relative overflow-y-scroll h-[75dvh]">
        {isFetchingContents ? (
          <Loader />
        ) : data?.results?.length ? (
          data.results.map((content) => (
            <ContentCard
              onClick={() => setSelectedContent(content)}
              key={content.id}
              content={content}
              setModal={setModal}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <NoContent message="No contents found" />
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
                {modal === 'new' ? 'New Content' : 'Edit Content'}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-[var(--color-text-muted)]">
                    Title*
                  </label>
                  <input
                    required
                    className={cn(
                      'p-2 border border-[var(--color-border)] rounded-lg w-full bg-[var(--color-surface)] text-[var(--color-text-primary)] text-[15px]'
                    )}
                    value={
                      modal === 'new'
                        ? formData?.title || ''
                        : editedData?.title || ''
                    }
                    onChange={(e) => {
                      if (modal === 'new') {
                        handleNewForm('title', e.target.value);
                      } else {
                        handleEditForm('title', e.target.value);
                      }
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-[var(--color-text-muted)]">
                    Path*
                  </label>
                  <input
                    required
                    className={cn(
                      'p-2 border border-[var(--color-border)] rounded-lg w-full bg-[var(--color-surface)] text-[var(--color-text-primary)] text-[15px]'
                    )}
                    value={
                      modal === 'new'
                        ? formData?.path || ''
                        : editedData?.path || ''
                    }
                    onChange={(e) => {
                      if (modal === 'new') {
                        handleNewForm('path', e.target.value);
                      } else {
                        handleEditForm('path', e.target.value);
                      }
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-[var(--color-text-muted)]">
                    Course*
                  </label>
                  <Button
                    variant="outline"
                    className="w-full justify-between bg-[var(--color-surface)] text-[var(--color-text-primary)] whitespace-nowrap"
                    onClick={() => setIsOpen(true)}
                  >
                    <span className="w-full truncate">
                      {selectedCourse?.abbreviation || 'Select Course'}
                    </span>
                  </Button>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-[var(--color-text-muted)]">
                    Type*
                  </label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-between bg-[var(--color-surface)] text-[var(--color-text-primary)]"
                      >
                        {modal === 'new'
                          ? formData?.type || 'Select Type'
                          : editedData?.type || 'Select Type'}
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="max-h-60 overflow-y-auto"
                      align="end"
                    >
                      <DropdownMenuLabel>Select Type</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuRadioGroup
                        value={
                          modal === 'new'
                            ? formData?.type || ''
                            : editedData?.type || ''
                        }
                        onValueChange={(value) => {
                          if (modal === 'new') {
                            handleNewForm('type', value);
                          } else {
                            handleEditForm('type', value);
                          }
                        }}
                      >
                        {['LECTURE', 'ASSIGNMENT', 'LAB', 'TUTORIAL'].map(
                          (type) => (
                            <DropdownMenuRadioItem key={type} value={type}>
                              {type}
                            </DropdownMenuRadioItem>
                          )
                        )}
                      </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-[var(--color-text-muted)]">
                    Chapter*
                  </label>
                  <input
                    required
                    className={cn(
                      'py-2 px-5 border border-[var(--color-border)] rounded-full w-full bg-[var(--color-surface)] text-[var(--color-text-primary)] text-[15px]'
                    )}
                    value={
                      modal === 'new'
                        ? formData?.chapter || ''
                        : editedData?.chapter || ''
                    }
                    onChange={(e) => {
                      if (modal === 'new') {
                        handleNewForm('chapter', e.target.value);
                      } else {
                        handleEditForm('chapter', e.target.value);
                      }
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-[var(--color-text-muted)]">
                    File*
                  </label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-between bg-[var(--color-surface)] text-[var(--color-text-primary)]"
                      >
                        {modal === 'new'
                          ? formData?.file?.extension || 'Select file extension'
                          : editedData?.file?.extension || 'PDF'}
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="max-h-60 overflow-y-auto"
                      align="end"
                    >
                      <DropdownMenuRadioGroup
                        value={
                          modal === 'new'
                            ? formData?.file?.extension || ''
                            : editedData?.file?.extension || 'PDF'
                        }
                        onValueChange={(value) => {
                          if (modal === 'new') {
                            setFormData((cur) => ({
                              ...(cur ?? {}),
                              file: {
                                ...(cur?.file ?? {}),
                                extension: value,
                              } as ContentFile,
                            }));
                          } else {
                            setEditedData((cur) => ({
                              ...(cur ?? {}),
                              file: {
                                ...(cur?.file ?? {}),
                                extension: value,
                              } as ContentFile,
                            }));
                          }
                        }}
                      >
                        {[
                          'PDF',
                          'DOC',
                          'PPT',
                          'PPTX',
                          'XLS',
                          'TXT',
                          'JPG',
                          'PNG',
                          'SVG',
                          'ZIP',
                          'CSS',
                          'SQL',
                          'CPP',
                        ].map((FileExt) => (
                          <DropdownMenuRadioItem key={FileExt} value={FileExt}>
                            {FileExt}
                          </DropdownMenuRadioItem>
                        ))}
                      </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-[var(--color-text-muted)]">
                    Size*
                  </label>
                  <input
                    required
                    className={cn(
                      'py-2 px-5 border border-[var(--color-border)] rounded-full w-full bg-[var(--color-surface)] text-[var(--color-text-primary)] text-[15px]'
                    )}
                    value={
                      modal === 'new'
                        ? formData?.file?.size || ''
                        : editedData?.file?.size || ''
                    }
                    onChange={(e) => {
                      if (modal === 'new') {
                        setFormData((cur) => ({
                          ...(cur ?? {}),
                          file: {
                            ...(cur?.file ?? {}),
                            size: e.target.value,
                          } as ContentFile,
                        }));
                      } else {
                        setEditedData((cur) => ({
                          ...(cur ?? {}),
                          file: {
                            ...(cur?.file ?? {}),
                            size: e.target.value,
                          } as ContentFile,
                        }));
                      }
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-[var(--color-text-muted)]">
                    Unit*
                  </label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-between bg-[var(--color-surface)] text-[var(--color-text-primary)]"
                      >
                        {modal === 'new'
                          ? formData?.file?.unit || 'Select size unit'
                          : editedData?.file?.unit || 'MB'}
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="max-h-60 overflow-y-auto"
                      align="end"
                    >
                      <DropdownMenuRadioGroup
                        value={
                          modal === 'new'
                            ? formData?.file?.unit || ''
                            : editedData?.file?.unit || 'MB'
                        }
                        onValueChange={(value) => {
                          if (modal === 'new') {
                            setFormData((cur) => ({
                              ...(cur ?? {}),
                              file: {
                                ...(cur?.file ?? {}),
                                unit: value,
                              } as ContentFile,
                            }));
                          } else {
                            setEditedData((cur) => ({
                              ...(cur ?? {}),
                              file: {
                                ...(cur?.file ?? {}),
                                unit: value,
                              } as ContentFile,
                            }));
                          }
                        }}
                      >
                        {['KB', 'MB'].map((unit) => (
                          <DropdownMenuRadioItem key={unit} value={unit}>
                            {unit}
                          </DropdownMenuRadioItem>
                        ))}
                      </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
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

      <SearchModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        query={query}
        setQuery={setQuery}
        debouncedQuery={debouncedCourseQuery}
        setDebouncedQuery={setDebouncedCourseQuery}
        placeholder="Search course..."
        results={courses?.results || []}
        isFetching={isFetchingCourses}
        onSelect={(id) =>
          modal === 'new'
            ? handleNewForm('course', id)
            : handleEditForm('course', id)
        }
        icon={<Repo className="w-4 h-4" />}
      />
      <ContentModal
        isOpen={Boolean(selectedContent)}
        content={selectedContent}
        fullDetail
        course={
          selectedCourse
            ? {
                abbreviation: selectedCourse.abbreviation,
                code: selectedCourse.code,
              }
            : undefined
        }
        downloadLogData={
          downloadLogData ? { count: downloadLogData.count } : undefined
        }
        onDownload={handleDownload}
        onClose={() => setSelectedContent(null)}
      />
    </main>
  );
};
