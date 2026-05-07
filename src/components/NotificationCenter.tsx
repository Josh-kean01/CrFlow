import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, MessageSquare, Users, Trophy } from 'lucide-react';

const allNotifications = [
  { icon: TrendingUp, title: 'Your post reached 5k impressions!', time: '2m ago' },
  { icon: MessageSquare, title: 'New comment on "Building in Public"', time: '15m ago' },
  { icon: Users, title: '12 new followers today', time: '1h ago' },
  { icon: Trophy, title: 'Challenge completed: Post 3 times', time: '3h ago' },
  { icon: TrendingUp, title: 'Engagement rate up 0.8% this week', time: '5h ago' },
  { icon: MessageSquare, title: 'Sarah replied to your comment thread', time: 'Yesterday' },
  { icon: TrendingUp, title: 'Your weekly reach report is ready', time: 'Yesterday' },
  { icon: Trophy, title: 'New challenge unlocked: Consistency Sprint', time: '2d ago' },
];

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationCenter({ isOpen, onClose }: NotificationCenterProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm md:flex md:justify-end"
          onClick={onClose}
        >
          <motion.aside
            initial={{ x: 32, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 32, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            onClick={(event) => event.stopPropagation()}
            className="m-3 flex max-h-[calc(100vh-1.5rem)] w-[calc(100%-1.5rem)] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-black/50 md:m-0 md:h-full md:max-h-none md:w-[420px] md:rounded-none md:border-y-0 md:border-r-0"
          >
            <div className="flex items-start justify-between border-b border-border/60 px-5 py-4">
              <div>
                <h2 className="font-mono text-lg font-semibold text-heading">Notifications</h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  Updates from your content, audience, and challenges.
                </p>
              </div>
              <button
                type="button"
                aria-label="Close notifications"
                onClick={onClose}
                className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-heading"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex items-center justify-between border-b border-border/40 px-5 py-3">
              <span className="rounded-full bg-primary/15 px-2.5 py-1 text-[11px] font-medium text-primary">
                3 unread
              </span>
              <button className="text-xs font-medium text-muted-foreground transition-colors hover:text-heading">
                Mark all as read
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3">
              <div className="mb-2 px-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Recent
              </div>
              <div className="space-y-1">
                {allNotifications.map((notification, index) => (
                  <button
                    key={`${notification.title}-${notification.time}`}
                    type="button"
                    className="flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition-colors hover:bg-secondary/70"
                  >
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <notification.icon className="h-4 w-4 text-primary" strokeWidth={1.8} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium leading-snug text-heading">
                        {notification.title}
                      </span>
                      <span className="mt-1 block text-[11px] text-muted-foreground">
                        {notification.time}
                      </span>
                    </span>
                    {index < 3 && <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary" />}
                  </button>
                ))}
              </div>
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
