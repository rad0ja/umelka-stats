type StatCardProps = {
  value: string;
  label: string;
  valueClassName?: string;
  className?: string;
};

function StatCard({ value, label, valueClassName = "", className = "" }: StatCardProps) {
  return (
    <div className={`bg-white shadow-md rounded-2xl p-4 text-center ${className}`}>
      <h3 className={`text-lg sm:text-xl font-bold ${valueClassName}`}>{value}</h3>
      <p className="text-gray-600 text-xs sm:text-sm">{label}</p>
    </div>
  );
}

export default function StatsGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mt-10 d-lg-flex">
          <StatCard value="56" label="Fouls" />
          <StatCard value="5" label="Yellow Cards" valueClassName="text-yellow-500" />
          <StatCard value="0" label="Red Cards" valueClassName="text-red-500" />
          <StatCard value="0" label="🥅 Red Cards" valueClassName="text-red-500" />
          <StatCard value="0" label="Red Cards" valueClassName="text-red-500" />
    </div>
  );
}
