import { useEffect, useState } from "react";
import Challenge from "./Challenge";
import LevelCard from "./LevelCard";
import Progress from "./Progress";
import { useFilterContext } from "screens/desktop/components/Contexts/FilterContext";
import { overwolfHttpRequest } from "utils/overwolfHttpRequest";

interface ChallengeData {
  id: number;
  requirements: Record<string, string>;
  startTime: string;
  endTime: string;
  type: string;
  name: string;
  Game: {
    gameName: string;
  };
}

interface Requirements {
  [key: string]: number | string | boolean;
}

export const ChallengesLeft = () => {
  const { gameId } = useFilterContext();
  const [challenges, setChallenges] = useState<Requirements>();

  useEffect(() => {
    // Use a proper URL and handle potential errors
    // overwolfHttpRequest(`${process.env.REACT_APP_LOCAL_URL}`, "GET", {
    //   externalUrl: `${process.env.REACT_APP_BACKEND_URL}/challenges/ongoing-challenges/${gameId}/`,
    // })
    //   .then((res: any) => {
    //     // setChallenges(aggregateRequirements(res));
    //   })
    //   .catch((error: any) => {
    //     console.error("Failed to fetch challenges:", error);
    //   });

    fetch(
      `${process.env.REACT_APP_BACKEND_URL}/challenges/ongoing-challenges/${gameId}/`,
      { method: "GET" }
    ).catch((error) => {
      console.error("Failed to fetch challenges:", error);
    });
  }, [gameId]);

  return (
    <div className="border-[1px] mt-2 border-[#BE9FFF33]">
      <div className="bg-[#1C1C1C] px-5 flex">
        <LevelCard />
        <Progress completed={30} total={40} />
      </div>
      <div className="bg-[#242424] p-5">
        <h1 className="font-Impact py-2">Challenges</h1>
        <div className="flex flex-col">
          <ul className="flex flex-col gap-5">
            {challenges &&
              Object.keys(challenges).map((key, index) => {
                return (
                  <Challenge
                    total={40}
                    completed={30}
                    name={key}
                    requirement={challenges[key]}
                    key={index}
                  />
                );
              })}
          </ul>
        </div>
      </div>
    </div>
  );
};
