import { AuthError, Provider } from "@supabase/supabase-js";
import { supabase } from "app";
import {
  DISPLAY_OVERWOLF_HOOKS_LOGS,
  TokenDetails,
  WINDOW_NAMES,
} from "app/shared/constants";
import { useWindow } from "overwolf-hooks";
import { ConsoleAuthError } from "../app/shared/Errors.utils";
import React from "react";

function useSupLogin() {
  const [desktop] = useWindow(
    WINDOW_NAMES.DESKTOP,
    DISPLAY_OVERWOLF_HOOKS_LOGS
  );
  const [login] = useWindow(WINDOW_NAMES.LOGIN, DISPLAY_OVERWOLF_HOOKS_LOGS);

  React.useEffect(() => {
    console.info("Setting up auth state listener in useSupLogin");
    console.info("Initial window states:", {
      desktop: desktop ? "available" : "not available",
      login: login ? "available" : "not available",
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.info("=== Auth State Change Event ===");
      console.info(`Event type: ${event}`);
      console.info(`Session exists: ${!!session}`);
      console.info(`Access token exists: ${!!session?.access_token}`);
      console.info(`Login window exists: ${!!login}`);
      console.info(`Desktop window exists: ${!!desktop}`);

      if (event === "SIGNED_IN" && session?.access_token) {
        console.info("=== Successful Sign In Detected ===");
        getUserInfo();

        // First restore desktop window, then close login window
        if (desktop && typeof desktop.maximize === "function") {
          console.info("Attempting to maximize desktop window...");
          try {
            desktop.maximize()();
            console.info(
              "Desktop window maximize command executed successfully"
            );
          } catch (error) {
            console.error("Error maximizing desktop window:", error);
          }
        } else {
          console.warn(
            "Desktop window reference not found or maximize not available"
          );
        }

        // Small delay to ensure desktop window is restored first
        setTimeout(() => {
          if (login && typeof login.close === "function") {
            console.info("Attempting to close login window...");
            try {
              login.close()();
              console.info("Login window close command executed successfully");
            } catch (error) {
              console.error("Error closing login window:", error);
            }
          } else {
            console.warn(
              "Login window reference not found or close not available"
            );
          }
        }, 500);
      }
    });

    return () => {
      console.info("Cleaning up auth state listener");
      subscription.unsubscribe();
    };
  }, [desktop, login]);
}

async function checkSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    ConsoleAuthError(error);
    return null;
  } else return data.session;
}

async function getUserInfo() {
  const user = await supabase.auth.getUser();
  console.info(`user ${user.data.user?.id}`);
}

async function logOut() {
  await supabase.auth.signOut();
}

async function signUp(
  email: string,
  password: string
): Promise<AuthError | undefined> {
  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
  });
  if (error) {
    console.log(data, error);
    return error;
  }
}

async function loginEP(
  email?: string,
  password?: string
): Promise<AuthError | undefined> {
  const { data } = await supabase.auth.getSession();
  if (data.session) {
    return;
  } else {
    if (email && password) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      console.log("Logged in user", data);

      if (error) {
        return error;
      }
    }
  }
}

async function setSess(access_token: string, refresh_token: string) {
  console.info("Setting session with tokens...");
  try {
    const { data, error } = await supabase.auth.setSession({
      access_token: access_token,
      refresh_token: refresh_token,
    });

    if (error) {
      console.error("Error setting session:", error);
      throw error;
    }

    console.info("Session set successfully:", data.session);
    return data.session;
  } catch (error) {
    console.error("Failed to set session:", error);
    throw error;
  }
}

function parseToken(e: overwolf.extensions.AppLaunchTriggeredEvent): void {
  if (!e || e.origin.includes("gamelaunchevent")) {
    return;
  }

  console.info("Processing token extraction...");
  console.info(`Extracting details from: ${decodeURIComponent(e.parameter)}`);

  const fullUrl: string = decodeURIComponent(e.parameter);

  // Extract the fragment part after '#'
  try {
    const fragment: string | undefined = fullUrl.split("#")[1];
    if (fragment) {
      const params: URLSearchParams = new URLSearchParams(fragment);
      const details: TokenDetails = {};

      params.forEach((value, key) => {
        details[key] = value;
      });

      const access_token = details.access_token;
      const refresh_token = details.refresh_token;

      // Check and log the extracted details
      if (access_token) {
        console.info("Access token extracted successfully");
        if (refresh_token) {
          console.info("Refresh token found, setting session...");
          setSess(access_token, refresh_token)
            .then(() => {
              console.info("Session set successfully");
              // No need to create a new auth listener here
              // The useSupLogin hook will handle the auth state change
            })
            .catch((error) => {
              console.error("Error setting session:", error);
            });
        } else {
          console.warn("No refresh token found in URL");
        }
      } else {
        throw new AuthError("Access token not found in URL.");
      }

      // Log other details
      console.info("Other details extracted from the URL:", details);
    } else {
      throw new AuthError("No fragment found in URL.");
    }
  } catch (error) {
    console.error("Error in parseToken:", error);
    ConsoleAuthError(error as AuthError);
  }
}

const UseloginProvider = (provider: Provider) => {
  const retFunction = async () => {
    console.info(`=== Initiating OAuth login with provider: ${provider} ===`);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider,
      });

      if (error) {
        console.error("OAuth login error:", error);
        ConsoleAuthError(error);
      } else {
        console.info("OAuth login initiated successfully");
      }
    } catch (error) {
      console.error("Unexpected error during OAuth login:", error);
      ConsoleAuthError(error as AuthError);
    }
  };
  return retFunction;
};

async function forgotPassword(email: string): Promise<Error | undefined> {
  const { error } = await supabase.auth.resetPasswordForEmail(email);
  console.info(`this is the ${error?.message}`);

  if (error) {
    ConsoleAuthError(error);
    return error;
  }
}

export {
  getUserInfo,
  useSupLogin,
  ConsoleAuthError,
  parseToken,
  setSess,
  checkSession,
};

export { loginEP, logOut, signUp, UseloginProvider, forgotPassword };
