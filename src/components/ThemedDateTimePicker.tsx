import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CalendarDays, ChevronLeft, ChevronRight, X } from 'lucide-react';
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

export const formatDateTimeLocal = (date = new Date()) => {
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

interface ThemedDateTimePickerProps {
  value: string;
  onChange: (value: string) => void;
}

export default function ThemedDateTimePicker({ value, onChange }: ThemedDateTimePickerProps) {
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