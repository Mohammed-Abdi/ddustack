import { BookmarkAdd, BookmarkCheck } from '@/assets/icons/Bookmark';
import { Download } from '@/assets/icons/Download';
import {
  Cpp,
  Css,
  Doc,
  File,
  Jpg,
  Pdf,
  Png,
  Ppt,
  Sql,
  Svg,
  Txt,
  Xls,
  Zip,
} from '@/assets/icons/FileExtensions';
import { Folder } from '@/assets/icons/Folder';
import { Box } from '@/assets/icons/Materials';
import { Badge, Button, Credit } from '@/components/ui';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Loader } from '@/features/app';
import { useGetContentsQuery, type Content } from '@/features/content';
import {
  useAddSavedCourseMutation,
  useDeleteSavedCourseMutation,
  useGetCourseQuery,
  useGetSavedCoursesQuery,
  type SavedCourse,
} from '@/features/course';
import { normalizeCapitalization } from '@/utils/format';
import { formatNumber } from '@/utils/numerals';
import { AnimatePresence, motion } from 'framer-motion';
import * as React from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';

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
  const [selectedContent, setSelectedContent] = React.useState<Content | null>(
    null
  );

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
  };

  const handleSubmitReport = (contentId: string) => {
    if (!contentId) return;
    toast.success('Thank you for reporting!', {
      description: 'Our team will review this file',
    });
    // TODO: implement intake posting for reports
  };

  const getFileIcon = (ext: string) => {
    const extension = ext?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return <Pdf className="w-5 h-5" />;
      case 'doc':
      case 'docx':
        return <Doc className="w-5 h-5" />;
      case 'xls':
      case 'xlsx':
        return <Xls className="w-5 h-5" />;
      case 'sql':
        return <Sql className="w-5 h-5" />;
      case 'ppt':
      case 'pptx':
        return <Ppt className="w-5 h-5" />;
      case 'png':
        return <Png className="w-5 h-5" />;
      case 'jpg':
      case 'jpeg':
        return <Jpg className="w-5 h-5" />;
      case 'svg':
        return <Svg className="w-5 h-5" />;
      case 'txt':
        return <Txt className="w-5 h-5" />;
      case 'zip':
      case 'rar':
        return <Zip className="w-5 h-5" />;
      case 'cpp':
        return <Cpp className="w-5 h-5" />;
      case 'css':
        return <Css className="w-5 h-5" />;
      default:
        return <File className="w-5 h-5" />;
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

      <AnimatePresence>
        {selectedContent && (
          <motion.div
            onClick={() => setSelectedContent(null)}
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
                {selectedContent.title}
              </h2>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-medium">
                  {course?.abbreviation}{' '}
                  {selectedContent.type === 'LECTURE' &&
                    `CH-${selectedContent.chapter}`}
                  {selectedContent.type === 'ASSIGNMENT' && '- ASSIGNMENT'}
                  {selectedContent.type === 'LAB' && '- LAB'}
                  {selectedContent.type === 'TUTORIAL' && '- TUTORIAL'}
                </h1>

                <Badge className="font-medium" color="var(--color-info-muted)">
                  {course?.code}
                </Badge>
              </div>

              <div className="flex items-center flex-wrap gap-5 text-sm font-medium">
                <div className="flex items-center gap-1">
                  <Box className="w-5 h-5" />
                  {selectedContent.file.size} {selectedContent.file.unit}
                </div>
                <div className="flex items-center gap-1">
                  <Folder className="w-5 h-5" />
                  {selectedContent.file.extension}
                </div>
                <div className="flex items-center gap-1">
                  <Download className="w-5 h-5" />
                  {/* TODO: implement download logs then display downloads */}
                  {formatNumber(1200)}
                </div>
              </div>

              <div className="mt-auto">
                <div className="flex items-center justify-between gap-2">
                  <Credit
                    label="Uploaded by"
                    user={selectedContent.uploaded_by}
                  />
                  {!selectedContent.uploaded_by && (
                    <Button
                      onClick={() => handleSubmitReport(selectedContent.id)}
                      variant="outline"
                    >
                      Report
                    </Button>
                  )}
                </div>

                {selectedContent.uploaded_by ? (
                  <div className="flex items-center justify-end pt-5">
                    <Button onClick={() => handleDownload(selectedContent)}>
                      Download
                    </Button>
                  </div>
                ) : (
                  <div className="text-sm font-medium text-[var(--color-error)] bg-[var(--color-error-muted)] p-2.5 rounded-md mt-5">
                    Download disabled: Unknown uploader. This is a security
                    precaution for your safety
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};
