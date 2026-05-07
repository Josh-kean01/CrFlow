import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, Clock, CheckCircle2, Circle, Trash2, X, CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  addDays,
  addMonths,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import {
  addCalendarPost,
  readCalendarPosts,
  writeCalendarPosts,
  type CalendarPostStatus,
} from '../utils/calendarPosts';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  platform: string;
  calendarPostId?: string;
  postStatus?: CalendarPostStatus;
  scheduleISO?: string;
}

const initialTasks: Task[] = [
  { id: '1', title: 'Write LinkedIn article', description: 'Draft thought leadership piece on AI trends', status: 'in-progress', priority: 'high', dueDate: 'Today', platform: 'LinkedIn' },
  { id: '2', title: 'Design Instagram carousel', description: 'Create 10-slide carousel on growth tips', status: 'todo', priority: 'medium', dueDate: 'Tomorrow', platform: 'Instagram' },
  { id: '3', title: 'Record behind-the-scenes video', description: 'Film office tour and team intro', status: 'todo', priority: 'low', dueDate: 'Wed', platform: 'Instagram' },
  { id: '4', title: 'Schedule Facebook posts', description: 'Batch schedule 5 posts for next week', status: 'done', priority: 'medium', dueDate: 'Completed', platform: 'Facebook' },
  { id: '5', title: 'Engage with comments', description: 'Reply to all pending comments across platforms', status: 'in-progress', priority: 'high', dueDate: 'Today', platform: 'All' },
  { id: '6', title: 'Update content calendar', description: 'Plan next month content strategy', status: 'todo', priority: 'high', dueDate: 'Thu', platform: 'All' },
];

const priorityColors = {
  low: 'text-chart-4 bg-chart-4/15',
  medium: 'text-chart-3 bg-chart-3/15',
  high: 'text-destructive bg-destructive/15',
};

const columns = [
  { key: 'todo' as const, label: 'To Do', color: 'text-muted-foreground' },
  { key: 'in-progress' as const, label: 'In Progress', color: 'text-primary' },
  { key: 'done' as const, label: 'Done', color: 'text-mint' },
];

