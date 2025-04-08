import Card from "./Card";
import ChallengeCard from "./ChallengeCard";
import { useSelector } from "react-redux";

interface ChallengeCardProps {
  id: any;
  Game: {
    gameName: any;
    id: any;
  };
  requirements: any;
  startTime: any;
  endTime: any;
  type: any;
  name: any;
  reward: number;
}

interface ChallengeCardsProps {
  cards: ChallengeCardProps[];
}

export default function ChallengeCards() {
  const { challenges } = useSelector(
    (state: { background: { challenges: ChallengeCardProps[] } }) =>
      state.background
  );
  return (
    <div className="flex overflow-x-auto ml-2 mr-20 gap-6 pb-4">
      {challenges.slice(0, 10).map((card: ChallengeCardProps, i: number) => (
        <ChallengeCard
          key={i}
          name={card.name}
          game={card.Game.gameName}
          reward={`${card.reward}`}
          gameId={card.Game.id}
        />
      ))}
    </div>
  );
}
