import { useEffect, useState } from "react";
import Progressbar from "../Challenges/components/ChallengeLeft/Progressbar";
import GameCard from "../Challenges/components/GameCard";
import { useFilterContext } from "../Contexts/FilterContext";
import Filter from "../Filter";
import LeaderboardBanner from "./LeaderboardBanner";
import { useDispatch, useSelector } from "react-redux";
import { fetchLeaderboardData } from "screens/desktop/stores/desktop";
import { AppDispatch } from "app/shared/store";

export interface GameData {
  id: number;
  userName: string;
  lifetime_earnings: number;
  UserGame: Array<{
    Game: Array<{
      gameName: string;
    }>;
  }>;
  rank: number;
}

const ScoreBox = ({
  score,
  scoreText,
}: {
  score: number;
  scoreText: string;
}) => {
  return (
    <div className="flex w-28 flex-col items-center justify-center">
      <h2 className="font-Impact">{score}</h2>
      <h2 className="font-Poppins font-[700]">{scoreText}</h2>
    </div>
  );
};

const YourScoreBox = () => {
  const { userInfo } = useSelector((state: any) => state.background);

  // Calculate level based on lifetime earnings (600 coins per level)
  const level = Math.floor(userInfo.lifetime_earnings / 600) + 1;

  // Calculate total coins needed for next level
  const totalCoinsForNextLevel = 600 * level; // This is 600 * (current level)
  const currentCoins = userInfo.lifetime_earnings;

  // Get rank message based on user's rank
  const getRankMessage = () => {
    if (!userInfo.globalRanking) return "Complete challenges to get ranked!";
    return `You're at rank ${userInfo.globalRanking}!`;
  };

  return (
    <div className="border-onetapViolet bg-[#222222] border-[1px] relative flex flex-col pt-16 items-center grow mr-4">
      <div className="flex w-full justify-around flex-row">
        <ScoreBox score={userInfo.globalRanking || 0} scoreText="Your Rank" />
        <ScoreBox score={userInfo.lifetime_earnings || 0} scoreText="Coins" />
        <ScoreBox score={level} scoreText="Level" />
      </div>
      <div>
        <div className="flex items-center gap-2 w-80">
          <Progressbar
            completed={currentCoins}
            total={totalCoinsForNextLevel}
          />
          <div className="flex items-center gap-2">
            <img className="w-3 h-3" src="/icons/coin.svg" alt="" />
            <p className="text-sm mr-2">
              {currentCoins}/{totalCoinsForNextLevel}
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col p-3 font-Inter justify-center">
        <h1>{getRankMessage()}</h1>
        <p className="text-sm text-[#9D9D9D]">
          {totalCoinsForNextLevel - currentCoins} coins away from reaching level{" "}
          {level + 1}.
        </p>
      </div>
      <div className="absolute bg-gradient-to-r py-2 px-3 font-Poppins from-[#7A43F0] to-[#C38CFF] top-0 right-0">
        YOUR SCORE
      </div>
    </div>
  );
};

const Record = ({
  rank,
  level,
  isFirst,
  name,
  coins,
}: {
  rank: number;
  level: number;
  isFirst?: boolean;
  name: string;
  coins: number;
}) => {
  return (
    <div className="w-full p-4 bg-gradient-to-t from-[#7A43F0] to-[#C38CFF] flex items-center justify-between font-Impact">
      <h2>{rank}</h2>
      <div className="flex items-center">
        <img
          className={`w-8 ${isFirst ? "" : "invisible"} h-8`}
          src="/images/leaderboard_trophy.png"
          alt=""
        />
        <h2>{name}</h2>
      </div>
      <div className="flex items-center gap-2">
        <img src="/icons/coin.svg" alt="" />
        <h2>{coins}</h2>
      </div>
      <h2>Level {level}</h2>
    </div>
  );
};

export default function Leaderboard({ className }: { className: string }) {
  // const { gameId } = useFilterContext();

  const [gameData, setGameData] = useState<GameData[] | null>();
  const dispatch = useDispatch<AppDispatch>();
  const [filter, setFilter] = useState<number>(0); // Local state for filter

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    event.preventDefault();
    setFilter(Number(event.target.value));
  };

  const filterOptions = {
    1: "Dota 2",
    2: "Valorant",
    3: "COD Warzone",
    4: "PUBG",
    5: "Fall Guys",
    6: "Fortnite",
    7: "Hearthstone",
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // dispatch(fetchLeaderboardData(filter as unknown as string));
        console.log(filter);
        try {
          let jsonData;
          if (filter !== 0) {
            jsonData = await fetch(
              `${process.env.REACT_APP_BACKEND_URL}/leaderboard/game-specific/${filter}`,
              { method: "GET" }
            ).then((res) => res.json());
          } else {
            jsonData = await fetch(
              `${process.env.REACT_APP_BACKEND_URL}/leaderboard/all-data`,
              { method: "GET" }
            ).then((res) => res.json());
          }
          setGameData(jsonData);
          console.log(jsonData);
        } catch (error) {
          console.error("Failed to fetch data:", error);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [filter]);

  return (
    <>
      <div className={`${className}`}>
        <select
          className="focus:outline-none flex p-2 text-center bg-[#383838] text-[#C6C6C6] font-Poppins mt-2"
          onChange={handleFilterChange}
          value={filter}
        >
          <option value={0}>No filter</option>
          {Object.entries(filterOptions).map(([key, value]) => (
            <option key={key} value={key}>
              {value}
            </option>
          ))}
        </select>
        <div className={`mt-10 flex gap-10`}>
          <LeaderboardBanner topPlayer={gameData ? gameData[0] : null} />
          <YourScoreBox />
        </div>
        <div className="mt-8 flex gap-10 flex-row">
          <div className="rounded-lg w-full">
            <h1 className="text-2xl font-Impact">Ranking</h1>
            <div className="flex mt-4 py-8 flex-col bg-gradient-to-t gap-4  border-onetapViolet">
              {gameData &&
                gameData.map((game: GameData, index: number) => (
                  <Record
                    key={game.id}
                    level={1}
                    isFirst={index + 1 === 1}
                    rank={game.rank}
                    name={game.userName}
                    coins={game.lifetime_earnings}
                  />
                ))}
            </div>
          </div>
          {/* <Filter className="w-[48dvw]">
            <GameCard id={"1"} img_src="dota2" className="w-40" />
            <GameCard id={"2"} img_src="valorant" className="w-40" />
            <GameCard id={"3"} img_src="cod_warzone" className="w-40" />
            <GameCard id={"4"} img_src="pubg" className="w-40" />
            <GameCard id={"5"} img_src="fallguys" className="w-40" />
            <GameCard id={"6"} img_src="fortnite" className="w-40" />
           <GameCard id={"7"} img_src="hearthstone" className="w-40"/> 
            <GameCard img_src="overwatch" id="8" className="w-40" />
            <GameCard img_src="ll" id="9" className="w-40" />
            <GameCard img_src="pubg" id="10" className="w-40" />
          </Filter> */}
        </div>
      </div>
    </>
  );
}
