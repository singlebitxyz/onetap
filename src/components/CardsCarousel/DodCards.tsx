import DodCard from "./DodCard";
import { useSelector } from "react-redux";
import { CouponsCount } from "types";
import { gameMapper } from "utils/gameMapper";

export default function DodCards() {
  const { couponsCount } = useSelector(
    (state: { background: { couponsCount: CouponsCount[] } }) =>
      state.background
  );

  return (
    <div className="flex overflow-x-auto ml-2 mr-2 gap-4">
      {couponsCount.map((coupon, i) => (
        <DodCard
          key={i}
          game={gameMapper(coupon.game_id)}
          numberOfCoupons={coupon.count}
        />
      ))}
    </div>
  );
}
