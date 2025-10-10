import Button from '@/components/ui/Button';
import { ArrowLeft } from 'lucide-react';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';

export const NotFound: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate(-1);
  };

  return (
    <main className="flex items-center justify-center w-full h-[100dvh]">
      <section className="flex flex-col gap-5 items-center">
        <span className="font-bold">404</span>

        <h1 className="font-bold text-5xl">Page not found</h1>

        <p>Sorry, we couldn’t find the page you’re looking for</p>

        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={handleNavigation}
        >
          <ArrowLeft className="w-4.5 h-4.5" />
          Go Back
        </Button>
      </section>
    </main>
  );
};
