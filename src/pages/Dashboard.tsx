import { motion } from 'framer-motion';
import {
  Eye,
  Users,
  TrendingUp,
  Zap,
  ArrowUpRight,
  FileText,
  MessageSquare,
  Heart,
  Share2,
  Calendar,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import AIVisualization from '../components/AIVisualization';

const stats = [
  {
    label: 'Profile Views',
    value: '4,281',
    change: '+12.3%',
    icon: Eye,
  },
  {
    label: 'Followers',
    value: '2,847',
    change: '+5.7%',
    icon: Users,
  },
  {
    label: 'Engagement Rate',
    value: '5.2%',
    change: '+0.8%',
    icon: TrendingUp,
  },
  {
    label: 'Posts This Week',
    value: '7',
    change: '+2',
    icon: Zap,
  },
];

const performanceData = [
  { day: 'Mon', impressions: 8200, clicks: 1200 },
  { day: 'Tue', impressions: 9400, clicks: 1400 },
  { day: 'Wed', impressions: 8800, clicks: 1300 },
  { day: 'Thu', impressions: 11200, clicks: 1700 },
  { day: 'Fri', impressions: 10800, clicks: 1600 },
  { day: 'Sat', impressions: 12400, clicks: 1800 },
  { day: 'Sun', impressions: 11800, clicks: 1750 },
];

const upcomingContent = [
  { title: 'LinkedIn Growth Tips', time: 'Tomorrow, 9:00 AM', status: 'scheduled' as const },
  { title: 'Case Study: Q1 Results', time: 'Wed, 10:30 AM', status: 'draft' as const },
  { title: 'Weekly Newsletter', time: 'Thu, 8:00 AM', status: 'scheduled' as const },
];

const recentActivity = [
  { icon: FileText, text: 'Published "AI in Marketing"', time: '2h ago' },
  { icon: MessageSquare, text: '12 new comments', time: '4h ago' },
  { icon: Heart, text: 'Post reached 500 likes', time: '6h ago' },
  { icon: Share2, text: 'Shared by 23 people', time: '8h ago' },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

export default function Dashboard() {
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
            <div className="mb-6">
              <h1 className="text-xl sm:text-2xl font-semibold text-heading">Good evening, Clinton</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Your content performance is up <span className="text-primary font-medium">12%</span> this week. Keep the momentum going.
              </p>
            </div>

            {/* Stats Row */}
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
            >
              {stats.map((stat) => (
                <motion.div
                  key={stat.label}
                  variants={item}
                  className="card-eclipse bg-card p-5"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-1.5 rounded-lg bg-secondary">
                      <stat.icon className="w-4 h-4 text-muted-foreground" strokeWidth={1.8} />
                    </div>
                    <span className="text-xs font-medium text-mint bg-mint/10 px-2 py-0.5 rounded-full">
                      {stat.change}
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-heading">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* AI Assistant Panel - Left */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                  className="card-eclipse bg-card p-4 sm:p-6 flex flex-col"
              >
                <h3 className="text-sm font-semibold text-heading mb-6">AI Assistant</h3>

                {/* Animated Visualization */}
                <div className="flex-1 flex items-center justify-center py-3">
                  <AIVisualization />
                </div>

                {/* Try Now Button */}
                <div className="flex justify-center mt-4">
                  <button className="px-6 py-2 rounded-full text-sm font-medium text-primary-foreground bg-gradient-primary hover:opacity-90 transition-opacity shadow-lg shadow-primary/20">
                    Try Now
                  </button>
                </div>

                {/* Description */}
                <p className="text-xs text-muted-foreground text-center mt-6 leading-relaxed px-4">
                  Analyze trends, generate content ideas,{' '}
                  <span className="text-primary">and optimize your LinkedIn strategy with AI-powered insights.</span>
                </p>
              </motion.div>

              {/* Right Column - 3 Cards */}
              <div className="space-y-5">
                {/* Performance Overview */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="card-eclipse bg-card p-5"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-sm font-semibold text-heading">Performance Overview</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">Last 7 days activity</p>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
                  </div>

                  {/* Legend */}
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-4">
                    <span className="flex items-center gap-1.5 text-xs">
                      <span className="w-2 h-2 rounded-full bg-primary" />
                      <span className="text-muted-foreground">Impressions</span>
                      <span className="text-heading font-semibold">12.4k</span>
                    </span>
                    <span className="flex items-center gap-1.5 text-xs">
                      <span className="w-2 h-2 rounded-full bg-chart-3" />
                      <span className="text-muted-foreground">Clicks</span>
                      <span className="text-heading font-semibold">1.8k</span>
                    </span>
                  </div>

                  <ResponsiveContainer width="100%" height={180}>
                    <AreaChart data={performanceData}>
                      <defs>
                        <linearGradient id="impGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(250 60% 62%)" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="hsl(250 60% 62%)" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="clickGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(200 55% 50%)" stopOpacity={0.15} />
                          <stop offset="95%" stopColor="hsl(200 55% 50%)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis
                        dataKey="day"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'hsl(220 10% 45%)', fontSize: 10 }}
                      />
                      <YAxis hide />
                      <Tooltip
                        contentStyle={{
                          background: 'hsl(220 18% 10%)',
                          border: '1px solid hsl(220 14% 14%)',
                          borderRadius: '8px',
                          fontSize: '11px',
                          color: 'hsl(220 15% 88%)',
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="impressions"
                        stroke="hsl(250 60% 62%)"
                        strokeWidth={2}
                        fill="url(#impGrad)"
                        dot={{ fill: 'hsl(220 18% 10%)', stroke: 'hsl(250 60% 62%)', r: 3, strokeWidth: 2 }}
                        activeDot={{ r: 5, fill: 'hsl(250 60% 62%)', stroke: 'hsl(220 18% 10%)', strokeWidth: 2 }}
                      />
                      <Area
                        type="monotone"
                        dataKey="clicks"
                        stroke="hsl(200 55% 50%)"
                        strokeWidth={1.5}
                        strokeDasharray="4 4"
                        fill="url(#clickGrad)"
                        dot={false}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </motion.div>

                {/* Upcoming Content */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="card-eclipse bg-card p-5"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <h3 className="text-sm font-semibold text-heading">Upcoming Content</h3>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="space-y-3">
                    {upcomingContent.map((item, i) => (
                      <div
                        key={i}
                          className="flex flex-col gap-2 py-2 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div>
                          <p className="text-sm text-heading">{item.title}</p>
                          <p className="text-[11px] text-muted-foreground mt-0.5">{item.time}</p>
                        </div>
                        <span
                          className={`text-[10px] px-2.5 py-1 rounded-full font-medium ${
                            item.status === 'scheduled'
                              ? 'bg-primary/15 text-primary'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Recent Activity */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 }}
                  className="card-eclipse bg-card p-5"
                >
                  <h3 className="text-sm font-semibold text-heading mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {recentActivity.map((activity, i) => (
                      <div key={i} className="flex items-center justify-between py-1">
                        <div className="flex items-center gap-3">
                          <div className="p-1.5 rounded-lg bg-secondary">
                            <activity.icon className="w-3.5 h-3.5 text-muted-foreground" strokeWidth={1.8} />
                          </div>
                          <p className="text-sm text-heading">{activity.text}</p>
                        </div>
                        <span className="text-[11px] text-muted-foreground">{activity.time}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
