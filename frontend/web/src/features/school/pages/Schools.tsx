import { AnimatePresence, motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';

import { Desktop } from '@/assets/icons/Error';
import { Button } from '@/components/ui';
import { Error, Forbidden, Loader, NoContent } from '@/features/app';
import {
  SchoolCard,
  useCreateSchoolMutation,
  useDeleteSchoolMutation,
  useGetSchoolsQuery,
  useUpdateSchoolMutation,
  type CreateSchoolRequest,
  type School,
} from '@/features/school';
import { useMediaQuery } from '@/hooks';
import { cn } from '@/lib/utils';
import type { RootState } from '@/store/store';
import { formatNumber } from '@/utils/numerals';

export const Schools: React.FC = () => {
  const { accessToken, user: currentUser } = useSelector(
    (state: RootState) => state.auth
  );
  const isMobile = useMediaQuery('mobile');
  const [modal, setModal] = React.useState<'new' | School | null>(null);
  const [formData, setFormData] = React.useState<Partial<School>>({});
  const [editedData, setEditedData] = React.useState<Partial<School>>({});
  const [originalData, setOriginalData] = React.useState<Partial<School>>({});
  const [deleteSchool] = useDeleteSchoolMutation();
  const [createSchool] = useCreateSchoolMutation();
  const [editSchool] = useUpdateSchoolMutation();

  const {
    data: schools,
    isLoading: isFetchingSchools,
    refetch,
  } = useGetSchoolsQuery(undefined, { skip: !accessToken });

  React.useEffect(() => {
    if (!modal || modal === 'new') return;
    setEditedData(modal);
    setOriginalData(modal);
  }, [modal]);

  const handleNewForm = React.useCallback(
    (key: keyof School, value: string | number | boolean | null) =>
      setFormData((prev) => ({ ...(prev ?? {}), [key]: value })),
    []
  );

  const handleEditForm = React.useCallback(
    (key: keyof School, value: string | number | boolean | null) =>
      setEditedData((prev) => ({ ...(prev ?? {}), [key]: value })),
    []
  );

  const hasChanges = React.useMemo(() => {
    if (!editedData || !originalData) return false;

    return (Object.keys(editedData) as (keyof School)[]).some((key) => {
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

    try {
      await editSchool({
        id: editedData.id as string,
        name: editedData.name,
      }).unwrap();
      toast.success('School updated successfully');
      setModal(null);
      refetch();
    } catch {
      toast.error('Failed to update school');
    }
  };

  const handleNew = async () => {
    if (!formData) return;

    if (!formData.name?.trim()) {
      toast.error('Name is required');
      return;
    }

    try {
      await createSchool(formData as CreateSchoolRequest).unwrap();
      toast.success('School created successfully');
      setModal(null);
      setFormData({});
      refetch();
    } catch {
      toast.error('Failed to create school');
    }
  };

  const handleDelete = async (school: School) => {
    try {
      await deleteSchool(school.id).unwrap();
      toast.dismiss();
      toast.success('School has been removed successfully.');
      refetch();
    } catch {
      toast.error('Failed to delete school');
    }
  };

  if (!['ADMIN'].includes(currentUser?.role as string)) return <Forbidden />;

  if (isMobile)
    return (
      <Error
        icon={<Desktop className="w-20 h-20 opacity-80" />}
        message={{
          main: 'Not available on mobile',
          sub: 'Please use a desktop or laptop to manage schools.',
        }}
      />
    );

  return (
    <main className="flex flex-col h-[87dvh]">
      <div className="flex items-center justify-between p-5">
        <div className="flex items-center">
          School List
          <div className="font-medium text-[15px] text-center w-10 ml-1">
            ({formatNumber(schools?.length || 0)})
          </div>
        </div>

        <Button onClick={() => setModal('new')}>
          <Plus className="size-4" /> Add new School
        </Button>
      </div>

      {schools?.length ? (
        <div className="flex items-center pl-5 p-2.5 gap-5 justify-between border-y border-[var(--color-container)] text-sm font-medium">
          <p className="w-20">ID</p>
          <p className="w-50">Name</p>
          <p className="w-30">Created At</p>
          <p className="w-30">Updated At</p>
          <p className="w-13 text-center"></p>
        </div>
      ) : null}

      <ul className="relative overflow-y-scroll h-[75dvh]">
        {isFetchingSchools ? (
          <Loader />
        ) : schools?.length ? (
          schools?.map((school) => (
            <SchoolCard
              key={school.id}
              school={school}
              setModal={setModal}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <NoContent message="No schools found" />
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
                {modal === 'new' ? 'New School' : 'Edit School'}
              </h2>

              <div className="grid grid-cols-1 gap-4">
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
