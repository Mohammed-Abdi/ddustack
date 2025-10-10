import { closeAlertDialog } from '@/features/app/slices/appSlice';
import type { AppDispatch, RootState } from '@/store/store';
import { motion } from 'framer-motion';
import type React from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from './Button';

const AlertDialog: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const alertDialog = useSelector((state: RootState) => state.app.alertDialog);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (alertDialog.status !== 'open') return;

      if (e.key === 'Escape') {
        dispatch(closeAlertDialog());
      }

      if (e.key === 'Enter') {
        e.preventDefault();
        alertDialog.action.method();
        dispatch(closeAlertDialog());
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [alertDialog.status, alertDialog.action, dispatch]);

  const handleAction = () => {
    alertDialog.action.method();
    dispatch(closeAlertDialog());
  };

  if (alertDialog.status === 'close') return null;

  return (
    <motion.main
      onClick={() => dispatch(closeAlertDialog())}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      className="flex items-center justify-center fixed top-0 left-0 z-50 w-full min-h-[100vh] bg-black/20"
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
        className="flex flex-col p-5 rounded-2xl min-h-45 w-full max-w-96 bg-[var(--color-background)]"
      >
        <h1 className="text-lg font-semibold mb-2.5">{alertDialog.title}</h1>
        <p>
          {alertDialog.description}
          {alertDialog.action.target && (
            <span className="font-bold"> {alertDialog.action.target}</span>
          )}
        </p>
        {alertDialog.subDescription && (
          <p className="text-[var(--color-text-muted)] text-sm">
            {alertDialog.subDescription}
          </p>
        )}
        <div className="flex items-center justify-end gap-2.5 mt-auto">
          <Button
            variant="outline"
            onClick={() => dispatch(closeAlertDialog())}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAction}
            variant={
              ['delete', 'remove', 'deactivate'].includes(
                alertDialog.action.label.toLowerCase()
              )
                ? 'destructive'
                : 'primary'
            }
          >
            {alertDialog.action.label}
          </Button>
        </div>
      </motion.div>
    </motion.main>
  );
};

export default AlertDialog;
