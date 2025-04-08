import {
  WINDOW_NAMES,
  RETRY_TIMES,
  DISPLAY_OVERWOLF_HOOKS_LOGS,
  REQUIRED_FEATURES,
} from "app/shared/constants";
import { useGameEventProvider, useWindow } from "overwolf-hooks";
import { useCallback, useEffect } from "react";
import { SUPPORTED_CLASS_IDS, getRunningGame } from "lib/games";
import { setInfo, setEvent, setGameId } from "../stores/background";
import store from "app/shared/store";
import { log } from "lib/log";
import { checkSession, parseToken } from "lib/auth.utils";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useFilterContext } from "screens/desktop/components/Contexts/FilterContext";

const { DESKTOP, INGAME, LOGIN } = WINDOW_NAMES;

const BackgroundWindow = () => {
  const [desktop] = useWindow(DESKTOP, DISPLAY_OVERWOLF_HOOKS_LOGS);
  const [ingame] = useWindow(INGAME, DISPLAY_OVERWOLF_HOOKS_LOGS);
  const [login] = useWindow(LOGIN, DISPLAY_OVERWOLF_HOOKS_LOGS);
  const { gameId } = useSelector((state: any) => state.background);
  const filterContext = useFilterContext();
  const dispatch = useDispatch();
  const required_features = REQUIRED_FEATURES[gameId];
  // log(
  //   "required features",
  //   "background screen",
  //   JSON.stringify(required_features)
  // );
  const { start, stop } = useGameEventProvider(
    {
      onInfoUpdates: (info: overwolf.games.events.InfoUpdates2Event) => {
        dispatch(setInfo({ ...info, timestamp: Date.now() }));
      },
      onNewEvents: (e: overwolf.games.events.NewGameEvents) => {
        dispatch(setEvent({ ...e, timestamp: Date.now() }));
      },
    },
    required_features,
    RETRY_TIMES,
    DISPLAY_OVERWOLF_HOOKS_LOGS
  );
  const startApp = useCallback(
    async (reason: string) => {
      // log(`Starting app. Reason: ${reason}`);
      //if the desktop or ingame window is not ready we don't want to start the app
      if (!desktop || !ingame || !login) {
        // log("Not all windows are ready. Aborting start.");
        return;
      }
      // log(reason, "src/screens/background/components/Screen.tsx", "startApp");
      if (await checkSession()) {
        const runningGame = await getRunningGame();
        // log(`Running game detected: ${JSON.stringify(runningGame)}`);
        if (runningGame) {
          // log(`Setting game ID: ${runningGame.classId}`);
          setGameId(runningGame.classId);
          // log(`Game ID set in store: ${store.getState().background.gameId}`);
          // log("Starting game event provider...");
          try {
            await Promise.all([
              start(),
              ingame?.restore(),
              desktop?.minimize(),
            ]);
            // log("Game event provider started and windows adjusted.");
          } catch (error) {
            // log(`Error starting game mode: ${error}`, "error");
          }
        } else {
          try {
            await Promise.all([stop(), desktop?.maximize()]);
            // log("Stopped game event provider and restored desktop window.");
          } catch (error) {
            // log(`Error stopping game mode: ${error}`, "error");
          }
        }
      } else {
        // log("Session check failed. Restoring login window.");
        login.restore();
        desktop.minimize();
      }
    },
    [desktop, login, ingame, start, stop]
  );

  useEffect(() => {
    // log(`Current game ID: ${gameId}`);
    // log(`Required features: ${JSON.stringify(REQUIRED_FEATURES[gameId])}`);
    filterContext.handleFilterChange(gameId);
  }, [gameId]);

  useEffect(() => {
    startApp("on initial load");
    overwolf.games.onGameInfoUpdated.addListener(async (event) => {
      // log(`Game info updated: ${JSON.stringify(event)}`);
      if (event.runningChanged && event.gameInfo) {
        const isSupportedGame = SUPPORTED_CLASS_IDS[event.gameInfo.classId];
        // log(`Is supported game: ${isSupportedGame}`);
        if (isSupportedGame) {
          startApp("onGameInfoUpdated");
        }
      }
    });

    overwolf.extensions.onAppLaunchTriggered.addListener((e) => {
      // log("App launch triggered");
      startApp("onAppLaunchTriggered");
      parseToken(e);
    });
    return () => {
      overwolf.games.onGameInfoUpdated.removeListener(() => {});
      overwolf.extensions.onAppLaunchTriggered.removeListener(() => {});
    };
  }, [startApp]);

  return null;
};

export default BackgroundWindow;
