import { Spinner } from '@/assets/animations/Spinner';
import { Identification } from '@/assets/icons/Identification';
import { Verified } from '@/assets/icons/Verified';
import Button from '@/components/ui/Button';
import type { ApiError } from '@/features/api/interfaces';
import { useCreateIntakeMutation } from '@/features/intake/intakeApi';
import Input from '@/pages/auth/components/Input';
import type { RootState } from '@/store/store';
import { capitalizeFirstLetter, titleCase } from '@/utils/format';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';

interface AccessRequestFormProps {
  handleCheckUser: () => void;
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
}

const AccessRequestForm: React.FC<AccessRequestFormProps> = ({
  handleCheckUser,
  setShowForm,
}) => {
  const user = useSelector((state: RootState) => state.auth.user);

  const [fullName, setFullName] = React.useState<string>(
    `${capitalizeFirstLetter(user?.first_name || '')} ${capitalizeFirstLetter(
      user?.last_name || ''
    )}`
  );
  const [staffId, setStaffId] = React.useState('');
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [createIntake, { isLoading }] = useCreateIntakeMutation();
  const fullNameRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    fullNameRef.current?.focus();
  }, []);

  const handleReset = () => {
    setFullName('');
    setStaffId('');
    setPhoneNumber('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!phoneNumber.includes('09') && !phoneNumber.includes('+251')) {
      toast.error('Invalid phone number');
      return;
    }

    try {
      await createIntake({
        full_name: titleCase(fullName),
        staff_id: staffId.toUpperCase(),
        phone_number: phoneNumber,
      }).unwrap();
      toast.success('Request submitted successfully');
      handleCheckUser();
      setShowForm(false);
    } catch (error: unknown) {
      const err = error as ApiError;
      toast.error(err.data?.detail || 'Something went wrong.');
    } finally {
      handleReset();
    }
  };

  return (
    <form
      className="flex flex-col gap-5 items-center w-full max-w-95 p-5"
      onSubmit={handleSubmit}
    >
      <article className="relative">
        <Verified className="absolute text-[#2e83e0] w-7 h-7 -right-2 top-0 bg-[var(--color-background)] rounded-full" />
        <Identification className="w-15 h-15" />
      </article>

      <h1 className="text-xl font-semibold mb-1">Verify your identity</h1>

      <Input
        ref={fullNameRef}
        required
        disabled={isLoading}
        label="Full name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
      />
      <Input
        required
        disabled={isLoading}
        label="Staff ID"
        value={staffId}
        onChange={(e) => setStaffId(e.target.value)}
      />
      <Input
        required
        disabled={isLoading}
        label="Phone number"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
      />
      <Button
        disabled={isLoading}
        className="text-[15px] py-3 w-full"
        type="submit"
      >
        {isLoading ? (
          <div className="flex items-center gap-2 w-fit mx-auto">
            <Spinner className="w-4 h-4" />
            <span>Submitting...</span>
          </div>
        ) : (
          'Submit'
        )}
      </Button>
    </form>
  );
};

export default AccessRequestForm;
