'use client';

import { useState } from 'react';
import { Calendar, MapPin, Users, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Match {
  id: string;
  opponent: string;
  date: string;
  time: string;
  location: string;
  type: 'upcoming' | 'completed';
  result?: {
    ourScore: number;
    theirScore: number;
  };
  rsvp?: {
    going: string[];
    notGoing: string[];
  };
}

const mockMatches: Match[] = [
  {
    id: '1',
    opponent: 'Thunder FC',
    date: 'Jan 12, 2026',
    time: '6:00 PM',
    location: 'Central Park Field 3',
    type: 'upcoming',
    rsvp: {
      going: ['Marcus Silva', 'Jordan Lee', 'Sam Taylor', 'Jamie Chen'],
      notGoing: ['Alex Rodriguez'],
    },
  },
  {
    id: '2',
    opponent: 'Lightning United',
    date: 'Jan 5, 2026',
    time: '7:00 PM',
    location: 'Riverside Stadium',
    type: 'completed',
    result: {
      ourScore: 3,
      theirScore: 2,
    },
  },
  {
    id: '3',
    opponent: 'Storm Strikers',
    date: 'Dec 29, 2025',
    time: '5:30 PM',
    location: 'Central Park Field 1',
    type: 'completed',
    result: {
      ourScore: 4,
      theirScore: 1,
    },
  },
  {
    id: '4',
    opponent: 'Blaze FC',
    date: 'Dec 22, 2025',
    time: '6:00 PM',
    location: 'Victory Field',
    type: 'completed',
    result: {
      ourScore: 2,
      theirScore: 2,
    },
  },
];

export function Matches() {
  const [userRsvp, setUserRsvp] = useState<{ [key: string]: 'going' | 'not-going' | null }>({});
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null);

  const handleRsvp = (matchId: string, response: 'going' | 'not-going') => {
    setUserRsvp(prev => ({
      ...prev,
      [matchId]: prev[matchId] === response ? null : response,
    }));
  };

  const upcomingMatches = mockMatches.filter(m => m.type === 'upcoming');
  const completedMatches = mockMatches.filter(m => m.type === 'completed');

  return (
    <div className="h-full overflow-y-auto pb-24 bg-gray-50">
      {/* Header */}
      <div className="bg-white pt-14 pb-6 px-6">
        <h1 className="text-4xl font-bold mb-1">Matches</h1>
        <p className="text-gray-500">Schedule & Results</p>
      </div>

      {/* Upcoming Matches */}
      <div className="px-4 pt-6 pb-4">
        <h2 className="text-xl font-semibold mb-3 px-2">Upcoming</h2>
        <div className="space-y-3">
          {upcomingMatches.map((match, index) => (
            <motion.div
              key={match.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-3xl shadow-sm overflow-hidden"
            >
              <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="text-xl font-bold text-gray-900 mb-1">vs {match.opponent}</div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                      <Calendar className="w-4 h-4" />
                      {match.date} • {match.time}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <MapPin className="w-4 h-4" />
                      {match.location}
                    </div>
                  </div>
                  <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                    Upcoming
                  </div>
                </div>

                {/* RSVP Section */}
                <div className="border-t border-gray-100 pt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">
                      {match.rsvp ? match.rsvp.going.length + (userRsvp[match.id] === 'going' ? 1 : 0) : 0} Going
                    </span>
                  </div>

                  <div className="flex gap-3">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleRsvp(match.id, 'going')}
                      className={`flex-1 py-3 rounded-xl font-semibold transition-colors ${
                        userRsvp[match.id] === 'going'
                          ? 'bg-gray-900 text-white'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <Check className="w-5 h-5" />
                        I'm Going
                      </div>
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleRsvp(match.id, 'not-going')}
                      className={`flex-1 py-3 rounded-xl font-semibold transition-colors ${
                        userRsvp[match.id] === 'not-going'
                          ? 'bg-gray-400 text-white'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <X className="w-5 h-5" />
                        Can't Make It
                      </div>
                    </motion.button>
                  </div>

                  {/* Show who's going */}
                  {match.rsvp && match.rsvp.going.length > 0 && (
                    <motion.button
                      onClick={() => setSelectedMatch(selectedMatch === match.id ? null : match.id)}
                      className="w-full mt-3 text-sm text-gray-700 font-medium"
                    >
                      {selectedMatch === match.id ? 'Hide' : 'Show'} who's going
                    </motion.button>
                  )}

                  <AnimatePresence>
                    {selectedMatch === match.id && match.rsvp && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <div className="space-y-2">
                            {match.rsvp.going.map((player, i) => (
                              <div key={i} className="flex items-center gap-2 text-sm">
                                <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                                  <Check className="w-4 h-4 text-gray-700" />
                                </div>
                                <span className="text-gray-700">{player}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent Results */}
      <div className="px-4 pb-6">
        <h2 className="text-xl font-semibold mb-3 px-2">Recent Results</h2>
        <div className="space-y-3">
          {completedMatches.map((match, index) => {
            const won = match.result && match.result.ourScore > match.result.theirScore;
            const draw = match.result && match.result.ourScore === match.result.theirScore;
            
            return (
              <motion.div
                key={match.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-5 shadow-sm"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex-1">
                    <div className="text-lg font-bold text-gray-900 mb-1">vs {match.opponent}</div>
                    <div className="text-sm text-gray-500">{match.date}</div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    won ? 'bg-gray-900 text-white' : 
                    draw ? 'bg-gray-400 text-white' : 
                    'bg-gray-200 text-gray-700'
                  }`}>
                    {won ? 'Win' : draw ? 'Draw' : 'Loss'}
                  </div>
                </div>
                {match.result && (
                  <div className="flex items-center justify-center gap-6 py-4 bg-gray-50 rounded-xl">
                    <div className="text-center">
                      <div className="text-sm text-gray-500 mb-1">Us</div>
                      <div className="text-3xl font-bold text-gray-900">{match.result.ourScore}</div>
                    </div>
                    <div className="text-2xl font-bold text-gray-300">-</div>
                    <div className="text-center">
                      <div className="text-sm text-gray-500 mb-1">Them</div>
                      <div className="text-3xl font-bold text-gray-900">{match.result.theirScore}</div>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}