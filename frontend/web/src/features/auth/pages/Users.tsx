import { Button, SearchInput } from '@/components/ui';
import { Forbidden, MiniLoader, NoContent } from '@/features/app';
import type { RootState } from '@/store/store';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import {
  useDeleteUserMutation,
  useGetUsersQuery,
  useResetPasswordMutation,
  type User,
} from '..';
import UserCard from '../components/UserCard';

export const Users: React.FC = () => {
  const { accessToken, user: currentUser } = useSelector(
    (state: RootState) => state.auth
  );
  const [searchTerm, setSearchTerm] = React.useState('');
  const [debouncedSearch, setDebouncedSearch] = React.useState('');
  const [page, setPage] = React.useState(1);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const { data, isFetching, refetch } = useGetUsersQuery(
    { page, search: debouncedSearch },
    { skip: !accessToken }
  );

  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  const [resetPassword, { isLoading: isResetting }] =
    useResetPasswordMutation();

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

  if (isFetching) return <MiniLoader />;

  return (
    <main className="flex flex-col">
      <div className="flex items-center justify-end gap-2 sticky top-2.5 px-2.5 z-20">
        <div className="flex items-center justify-center gap-2 rounded-full px-4 py-2 outline outline-[var(--color-border)] bg-[var(--color-background)]">
          <span className="font-medium">{data?.count}</span>
          <span className="text-sm text-[var(--color-text-muted)]">
            user{(data?.count ?? 0) > 1 && 's'}
          </span>
        </div>
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search Users..."
        />
      </div>

      <ul>
        {data?.results?.length ? (
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

      {(data?.count ?? 0) > 20 && (
        <div className="flex justify-center items-center gap-2 my-5">
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
            animate={{ scale: data?.next ? 1 : 0, opacity: data?.next ? 1 : 0 }}
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
    </main>
  );
};
