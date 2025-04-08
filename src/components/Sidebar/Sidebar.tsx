import ListCompoenent from "./ListCompoenent";

export default function Sidebar({className}:{className:string}) {
  return (
    <div className={`${className} border-[#9D9D9D] h-[100dvh] z-50 border-r-[1px] w-52`}>
      <div className="flex py-0 mt-5">
        <span className="font-Ranchers mx-4 text-4xl">ONE TAP</span>
        <img src="/logo.png" className="w-10 h-10" alt="logo" />
      </div>
      <div className="flex py-0 mt-16 font-Impact flex-col justify-between mx-6">
        <ul className="flex my-0 py-0 flex-col">
          <ListCompoenent iconSrc="home" to="/">Home</ListCompoenent>
          <ListCompoenent iconSrc="challenges" to="/challenges">Challenges</ListCompoenent>
          <ListCompoenent iconSrc="marketplace"to="/marketplace">Marketplace</ListCompoenent>
          <ListCompoenent iconSrc="inventory" to="/inventory">Inventory</ListCompoenent>
          <ListCompoenent iconSrc="leaderboard" to="/leaderboard">Leaderboard</ListCompoenent>
          <ListCompoenent iconSrc="subscription" to="/subscription">Subscription</ListCompoenent>
        </ul>
      </div>
    </div>
  );
}
