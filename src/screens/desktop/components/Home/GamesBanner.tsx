import Button from "components/Button/Button";
import ListCompoenent from "components/Sidebar/ListCompoenent";

export default function GamesBanner() {
  return (
    <div className="grid ml-2 mr-20 grid-cols-2 border-[#B0B0B0B2] border-solid border-[1px] border-opacity-70 rounded-sm">
      <div className="bg-[#232120] px-5 grid grid-rows-9">
        <h1 className="text-2xl row-start-3">
          Earn coins and shop your favourite gaming items on discounted price
        </h1>
        <Button className="row-start-6 h-fit w-fit ">
          <ListCompoenent
            to="/marketplace"
            iconSrc="marketplace"
            className="px-8 font-Poppins font-bold"
          >
            Explore Now
          </ListCompoenent>
        </Button>
      </div>
      <div className="bg-games_banner bg-opacity-80 bg-left">
        {/* <img src="/banners/games_banner.png" className="bg-cover" alt="games"/> */}
      </div>
    </div>
  );
}