const formatDateTimeLocal = (date = new Date()) => {
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

export default function Planner() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<{ id: string; title: string } | null>(null);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    status: 'draft' as CalendarPostStatus,
    schedule: formatDateTimeLocal(),
  });

  const resetNewPost = () => {
    setEditingTaskId(null);
    setNewPost({
      title: '',
      content: '',
      status: 'draft',
      schedule: formatDateTimeLocal(),
    });
  };

  const openNewPostModal = () => {
    resetNewPost();
    setTaskModalOpen(true);
  };

  const openEditPostModal = (task: Task) => {
    setEditingTaskId(task.id);
    setNewPost({
      title: task.title,
      content: task.description === 'LinkedIn post draft' ? '' : task.description,
      status: task.postStatus || 'draft',
      schedule: task.scheduleISO ? formatDateTimeLocal(new Date(task.scheduleISO)) : formatDateTimeLocal(),
    });
    setTaskModalOpen(true);
  };

  const handleCreatePost = () => {
    if (!newPost.title.trim()) return;

    const scheduledDate = new Date(newPost.schedule);
    const safeDate = Number.isNaN(scheduledDate.getTime()) ? new Date() : scheduledDate;
    const calendarPostId =
      tasks.find((task) => task.id === editingTaskId)?.calendarPostId || Date.now().toString();

    const postPayload = {
      id: calendarPostId,
      title: newPost.title.trim(),
      content: newPost.content.trim(),
      date: safeDate.toISOString(),
      time: format(safeDate, 'HH:mm'),
      type: 'linkedin' as const,
      status: newPost.status,
    };

    const existingPosts = readCalendarPosts();
    const existingPost = existingPosts.some((post) => post.id === calendarPostId);

    if (existingPost) {
      writeCalendarPosts(
        existingPosts.map((post) => (post.id === calendarPostId ? postPayload : post))
      );
    } else {
      addCalendarPost(postPayload);
    }

    const nextTask = {
      title: newPost.title.trim(),
      description: newPost.content.trim() || 'LinkedIn post draft',
      status: newPost.status === 'scheduled' ? 'in-progress' : 'todo',
      priority: newPost.status === 'idea' ? 'low' : 'medium',
      dueDate: newPost.status === 'scheduled' ? format(safeDate, 'MMM d, h:mm a') : 'Unscheduled',
      platform: 'LinkedIn',
      calendarPostId,
      postStatus: newPost.status,
      scheduleISO: safeDate.toISOString(),
    } satisfies Omit<Task, 'id'>;

    if (editingTaskId) {
      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === editingTaskId ? { ...task, ...nextTask } : task
        )
      );
      resetNewPost();
      setTaskModalOpen(false);
      return;
    }

    setTasks((currentTasks) => [
      ...currentTasks,
      {
        id: `planner-${calendarPostId}`,
        ...nextTask,
      },
    ]);
    resetNewPost();
    setTaskModalOpen(false);
  };

  const handleDeleteClick = (id: string, title: string) => {
    setTaskToDelete({ id, title });
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (taskToDelete) {
      setTasks((currentTasks) => currentTasks.filter((task) => task.id !== taskToDelete.id));
      setTaskToDelete(null);
    }
  };

  const toggleStatus = (id: string) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) => {
        if (task.id !== id) return task;
        const next = task.status === 'todo' ? 'in-progress' : task.status === 'in-progress' ? 'done' : 'todo';
        return { ...task, status: next };
      })
    );
  };

  return (
    <div className="flex bg-background">
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-[1400px] mx-auto"
          >
            <div className="flex flex-col gap-3 mb-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-xl sm:text-2xl font-semibold text-heading">Content Planner</h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Organize and track your content creation workflow
                </p>
              </div>
              <button
                onClick={openNewPostModal}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity bg-gradient-primary"
              >
                <Plus className="w-4 h-4" />
                New Task
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {columns.map((col) => {
                const colTasks = tasks.filter((task) => task.status === col.key);
                return (
                  <motion.div
                    key={col.key}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: col.key === 'todo' ? 0.1 : col.key === 'in-progress' ? 0.2 : 0.3 }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-semibold ${col.color}`}>{col.label}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-secondary text-muted-foreground">
                          {colTasks.length}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <AnimatePresence mode="popLayout">
                        {colTasks.map((task) => (
                          <motion.div
                            key={task.id}
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            onClick={() => openEditPostModal(task)}
                            className="card-eclipse bg-card p-4 group cursor-pointer hover:border-primary/30 transition-colors"
                          >
                            <div className="flex items-start gap-3">
                              <button
                                onClick={(event) => {
                                  event.stopPropagation();
                                  toggleStatus(task.id);
                                }}
                                className="mt-0.5 shrink-0"
                              >
                                {task.status === 'done' ? (
                                  <CheckCircle2 className="w-4 h-4 text-mint" />
                                ) : (
                                  <Circle className="w-4 h-4 text-muted-foreground hover:text-primary transition-colors" />
                                )}
                              </button>
                              <div className="flex-1 min-w-0">
                                <p className={`text-sm text-heading ${task.status === 'done' ? 'line-through opacity-50' : ''}`}>
                                  {task.title}
                                </p>
                                <p className="text-[11px] text-muted-foreground mt-1">{task.description}</p>
                                <div className="flex items-center gap-2 mt-3 flex-wrap">
                                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${priorityColors[task.priority]}`}>
                                    {task.priority}
                                  </span>
                                  <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                    <Clock className="w-2.5 h-2.5" />
                                    {task.dueDate}
                                  </span>
                                  <span className="text-[10px] text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">
                                    {task.platform}
                                  </span>
                                </div>
                              </div>
                              <button
                                onClick={(event) => {
                                  event.stopPropagation();
                                  handleDeleteClick(task.id, task.title);
                                }}
                                className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all shrink-0"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </main>
      </div>

      <AnimatePresence>
        {taskModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[90]"
            onClick={() => setTaskModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(event) => event.stopPropagation()}
              className="card-eclipse bg-card p-4 sm:p-6 w-full max-w-lg mx-4 max-h-[calc(100vh-2rem)] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-lg font-semibold text-heading">
                    {editingTaskId ? 'Edit Post' : 'Create New Post'}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Draft a new post for your content calendar.
                  </p>
                </div>
                <button
                  onClick={() => setTaskModalOpen(false)}
                  className="text-muted-foreground hover:text-heading transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">Title</label>
                  <input
                    value={newPost.title}
                    onChange={(event) => setNewPost({ ...newPost, title: event.target.value })}
                    placeholder="Enter post title..."
                    className="w-full bg-secondary border border-border rounded-lg px-3 py-2.5 text-sm text-heading placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">Content</label>
                  <textarea
                    value={newPost.content}
                    onChange={(event) => setNewPost({ ...newPost, content: event.target.value })}
                    placeholder="Write your post content..."
                    rows={5}
                    className="w-full bg-secondary border border-border rounded-lg px-3 py-2.5 text-sm text-heading placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">Status</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['draft', 'scheduled', 'idea'] as CalendarPostStatus[]).map((status) => (
                      <button
                        key={status}
                        type="button"
                        onClick={() => setNewPost({ ...newPost, status })}
                        className={`flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium capitalize transition-colors ${
                          newPost.status === status
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
                  {newPost.status === 'scheduled' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-visible"
                    >
                      <ThemedDateTimePicker
                        value={newPost.schedule}
                        onChange={(schedule) => setNewPost({ ...newPost, schedule })}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setTaskModalOpen(false)}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-secondary text-sm font-medium text-foreground hover:bg-secondary/80 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreatePost}
                    disabled={!newPost.title.trim()}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-primary text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {editingTaskId ? 'Save Changes' : 'Create Post'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setTaskToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Task"
        description="This will permanently remove this task from your planner."
        itemName={taskToDelete?.title}
      />
    </div>
  );
}

interface ThemedDateTimePickerProps {
  value: string;
  onChange: (value: string) => void;
}

function ThemedDateTimePicker({ value, onChange }: ThemedDateTimePickerProps) {
  const selectedDate = new Date(value);
  const safeSelectedDate = Number.isNaN(selectedDate.getTime()) ? new Date() : selectedDate;
  const [isOpen, setIsOpen] = useState(false);
  const [viewMonth, setViewMonth] = useState(startOfMonth(safeSelectedDate));

  const monthDays = (() => {
    const start = startOfWeek(startOfMonth(viewMonth));
    const end = endOfWeek(endOfMonth(viewMonth));
    const days: Date[] = [];
    let day = start;

    while (day <= end) {
      days.push(day);
      day = addDays(day, 1);
    }

    return days;
  })();

  const updateDate = (date: Date) => {
    const next = new Date(date);
    next.setHours(safeSelectedDate.getHours(), safeSelectedDate.getMinutes(), 0, 0);
    onChange(formatDateTimeLocal(next));
  };

  const updateTime = (type: 'hour' | 'minute', rawValue: string) => {
    const next = new Date(safeSelectedDate);
    if (type === 'hour') next.setHours(Number(rawValue));
    if (type === 'minute') next.setMinutes(Number(rawValue));
    onChange(formatDateTimeLocal(next));
  };

  return (
    <div className="relative">
      <label className="text-xs text-muted-foreground mb-1.5 block">Schedule</label>
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="flex w-full items-center justify-between rounded-lg border border-border bg-secondary px-3 py-2.5 text-left text-sm text-heading transition-colors hover:border-primary/40 focus:outline-none focus:ring-1 focus:ring-primary"
      >
        <span className="flex min-w-0 items-center gap-2">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <CalendarDays className="h-4 w-4" />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-medium text-heading">
              {format(safeSelectedDate, 'MMM d, yyyy')}
            </span>
            <span className="block text-[11px] text-muted-foreground">
              {format(safeSelectedDate, 'h:mm a')}
            </span>
          </span>
        </span>
        <ChevronRight className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? 'rotate-90' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[130] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 10 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              onClick={(event) => event.stopPropagation()}
              className="card-eclipse w-full max-w-md bg-card p-4 sm:p-5 shadow-2xl shadow-black/50 max-h-[calc(100vh-2rem)] overflow-y-auto"
            >
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <h4 className="font-mono text-base font-semibold text-heading">Pick date and time</h4>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {format(safeSelectedDate, 'EEEE, MMM d')} at {format(safeSelectedDate, 'h:mm a')}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-heading"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mb-3 flex items-center justify-between rounded-xl border border-border/60 bg-secondary/40 px-2 py-2">
                <button
                  type="button"
                  onClick={() => setViewMonth(subMonths(viewMonth, 1))}
                  className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-heading"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <p className="font-mono text-sm font-semibold text-heading">
                  {format(viewMonth, 'MMMM yyyy')}
                </p>
                <button
                  type="button"
                  onClick={() => setViewMonth(addMonths(viewMonth, 1))}
                  className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-heading"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                  <span key={`${day}-${index}`} className="py-1">
                    {day}
                  </span>
                ))}
              </div>

              <div className="mt-1 grid grid-cols-7 gap-1">
                {monthDays.map((day) => {
                  const selected = isSameDay(day, safeSelectedDate);
                  return (
                    <button
                      key={day.toISOString()}
                      type="button"
                      onClick={() => updateDate(day)}
                      className={`rounded-lg py-2 text-xs font-medium transition-colors ${
                        selected
                          ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                          : isSameMonth(day, viewMonth)
                            ? 'text-heading hover:bg-secondary'
                            : 'text-muted-foreground/40 hover:bg-secondary/50'
                      }`}
                    >
                      {format(day, 'd')}
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 border-t border-border/60 pt-4">
                <div>
                  <label className="mb-1.5 block text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    Hour
                  </label>
                  <select
                    value={safeSelectedDate.getHours()}
                    onChange={(event) => updateTime('hour', event.target.value)}
                    className="w-full rounded-lg border border-border bg-secondary px-2 py-2.5 text-sm text-heading focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    {Array.from({ length: 24 }, (_, hour) => (
                      <option key={hour} value={hour}>
                        {String(hour).padStart(2, '0')}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    Minute
                  </label>
                  <select
                    value={safeSelectedDate.getMinutes()}
                    onChange={(event) => updateTime('minute', event.target.value)}
                    className="w-full rounded-lg border border-border bg-secondary px-2 py-2.5 text-sm text-heading focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    {Array.from({ length: 12 }, (_, index) => index * 5).map((minute) => (
                      <option key={minute} value={minute}>
                        {String(minute).padStart(2, '0')}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-5 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 rounded-xl bg-secondary px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary/80"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 rounded-xl bg-gradient-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}