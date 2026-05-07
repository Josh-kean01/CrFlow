import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Search,
  Bell,
  TrendingUp,
  MessageSquare,
  Users,
  Trophy,
  X,
  LayoutDashboard,
  FileText,
  CalendarDays,
  BarChart3,
  Palette,
  Lightbulb,
  Settings,
  Bot,
} from 'lucide-react';

const pageNames: Record<string, string> = {
  '/': 'Dashboard',
  '/planner': 'Planner',
  '/calendar': 'Calendar',
  '/analytics': 'Analytics',
  '/brand-kit': 'Brand Kit',
  '/inspiration': 'Inspiration',
  '/challenges': 'Challenges',
  '/agent': 'AI Agent',
  '/settings': 'Settings',
};

const searchItems = [
  { label: 'Dashboard', description: 'Profile views, performance, AI assistant', to: '/', type: 'Page', icon: LayoutDashboard, keywords: 'home overview stats metrics' },
  { label: 'Content Planner', description: 'Tasks, workflow, content ideas', to: '/planner', type: 'Page', icon: FileText, keywords: 'planner tasks kanban todo content' },
  { label: 'Calendar', description: 'Scheduled posts and upcoming content', to: '/calendar', type: 'Page', icon: CalendarDays, keywords: 'schedule posts calendar upcoming' },
  { label: 'Analytics', description: 'Charts, followers, engagement reports', to: '/analytics', type: 'Page', icon: BarChart3, keywords: 'metrics charts performance reports' },
  { label: 'Brand Kit', description: 'Colors, typography, brand guidelines', to: '/brand-kit', type: 'Page', icon: Palette, keywords: 'brand colors fonts typography' },
  { label: 'Inspiration', description: 'Content inspiration and saved ideas', to: '/inspiration', type: 'Page', icon: Lightbulb, keywords: 'ideas inspiration saved examples' },
  { label: 'Challenges', description: 'XP, streaks, and content challenges', to: '/challenges', type: 'Page', icon: Trophy, keywords: 'challenge xp streak gamification' },
  { label: 'AI Agent', description: 'Ask CrFlow AI for content help', to: '/agent', type: 'Page', icon: Bot, keywords: 'assistant ai chat draft' },
  { label: 'Settings', description: 'Profile, notifications, integrations', to: '/settings', type: 'Page', icon: Settings, keywords: 'account preferences integrations' },
  { label: 'Write LinkedIn article', description: 'Planner task in progress', to: '/planner', type: 'Task', icon: FileText, keywords: 'linkedin article ai trends' },
  { label: 'LinkedIn Growth Tips', description: 'Upcoming scheduled content', to: '/calendar', type: 'Content', icon: CalendarDays, keywords: 'growth tips scheduled linkedin' },
  { label: 'Performance Overview', description: 'Last 7 days activity chart', to: '/', type: 'Insight', icon: TrendingUp, keywords: 'impressions clicks overview chart' },
];

const notifications = [
  { icon: TrendingUp, title: 'Your post reached 5k impressions!', time: '2m ago' },
  { icon: MessageSquare, title: 'New comment on "Building in Public"', time: '15m ago' },
  { icon: Users, title: '12 new followers today', time: '1h ago' },
  { icon: Trophy, title: 'Challenge completed: Post 3 times', time: '3h ago' },
  { icon: TrendingUp, title: 'Engagement rate up 0.8% this week', time: '5h ago' },
];

export interface HeaderProps {
  onOpenNotificationCenter: () => void;
}

