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
  Switch,
} from '@/components/ui';
import { Error, Forbidden, Loader, NoContent } from '@/features/app';
import { useGetDepartmentsQuery, type Department } from '@/features/department';
import { useMediaQuery } from '@/hooks';
import { cn } from '@/lib/utils';
import type { RootState } from '@/store/store';
import { normalizeCapitalization } from '@/utils/format';
import { formatNumber, getOrdinalSuffix } from '@/utils/numerals';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import {
  useDeleteUserMutation,
  useGetUsersQuery,
  useRegisterUserMutation,
  useResetPasswordMutation,
  type User,
} from '..';
import UserCard from '../components/UserCard';

export const Users: React.FC = () => {
  const isMobile = useMediaQuery('mobile');
  const { accessToken, user: currentUser } = useSelector(
    (state: RootState) => state.auth
  );
  const [registerUser] = useRegisterUserMutation();
  const { data: departments } = useGetDepartmentsQuery();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [debouncedSearch, setDebouncedSearch] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [isOpen, setIsOpen] = React.useState(false);
  const [formData, setFormData] = React.useState<Partial<User>>({
    is_active: true,
    role: 'STUDENT',
  });

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const {
    data,
    isLoading: isFetchingUsers,
    refetch,
  } = useGetUsersQuery(
    { page, search: debouncedSearch },
    { skip: !accessToken }
  );

  const selectedDepartmentRef = React.useRef<Department | null>(null);

  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  const [resetPassword, { isLoading: isResetting }] =
    useResetPasswordMutation();

  const handleFormChange = React.useCallback(
    (key: keyof User, value: string | number | boolean | null) =>
      setFormData((prev) => (prev ? { ...prev, [key]: value } : prev)),
    []
  );

  const handleRegister = async () => {
    if (!formData) return;

    const data = {
      ...formData,
      first_name: normalizeCapitalization(formData.first_name ?? ''),
      last_name: normalizeCapitalization(formData.last_name ?? ''),
      year: Number(formData.year),
      semester: Number(formData.semester),
    };
    try {
      await registerUser(data).unwrap();
      toast.success('User registered successfully');
      setIsOpen(false);
    } catch {
      toast.error('Failed to register user');
    }
  };

  const handleDelete = async (user: User) => {
    try {
      await deleteUser(user.id).unwrap();
      toast.dismiss();
      toast.success(`${user.first_name} has been removed successfully.`);
      refetch();
    } catch {
      toast.error(`Failed to delete ${user.first_name}`);
    }
  };

  const handleReset = async (user: User) => {
    try {
      await resetPassword({ user_id: user.id }).unwrap();
      toast.dismiss();
      toast.success(
        `Password for ${user.first_name} has been successfully reset.`
      );
    } catch {
      toast.error('Failed to reset password');
    }
  };

  React.useEffect(() => {
    if (isResetting) toast.loading('Resetting user password…');
  }, [isResetting]);

  React.useEffect(() => {
    if (isDeleting) toast.loading('Removing user account…');
  }, [isDeleting]);

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
          User List
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
            placeholder="Search Users..."
          />
          {/* <Button variant="outline">
            <ListFilterIcon className="size-4" /> Filter
          </Button> */}
          <Button onClick={() => setIsOpen(true)}>
            <Plus className="size-4" /> Add new User
          </Button>
        </article>
      </div>

      {data?.results?.length ? (
        <div className="flex items-center pl-5 p-2.5 gap-5 justify-between border-y border-[var(--color-container)] text-sm font-medium">
          <p className="w-50">Name</p>
          <p className="w-60">Email</p>
          <p className="w-30">Role</p>
          <p className="w-10 text-center">Dep</p>
          <p className="w-10 text-center">Year</p>
          <p className="w-10 text-center">Sem</p>
          <p className="w-13 text-center"></p>
        </div>
      ) : null}

      <ul className="relative overflow-y-scroll h-[75dvh]">
        {isFetchingUsers ? (
          <Loader />
        ) : data?.results?.length ? (
          data.results.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              onDelete={handleDelete}
              onResetPassword={handleReset}
            />
          ))
        ) : (
          <NoContent message="No users found" />
        )}
      </ul>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            onClick={() => setIsOpen(false)}
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
              className="bg-[var(--color-background)] p-5 md:rounded-2xl shadow-lg w-full max-w-[420px] min-h-[100dvh] md:min-h-80 flex flex-col gap-4"
            >
              <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
                New User
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
                          {selectedDepartmentRef?.current?.name ||
                            'Select Department'}
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
                            selectedDepartmentRef.current =
                              departments?.find((dep) => dep.id === value) ||
                              null;
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
                          disabled={!selectedDepartmentRef.current}
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
                          {selectedDepartmentRef.current?.year ? (
                            [...Array(selectedDepartmentRef.current.year)].map(
                              (_, i) => {
                                const year = i + 2;
                                return (
                                  <DropdownMenuRadioItem
                                    key={year}
                                    value={year.toString()}
                                  >
                                    {getOrdinalSuffix(year)}
                                  </DropdownMenuRadioItem>
                                );
                              }
                            )
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
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleRegister}>Save</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};
