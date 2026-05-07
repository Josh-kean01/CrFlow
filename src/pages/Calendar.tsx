import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  Trash2,
  CalendarDays,
  Bell,
  X,
} from 'lucide-react';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  isToday,
} from 'date-fns';
import {
  type CalendarPostStatus,
  type CalendarPostType,
  type StoredCalendarPost,
  readCalendarPosts,
  writeCalendarPosts,
} from '../utils/calendarPosts';
import ThemedDateTimePicker, { formatDateTimeLocal } from '../components/ThemedDateTimePicker';

type PostType = CalendarPostType;
type PostStatus = CalendarPostStatus;

interface ScheduledPost {
  id: string;
  title: string;
  content?: string;
  date: Date;
  time: string;
  type: PostType;
  status: PostStatus;
}

const typeConfig: Record<PostType, { label: string; color: string; bg: string }> = {
  linkedin: { label: 'LinkedIn', color: 'text-[#0A66C2]', bg: 'bg-[#0A66C2]/15' },
  instagram: { label: 'Instagram', color: 'text-[#E4405F]', bg: 'bg-[#E4405F]/15' },
  facebook: { label: 'Facebook', color: 'text-[#1877F2]', bg: 'bg-[#1877F2]/15' },
  story: { label: 'Story', color: 'text-[#FF6B35]', bg: 'bg-[#FF6B35]/15' },
  reel: { label: 'Reel', color: 'text-[#E4405F]', bg: 'bg-[#E4405F]/15' },
  reminder: { label: 'Reminder', color: 'text-primary', bg: 'bg-primary/15' },
};

const statusConfig: Record<PostStatus, string> = {
  scheduled: 'bg-success/15 text-mint',
  draft: 'bg-muted text-muted-foreground',
  published: 'bg-primary/15 text-primary',
  idea: 'bg-chart-3/15 text-chart-3',
};

const toScheduledPost = (post: StoredCalendarPost): ScheduledPost => ({
  ...post,
  date: new Date(post.date),
});