export default function Header({ onOpenNotificationCenter }: HeaderProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const pageName = pageNames[location.pathname] || 'Dashboard';
  const [openNotifications, setOpenNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [openSearch, setOpenSearch] = useState(false);
  const [openMobileSearch, setOpenMobileSearch] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const filteredSearchItems = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    if (!normalizedQuery) return searchItems.slice(0, 6);

    return searchItems.filter((item) => {
      const searchable = `${item.label} ${item.description} ${item.type} ${item.keywords}`.toLowerCase();
      return searchable.includes(normalizedQuery);
    });
  }, [searchQuery]);

  const closeSearch = () => {
    setOpenSearch(false);
    setSearchQuery('');
  };

  const selectSearchItem = (to: string) => {
    navigate(to);
    closeSearch();
  };

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (notificationRef.current && !notificationRef.current.contains(target)) {
        setOpenNotifications(false);
      }
      if (searchRef.current && !searchRef.current.contains(target)) {
        setOpenSearch(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        if (window.innerWidth < 640) {
          setOpenMobileSearch(true);
        } else {
          setOpenSearch(true);
          searchInputRef.current?.focus();
        }
      }

      if (event.key === 'Escape') {
        setOpenSearch(false);
        setOpenMobileSearch(false);
        setOpenNotifications(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-[55] h-14 border-b border-border/50 bg-sidebar-bg/95 backdrop-blur-sm flex items-center justify-between px-3 sm:px-6 shrink-0">
      <div className="flex min-w-0 items-center gap-2 text-sm">
        <span className="font-medium text-heading shrink-0">CrFlow</span>
        <span className="text-muted-foreground">/</span>
        <span className="truncate text-muted-foreground">{pageName}</span>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <button
          type="button"
          aria-label="Open search"
          onClick={() => setOpenMobileSearch(true)}
          className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-heading sm:hidden"
        >
          <Search className="h-4 w-4" />
        </button>

        <div ref={searchRef} className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(event) => {
              setSearchQuery(event.target.value);
              setOpenSearch(true);
            }}
            onFocus={() => setOpenSearch(true)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && filteredSearchItems[0]) {
                event.preventDefault();
                selectSearchItem(filteredSearchItems[0].to);
              }
            }}
            placeholder="Search"
            className="w-[220px] bg-secondary border border-border/50 rounded-lg pl-9 pr-14 py-2 text-sm text-heading placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
          />
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground bg-border/50 px-1.5 py-0.5 rounded border border-border/30">
            ⌘K
          </span>

          <AnimatePresence>
            {openSearch && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={{ duration: 0.16, ease: 'easeOut' }}
                className="absolute right-0 top-[calc(100%+0.5rem)] z-50 w-[min(360px,calc(100vw-2rem))] overflow-hidden rounded-xl border border-border bg-card shadow-2xl shadow-black/40"
              >
                <div className="border-b border-border/60 px-4 py-3">
                  <p className="font-mono text-xs font-semibold text-heading">
                    {searchQuery.trim() ? 'Search results' : 'Quick search'}
                  </p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    Press Enter to open the first result.
                  </p>
                </div>

                <div className="max-h-[320px] overflow-y-auto py-2">
                  {filteredSearchItems.length > 0 ? (
                    filteredSearchItems.map((item) => (
                      <button
                        key={`${item.type}-${item.label}`}
                        type="button"
                        onClick={() => selectSearchItem(item.to)}
                        className="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-secondary/60"
                      >
                        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                          <item.icon className="h-4 w-4 text-primary" strokeWidth={1.8} />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex items-center gap-2">
                            <span className="truncate text-sm font-medium text-heading">{item.label}</span>
                            <span className="rounded-full bg-secondary px-1.5 py-0.5 text-[9px] font-medium text-muted-foreground">
                              {item.type}
                            </span>
                          </span>
                          <span className="mt-1 block truncate text-[11px] text-muted-foreground">
                            {item.description}
                          </span>
                        </span>
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-8 text-center">
                      <p className="text-sm font-medium text-heading">No results found</p>
                      <p className="mt-1 text-xs text-muted-foreground">Try searching for a page, task, or metric.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div ref={notificationRef} className="relative">
          <button
            type="button"
            aria-label="Toggle notifications"
            aria-expanded={openNotifications}
            onClick={() => setOpenNotifications((current) => !current)}
            className="relative p-2 rounded-lg hover:bg-secondary transition-colors"
          >
            <Bell className="w-4 h-4 text-muted-foreground" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary" />
          </button>

          <AnimatePresence>
            {openNotifications && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={{ duration: 0.16, ease: 'easeOut' }}
                className="fixed left-3 right-3 top-16 z-50 w-auto overflow-hidden rounded-lg border border-border bg-card shadow-2xl shadow-black/40 sm:absolute sm:left-auto sm:right-0 sm:top-[calc(100%+0.5rem)] sm:w-80"
              >
                <div className="flex items-center justify-between px-4 py-3 border-b border-border/60">
                  <h3 className="font-mono text-sm font-semibold text-heading">Notifications</h3>
                  <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-medium text-primary">
                    3 new
                  </span>
                </div>

                <div className="max-h-[280px] overflow-y-auto py-2">
                  {notifications.map((notification, index) => (
                    <div key={notification.title} className="flex items-start gap-3 px-4 py-3 hover:bg-secondary/60 transition-colors">
                      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <notification.icon className="h-3.5 w-3.5 text-primary" strokeWidth={1.8} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium leading-snug text-heading">{notification.title}</p>
                        <p className="mt-1 text-[11px] text-muted-foreground">{notification.time}</p>
                      </div>
                      {index < 3 && <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />}
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setOpenNotifications(false);
                    onOpenNotificationCenter();
                  }}
                  className="block w-full border-t border-border/60 px-4 py-3 text-center text-xs font-medium text-primary hover:bg-secondary/60 transition-colors"
                >
                  View all notifications
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-white text-xs font-semibold">
          CK
        </div>
      </div>

      <AnimatePresence>
        {openMobileSearch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-black/60 p-3 backdrop-blur-sm sm:hidden"
            onClick={() => setOpenMobileSearch(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.16, ease: 'easeOut' }}
              onClick={(event) => event.stopPropagation()}
              className="overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-black/50"
            >
              <div className="flex items-center gap-2 border-b border-border/60 p-3">
                <Search className="h-4 w-4 text-muted-foreground" />
                <input
                  autoFocus
                  type="text"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' && filteredSearchItems[0]) {
                      event.preventDefault();
                      setOpenMobileSearch(false);
                      selectSearchItem(filteredSearchItems[0].to);
                    }
                  }}
                  placeholder="Search CrFlow..."
                  className="min-w-0 flex-1 bg-transparent text-sm text-heading placeholder:text-muted-foreground focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setOpenMobileSearch(false)}
                  className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-heading"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="max-h-[70vh] overflow-y-auto py-2">
                {filteredSearchItems.length > 0 ? (
                  filteredSearchItems.map((item) => (
                    <button
                      key={`mobile-${item.type}-${item.label}`}
                      type="button"
                      onClick={() => {
                        setOpenMobileSearch(false);
                        selectSearchItem(item.to);
                      }}
                      className="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-secondary/60"
                    >
                      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <item.icon className="h-4 w-4 text-primary" strokeWidth={1.8} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-heading">{item.label}</span>
                        <span className="mt-1 block truncate text-[11px] text-muted-foreground">
                          {item.description}
                        </span>
                      </span>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-8 text-center">
                    <p className="text-sm font-medium text-heading">No results found</p>
                    <p className="mt-1 text-xs text-muted-foreground">Try a page, task, or metric.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}