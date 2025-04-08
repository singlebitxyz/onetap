import Button from "components/Button/Button";

type DodCardProps = {
  game: string;
  numberOfCoupons: number;
};

export default function DodCard({ game, numberOfCoupons }: DodCardProps) {
  return (
    <div className="bg-[#222222] rounded min-w-[16rem] w-[16rem] flex-shrink-0">
      <div>
        <img
          className="rounded w-full"
          src={`/images/${game}.png`}
          alt={`${game}`}
        />
      </div>
      <div className="py-2">
        <h2 className="font-Impact mx-3 mt-1">{game}</h2>
        <div className="w-[15rem] mx-3">
          <h2 className="font-Poppins font-bold">Coupons: {numberOfCoupons}</h2>
        </div>
      </div>
    </div>
  );
}
