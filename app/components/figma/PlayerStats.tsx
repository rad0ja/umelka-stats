import { Trophy, Target, Zap, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';

interface PlayerStat {
  id: string;
  name: string;
  position: string;
  goals: number;
  assists: number;
  matches: number;
  wins: number;
  avatar: string;
}

const mockPlayers: PlayerStat[] = [
  { id: '1', name: 'Marcus Silva', position: 'Forward', goals: 18, assists: 7, matches: 22, wins: 16, avatar: 'MS' },
  { id: '2', name: 'Jordan Lee', position: 'Midfielder', goals: 12, assists: 15, matches: 22, wins: 16, avatar: 'JL' },
  { id: '3', name: 'Alex Rodriguez', position: 'Defender', goals: 3, assists: 8, matches: 21, wins: 15, avatar: 'AR' },
  { id: '4', name: 'Sam Taylor', position: 'Forward', goals: 14, assists: 5, matches: 20, wins: 14, avatar: 'ST' },
  { id: '5', name: 'Jamie Chen', position: 'Midfielder', goals: 9, assists: 11, matches: 22, wins: 16, avatar: 'JC' },
  { id: '6', name: 'Chris Parker', position: 'Goalkeeper', goals: 0, assists: 2, matches: 22, wins: 16, avatar: 'CP' },
];

const StatCard = ({ icon: Icon, label, value, color }: { icon: any; label: string; value: string; color: string }) => (
  <motion.div
    whileTap={{ scale: 0.95 }}
    className={`flex-1 rounded-2xl p-4 ${color}`}
  >
    <Icon className="w-6 h-6 mb-2 text-gray-700" />
    <div className="text-2xl font-semibold mb-1 text-gray-900">{value}</div>
    <div className="text-sm text-gray-600">{label}</div>
  </motion.div>
);

export function PlayerStats() {
  const topScorer = mockPlayers.reduce((prev, current) => 
    prev.goals > current.goals ? prev : current
  );

  const totalGoals = mockPlayers.reduce((sum, player) => sum + player.goals, 0);
  const totalMatches = mockPlayers[0].matches;
  const winRate = Math.round((mockPlayers[0].wins / totalMatches) * 100);

  return (
    <div className="h-full overflow-y-auto pb-24 bg-gray-50">
      {/* Header */}
      <div className="bg-white pt-14 pb-6 px-6">
        <h1 className="text-4xl font-bold mb-1">Stats</h1>
        <p className="text-gray-500">Team Performance</p>
      </div>

      {/* Quick Stats */}
      <div className="px-4 pt-6 pb-4">
        <div className="flex gap-3">
          <StatCard icon={Trophy} label="Win Rate" value={`${winRate}%`} color="bg-white shadow-sm" />
          <StatCard icon={Target} label="Total Goals" value={totalGoals.toString()} color="bg-white shadow-sm" />
        </div>
      </div>

      {/* Top Scorer Highlight */}
      <div className="px-4 pb-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 rounded-3xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-400 mb-1">⚽ Top Scorer</div>
              <div className="text-2xl font-bold mb-1">{topScorer.name}</div>
              <div className="text-lg text-gray-300">{topScorer.goals} Goals</div>
            </div>
            <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-2xl font-bold">
              {topScorer.avatar}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Player Leaderboard */}
      <div className="px-4">
        <h2 className="text-xl font-semibold mb-3 px-2">Leaderboard</h2>
        <div className="space-y-3">
          {mockPlayers.map((player, index) => (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white rounded-2xl p-4 shadow-sm active:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4">
                <div className="text-2xl font-bold text-gray-300 w-8">
                  {index + 1}
                </div>
                <div className="w-12 h-12 rounded-full bg-gray-900 flex items-center justify-center text-white font-semibold">
                  {player.avatar}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">{player.name}</div>
                  <div className="text-sm text-gray-500">{player.position}</div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-4 text-sm">
                    <div>
                      <div className="font-semibold text-gray-900">{player.goals}</div>
                      <div className="text-xs text-gray-500">Goals</div>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{player.assists}</div>
                      <div className="text-xs text-gray-500">Assists</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}