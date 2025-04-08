import { supabase } from "app";
import {
  DISPLAY_OVERWOLF_HOOKS_LOGS,
  WINDOW_NAMES,
} from "app/shared/constants";
import { useWindow } from "overwolf-hooks";
import { useEffect } from "react";

export const useDesktopHooks = () => {
  const [login] = useWindow(WINDOW_NAMES.LOGIN, DISPLAY_OVERWOLF_HOOKS_LOGS);
  const [desktop] = useWindow(
    WINDOW_NAMES.DESKTOP,
    DISPLAY_OVERWOLF_HOOKS_LOGS
  );
  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        console.log("No session, redirecting to login");

        // Ensure window functions are available before calling them
        if (login && typeof login.restore === "function") {
          try {
            login.restore()();
          } catch (error) {
            console.error("Error restoring login window:", error);
          }
        }

        if (desktop && typeof desktop.minimize === "function") {
          try {
            desktop.minimize()();
          } catch (error) {
            console.error("Error minimizing desktop window:", error);
          }
        }
      }
    });
  }, [login, desktop]);
};
