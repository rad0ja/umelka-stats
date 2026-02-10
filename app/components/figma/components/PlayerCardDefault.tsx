import React from 'react';

interface PlayerCardProps {
  playerName: string;
  jerseyNumber: number;
  teamCode: string;
  nationality: string;
  imageUrl?: string;
  backgroundColor?: string;
  teamLogoUrl?: string;
  nationalFlagUrl?: string;
}

const PlayerCardDefault: React.FC<PlayerCardProps> = ({
  playerName,
  jerseyNumber,
  teamCode,
  nationality,
  imageUrl,
  backgroundColor = '#1e4d7b',
  teamLogoUrl,
  nationalFlagUrl,
}) => {
  const [firstName, ...lastNameParts] = playerName.split(' ');
  const lastName = lastNameParts.join(' ');

  return (
    <div className="relative w-80 h-[250px] rounded-2xl overflow-hidden shadow-2xl">
      {/* Background with diagonal pattern */}
      <div 
        className="absolute inset-0"
        style={{ backgroundColor }}
      >
        {/* Diagonal stripes effect */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 35px,
              rgba(255,255,255,0.1) 35px,
              rgba(255,255,255,0.1) 70px
            )`
          }} />
        </div>
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col p-6">
        {/* Header with name and badges */}
        <div className="mb-4">
          <div className="text-white text-sm font-medium mb-1 opacity-90">
            {firstName}
          </div>
          <div className="text-white text-4xl font-bold mb-3">
            {lastName}
          </div>
          
          {/* Team and Country badges */}
          <div className="flex items-center gap-3">
            {/* Team badge */}
            <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm rounded-full px-2.5 py-1">
              {teamLogoUrl ? (
                <img src={teamLogoUrl} alt={teamCode} className="w-4 h-4" />
              ) : (
                <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                  <span className="text-[8px] font-bold" style={{ color: backgroundColor }}>
                    {teamCode[0]}
                  </span>
                </div>
              )}
              <span className="text-white text-xs font-semibold">{teamCode}</span>
            </div>

            {/* Country badge */}
            <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm rounded-full px-2.5 py-1">
              {nationalFlagUrl ? (
                <img src={nationalFlagUrl} alt={nationality} className="w-4 h-4 rounded-full" />
              ) : (
                <div className="w-4 h-4 bg-white rounded-full" />
              )}
              <span className="text-white text-xs font-semibold">{nationality}</span>
            </div>
          </div>
        </div>

        {/* Jersey number - positioned on left */}
        <div className="absolute left-6 top-48">
          <div className="text-white text-[120px] font-black leading-none" style={{
            WebkitTextStroke: '3px rgba(255,255,255,0.3)',
            paintOrder: 'stroke fill',
          }}>
            {jerseyNumber}
          </div>
        </div>

        {/* Player silhouette/image */}
        <div className="absolute right-0 bottom-0 w-64 h-96">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={playerName}
              className="w-full h-full object-cover object-top"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-t from-black/20 to-transparent flex items-center justify-center">
              <svg
                className="w-48 h-full opacity-30"
                viewBox="0 0 200 400"
                fill="currentColor"
              >
                <ellipse cx="100" cy="60" rx="35" ry="40" className="text-white" />
                <path
                  d="M 70 110 Q 60 120 65 180 L 65 320 Q 65 360 75 400 L 125 400 Q 135 360 135 320 L 135 180 Q 140 120 130 110 Q 100 90 70 110"
                  className="text-white"
                />
                <path
                  d="M 65 140 Q 40 150 30 200 L 35 220 Q 50 210 65 180"
                  className="text-white"
                />
                <path
                  d="M 135 140 Q 160 150 170 200 L 165 220 Q 150 210 135 180"
                  className="text-white"
                />
              </svg>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayerCardDefault;