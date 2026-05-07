import { addDays } from 'date-fns';

export type CalendarPostType = 'linkedin' | 'instagram' | 'facebook' | 'story' | 'reel' | 'reminder';
export type CalendarPostStatus = 'scheduled' | 'draft' | 'published' | 'idea';

export interface StoredCalendarPost {
  id: string;
  title: string;
  content?: string;
  date: string;
  time: string;
  type: CalendarPostType;
  status: CalendarPostStatus;
}

const STORAGE_KEY = 'crflow-calendar-posts';

export function createDefaultCalendarPosts(): StoredCalendarPost[] {
  const now = new Date();

  return [
    { id: '1', title: '5 Lessons from Building in Public', date: now.toISOString(), time: '09:00', type: 'linkedin', status: 'scheduled' },
    { id: '2', title: 'Carousel: Growth Tips', date: now.toISOString(), time: '12:00', type: 'linkedin', status: 'draft' },
    { id: '3', title: 'Behind the scenes reel', date: now.toISOString(), time: '15:00', type: 'reel', status: 'draft' },
    { id: '4', title: 'Product launch announcement', date: addDays(now, 1).toISOString(), time: '10:00', type: 'facebook', status: 'scheduled' },
    { id: '5', title: 'Weekly engagement recap', date: addDays(now, 2).toISOString(), time: '11:00', type: 'linkedin', status: 'scheduled' },
    { id: '6', title: 'Team photo story', date: addDays(now, 2).toISOString(), time: '14:00', type: 'story', status: 'draft' },
    { id: '7', title: 'Industry trends thread', date: addDays(now, 4).toISOString(), time: '09:00', type: 'linkedin', status: 'draft' },
    { id: '8', title: 'Client testimonial post', date: addDays(now, 5).toISOString(), time: '10:00', type: 'instagram', status: 'scheduled' },
    { id: '9', title: 'Friday motivation reel', date: addDays(now, 6).toISOString(), time: '08:00', type: 'reel', status: 'scheduled' },
    { id: '10', title: 'Review analytics', date: addDays(now, 3).toISOString(), time: '16:00', type: 'reminder', status: 'scheduled' },
  ];
}

export function readCalendarPosts(): StoredCalendarPost[] {
  if (typeof window === 'undefined') return createDefaultCalendarPosts();

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    const defaults = createDefaultCalendarPosts();
    writeCalendarPosts(defaults);
    return defaults;
  }

  try {
    const parsed = JSON.parse(stored) as StoredCalendarPost[];
    return Array.isArray(parsed) ? parsed : createDefaultCalendarPosts();
  } catch {
    return createDefaultCalendarPosts();
  }
}

export function writeCalendarPosts(posts: StoredCalendarPost[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
}

export function addCalendarPost(post: StoredCalendarPost) {
  const posts = readCalendarPosts();
  writeCalendarPosts([...posts, post]);
}