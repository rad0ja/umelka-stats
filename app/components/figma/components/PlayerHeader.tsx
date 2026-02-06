const urlImg = 'https://images.unsplash.com/photo-1728577740843-5f29c7586afe?q=80&w=2680&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

export function PlayerHeader() {
  return (
    <div className="relative w-full max-w-md bg-gradient-to-b from-[#1a2847] to-[#0d1829] overflow-hidden p-6 pb-8">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-transparent pointer-events-none" />
      
      {/* Player Image */}
      <div className="absolute right-0 top-0 w-64 h-72 opacity-90">
        {/* <img 
          src={urlImg} 
          alt="Player" 
          className="w-full h-full object-cover object-top"
        /> */}
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {/* Jersey Number */}
        <div className="text-7xl font-bold text-white/30 stroke-white mb-2" style={{ WebkitTextStroke: '2px white' }}>
          8
        </div>
        
        {/* Player Name */}
        <div className="mb-2">
          <p className="text-white text-sm mb-1">Scott Francis</p>
          <h1 className="text-white text-3xl font-bold tracking-wide">MCTOMINAY</h1>
        </div>
        
        {/* Team and Country Badges */}
        <div className="flex gap-4 mb-8">
          <div className="flex items-center gap-2 bg-black/30 rounded-full px-3 py-1.5">
            <div className="w-6 h-6 bg-blue-300 rounded-full flex items-center justify-center">
              <span className="text-blue-900 font-bold text-xs">N</span>
            </div>
            <span className="text-white text-sm font-semibold">Napoli</span>
          </div>
          
          <div className="flex items-center gap-2 bg-black/30 rounded-full px-3 py-1.5">
            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M0 0 L16 8 L0 16 Z" fill="#0065BF"/>
                <path d="M0 0 L8 8 L0 16 Z" fill="white"/>
              </svg>
            </div>
            <span className="text-white text-sm font-semibold">Scotland</span>
          </div>
        </div>
        
        {/* Stats Card */}
        {/* <div className="bg-black/20 backdrop-blur-sm rounded-2xl border border-white/10 p-6 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-white/70 text-sm font-semibold tracking-wide">POSITION</span>
            <span className="text-white text-lg font-bold">MIDFIELDER</span>
          </div>
          
          <div className="h-px bg-white/10" />
          
          <div className="flex justify-between items-center">
            <span className="text-white/70 text-sm font-semibold tracking-wide">AGE</span>
            <span className="text-white text-lg font-bold">29 <span className="text-white/60 text-sm">(08/12/1996)</span></span>
          </div>
          
          <div className="h-px bg-white/10" />
          
          <div className="flex justify-between items-center">
            <span className="text-white/70 text-sm font-semibold tracking-wide">HEIGHT</span>
            <span className="text-white text-lg font-bold">193m</span>
          </div>
          
          <div className="h-px bg-white/10" />
          
          <div className="flex justify-between items-center">
            <span className="text-white/70 text-sm font-semibold tracking-wide">WEIGHT</span>
            <span className="text-white text-lg font-bold">88kg</span>
          </div>
        </div> */}
      </div>
    </div>
  );
}
