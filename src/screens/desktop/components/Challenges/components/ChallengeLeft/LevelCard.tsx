interface LevelCardProps {
  className?: string;
  level: number;
  challengeCount: number;
  totalReward?: number;
  showReward?: boolean;
  isLocked?: boolean;
}

export default function LevelCard({
  className,
  level,
  challengeCount,
  totalReward,
  showReward = false,
  isLocked = false,
}: LevelCardProps) {
  return (
    <div
      className={`bg-[#282828] ${className} my-2 flex flex-col ${isLocked ? "opacity-70" : ""}`}
    >
      <div className="relative pt-[56.25%]">
        <img
          alt=""
          className="absolute top-0 left-0 w-full h-full object-cover p-[0.1rem] text-white"
          src={`/images/level.png`}
        />
        {isLocked && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <img alt="locked" className="w-8 h-8" src="/images/lock.png" />
          </div>
        )}
      </div>
      <div className="h-[50px] flex items-center justify-center">
        <div className="flex flex-col items-center">
          <h1 className="font-Impact font-[400] leading-tight">
            Level {level}
          </h1>
          {isLocked ? (
            <p className="font-Inter text-xs text-[#9D9D9D] font-[400] leading-tight text-center px-2">
              Complete previous levels to unlock
            </p>
          ) : (
            <>
              <p className="font-Inter text-xs text-[#9D9D9D] font-[400] leading-tight">
                {challengeCount} Challenges
              </p>
              {showReward && totalReward && (
                <div className="flex items-center gap-1">
                  <img className="h-3" src="/icons/coin.svg" alt="coin" />
                  <span className="text-xs">{totalReward}</span>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
