import React, { useEffect, useState } from "react";
import Progressbar from "./components/ChallengeLeft/Progressbar";
import { useFilterContext } from "../Contexts/FilterContext";
import { useSelector } from "react-redux";
import { gameMapper } from "utils/gameMapper";
import { CompletedChallengeData } from "types";

export const ChallengeCompletedCard = ({
  className,
  challenge,
}: {
  className?: string;
  challenge: CompletedChallengeData;
}) => {
  return (
    <div className="flex px-5 py-2 rounded bg-[#1C1C1C] w-[30%]">
      {/* <div className={`bg-black ${className} my-2 flex flex-col`}>
        <img
          alt=""
          className="h-[88px] p-[0.1rem] text-white"
          src={`/images/level.png`}
        />
        <div className="h-[81px] flex items-center justify-center">
          <div className="flex flex-col items-center">
            <h1 className="font-Impact font-[400]">Level 1</h1>
            <p className="font-Inter text-xs text-[#9D9D9D] font-[400]">
              2 Challenges
            </p>
          </div>
        </div>
      </div> */}
      <div className="w-full">
        <img
          className="w-full"
          src={`/images/${gameMapper(challenge.gameId)}.png`}
          alt=""
        />
        <div className="p-3">
          <h2 className="my-2">{challenge.game_challenges.name}</h2>
          <Progressbar color="#83DD61" completed={100} total={100} />
          <div className="flex items-center gap-2 my-2">
            <img className="w-4" src="/images/green-tick.png" alt="" />
            <div className="font-bold text-[#83DD61]">Completed</div>
          </div>
          <div className="flex flex-col gap-1 my-2">
            <p className="text-[#4e4e4e]">Earned</p>
            <div className="flex gap-2">
              <img alt="coin" src="/icons/coin.svg" />
              {challenge.game_challenges.reward}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ChallengesCompleted({
  className,
}: {
  className?: string;
}) {
  const [challenges, setChallenges] = useState<CompletedChallengeData[]>([
    {
      challengeId: 0,
      gameId: 0,
      game_challenges: {
        name: "",
        reward: 0,
        id: 0,
        userId: 0,
      },
      Game: {
        gameName: "",
      },
    },
  ]);
  const { userId } = useSelector((state: any) => state.background);
  // const { gameId } = useFilterContext();
  const [gameId, setGameId] = useState(0);
  const [filteredChallenges, setFilteredChallenges] =
    useState<CompletedChallengeData[]>();

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    event.preventDefault();
    setGameId(Number(event.target.value));
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
        console.log(` ${userId}`);
        let jsonData;
        jsonData = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/challenges/all-completed-challenges/${userId}`,
          { method: "GET" }
        ).then((res) => res.json());
        console.log(jsonData);
        setChallenges(jsonData);
        setFilteredChallenges(jsonData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [userId]);

  useEffect(() => {
    if (gameId !== 0) {
      setFilteredChallenges(
        challenges.filter(
          (challenge) =>
            challenge.Game.gameName ===
            filterOptions[gameId as keyof typeof filterOptions]
        )
      );
    } else {
      setFilteredChallenges(challenges);
    }
  }, [gameId]);

  return (
    <div className="col-start-1 flex gap-8 my-5 flex-col col-end-3">
      <div>
        <p className="font-Impact text-2xl">Filter</p>
        <select
          className="focus:outline-none flex p-2 text-center bg-[#383838] text-[#C6C6C6] font-Poppins mt-2"
          onChange={handleFilterChange}
          value={gameId}
        >
          <option value={0}>No filter</option>
          {Object.entries(filterOptions).map(([key, value]) => (
            <option key={key} value={key}>
              {value}
            </option>
          ))}
        </select>
      </div>
      <div className="w-full flex items-center gap-4 flex-wrap">
        {filteredChallenges &&
          filteredChallenges.map((challenge: CompletedChallengeData) => {
            return <ChallengeCompletedCard challenge={challenge} />;
          })}
      </div>
    </div>
  );
}
