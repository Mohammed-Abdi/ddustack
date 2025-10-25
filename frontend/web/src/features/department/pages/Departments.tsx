import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Plus } from 'lucide-react';
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
} from '@/components/ui';
import { Error, Forbidden, Loader, NoContent } from '@/features/app';
import {
  DepartmentCard,
  useCreateDepartmentMutation,
  useDeleteDepartmentMutation,
  useGetDepartmentsQuery,
  useUpdateDepartmentMutation,
  type CreateDepartmentRequest,
  type Department,
} from '@/features/department';
import { useGetSchoolQuery, useGetSchoolsQuery } from '@/features/school';
import { useMediaQuery } from '@/hooks';
import { cn } from '@/lib/utils';
import type { RootState } from '@/store/store';
import { formatNumber } from '@/utils/numerals';

export const Departments: React.FC = () => {
  const { accessToken, user: currentUser } = useSelector(
    (state: RootState) => state.auth
  );
  const isMobile = useMediaQuery('mobile');
  const [modal, setModal] = React.useState<'new' | Department | null>(null);
  const [formData, setFormData] = React.useState<Partial<Department>>({});
  const [editedData, setEditedData] = React.useState<Partial<Department>>({});
  const [originalData, setOriginalData] = React.useState<Partial<Department>>(
    {}
  );
  const [deleteDepartment] = useDeleteDepartmentMutation();
  const [createDepartment] = useCreateDepartmentMutation();
  const [editDepartment] = useUpdateDepartmentMutation();

  const {
    data: departments,
    isLoading: isFetchingDepartments,
    refetch,
  } = useGetDepartmentsQuery(undefined, { skip: !accessToken });

  const { data: schools } = useGetSchoolsQuery(undefined, {
    skip: !accessToken,
  });

  const { data: school } = useGetSchoolQuery(
    modal
      ? modal === 'new'
        ? (formData.school as string)
        : (editedData.school as string)
      : '',
    {
      skip: !accessToken || (!editedData.school && !formData.school),
    }
  );

  React.useEffect(() => {
    if (!modal || modal === 'new') return;
    setEditedData(modal);
    setOriginalData(modal);
  }, [modal]);

  const schoolMap = React.useMemo(() => {
    const map = new Map();
    schools?.forEach((school) => {
      map.set(school.id, school.name);
    });
    return map;
  }, [schools]);

  const handleNewForm = React.useCallback(
    (key: keyof Department, value: string | number | boolean | null) =>
      setFormData((prev) => ({ ...(prev ?? {}), [key]: value })),
    []
  );

  const handleEditForm = React.useCallback(
    (key: keyof Department, value: string | number | boolean | null) =>
      setEditedData((prev) => ({ ...(prev ?? {}), [key]: value })),
    []
  );

  const hasChanges = React.useMemo(() => {
    if (!editedData || !originalData) return false;

    return (Object.keys(editedData) as (keyof Department)[]).some((key) => {
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
    if (!editedData.school) {
      toast.error('School is required');
      return;
    }
    if (!editedData.year) {
      toast.error('Year is required');
      return;
    }

    try {
      await editDepartment({
        id: editedData.id as string,
        name: editedData.name,
        code: editedData.code,
        school: editedData.school,
        year: editedData.year,
      }).unwrap();
      toast.success('Department updated successfully');
      setModal(null);
      refetch();
    } catch {
      toast.error('Failed to update department');
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
    if (!formData.school) {
      toast.error('School is required');
      return;
    }
    if (!formData.year) {
      toast.error('Year is required');
      return;
    }

    try {
      await createDepartment(formData as CreateDepartmentRequest).unwrap();
      toast.success('Department created successfully');
      setModal(null);
      setFormData({});
      refetch();
    } catch {
      toast.error('Failed to create department');
    }
  };

  const handleDelete = async (department: Department) => {
    try {
      await deleteDepartment(department.id).unwrap();
      toast.dismiss();
      toast.success('Department has been removed successfully.');
      refetch();
    } catch {
      toast.error('Failed to delete department');
    }
  };

  if (!['ADMIN'].includes(currentUser?.role as string)) return <Forbidden />;

  if (isMobile)
    return (
      <Error
        icon={<Desktop className="w-20 h-20 opacity-80" />}
        message={{
          main: 'Not available on mobile',
          sub: 'Please use a desktop or laptop to manage departments.',
        }}
      />
    );

  return (
    <main className="flex flex-col h-[87dvh]">
      <div className="flex items-center justify-between p-5">
        <div className="flex items-center">
          Department List
          <div className="font-medium text-[15px] text-center w-10 ml-1">
            ({formatNumber(departments?.length || 0)})
          </div>
        </div>

        <Button onClick={() => setModal('new')}>
          <Plus className="size-4" /> Add new Department
        </Button>
      </div>

      {departments?.length ? (
        <div className="flex items-center pl-5 p-2.5 gap-5 justify-between border-y border-[var(--color-container)] text-sm font-medium">
          <p className="w-20">ID</p>
          <p className="w-50">Name</p>
          <p className="w-40">School</p>
          <p className="w-20">Year</p>
          <p className="w-30">Created At</p>
          <p className="w-30">Updated At</p>
          <p className="w-13 text-center"></p>
        </div>
      ) : null}

      <ul className="relative overflow-y-scroll h-[75dvh]">
        {isFetchingDepartments ? (
          <Loader />
        ) : departments?.length ? (
          departments?.map((department) => (
            <DepartmentCard
              key={department.id}
              department={department}
              schoolName={schoolMap.get(department.school)}
              setModal={setModal}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <NoContent message="No departments found" />
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
              className="bg-[var(--color-background)] p-5 md:rounded-2xl shadow-lg w-full max-w-[420px] min-h-[60dvh] flex flex-col gap-4"
            >
              <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
                {modal === 'new' ? 'New Department' : 'Edit Department'}
              </h2>

              <div className="flex flex-col gap-2.5">
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

                <article className="flex items-center gap-4">
                  <div className="space-y-2">
                    <label className="text-sm text-[var(--color-text-muted)]">
                      School*
                    </label>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-between bg-[var(--color-surface)] text-[var(--color-text-primary)] whitespace-nowrap"
                        >
                          {modal === 'new' && !formData?.school
                            ? 'Select School'
                            : school?.name}
                          <ChevronDown className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        className="max-h-60 overflow-y-auto"
                        align="end"
                      >
                        <DropdownMenuLabel>Select School</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuRadioGroup
                          value={
                            modal === 'new'
                              ? formData?.school || ''
                              : editedData?.school || ''
                          }
                          onValueChange={(value: string) => {
                            if (modal === 'new') {
                              handleNewForm('school', value);
                            } else {
                              handleEditForm('school', value);
                            }
                          }}
                        >
                          {schools?.map((school) => (
                            <DropdownMenuRadioItem
                              key={school.id}
                              value={school.id}
                            >
                              {school.name}
                            </DropdownMenuRadioItem>
                          ))}
                        </DropdownMenuRadioGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-[var(--color-text-muted)]">
                      Year*
                    </label>
                    <input
                      required
                      type="number"
                      className={cn(
                        'p-2 border border-[var(--color-border)] rounded-lg w-full bg-[var(--color-surface)] text-[var(--color-text-primary)] text-[15px]'
                      )}
                      value={
                        modal === 'new'
                          ? formData?.year || ''
                          : editedData?.year || ''
                      }
                      onChange={(e) => {
                        if (modal === 'new') {
                          handleNewForm('year', Number(e.target.value));
                        } else {
                          handleEditForm('year', Number(e.target.value));
                        }
                      }}
                    />
                  </div>
                </article>
              </div>

              <div className="flex justify-end gap-2 mt-auto">
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
    </main>
  );
};