const toStoredPost = (post: ScheduledPost): StoredCalendarPost => ({
  ...post,
  date: post.date.toISOString(),
});

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [posts, setPosts] = useState<ScheduledPost[]>(() => readCalendarPosts().map(toScheduledPost));
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newScheduleDate, setNewScheduleDate] = useState(formatDateTimeLocal());
  const [newStatus, setNewStatus] = useState<PostStatus>('draft');
  
  // Delete confirmation modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<{ id: string; title: string } | null>(null);

  useEffect(() => {
    writeCalendarPosts(posts.map(toStoredPost));
  }, [posts]);

  const handleDeleteClick = (id: string, title: string) => {
    setPostToDelete({ id, title });
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (postToDelete) {
      setPosts(posts.filter((p) => p.id !== postToDelete.id));
      setPostToDelete(null);
    }
  };

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    const days: Date[] = [];
    let day = startDate;
    while (day <= endDate) {
      days.push(day);
      day = addDays(day, 1);
    }
    return days;
  }, [currentMonth]);

  const getPostsForDate = (date: Date) =>
    posts.filter((p) => isSameDay(p.date, date));

  const selectedPosts = selectedDate
    ? posts.filter((p) => isSameDay(p.date, selectedDate))
    : [];

  const getDefaultSchedule = (date = new Date()) => {
    const next = new Date(date);
    if (next.getHours() === 0 && next.getMinutes() === 0) {
      next.setHours(9, 0, 0, 0);
    }
    return formatDateTimeLocal(next);
  };

  const openCreatePostModal = (date = selectedDate, defaultStatus: PostStatus = 'draft') => {
    setSelectedDate(date);
    setNewStatus(defaultStatus);
    setNewScheduleDate(getDefaultSchedule(date));
    setShowModal(true);
  };

  const parseScheduleDate = () => {
    const date = new Date(newScheduleDate);
    if (Number.isNaN(date.getTime())) return selectedDate;
    return date;
  };

  const handleAddPost = () => {
    if (!newTitle.trim()) return;
    const scheduledDate = newStatus === 'scheduled' ? parseScheduleDate() : selectedDate;
    const fallbackDate = new Date(scheduledDate);
    if (newStatus !== 'scheduled') fallbackDate.setHours(9, 0, 0, 0);
    const postDate = newStatus === 'scheduled' ? scheduledDate : fallbackDate;
    setPosts([
      ...posts,
      {
        id: Date.now().toString(),
        title: newTitle.trim(),
        content: newContent.trim(),
        date: postDate,
        time: format(postDate, 'HH:mm'),
        type: 'linkedin',
        status: newStatus,
      },
    ]);
    setNewTitle('');
    setNewContent('');
    setSelectedDate(postDate);
    setNewScheduleDate(formatDateTimeLocal(postDate));
    setNewStatus('draft');
    setShowModal(false);
  };

  // Replaced by handleDeleteClick and handleConfirmDelete

  return (
    <div className="flex bg-background">
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-[1400px] mx-auto"
          >
            {/* Header */}
            <div className="flex flex-col gap-3 mb-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-xl sm:text-2xl font-semibold text-heading">Content Calendar</h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Plan, schedule, and manage all your social content
                </p>
              </div>
              <button
                onClick={() => openCreatePostModal()}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity bg-gradient-primary"
              >
                <Plus className="w-4 h-4" />
                New Post
              </button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-5">
              {/* Calendar */}
              <div className="card-eclipse bg-card overflow-hidden">
                {/* Month Navigation */}
                <div className="flex items-center justify-between px-3 py-3 sm:px-6 sm:py-4 border-b border-border/50">
                  <button
                    onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                    className="p-2 rounded-lg hover:bg-secondary transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 text-muted-foreground" />
                  </button>
                  <h2 className="text-sm sm:text-lg font-semibold text-heading">
                    {format(currentMonth, 'MMMM yyyy')}
                  </h2>
                  <button
                    onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                    className="p-2 rounded-lg hover:bg-secondary transition-colors"
                  >
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>

                {/* Day Headers */}
                <div className="grid grid-cols-7 border-b border-border/50">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div
                      key={day}
                      className="px-1 py-2 text-center text-[10px] font-medium text-muted-foreground uppercase tracking-wider sm:px-3 sm:py-3 sm:text-xs"
                    >
                      <span className="sm:hidden">{day[0]}</span>
                      <span className="hidden sm:inline">{day}</span>
                    </div>
                  ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7">
                  {calendarDays.map((day, i) => {
                    const dayPosts = getPostsForDate(day);
                    const isCurrentMonth = isSameMonth(day, currentMonth);
                    const isSelected = selectedDate && isSameDay(day, selectedDate);
                    const isTodayDate = isToday(day);

                    return (
                      <div
                        key={i}
                        onClick={() => setSelectedDate(day)}
                        className={`min-h-[72px] sm:min-h-[110px] border-b border-r border-border/30 p-1 sm:p-2 cursor-pointer transition-colors relative group ${
                          !isCurrentMonth ? 'opacity-35' : ''
                        } ${
                          isSelected
                            ? 'bg-primary/5 ring-1 ring-inset ring-primary/30'
                            : 'hover:bg-secondary/40'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span
                            className={`text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full ${
                              isTodayDate
                                ? 'bg-primary text-primary-foreground'
                                : 'text-muted-foreground'
                            }`}
                          >
                            {format(day, 'd')}
                          </span>
                          {dayPosts.length > 0 && (
                            <span className="text-[9px] text-muted-foreground font-mono">
                              {dayPosts.length}
                            </span>
                          )}
                        </div>
                        <div className="space-y-1">
                          {dayPosts.slice(0, 3).map((post) => {
                            const config = typeConfig[post.type];
                            return (
                              <div
                                key={post.id}
                                className={`hidden sm:flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] truncate ${config.bg} ${config.color}`}
                              >
                                <span className="truncate">{post.title}</span>
                              </div>
                            );
                          })}
                          {dayPosts.length > 3 && (
                            <div className="hidden sm:block text-[9px] text-muted-foreground pl-1.5">
                              +{dayPosts.length - 3} more
                            </div>
                          )}
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openCreatePostModal(day, 'scheduled');
                          }}
                          className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary/20"
                        >
                          <Plus className="w-3 h-3 text-primary" />
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="flex items-center gap-4 px-6 py-3 border-t border-border/30 flex-wrap">
                  {Object.entries(typeConfig).map(([key, config]) => (
                    <div key={key} className="flex items-center gap-1.5">
                      <div className={`w-2 h-2 rounded-full ${config.bg}`}>
                        <div className={`w-2 h-2 rounded-full ${config.color.replace('text-', 'bg-')}`} />
                      </div>
                      <span className="text-[10px] text-muted-foreground">{config.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-5">
                {/* Selected Date */}
                <div className="card-eclipse bg-card p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-sm font-semibold text-heading">
                        {selectedDate ? format(selectedDate, 'EEEE, MMM d') : 'Select a date'}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {selectedPosts.length} item{selectedPosts.length === 1 ? '' : 's'} scheduled
                      </p>
                    </div>
                    <button
                      onClick={() => selectedDate && openCreatePostModal(selectedDate, 'scheduled')}
                      className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors"
                    >
                      <Plus className="w-4 h-4 text-primary" />
                    </button>
                  </div>

                  {selectedPosts.length === 0 ? (
                    <div className="text-center py-8">
                      <CalendarDays className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                      <p className="text-xs text-muted-foreground">No content scheduled</p>
                      <button
                        onClick={() => openCreatePostModal(selectedDate, 'scheduled')}
                        className="text-xs text-primary hover:underline mt-1"
                      >
                        + Add something
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {selectedPosts
                        .sort((a, b) => a.time.localeCompare(b.time))
                        .map((post) => {
                          const config = typeConfig[post.type];
                          return (
                            <motion.div
                              key={post.id}
                              initial={{ opacity: 0, x: -8 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="group p-3 rounded-lg bg-secondary/50 hover:bg-secondary border border-transparent hover:border-border/30 transition-all"
                            >
                              <div className="flex items-start gap-2.5">
                                <div className={`p-1.5 rounded-md ${config.bg} shrink-0 mt-0.5`}>
                                  <span className={`text-[10px] font-bold ${config.color}`}>
                                    {config.label[0]}
                                  </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm text-heading truncate">{post.title}</p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                      <Clock className="w-2.5 h-2.5" />
                                      {post.time}
                                    </span>
                                    <span
                                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${statusConfig[post.status]}`}
                                    >
                                      {post.status}
                                    </span>
                                  </div>
                                </div>
                                <button
                                  onClick={() => handleDeleteClick(post.id, post.title)}
                                  className="text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </motion.div>
                          );
                        })}
                    </div>
                  )}
                </div>

                {/* Upcoming */}
                <div className="card-eclipse bg-card p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Bell className="w-4 h-4 text-primary" />
                    <h3 className="text-sm font-semibold text-heading">Upcoming</h3>
                  </div>
                  <div className="space-y-1.5">
                    {posts
                      .filter((p) => p.date >= new Date(new Date().setHours(0, 0, 0, 0)))
                      .sort(
                        (a, b) =>
                          a.date.getTime() - b.date.getTime() ||
                          a.time.localeCompare(b.time)
                      )
                      .slice(0, 6)
                      .map((post) => {
                        const config = typeConfig[post.type];
                        return (
                          <div
                            key={post.id}
                            onClick={() => setSelectedDate(post.date)}
                            className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-secondary/50 cursor-pointer transition-colors"
                          >
                            <div className="w-9 text-center shrink-0">
                              <p className="text-[9px] text-muted-foreground uppercase leading-none">
                                {format(post.date, 'MMM')}
                              </p>
                              <p className="text-sm font-semibold text-heading leading-tight">
                                {format(post.date, 'd')}
                              </p>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-heading truncate">{post.title}</p>
                              <p className="text-[10px] text-muted-foreground">{post.time}</p>
                            </div>
                            <span className={`text-[10px] font-medium ${config.color}`}>
                              {config.label[0]}
                            </span>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </main>
      </div>

      {/* Create Post Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="card-eclipse bg-card p-4 sm:p-6 w-full max-w-lg mx-4 max-h-[calc(100vh-2rem)] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-lg font-semibold text-heading">Create New Post</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Draft a new post for your content calendar.
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-muted-foreground hover:text-heading"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">Title</label>
                  <input
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Enter post title..."
                    className="w-full bg-secondary border border-border rounded-lg px-3 py-2.5 text-sm text-heading placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">Content</label>
                  <textarea
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    placeholder="Write your post content..."
                    rows={5}
                    className="w-full bg-secondary border border-border rounded-lg px-3 py-2.5 text-sm text-heading placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">Status</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['draft', 'scheduled', 'idea'] as PostStatus[]).map((status) => (
                      <button
                        key={status}
                        type="button"
                        onClick={() => setNewStatus(status)}
                        className={`flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium capitalize transition-colors ${
                          newStatus === status
                            ? 'border-primary/40 bg-primary/15 text-primary'
                            : 'border-border bg-secondary text-muted-foreground hover:text-heading'
                        }`}
                      >
                        {status === 'scheduled' && <CalendarDays className="h-3.5 w-3.5" />}
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                <AnimatePresence initial={false}>
                  {newStatus === 'scheduled' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-visible"
                    >
                      <ThemedDateTimePicker
                        value={newScheduleDate}
                        onChange={(schedule) => setNewScheduleDate(schedule)}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-secondary text-sm font-medium text-foreground hover:bg-secondary/80 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddPost}
                    disabled={!newTitle.trim()}
                    className="flex-1 px-4 py-2.5 rounded-xl text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 bg-gradient-primary"
                  >
                    Create Post
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setPostToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Scheduled Post"
        description="This will permanently remove this post from your calendar."
        itemName={postToDelete?.title}
      />
    </div>
  );
}
