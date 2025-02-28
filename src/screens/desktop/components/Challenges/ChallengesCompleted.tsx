import React, { useEffect, useState } from "react";
import Progressbar from "./components/ChallengeLeft/Progressbar";
import { useFilterContext } from "../Contexts/FilterContext";
import { useSelector } from "react-redux";
import { overwolfHttpRequest } from "utils/overwolfHttpRequest";

export const ChallengeCompletedCard = ({
  className,
  challengeId,
}: {
  className?: string;
  challengeId: string;
}) => {
  const [challenge, setChallenge] = useState<any>();
  const { userId, gameId } = useSelector((state: any) => state.background);

  useEffect(() => {
    const fetchData = async (challengeId: string) => {
      try {
        // const jsonData = await overwolfHttpRequest(
        //   `${process.env.REACT_APP_LOCAL_URL}`,
        //   "GET",
        //   {
        //     externalUrl: `${process.env.REACT_APP_BACKEND_URL}/challenges/completed-challenges/${gameId}/${userId}`,
        //   }
        // );
        const jsonData = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/challenges/completed-challenges/${gameId}/${userId}`,
          { method: "GET" }
        ).then((res) => res.json());

        console.log(jsonData);
        setChallenge(jsonData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData(challengeId);
  }, [challengeId]);
  return (
    <div className="flex px-5 py-2 bg-[#1C1C1C] w-[80%]">
      <div className={`bg-black ${className} my-2 flex flex-col`}>
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
      </div>
      <div className="p-6 w-full">
        <h2 className="my-2">{challenge.name}</h2>
        <Progressbar completed={Math.floor(Math.random() * 100)} total={100} />
        <div className="flex flex-col gap-1 my-2">
          <p>Earned</p>
          <div className="flex gap-2">
            <img alt="coin" src="icons/coin.svg" />
            {Math.floor(Math.random() * 100)}
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
  const [challenges, setChallenges] = useState<any>();
  const { userId } = useSelector((state: any) => state.background);
  const { gameId } = useFilterContext();

  useEffect(() => {
    const fetchData = async (gameId: string) => {
      try {
        console.log(`gameId ${gameId} ${userId}`);
        // const jsonData = await overwolfHttpRequest(
        //   `${process.env.REACT_APP_LOCAL_URL}`,
        //   "GET",
        //   {
        //     externalUrl: `${process.env.REACT_APP_BACKEND_URL}/challenges/completed-challenges/${gameId}/${userId}`,
        //   }
        // );
        const jsonData = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/challenges/completed-challenges/${gameId}/${userId}`,
          { method: "GET" }
        ).then((res) => res.json());

        console.log(jsonData);
        setChallenges(jsonData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData(gameId);
  }, [gameId, userId]);

  return (
    <div className="col-start-1 flex gap-8 my-5 flex-col col-end-3">
      {challenges &&
        challenges.forEach((challenge: any) => {
          return <ChallengeCompletedCard challengeId={challenge.challengeId} />;
        })}
    </div>
  );
}
