import { BookmarkAdd, BookmarkCheck } from '@/assets/icons/Bookmark';
import { Download } from '@/assets/icons/Download';
import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui';
import { Loader } from '@/features/app';
import {
  useCreateDownloadLogMutation,
  useGetContentsQuery,
  useGetDownloadLogsQuery,
  type Content,
} from '@/features/content';
import {
  useAddSavedCourseMutation,
  useDeleteSavedCourseMutation,
  useGetCourseQuery,
  useGetSavedCoursesQuery,
  type SavedCourse,
} from '@/features/course';
import {
  useCreateIntakeMutation,
  useIsContentReportedQuery,
} from '@/features/intake';
import { normalizeCapitalization } from '@/utils/format';
import { getFileIcon } from '@/utils/getFileIcon';
import * as React from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { ContentModal } from '../components/ContentModal';

export const ForYouContents: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();

  const { data: contentsData, isLoading: contentsLoading } =
    useGetContentsQuery({ courseId: courseId! }, { skip: !courseId });

  const { data: course, isLoading: courseLoading } = useGetCourseQuery(
    courseId as string,
    { skip: !courseId }
  );

  const {
    data: savedCoursesData,
    isLoading: savedCoursesLoading,
    refetch: refetchSavedCourses,
  } = useGetSavedCoursesQuery({});

  const [addSavedCourse] = useAddSavedCourseMutation();
  const [deleteSavedCourse] = useDeleteSavedCourseMutation();
  const [registerDownloadLog] = useCreateDownloadLogMutation();
  const [createIntake] = useCreateIntakeMutation();
  const [selectedContent, setSelectedContent] = React.useState<Content | null>(
    null
  );

  const { data: downloadLogData } = useGetDownloadLogsQuery(
    { contentId: selectedContent?.id as string },
    {
      skip: !selectedContent,
    }
  );

  const { data: isReported, isLoading: isReportedLoading } =
    useIsContentReportedQuery(selectedContent?.id as string, {
      skip: !selectedContent,
    });

  const contents: Content[] = React.useMemo(
    () => contentsData?.results ?? [],
    [contentsData?.results]
  );

  const savedCourses = React.useMemo(
    () => savedCoursesData?.results ?? [],
    [savedCoursesData?.results]
  );

  const isLoading = contentsLoading || courseLoading || savedCoursesLoading;

  const isReady = !contentsLoading && contents.length > 0;

  const alreadyAdded = React.useMemo(
    () => savedCourses.some((sc: SavedCourse) => sc.course === courseId),
    [savedCourses, courseId]
  );

  const handleSavedCourses = async (id: string) => {
    try {
      if (alreadyAdded) {
        const existing = savedCourses.find(
          (sc: SavedCourse) => sc.course === id
        );
        if (existing) {
          await deleteSavedCourse(existing.id).unwrap();
          toast.success('Course removed from saved courses');
        }
      } else {
        await addSavedCourse({ course: id }).unwrap();
        toast.success('Course added successfully', {
          description: 'It is added to saved courses',
        });
      }
      refetchSavedCourses();
    } catch {
      toast.error('Failed to save course');
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

  const handleReport = async (contentId: string) => {
    if (!contentId) return;

    try {
      await createIntake({
        type: 'COMPLAIN',
        subject: 'Reported disabled download content',
        content: contentId,
        description: `Reported disabled download content ID: ${contentId}`,
      }).unwrap();

      toast.success('Thank you for reporting!', {
        description: 'Our team will review this file',
      });
    } catch {
      toast.error('Failed to submit report. Please try again.');
    }
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center p-5 h-full">
        <Loader message="Loading Contents" />
      </div>
    );

  if (!isReady)
    return (
      <div className="flex items-center justify-center p-5 h-full">
        <div className="flex flex-col items-center justify-center gap-5 -translate-y-5">
          <img
            src="/illustrations/book-lover.svg"
            alt="saved courses illustration"
            className="w-60 translate-y-5"
          />
          <article className="text-center">
            <h1 className="text-xl md:text-2xl font-medium">
              We are working on this course
            </h1>
            <p>Contents for this course will be available soon.</p>
          </article>
        </div>
      </div>
    );

  return (
    <main>
      <div className="flex gap-2.5 p-5">
        <article className="flex flex-col gap-2.5 flex-1 w-[90%]">
          <h1 className="text-lg md:text-2xl font-bold truncate w-full">
            {course?.name}
          </h1>
          <p className="text-[15px] text-[var(--color-text-muted)] truncate w-full">
            {course?.description}
          </p>
        </article>
        <div className="flex items-center gap-5">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="icon"
                style={{
                  background: alreadyAdded ? 'none' : '',
                  cursor: alreadyAdded ? 'pointer' : '',
                }}
                onClick={() => handleSavedCourses(courseId as string)}
              >
                {alreadyAdded ? <BookmarkCheck /> : <BookmarkAdd />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {alreadyAdded
                  ? 'Remove from saved courses'
                  : 'Add to saved courses'}
              </p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
      <ul>
        {contents?.map((content) => (
          <div
            onClick={() => setSelectedContent(content)}
            key={content.id}
            className="flex flex-row items-center gap-3 p-5 bg-[var(--color-background)] border-y border-[var(--color-container)] hover:bg-[var(--color-surface)] transition-colors ease-in-out duration-300 cursor-pointer"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-container)]">
              {getFileIcon(content.file?.extension)}
            </div>
            <article className="flex flex-col flex-1 gap-0.5 min-w-0">
              <p className="whitespace-nowrap truncate w-full text-[15px] font-medium">
                {content.type === 'LECTURE' &&
                  `Chapter - ${content.chapter} : `}
                {content.title}
              </p>
              <p className="text-xs font-medium text-[var(--color-text-muted)]">
                {normalizeCapitalization(content.type)}
              </p>
            </article>
            <Tooltip>
              <TooltipTrigger
                className="ml-auto"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedContent(content);
                }}
                asChild
              >
                <Button variant="icon">
                  <Download />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Download</p>
              </TooltipContent>
            </Tooltip>
          </div>
        ))}
      </ul>

      <ContentModal
        isOpen={Boolean(selectedContent)}
        content={selectedContent}
        course={
          course
            ? { abbreviation: course.abbreviation, code: course.code }
            : undefined
        }
        downloadLogData={
          downloadLogData ? { count: downloadLogData.count } : undefined
        }
        isReported={isReported}
        isReportedLoading={isReportedLoading}
        onDownload={handleDownload}
        onReport={handleReport}
        onClose={() => setSelectedContent(null)}
      />
    </main>
  );
};
