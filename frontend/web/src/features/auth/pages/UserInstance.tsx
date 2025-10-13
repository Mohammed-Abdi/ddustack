import Edit from '@/assets/icons/Setting';
import { Verified } from '@/assets/icons/Verified';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Detail,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Switch,
} from '@/components/ui';
import { Forbidden, Loader } from '@/features/app';
import {
  useGetDepartmentQuery,
  useGetDepartmentsQuery,
} from '@/features/department';
import { useMediaQuery } from '@/hooks';
import { cn } from '@/lib/utils';
import type { RootState } from '@/store/store';
import { normalizeCapitalization } from '@/utils/format';
import { getOrdinalSuffix } from '@/utils/numerals';
import { format } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useGetUserQuery, useUpdateUserMutation, type User } from '..';

export const UserInstance: React.FC = () => {
  const isMobile = useMediaQuery('mobile');
  const { userId } = useParams<{ userId: string }>();
  const { accessToken, user: currentUser } = useSelector(
    (state: RootState) => state.auth
  );

  const [isEditing, setIsEditing] = React.useState(false);
  const [formData, setFormData] = React.useState<Partial<User>>({});
  const [originalData, setOriginalData] = React.useState<Partial<User>>({});

  const {
    data: user,
    isFetching: loadingUser,
    refetch,
  } = useGetUserQuery(userId!, {
    skip: !accessToken || !userId,
  });
  const { data: departments, isFetching: loadingDepartments } =
    useGetDepartmentsQuery(undefined, { skip: !accessToken });

  const selectedDepartmentRef = React.useRef<string | undefined>(
    user?.department
  );

  React.useEffect(() => {
    if (user?.department && user.department !== selectedDepartmentRef.current) {
      selectedDepartmentRef.current = user.department;
    }
  }, [user?.department]);

  const shouldSkip = !accessToken || !selectedDepartmentRef.current;

  const { data: selectedDepartment, isFetching: loadingDept } =
    useGetDepartmentQuery(selectedDepartmentRef.current as string, {
      skip: shouldSkip,
    });

  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  const isLoading = loadingUser || loadingDepartments || loadingDept;

  React.useEffect(() => {
    if (user) {
      const initData = {
        ...user,
        is_active: !!user.is_active,
        is_verified: !!user.is_verified,
      };
      setFormData(initData);
      setOriginalData(initData);
    }
  }, [user]);

  const handleFormChange = React.useCallback(
    (key: keyof User, value: string | number | boolean | null) =>
      setFormData((prev) => (prev ? { ...prev, [key]: value } : prev)),
    []
  );

  const hasChanges = React.useMemo(() => {
    return (Object.keys(formData) as (keyof User)[]).some(
      (key) => formData[key] !== originalData[key]
    );
  }, [formData, originalData]);

  const handleSubmit = async () => {
    if (!formData || !userId || !hasChanges) return;

    const data = {
      ...formData,
      first_name: normalizeCapitalization(formData.first_name ?? ''),
      last_name: normalizeCapitalization(formData.last_name ?? ''),
      year: Number(formData.year),
      semester: Number(formData.semester),
    };
    try {
      await updateUser({ userId, data }).unwrap();
      toast.success('User updated successfully');
      setOriginalData(data);
      refetch();
      setIsEditing(false);
    } catch {
      toast.error('Failed to update user');
    }
  };

  if (!currentUser || !['ADMIN'].includes(currentUser.role))
    return <Forbidden />;

  if (isLoading || !user) return <Loader message="Loading user profile" />;

  return (
    <main className="relative flex flex-col gap-5">
      <div className="relative h-40 bg-[var(--color-container)]">
        <Avatar className="w-32 h-32 absolute -bottom-16 left-5 border-4 border-[var(--color-background)] overflow-hidden bg-[var(--color-background)]">
          <div className="relative w-full">
            <AvatarImage src={user.avatar || undefined} />
            <AvatarFallback className="flex items-center justify-center w-full h-full text-4xl font-medium">
              <img
                src="/illustrations/pfp-fallback.webp"
                alt="default profile picture"
                className="w-full h-full"
              />
            </AvatarFallback>
          </div>
        </Avatar>
      </div>

      <div className="px-5 pt-16 pb-5 flex justify-between items-start">
        <div className="flex flex-col gap-1">
          <div className="flex items-center flex-wrap gap-2">
            <h1 className="md:text-2xl font-semibold">
              {user?.first_name} {user?.last_name}
            </h1>
            {user?.is_verified && (
              <Verified className="w-4 h-4 text-[var(--color-info)]" />
            )}
          </div>
          <p>{user?.email}</p>

          {user?.role.toLowerCase() === 'student' && (
            <>
              <div className="flex items-center flex-wrap text-[15px] font-medium gap-2">
                <h3 className="text-[var(--color-info)]">
                  {selectedDepartment?.name}
                </h3>
              </div>
              {user?.year && user?.semester && (
                <p className="text-sm text-[var(--color-text-secondary)]">
                  {getOrdinalSuffix(user?.year)} Year •{' '}
                  {getOrdinalSuffix(user?.semester)} Semester
                </p>
              )}
            </>
          )}

          <section className="grid grid-cols-1 md:grid-cols-2 gap-x-10">
            {[
              { label: 'Account ID', value: user?.id, copyable: true },
              {
                label: 'Role',
                value: normalizeCapitalization(user?.role || ''),
              },
              {
                label: 'Student/Staff ID',
                value: user?.user_id,
                copyable: Boolean(user?.user_id),
              },
              { label: 'Provider', value: user?.provider },
              {
                label: 'Provider ID',
                value: user?.provider_id,
                copyable: Boolean(user?.provider_id),
              },
              {
                label: 'Username',
                value: user?.username,
                copyable: Boolean(user?.username),
              },
              {
                label: 'Date joined',
                value: user?.date_joined
                  ? format(new Date(user?.date_joined), 'PPP p')
                  : undefined,
              },
              {
                label: 'Updated at',
                value: user?.updated_at
                  ? format(new Date(user?.updated_at), 'PPP p')
                  : undefined,
              },
            ].map(({ label, value, copyable }) => (
              <Detail
                key={label}
                label={label}
                value={value}
                copyable={copyable}
              />
            ))}
          </section>
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
              <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
                Edit User
              </h2>
              <article className="flex flex-col gap-2">
                <div className="space-y-2">
                  <label className="text-sm text-[var(--color-text-muted)]">
                    First name*
                  </label>
                  <input
                    required
                    className={cn(
                      'p-2 border border-[var(--color-border)] rounded-lg w-full bg-[var(--color-surface)] text-[var(--color-text-primary)] text-[15px]'
                    )}
                    value={formData?.first_name || ''}
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
                    className={cn(
                      'p-2 border border-[var(--color-border)] rounded-lg w-full bg-[var(--color-surface)] text-[var(--color-text-primary)] text-[15px]'
                    )}
                    value={formData?.last_name || ''}
                    onChange={(e) =>
                      handleFormChange('last_name', e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-[var(--color-text-muted)]">
                    Email
                  </label>
                  <input
                    className="p-2 border border-[var(--color-border)] rounded-lg w-full bg-[var(--color-surface)] text-[var(--color-text-primary)] text-[15px]"
                    value={formData?.email || ''}
                    onChange={(e) => handleFormChange('email', e.target.value)}
                  />
                </div>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-sm">
                    <Switch
                      checked={!!formData?.is_active}
                      onCheckedChange={(checked) =>
                        handleFormChange('is_active', Boolean(checked))
                      }
                    />
                    Active
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <Switch
                      checked={!!formData?.is_verified}
                      onCheckedChange={(checked) =>
                        handleFormChange('is_verified', Boolean(checked))
                      }
                    />
                    Verified
                  </label>
                </div>
                <article className="flex items-center gap-2.5">
                  <div className="space-y-2 flex-1">
                    <label className="text-sm text-[var(--color-text-muted)]">
                      Department
                    </label>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-between bg-[var(--color-surface)] text-[var(--color-text-primary)] whitespace-nowrap"
                        >
                          {selectedDepartment?.name || 'Select Department'}
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
                          onValueChange={(value) => {
                            selectedDepartmentRef.current = value;
                            setFormData((prev) => ({
                              ...prev,
                              department: value,
                              year: undefined,
                              semester: undefined,
                            }));
                          }}
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
                  <div className="space-y-2 flex-1">
                    <label className="text-sm text-[var(--color-text-muted)]">
                      Role
                    </label>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-between bg-[var(--color-surface)] text-[var(--color-text-primary)]"
                        >
                          {formData?.role || 'Select Role'}
                          <ChevronDown className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="max-h-60 overflow-y-auto">
                        <DropdownMenuLabel>Select Role</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuRadioGroup
                          value={formData?.role || ''}
                          onValueChange={(value) =>
                            handleFormChange('role', value)
                          }
                        >
                          {['STUDENT', 'LECTURER', 'MODERATOR', 'ADMIN'].map(
                            (role) => (
                              <DropdownMenuRadioItem key={role} value={role}>
                                {role}
                              </DropdownMenuRadioItem>
                            )
                          )}
                        </DropdownMenuRadioGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </article>
                <article className="flex items-center gap-2.5">
                  <div className="space-y-2 flex-1">
                    <label className="text-sm text-[var(--color-text-muted)]">
                      Year
                    </label>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        asChild
                        disabled={!selectedDepartmentRef.current}
                      >
                        <Button
                          disabled={!selectedDepartment}
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
                          {selectedDepartment?.year ? (
                            [...Array(selectedDepartment.year)].map((_, i) => {
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
                              Select Department First
                            </p>
                          )}
                        </DropdownMenuRadioGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="space-y-2 flex-1">
                    <label className="text-sm text-[var(--color-text-muted)]">
                      Semester
                    </label>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
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
                        <DropdownMenuLabel>Select a Semester</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuRadioGroup
                          value={formData?.semester?.toString() || ''}
                          onValueChange={(value) =>
                            handleFormChange('semester', Number(value))
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
              </article>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isUpdating || !hasChanges}
                >
                  Save
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};
