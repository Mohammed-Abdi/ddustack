import { QuillPen, ScienceSpark, Spark } from '@/assets/icons/Ai';
import { Folder } from '@/assets/icons/Folder';
import { Message } from '@/assets/icons/Message';
import { Repo } from '@/assets/icons/Repo';
import { Rocket } from '@/assets/icons/Roket';
import { People } from '@/assets/icons/User';
import { nanoid } from '@reduxjs/toolkit';
import { Bookmark, Building, Layers } from 'lucide-react';
import type { Nav } from './interfaces';

export const navLinks: Nav[] = [
  {
    id: nanoid(),
    path: '/for-you',
    label: 'For you',
    icon: <Spark className="w-5 h-5" />,
    tag: null,
    hotKey: 'Ctrl + F',
    roles: ['ADMIN', 'MODERATOR', 'LECTURER'],
  },
  {
    id: nanoid(),
    path: '/summarizer',
    label: 'Summarizer',
    icon: <QuillPen className="w-5 h-5" />,
    tag: { label: 'NEW', explanation: 'Quickly summarize documents' },
    hotKey: 'Ctrl + Q',
    roles: ['ADMIN', 'MODERATOR', 'LECTURER'],
  },
  {
    id: nanoid(),
    path: '/gpa-analyzer',
    label: 'GPA analyzer',
    icon: <ScienceSpark className="w-5 h-5" />,
    tag: null,
    hotKey: 'Ctrl + G',
    roles: ['ADMIN', 'MODERATOR', 'LECTURER'],
  },
  {
    id: nanoid(),
    path: '/users',
    label: 'Users',
    icon: <People className="w-6 h-6" />,
    tag: null,
    hotKey: 'Ctrl + U',
    roles: ['ADMIN'],
  },
  {
    id: nanoid(),
    path: '/intake',
    label: 'Intake',
    icon: <Message className="w-5 h-5" />,
    tag: null,
    hotKey: 'Ctrl + I',
    roles: ['ADMIN', 'MODERATOR', 'LECTURER'],
  },
  {
    id: nanoid(),
    path: '/schools',
    label: 'Schools',
    icon: <Building className="w-5 h-5" />,
    tag: null,
    hotKey: 'Ctrl + S',
    roles: ['ADMIN', 'MODERATOR'],
  },
  {
    id: nanoid(),
    path: '/departments',
    label: 'Departments',
    icon: <Layers className="w-5 h-5" />,
    tag: null,
    hotKey: 'Ctrl + D',
    roles: ['ADMIN', 'MODERATOR'],
  },
  {
    id: nanoid(),
    path: '/courses',
    label: 'Courses',
    icon: <Repo className="w-5 h-5" />,
    tag: null,
    hotKey: 'Ctrl + L',
    roles: ['ADMIN', 'MODERATOR'],
  },
  {
    id: nanoid(),
    path: '/contents',
    label: 'Contents',
    icon: <Folder className="w-5.5 h-5.5" />,
    tag: null,
    hotKey: 'Ctrl + O',
    roles: ['ADMIN', 'MODERATOR'],
  },
  {
    id: nanoid(),
    path: '/saved-courses',
    label: 'Saved courses',
    icon: <Bookmark className="w-5.5 h-5.5" />,
    tag: null,
    hotKey: null,
    roles: ['ADMIN', 'MODERATOR'],
  },
  {
    id: nanoid(),
    path: '/upgrade-role',
    label: 'Upgrade role',
    icon: <Rocket className="w-5.5 h-5.5" />,
    tag: null,
    hotKey: null,
    roles: ['ADMIN', 'MODERATOR'],
  },
];
