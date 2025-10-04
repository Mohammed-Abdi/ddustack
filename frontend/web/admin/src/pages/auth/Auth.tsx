import { nanoid } from '@reduxjs/toolkit';
import * as React from 'react';
import { Link } from 'react-router-dom';
import Form from './components/Form';

const links = [
  {
    id: nanoid(),
    path: '',
    label: 'Terms of Use',
  },
  {
    id: nanoid(),
    path: '',
    label: 'Privacy Policy',
  },
];

const Auth: React.FC = () => {
  return (
    <main className="flex items-center justify-center w-full h-[100dvh] outline">
      <section className="w-full max-w-95 p-5 space-y-5">
        <Form />
        <div className="flex items-center gap-1.5 w-fit text-sm mx-auto">
          {links.map((link, i) => (
            <article key={link.id} className="space-x-1.5">
              <Link
                className="opacity-70 underline hover:opacity-100"
                to={link.path}
              >
                {link.label}
              </Link>
              {i % 2 === 0 && <span className="opacity-70">|</span>}
            </article>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Auth;
