import Button from "components/Button/Button";
import { gameMapper } from "utils/gameMapper";

type ChallengeCardProps = {
  name: string;
  game: string;
  reward: string;
  gameId: number;
};

export default function ChallengeCard({
  name,
  game,
  reward,
  gameId,
}: ChallengeCardProps) {
  return (
    <div className="bg-[#222222] rounded min-w-[16rem] w-[16rem] flex-shrink-0">
      <img
        className="rounded w-full h-[140px] object-cover"
        src={`/images/${gameMapper(gameId)}.png`}
        alt={game}
      />
      <div className="py-2">
        <h2 className="font-Impact mx-3 mt-1">{name}</h2>
        <div className="mx-3">
          <h2 className="font-Poppins font-bold">{game}</h2>
          <p className="font-Poppins font-normal">Reward: {reward}</p>
        </div>
        {/* <div className="flex justify-center">
          <Button className="py-1.5 mt-1.5 mb-2.5 mx-2 px-20">
            View Challenge
          </Button>
        </div> */}
      </div>
    </div>
  );
}
