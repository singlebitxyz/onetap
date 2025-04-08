import { GameData } from "./Leaderboard"; // Import GameData interface

export function LbBox({
  imgSrc,
  num,
  textSrc,
}: {
  imgSrc: string;
  num: number;
  textSrc: string;
}) {
  return (
    <div className="bg-[#3E3E3E]">
      <div className="flex justify-center items-center p-3 bg-gradient-to-r from-[#B38BF5] to-[#967ECA]">
        <img src={`/icons/${imgSrc}`} alt="" />
      </div>
      <div className="flex flex-col p-1 items-center">
        <h2 className="font-Impact mx-3 text-onetapViolet">{num}</h2>
        <h2 className="font-Impact mx-3">{textSrc}</h2>
      </div>
    </div>
  );
}

export default function LeaderboardBanner({
  topPlayer,
}: {
  topPlayer: GameData | null;
}) {
  if (!topPlayer) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex bg-[#211F1F] gap-3 border-[1px] rounded border-onetapViolet">
      <div className="relative shrink-0 w-72 h-64">
        <img
          className="absolute left-2 -top-12 h-72"
          src="/images/leaderboard_trophy.png"
          alt=""
        />
        <div className="absolute px-16 py-2 bg-gradient-to-r from-[#7A43F0] to-[#C38CFF] top-20 left-6">
          <h1 className="text-2xl font-Sansita">Leaderboard</h1>
        </div>
      </div>
      <div className="flex flex-col px-3 w-full justify-center items-center">
        <div className="flex font-Impact text-2xl flex-col items-center">
          <h2>{topPlayer.userName}</h2>
          <h2 className="text-onetapYellow">Challenge Conqueror</h2>
        </div>
        <div>
          <p className="font-Inter text-sm w-72">
            Celebrating {topPlayer.userName}'s Epic Challenge Victory
          </p>
        </div>
        <div className="flex gap-5 p-2 flex-row">
          <LbBox
            imgSrc="image 73.svg"
            num={topPlayer.rank || 1}
            textSrc="Rank"
          />
          <LbBox imgSrc="image 72.svg" num={1} textSrc="Level" />
          <LbBox
            imgSrc="image 72-1.svg"
            num={topPlayer.lifetime_earnings}
            textSrc="Coins"
          />
        </div>
      </div>
    </div>
  );
}
