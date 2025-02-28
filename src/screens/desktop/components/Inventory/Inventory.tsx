import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setInventoryOpen } from "screens/desktop/stores/desktop";
import { CoinsEarned, CoinsSpend, Data } from "./types";
import { overwolfHttpRequest } from "utils/overwolfHttpRequest";

type InventoryProps = {
  className?: string;
};

export const EarntItem = ({
  game_name,
  amount,
  src_img,
}: {
  game_name: string;
  amount: number;
  src_img: string;
}) => {
  return (
    <div className="flex justify-between w-full px-5 py-3">
      <div className="flex tracking-wider font-Impact gap-2 items-center">
        {/* <img className="rounded" src={`/images/${src_img}.png`} alt="" /> */}
        <img className="rounded" src={`/images/dota.png`} alt="" />
        <p>{game_name}</p>
      </div>
      <div className="flex font-Impact tracking-wider items-center gap-2">
        <img src="/icons/coin.svg" alt="" />
        <p>{amount.toString()}</p>
      </div>
    </div>
  );
};

export const SpentItem = ({
  game_name,
  price = "100",
  amount_currency,
  className,
}: {
  game_name?: string;
  price?: string;
  amount_currency?: string;
  className?: string;
}) => {
  return (
    <div className={`${className} h-48 bg-black rounded`}>
      <img className="rounded" src="/banners/pubg.png" alt="pubg" />
      <div className="py-2">
        <div className="mx-3">
          <h2 className="font-Impact">
            {game_name} {amount_currency}
          </h2>
          <div className="flex items-center gap-2">
            <img className="h-4" src="/icons/coin.svg" alt="coin" />
            <p>{price}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const EarntSection = ({
  inventoryOpen,
  data,
}: {
  inventoryOpen: number;
  data?: CoinsEarned[];
}) => {
  return (
    <div className={`${inventoryOpen !== 3 ? "flex flex-col" : "hidden"}`}>
      <div className="flex flex-col w-full overflow-y-scroll scrollbar">
        {data &&
          data.map((item) => {
            return (
              <EarntItem
                src_img={item.Game.gameImage as string}
                game_name={item.Game.gameName}
                key={item.id}
                amount={item.gameBalance}
              />
            );
          })}
      </div>
      <div>
        <p className="font-Impact">Get More Coins</p>
        <div className="flex flex-row overflow-scroll-x"></div>
      </div>
    </div>
  );
};

export const SpentSection = ({
  inventoryOpen,
  data,
}: {
  inventoryOpen: number;
  data?: CoinsSpend[];
}) => {
  return (
    <div className={`${inventoryOpen === 3 ? "flex" : "hidden"}`}>
      <div className="flex flex-row px-1 h-[47dvh] gap-2 flex-wrap overflow-y-scroll scrollbar">
        {data &&
          data.map((item) => {
            return (
              <SpentItem
                price={item.coinsSpend.toString()}
                game_name={item.Game.gameName}
                amount_currency={item.coinsSpend.toString()}
                className="w-44"
              />
            );
          })}
      </div>
    </div>
  );
};

export default function Inventory({ className }: InventoryProps) {
  const [data, setData] = useState<Data>();
  const dispatch = useDispatch();
  const { inventoryOpen } = useSelector((state: any) => state.desktop);
  const { userId } = useSelector((state: any) => state.background);
  const handleClick = (num: number) => {
    dispatch(setInventoryOpen(num));
  };

  console.log(data?.coinsEarned);

  useEffect(() => {
    async function getData() {
      try {
        // const data = await overwolfHttpRequest(
        //   `${process.env.REACT_APP_LOCAL_URL}`,
        //   "GET",
        //   {
        //     externalUrl: `${process.env.REACT_APP_BACKEND_URL}/inventory/get-all-user-info/${userId}`,
        //   }
        // );
        const data = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/inventory/get-all-user-info/${userId}`,
          { method: "GET" }
        ).then((res) => res.json());
        setData(data);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    }

    if (inventoryOpen === 1 && userId) getData();
  }, [inventoryOpen]);

  return (
    <div
      className={`${className} bg-[#262525] w-96 h-[80dvh] right-0 top-24 z-50 rounded absolute ${inventoryOpen !== 4 ? "block" : "hidden"}`}
    >
      <img className="rounded-t" src="images/inventory_bg.png" alt="" />
      <div className="flex cursor-pointer items-center gap-1 font-Impact">
        <div
          onClick={() => handleClick(2)}
          className="mt-5 w-full text-center bg-clip-text text-transparent bg-gradient-to-r from-[#9B6CFF] to-[#DBBBFF]"
        >
          <p
            className={`bg-clip-text ${inventoryOpen !== 3 ? "bg-gradient-to-r from-[#9B6CFF] to-[#DBBBFF]" : "bg-white"}`}
          >
            Coins Earned
          </p>
          <hr
            className={`border-0 my-2.5 h-[2px] ${inventoryOpen !== 3 ? "bg-gradient-to-r from-[#9B6CFF] to-[#DBBBFF]" : "bg-white"}`}
          />
        </div>
        <div
          onClick={() => {
            handleClick(3);
          }}
          className="mt-5 w-full text-center bg-clip-text text-transparent bg-gradient-to-r from-[#9B6CFF] to-[#DBBBFF]"
        >
          <p
            className={`bg-clip-text ${inventoryOpen === 3 ? "bg-gradient-to-r from-[#9B6CFF] to-[#DBBBFF]" : "bg-white"}`}
          >
            Coins Spent
          </p>
          <hr
            className={`border-0 my-2.5 h-[2px] ${inventoryOpen === 3 ? "bg-gradient-to-r from-[#9B6CFF] to-[#DBBBFF]" : "bg-white"}`}
          />
        </div>
      </div>
      <EarntSection data={data?.coinsEarned} inventoryOpen={inventoryOpen} />
      <SpentSection data={data?.coinsSpend} inventoryOpen={inventoryOpen} />
    </div>
  );
}
