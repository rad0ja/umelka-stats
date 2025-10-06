import SeasonPicker from "@/app/components/SeasonPicker";

function CircleChart() {
  return (
    <div className="relative w-28 h-28 sm:w-32 sm:h-32">
      <svg className="w-full h-full" viewBox="0 0 36 36">
        <path
          className="text-blue-200 stroke-current"
          strokeWidth="3"
          fill="none"
          d="M18 2.0845
                   a 15.9155 15.9155 0 0 1 0 31.831
                   a 15.9155 15.9155 0 0 1 0 -31.831"
        />
        <path
          className="text-cyan-400 stroke-current"
          strokeWidth="3"
          strokeDasharray="25, 75"
          fill="none"
          d="M18 2.0845
                   a 15.9155 15.9155 0 0 1 0 31.831
                   a 15.9155 15.9155 0 0 1 0 -31.831"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg sm:text-xl font-bold">4</span>
      </div>
    </div>
  );
}

function StatsBreakdown() {
  return (
    <div className="flex items-center justify-center space-x-2">
      <div className="flex items-center justify-center space-x-2">
        <span className="w-3 h-3 bg-cyan-400 rounded-sm"></span>
        <span>Wins: 1</span>
        <span className="w-3 h-3 bg-blue-400 rounded-sm"></span>
        <span>Draws: 1</span>
        <span className="w-3 h-3 bg-blue-800 rounded-sm"></span>
        <span>Losses: 2</span>
      </div>
    </div>
  );
}

export default function StatsOverview() {
  return (
    <div className="px-4 sm:px-8 py-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-3 sm:space-y-0">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">STATISTICS</h2>
        <SeasonPicker />
      </div>
      <div className="flex flex-col sm:flex-row items-center sm:items-start sm:space-x-12 space-y-6 sm:space-y-0">
        <CircleChart />
        <StatsBreakdown />
      </div>
    </div>
  );
}
