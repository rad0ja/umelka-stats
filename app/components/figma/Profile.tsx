'use client';

import { useMemo } from 'react';
import { Mail, Phone, Calendar, Award, Activity } from 'lucide-react';
import { motion } from 'motion/react';
import LogoutButton from './components/LogoutButton';
import InstallPrompt from '@/app/components/figma/components/InstallPrompt';
import { PlayerHeader } from './components/PlayerHeader';
import { StatGrid } from './components/StatGrid';
import { ContactInfoList } from './components/ContactInfoList';
import { AchievementCard } from './components/AchievementCard';

export function Profile() {
  // TODO: Replace with actual user data from API/context
  const userStats = {
    name: 'Jordan Lee',
    position: 'Midfielder',
    number: 10,
    email: 'jordan.lee@email.com',
    phone: '+1 (555) 123-4567',
    joinDate: 'March 2024',
    personalStats: {
      goals: 12,
      assists: 15,
      matches: 22,
      mvp: 3,
    },
  };

  const statsConfig = useMemo(
    () => [
      {
        value: userStats.personalStats.goals,
        label: 'Goals',
        gradient:
          'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30',
        color: 'text-blue-600 dark:text-blue-400',
      },
      {
        value: userStats.personalStats.assists,
        label: 'Assists',
        gradient:
          'bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30',
        color: 'text-purple-600 dark:text-purple-400',
      },
      {
        value: userStats.personalStats.matches,
        label: 'Matches',
        gradient:
          'bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30',
        color: 'text-green-600 dark:text-green-400',
      },
      {
        value: userStats.personalStats.mvp,
        label: 'MVP Awards',
        gradient:
          'bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/30 dark:to-yellow-800/30',
        color: 'text-yellow-600 dark:text-yellow-400',
      },
    ],
    [userStats.personalStats]
  );

  const contactInfo = useMemo(
    () => [
      {
        icon: Mail,
        label: 'Email',
        value: userStats.email,
        bgColor: 'bg-blue-100 dark:bg-blue-900/50',
        iconColor: 'text-blue-600 dark:text-blue-400',
      },
      {
        icon: Phone,
        label: 'Phone',
        value: userStats.phone,
        bgColor: 'bg-green-100 dark:bg-green-900/50',
        iconColor: 'text-green-600 dark:text-green-400',
      },
      {
        icon: Calendar,
        label: 'Joined',
        value: userStats.joinDate,
        bgColor: 'bg-purple-100 dark:bg-purple-900/50',
        iconColor: 'text-purple-600 dark:text-purple-400',
      },
    ],
    [userStats.email, userStats.phone, userStats.joinDate]
  );

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-950">
      <PlayerHeader />

      <div className="flex-1 min-h-0 overflow-y-auto relative z-10">

        <div className="px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-lg"
          >
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Season Stats
            </h2>
            <StatGrid stats={statsConfig} />
          </motion.div>
        </div>

        <div className="px-4 pt-6">
          <h2 className="text-xl font-semibold mb-3 px-2 dark:text-white">Contact Info</h2>
          <ContactInfoList items={contactInfo} />
        </div>

        <div className="px-4 pt-6 pb-6">
          <h2 className="text-xl font-semibold mb-3 px-2 dark:text-white">Achievements</h2>
          <div className="space-y-3">
            <AchievementCard
              icon={Award}
              title="Top Assister"
              description="Most assists this season"
              gradient="bg-gradient-to-br from-yellow-400 to-orange-500 dark:from-yellow-500 dark:to-orange-600"
            />
            <AchievementCard
              icon={Activity}
              title="Perfect Attendance"
              description="Played all matches"
              gradient="bg-gradient-to-br from-green-500 to-emerald-600 dark:from-green-600 dark:to-emerald-700"
            />
            <LogoutButton />
            <InstallPrompt />
          </div>
        </div>
      </div>
    </div>
  );
}