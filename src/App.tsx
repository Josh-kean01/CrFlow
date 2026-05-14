import { useState } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import NotificationCenter from './components/NotificationCenter';
import Dashboard from './pages/Dashboard';
import Planner from './pages/Planner';
import Calendar from './pages/Calendar';
import Analytics from './pages/Analytics';
import BrandKit from './pages/BrandKit';
import Inspiration from './pages/Inspiration';
import Challenges from './pages/Challenges';
import Agent from './pages/Agent';
import Settings from './pages/Settings';

export default function App() {
  const [notificationCenterOpen, setNotificationCenterOpen] = useState(false);

  return (
    <HashRouter>
      <div className="flex min-h-screen bg-background overflow-visible">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 overflow-visible">
          <Header onOpenNotificationCenter={() => setNotificationCenterOpen(true)} />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/planner" element={<Planner />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/brand-kit" element={<BrandKit />} />
            <Route path="/inspiration" element={<Inspiration />} />
            <Route path="/challenges" element={<Challenges />} />
            <Route path="/agent" element={<Agent />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </div>
      <NotificationCenter
        isOpen={notificationCenterOpen}
        onClose={() => setNotificationCenterOpen(false)}
      />
    </HashRouter>
  );
}
