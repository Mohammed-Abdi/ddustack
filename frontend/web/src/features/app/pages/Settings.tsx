import { Clock } from '@/assets/icons/Clock';
import Edit from '@/assets/icons/Setting';
import { Verified } from '@/assets/icons/Verified';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Emblem,
  Skeleton,
} from '@/components/ui';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { User } from '@/features/auth';
import {
  updateUser,
  useUpdateMeMutation,
  useUploadAvatarMutation,
} from '@/features/auth';
import type { Department } from '@/features/department';
import {
  useLazyGetDepartmentQuery,
  useLazyGetDepartmentsQuery,
} from '@/features/department';
import { useMediaQuery } from '@/hooks';
import { cn } from '@/lib/utils';
import type { AppDispatch, RootState } from '@/store/store';
import { normalizeCapitalization } from '@/utils/format';
import { getOrdinalSuffix } from '@/utils/numerals';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';

const MS_IN_DAY = 1000 * 60 * 60 * 24;
const EDIT_COOLDOWN_DAYS = Number(import.meta.env.VITE_EDIT_COOLDOWN_DAYS) || 0;

export const Settings: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const isMobile = useMediaQuery('mobile');

  const [updateUserInfo] = useUpdateMeMutation();
  const [uploadAvatar] = useUploadAvatarMutation();
  const [
    fetchDepartments,
    { data: departments, isLoading: isFetchingDepartments },
  ] = useLazyGetDepartmentsQuery();
  const [fetchDepartment] = useLazyGetDepartmentQuery();

  const [formData, setFormData] = React.useState<Partial<User> | null>(null);
  const [isHovered, setIsHovered] = React.useState<boolean>(false);
  const [isEditing, setIsEditing] = React.useState<boolean>(false);
  const [department, setDepartment] = React.useState<Department>();

  React.useEffect(() => {
    if (user) {
      fetchDepartments();
      setFormData({
        first_name: user.first_name,
        last_name: user.last_name,
        department: user.department,
        year: user.year,
        semester: user.semester,
      });
    }
  }, [user, fetchDepartments]);

  React.useEffect(() => {
    if (formData?.department) {
      (async () => {
        try {
          const dep = await fetchDepartment(
            formData.department as string
          ).unwrap();
          setDepartment(dep);
        } catch (err) {
          console.error('Failed to fetch department', err);
        }
      })();
    }
  }, [formData?.department, fetchDepartment]);

  const editStatus = React.useMemo(() => {
    if (!user?.updated_at || !user?.date_joined)
      return { canEdit: true, daysLeft: 0 };

    const updatedTrimmed = user.updated_at.slice(0, 16);
    const joinedTrimmed = user.date_joined.slice(0, 16);

    if (updatedTrimmed === joinedTrimmed) return { canEdit: true, daysLeft: 0 };

    const now = Date.now();
    const updatedAt = new Date(user.updated_at).getTime();
    const daysSinceUpdate = (now - updatedAt) / MS_IN_DAY;

    const canEdit = daysSinceUpdate >= EDIT_COOLDOWN_DAYS;
    const daysLeft = canEdit
      ? 0
      : Math.ceil(EDIT_COOLDOWN_DAYS - daysSinceUpdate);

    return { canEdit, daysLeft };
  }, [user?.updated_at, user?.date_joined]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const data = new FormData();
    data.append('avatar', file);
    try {
      const res = await uploadAvatar(data).unwrap();
      dispatch(updateUser({ avatar: res.avatar }));
      toast.success('Avatar updated!');
    } catch {
      toast.error('Failed to upload avatar.');
    }
  };

  const handleFormChange = (key: string, value: string) =>
    setFormData((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async () => {
    if (!formData) return;
    if (!editStatus.canEdit) {
      toast.error(
        "Can't update your profile since you just changed it in the last 30 days"
      );
      return;
    }

    const data: Partial<User> = {
      first_name: normalizeCapitalization(formData.first_name as string),
      last_name: normalizeCapitalization(formData.last_name as string),
      department: formData.department,
      year: Number(formData.year),
      semester: Number(formData.semester),
    };

    try {
      await updateUserInfo(data).unwrap();

      dispatch(updateUser(data));

      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      toast.error('Failed to update profile');
    }
  };

  const isLoading = !user || isFetchingDepartments;

  return (
    <div className="relative flex flex-col gap-5">
      <div className="relative h-40 bg-[var(--color-container)]">
        <input
          type="file"
          id="avatarUpload"
          className="hidden"
          onChange={handleAvatarChange}
          accept="image/*"
        />
        <label
          htmlFor="avatarUpload"
          className="w-full h-full cursor-pointer"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Avatar className="w-32 h-32 absolute -bottom-16 left-5 border-4 border-[var(--color-background)] overflow-hidden bg-[var(--color-background)]">
            {isLoading ? (
              <Skeleton className="h-32 w-32 rounded-full" />
            ) : (
              <div className="relative w-full">
                <AvatarImage src={user.avatar || undefined} />
                <AvatarFallback className="flex items-center justify-center w-full h-full text-4xl font-medium">
                  <img
                    src="/illustrations/pfp-fallback.webp"
                    alt="default profile picture"
                    className="w-full h-full"
                  />
                </AvatarFallback>
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ ease: 'easeInOut' }}
                      className="absolute inset-0 flex items-center justify-center bg-black/20"
                    >
                      <Edit className="text-white w-8 h-8" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </Avatar>
        </label>
      </div>
      <div className="px-5 pt-16 flex justify-between items-start">
        <div className="flex flex-col gap-1">
          <div className="flex items-center flex-wrap gap-2">
            {isLoading ? (
              <Skeleton className="h-6 w-48 rounded-sm" />
            ) : (
              <>
                <h1 className="md:text-2xl font-semibold">
                  {user.first_name} {user.last_name}
                </h1>
                {user.is_verified && (
                  <Verified className="w-4 h-4 text-[var(--color-info)]" />
                )}
              </>
            )}
          </div>
          {isLoading ? (
            <Skeleton className="h-4 w-24 rounded-sm " />
          ) : (
            <p>{user.email}</p>
          )}
          <div className="flex items-center flex-wrap text-[15px] font-medium gap-2">
            {isLoading ? (
              <Skeleton className="h-4 w-24 rounded-sm" />
            ) : (
              <>
                <h3 className="text-[var(--color-info)]">
                  {['LECTURER', 'MODERATOR', 'ADMIN'].includes(user.role)
                    ? user.user_id
                    : department?.name}
                </h3>
                {' • '}
                <h3 className="text-sm font-medium">{user.role}</h3>
              </>
            )}
          </div>
          {isLoading ? (
            <Skeleton className="h-4 w-24 rounded-sm" />
          ) : (
            user.year &&
            user.semester && (
              <p className="text-sm text-[var(--color-text-secondary)]">
                {getOrdinalSuffix(user.year)} Year •{' '}
                {getOrdinalSuffix(user.semester)} Semester
              </p>
            )
          )}
        </div>
        <Button
          variant="outline"
          onClick={() => setIsEditing(true)}
          className="flex items-center gap-2 text-[var(--color-text-primary)]"
        >
          <Edit className="w-5 h-5" /> Edit
        </Button>
      </div>
      <AnimatePresence>
        {isEditing && (
          <motion.div
            onClick={() => setIsEditing(false)}
            initial={isMobile ? undefined : { opacity: 0 }}
            animate={isMobile ? undefined : { opacity: 1 }}
            transition={
              isMobile ? undefined : { duration: 0.15, ease: 'easeOut' }
            }
            className="fixed inset-0 bg-black/30 flex justify-center items-center z-50"
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={isMobile ? undefined : { scale: 0.9 }}
              animate={isMobile ? undefined : { scale: 1 }}
              transition={
                isMobile ? undefined : { duration: 0.15, ease: 'easeOut' }
              }
              className="bg-[var(--color-background)] p-5 md:rounded-2xl shadow-lg w-full max-w-[420px] min-h-[100dvh] md:min-h-80 flex flex-col gap-4"
            >
              {editStatus.canEdit ? (
                <>
                  <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
                    Edit Profile
                  </h2>

                  <p className="text-sm bg-[var(--color-error-muted)] p-2.5 rounded-md">
                    Profile can only be updated once every{' '}
                    <span className="font-medium">30 days</span>.
                  </p>

                  <article className="flex flex-col md:flex-row items-center gap-2.5">
                    <div className="space-y-2">
                      <label className="text-sm text-[var(--color-text-muted)]">
                        First name*
                      </label>
                      <input
                        required
                        disabled={!editStatus.canEdit}
                        className={cn(
                          'p-2 border border-[var(--color-border)] rounded-lg w-full bg-[var(--color-surface)] text-[var(--color-text-primary)] text-[15px]'
                        )}
                        value={formData?.first_name}
                        onChange={(e) =>
                          handleFormChange('first_name', e.target.value)
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm text-[var(--color-text-muted)]">
                        Last name*
                      </label>
                      <input
                        required
                        disabled={!editStatus.canEdit}
                        className={cn(
                          'p-2 border border-[var(--color-border)] rounded-lg w-full bg-[var(--color-surface)] text-[var(--color-text-primary)] text-[15px]'
                        )}
                        value={formData?.last_name}
                        onChange={(e) =>
                          handleFormChange('last_name', e.target.value)
                        }
                      />
                    </div>
                  </article>

                  <article className="flex flex-wrap items-center gap-2.5">
                    <div className="space-y-2 flex-1">
                      <label className="text-sm text-[var(--color-text-muted)]">
                        Department
                      </label>
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          asChild
                          disabled={!editStatus.canEdit}
                        >
                          <Button
                            variant="outline"
                            className="w-full justify-between bg-[var(--color-surface)] text-[var(--color-text-primary)] whitespace-nowrap"
                          >
                            {department?.name || 'Select Department'}
                            <ChevronDown className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="max-h-64 overflow-y-auto">
                          <DropdownMenuLabel>
                            Select a Department
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuRadioGroup
                            value={formData?.department || ''}
                            onValueChange={(value) =>
                              setFormData((prev) => ({
                                ...prev,
                                department: value,
                              }))
                            }
                          >
                            {departments?.length ? (
                              departments.map((dep) => (
                                <DropdownMenuRadioItem
                                  key={dep.id}
                                  value={dep.id}
                                >
                                  {dep.name}
                                </DropdownMenuRadioItem>
                              ))
                            ) : (
                              <p className="text-sm text-center p-2 text-[var(--color-text-muted)]">
                                No departments found
                              </p>
                            )}
                          </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm text-[var(--color-text-muted)]">
                        Year
                      </label>
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          asChild
                          disabled={!editStatus.canEdit}
                        >
                          <Button
                            disabled={!department}
                            variant="outline"
                            className="w-full justify-between bg-[var(--color-surface)] text-[var(--color-text-primary)]"
                          >
                            {formData?.year
                              ? getOrdinalSuffix(formData.year)
                              : 'Select Year'}
                            <ChevronDown className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="max-h-60 overflow-y-auto">
                          <DropdownMenuLabel>Select a Year</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuRadioGroup
                            value={formData?.year?.toString() || ''}
                            onValueChange={(value) =>
                              setFormData((prev) => ({
                                ...prev,
                                year: Number(value),
                              }))
                            }
                          >
                            {department?.year ? (
                              [...Array(department.year - 1)].map((_, i) => {
                                const year = i + 2;
                                return (
                                  <DropdownMenuRadioItem
                                    key={year}
                                    value={year.toString()}
                                  >
                                    {getOrdinalSuffix(year)}
                                  </DropdownMenuRadioItem>
                                );
                              })
                            ) : (
                              <p className="text-sm text-center p-2 text-[var(--color-text-muted)]">
                                No years available
                              </p>
                            )}
                          </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm text-[var(--color-text-muted)]">
                        Semester
                      </label>
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          asChild
                          disabled={!editStatus.canEdit}
                        >
                          <Button
                            disabled={!department}
                            variant="outline"
                            className="w-full justify-between bg-[var(--color-surface)] text-[var(--color-text-primary)]"
                          >
                            {formData?.semester
                              ? getOrdinalSuffix(formData.semester)
                              : 'Select Semester'}
                            <ChevronDown className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="max-h-60 overflow-y-auto">
                          <DropdownMenuLabel>
                            Select a Semester
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuRadioGroup
                            value={formData?.semester?.toString() || ''}
                            onValueChange={(value) =>
                              setFormData((prev) => ({
                                ...prev,
                                semester: Number(value),
                              }))
                            }
                          >
                            {[1, 2].map((sem) => (
                              <DropdownMenuRadioItem
                                key={sem}
                                value={sem.toString()}
                              >
                                {getOrdinalSuffix(sem)}
                              </DropdownMenuRadioItem>
                            ))}
                          </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </article>

                  <div className="flex justify-end gap-2 mt-auto md:mt-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleSubmit}>Save</Button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center gap-5 w-full h-[100dvh] md:h-80 p-5">
                  <Emblem color="#fbbc05" className="w-25 h-25">
                    <Clock className="w-20 h-20" />
                  </Emblem>
                  <div className="space-y-2 text-center">
                    <h1 className="text-3xl font-semibold text-[var(--color-text-primary)]">
                      {editStatus.daysLeft} day
                      {editStatus.daysLeft > 1 ? 's' : ''} left
                    </h1>
                    <p className="text-[var(--color-text-muted)] text-base">
                      You’ll be able to update your profile again soon.
                    </p>
                  </div>

                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    <ArrowLeft className="w-4 h-4" /> Go Back
                  </Button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
