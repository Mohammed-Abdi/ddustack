import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';

import {
  Button,
  Card,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
  Progress,
} from '@/components/ui';
import { updateUser, useUpdateMeMutation } from '@/features/auth';
import type { Department } from '@/features/department';
import { getOrdinalSuffix } from '@/utils/numerals';

interface ProfileSetupProps {
  departments: Department[] | undefined;
}

export const ProfileSetup: React.FC<ProfileSetupProps> = ({ departments }) => {
  const dispatch = useDispatch();
  const [update] = useUpdateMeMutation();

  const [isOpen, setIsOpen] = useState(false);
  const [currSlide, setCurrSlide] = useState(3);
  const [department, setDepartment] = useState<string | null>(null);
  const [year, setYear] = useState<string | null>(null);
  const [semester, setSemester] = useState<string | null>(null);

  const getDepartmentName = (id: string) =>
    departments?.find((dep) => dep.id === id)?.name;

  const handleNext = () => {
    if (!department) {
      toast.error('Department missing', {
        description: 'Please select your department to continue.',
      });
      return;
    }
    setCurrSlide((curr) => curr + 1);
  };

  const handleSubmit = async () => {
    if (!year || !semester) {
      toast.error('Missing information', {
        description: 'Please select both year and semester.',
      });
      return;
    }

    try {
      const updateData = {
        department: String(department),
        semester: Number(semester),
        year: Number(year),
      };
      await update(updateData).unwrap();
      dispatch(updateUser(updateData));
      toast.success('Profile completed successfully');
      setDepartment(null);
      setYear(null);
      setSemester(null);
    } catch {
      toast.error('Could not complete Profile', {
        description: 'Please try again',
      });
    }
  };

  return (
    <div className="flex items-center justify-center w-full min-h-[85dvh]">
      <div className="flex flex-col items-center justify-center gap-5 -translate-y-5">
        <img
          src="/illustrations/personal-data.svg"
          alt="announcement"
          className="w-2xs translate-y-5"
        />
        <p className="max-w-80 text-center">
          Please complete your profile to unlock your personalized For You page
        </p>
        {!isOpen && <Button onClick={() => setIsOpen(true)}>Complete</Button>}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            onClick={() => setIsOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="fixed inset-0 bg-black/30 flex justify-center items-center z-50"
          >
            <Card
              onClick={(e) => e.stopPropagation()}
              className="flex flex-col gap-5 fixed top-1/2 left-1/2 -translate-1/2 p-5"
              style={{ width: 'min(500px, 100% - 2.5rem)' }}
            >
              <article className="flex flex-col gap-2.5">
                <h1 className="font-medium">
                  Complete your profile ({currSlide}/5)
                </h1>
                <Progress value={currSlide * 20} />
                <p className="text-sm text-[var(--color-text-muted)]">
                  Unlock your full potential by completing your profile
                </p>
              </article>

              <div className="min-h-40">
                {currSlide === 3 && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">
                        {department
                          ? getDepartmentName(department)
                          : 'Select your department'}
                        <ChevronDown className="w-5 h-5 opacity-75" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuRadioGroup
                        value={department ?? undefined}
                        onValueChange={setDepartment}
                      >
                        {departments?.map((dep) => (
                          <DropdownMenuRadioItem key={dep.id} value={dep.id}>
                            {dep.name}
                          </DropdownMenuRadioItem>
                        ))}
                      </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}

                {currSlide === 4 && (
                  <div className="flex flex-wrap w-fit gap-5">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                          {year
                            ? `${getOrdinalSuffix(Number(year))} year`
                            : 'Select year'}
                          <ChevronDown className="w-5 h-5 opacity-75" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuRadioGroup
                          value={year ?? undefined}
                          onValueChange={setYear}
                        >
                          {Array.from(
                            {
                              length:
                                departments?.find(
                                  (dep) => dep.id === department
                                )?.year ?? 0,
                            },
                            (_, y) => y + 1
                          ).map((y) => (
                            <DropdownMenuRadioItem key={y} value={String(y)}>
                              {getOrdinalSuffix(y)} year
                            </DropdownMenuRadioItem>
                          ))}
                        </DropdownMenuRadioGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                          {semester
                            ? `${getOrdinalSuffix(Number(semester))} semester`
                            : 'Select semester'}
                          <ChevronDown className="w-5 h-5 opacity-75" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuRadioGroup
                          value={semester ?? undefined}
                          onValueChange={setSemester}
                        >
                          {[1, 2, 3].map((s) => (
                            <DropdownMenuRadioItem key={s} value={String(s)}>
                              {getOrdinalSuffix(s)} semester
                            </DropdownMenuRadioItem>
                          ))}
                        </DropdownMenuRadioGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end">
                <Button onClick={currSlide < 4 ? handleNext : handleSubmit}>
                  {currSlide < 4 ? 'Next' : 'Complete'}
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
