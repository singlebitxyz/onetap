import { useState } from "react";
import Filter from "../Filter";
import Col1 from "./components/Col1";
import GameCard from "./components/GameCard";
import ChallengesCompleted from "./ChallengesCompleted";

type ChallengesProps = {
  className: string;
};
export default function Challenges({ className }: ChallengesProps) {
  const [onGoing, setOnGoing] = useState<boolean>(true);
  return (
    <div className={`${className} mt-5 grid grid-cols-1`}>
      <div className="col-start-1 col-end-3">
        <div className="flex gap-10">
          <h1
            onClick={() => setOnGoing(true)}
            className={`text-2xl ${onGoing ? "text-white" : "text-[#747474]"} cursor-pointer font-Impact`}
          >
            Ongoing Challenges
          </h1>
          <h1
            onClick={() => setOnGoing(false)}
            className={`text-2xl ${!onGoing ? "text-white" : "text-[#747474]"} cursor-pointer font-Impact`}
          >
            Completed Challenges
          </h1>
        </div>
      </div>
      {onGoing ? <Col1 /> : <ChallengesCompleted />}
      {/* <Filter>
        <GameCard id={"1"} img_src="dota2" className="w-36"/>
        <GameCard id={"2"} img_src="valorant" className="w-36"/>
        <GameCard id={"3"} img_src="cod_warzone" className="w-36"/>
        <GameCard id={"4"} img_src="pubg" className="w-36"/>
        <GameCard id={"5"} img_src="fallguys" className="w-36"/>
        <GameCard id={"6"} img_src="fortnite" className="w-36"/>
        <GameCard id={"7"} img_src="hearthstone" className="w-36"/>
      </Filter> */}
    </div>
  );
}
