import Col2 from "./Col2";
import { ChallengesLeft } from "./ChallengeLeft/ChallengesLeft";
import Banner from "components/Banner/Banner";
import Progressbar from "./ChallengeLeft/Progressbar";
import Button from "components/Button/Button";
import LevelCard from "./ChallengeLeft/LevelCard";
import DailyRewardCard from "./ChallengeLeft/DailyRewardCard";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootReducer } from "app/shared/rootReducer";
import { fetchLastRewardTimestamp } from "screens/background/stores/background";
import { AppDispatch } from "app/shared/store";
import { gameMapper } from "utils/gameMapper";

const DEFAULT_VALUES = {
  agent: "",
  deaths: 0,
  region: "",
  assists: 0,
  headshot: 0,
  game_mode: "",
  damage_done: 0,
  team_scores: 0,
  total_kills: 0,
  damage_taken: 0,
  match_status: false,
  spikes_defuse: 0,
  spikes_planted: 0,
};

interface ChallengeData {
  id: number;
  requirements: Record<string, string | number | boolean>;
  name: string;
  reward: number;
  Game: {
    gameName: string;
    id: number;
  };
}

function calculateProgress(
  requirement: Record<string, string | number | boolean>
) {
  // For kills, we want to cap at 2 (the target)
  const kills = (requirement.total_kills as number) || 0;
  return Math.min(kills, 2);
}

export default function Col1() {
  const dispatch = useDispatch<AppDispatch>();
  const { userInfo } = useSelector((state: RootReducer) => state.background);
  const [firstChallenge, setFirstChallenge] = useState<ChallengeData | null>(
    null
  );

  useEffect(() => {
    if (userInfo.id) {
      dispatch(fetchLastRewardTimestamp(userInfo.id));
    }
  }, [dispatch, userInfo.id]);

  useEffect(() => {
    const fetchFirstChallenge = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/challenges/all-ongoing-challenges`
        );
        const challenges = await response.json();
        if (challenges && challenges.length > 0) {
          setFirstChallenge(challenges[0]);
          console.log("First Challenge Data:", challenges[0]);
          console.log("Requirements:", challenges[0].requirements);
          console.log(
            "First Requirement:",
            Object.entries(challenges[0].requirements)[0]
          );
        }
      } catch (error) {
        console.error("Error fetching first challenge:", error);
      }
    };

    fetchFirstChallenge();
  }, []);

  const getRequirementValue = (
    requirements: Record<string, string | number | boolean>
  ) => {
    const relevantRequirement = Object.entries(requirements).find(
      ([key, value]) =>
        value !== DEFAULT_VALUES[key as keyof typeof DEFAULT_VALUES]
    );
    return relevantRequirement ? relevantRequirement[1] : 0;
  };

  return (
    <div className="col-start-1 col-end-3">
      <div className="flex gap-5">
        <ChallengesLeft />
        <Col2 />
      </div>
      <h1 className="text-2xl my-10 font-Impact">Daily Challenges</h1>
      {firstChallenge && (
        <div className="bg-[#1C1C1C] rounded mr-5 mb-10">
          <div className="grid grid-cols-2">
            <div className="col-span-1">
              <img
                className="w-full h-[300px] object-cover p-5"
                src={`/images/${gameMapper(firstChallenge.Game.id)}.png`}
                alt=""
              />
            </div>
            <div className="flex flex-col p-5 justify-center">
              <h1 className="text-2xl font-Impact">{firstChallenge.name}</h1>
              <p className="font-Inter text-[#9D9D9D] mt-2">
                Get {getRequirementValue(firstChallenge.requirements)} Kills
              </p>
              <div className="flex flex-col justify-center gap-1 mt-4">
                <div className="flex items-center gap-1">
                  <div className="w-56 h-2 bg-[#383838] rounded-full">
                    <div
                      className="h-full bg-[#692CCD] rounded-full"
                      style={{
                        width: `${(calculateProgress(firstChallenge.requirements) / 2) * 100}%`,
                      }}
                    />
                  </div>
                  <p className="text-[#692CCD] text-xs">
                    {calculateProgress(firstChallenge.requirements)}/2 Kills
                  </p>
                </div>

                <Button
                  className={`flex gap-1 w-72 items-center justify-center ${
                    calculateProgress(firstChallenge.requirements) >= 2
                      ? "opacity-50 pointer-events-none"
                      : ""
                  }`}
                >
                  {calculateProgress(firstChallenge.requirements) >= 2
                    ? "Collected"
                    : "Complete challenge to collect"}
                  <img className="w-4 h-4" src="/icons/coin.svg" alt="" />
                  {firstChallenge.reward}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div>
        <h1 className="text-2xl mb-5 font-Impact">Daily Rewards</h1>
        <div className="flex gap-2 flex-row overflow-x-scroll h-52">
          <DailyRewardCard day={1} className="w-40" />
          <DailyRewardCard day={2} className="w-40" />
          <DailyRewardCard day={3} className="w-40" />
          <DailyRewardCard day={4} className="w-40" />
          <DailyRewardCard day={5} className="w-40" />
        </div>
      </div>
    </div>
  );
}
