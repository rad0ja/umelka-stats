import { User, Mail, Phone, MapPin, Calendar, Award, Activity } from 'lucide-react';
import { motion } from 'motion/react';

export function Profile() {
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

  return (
    <div className="h-full overflow-y-auto pb-24 bg-gray-50">
      {/* Header */}
      <div className="bg-gray-900 pt-14 pb-8 px-6">
        <div className="flex flex-col items-center text-white">
          <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-3xl font-bold mb-4 border-4 border-white/20">
            JL
          </div>
          <h1 className="text-3xl font-bold mb-1">{userStats.name}</h1>
          <div className="flex items-center gap-2 text-white/80">
            <span className="text-lg">{userStats.position}</span>
            <span className="text-white/40">•</span>
            <span className="text-lg">#{userStats.number}</span>
          </div>
        </div>
      </div>

      {/* Personal Stats */}
      <div className="px-4 -mt-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-6 shadow-lg"
        >
          <h2 className="text-lg font-semibold mb-4 text-gray-900">Season Stats</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-2xl">
              <div className="text-3xl font-bold text-gray-900 mb-1">{userStats.personalStats.goals}</div>
              <div className="text-sm text-gray-600">Goals</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-2xl">
              <div className="text-3xl font-bold text-gray-900 mb-1">{userStats.personalStats.assists}</div>
              <div className="text-sm text-gray-600">Assists</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-2xl">
              <div className="text-3xl font-bold text-gray-900 mb-1">{userStats.personalStats.matches}</div>
              <div className="text-sm text-gray-600">Matches</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-2xl">
              <div className="text-3xl font-bold text-gray-900 mb-1">{userStats.personalStats.mvp}</div>
              <div className="text-sm text-gray-600">MVP Awards</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Contact Information */}
      <div className="px-4 pt-6">
        <h2 className="text-xl font-semibold mb-3 px-2">Contact Info</h2>
        <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
          <div className="divide-y divide-gray-100">
            <div className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                <Mail className="w-5 h-5 text-gray-700" />
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Email</div>
                <div className="text-gray-900">{userStats.email}</div>
              </div>
            </div>
            <div className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                <Phone className="w-5 h-5 text-gray-700" />
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Phone</div>
                <div className="text-gray-900">{userStats.phone}</div>
              </div>
            </div>
            <div className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-gray-700" />
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Joined</div>
                <div className="text-gray-900">{userStats.joinDate}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="px-4 pt-6 pb-6">
        <h2 className="text-xl font-semibold mb-3 px-2">Achievements</h2>
        <div className="space-y-3">
          <motion.div
            whileTap={{ scale: 0.98 }}
            className="bg-gray-900 rounded-2xl p-5 text-white shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <div className="font-semibold text-lg">Top Assister</div>
                <div className="text-sm text-gray-300">Most assists this season</div>
              </div>
            </div>
          </motion.div>
          <motion.div
            whileTap={{ scale: 0.98 }}
            className="bg-gray-700 rounded-2xl p-5 text-white shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <div className="font-semibold text-lg">Perfect Attendance</div>
                <div className="text-sm text-gray-300">Played all matches</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}