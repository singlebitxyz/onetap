import { Stats } from "./Stats";
import { useData } from "../hooks/useData";
import "./styles/Overview.css";
import { useSelector } from "react-redux";
import { RootReducer } from "app/shared/rootReducer";
import { useEffect } from "react";
import fetchApi from "utils/api";

export const Overview = ({ className }: { className: string }) => {
  const { userId, gameId } = useSelector((state: any) => state.background);
  const { events, infos } = useData();
  const gameData = useSelector(
    (state: RootReducer) => state.background.gameData
  );
  const flag = useSelector((state: RootReducer) => state.background.flag);

  useEffect(() => {
    if (flag) {
      console.log(`${flag} hey flag is working`);
      fetchApi(
        `${process.env.REACT_APP_BACKEND_URL}/challenges/update-completed-challenges`,
        {
          method: "POST",
          body: JSON.stringify({
            userId: userId,
            gameId: gameId,
            gameData: gameData,
          }),
        }
      )
        .then((data) => {
          console.log(data);
        })
        .catch((error) => {
          console.error("There was an error posting the data:", error);
        });
    }
  }, [gameData, flag]);

  return (
    <div className={`overview ${className}`}>
      <Stats label={events.label} value={events.quantity} />
      <Stats label={infos.label} value={infos.quantity} />
    </div>
  );
};
