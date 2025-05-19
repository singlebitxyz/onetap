import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { setInventoryOpen } from "screens/desktop/stores/desktop";
import { Inventory } from "screens/desktop/components/Inventory/Inventory";

export default function Header({ className }: { className: string }) {
  const { inventoryOpen } = useSelector((state: any) => state.desktop);
  const { userInfo } = useSelector((state: any) => state.background);
  const [balance, setBalance] = useState<number>(0);
  const coinButtonRef = useRef<HTMLImageElement>(null);

  const dispatch = useDispatch();

  const handleCoinClick = () => {
    dispatch(setInventoryOpen(inventoryOpen === 1 ? 0 : 1));
  };

  useEffect(() => {
    setBalance(userInfo.balance);
  }, [userInfo]);

  return (
    <>
      <div
        className={`${className} flex mt-7 justify-end items-center text-xl pe-5 h-11`}
      >
        <a href="https://onetap-two.vercel.app">
        <button className="font-Ranchers p-2 bg-gradient-to-r from-[#AB8E55] to-[#AE780F]">
          Upgrade to Premium
        </button>
        </a>
        <span className="flex cursor-pointer mx-5">
          <span className="flex items-center">
            <img
              ref={coinButtonRef}
              className="mx-1"
              src="/icons/coin.svg"
              alt=""
              onClick={handleCoinClick}
            />
            <span className="mx-1">{balance}</span>
          </span>
          <Link to={"/userProfile"}>
            <img className="mx-1" src="/icons/user.svg" alt="" />
          </Link>
        </span>
      </div>

      <Inventory
        anchorEl={inventoryOpen === 1 ? coinButtonRef.current : null}
      />
    </>
  );
}
