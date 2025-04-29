import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import fetchApi from "utils/api";
import {
  BackgroundState,
  EventPayload,
  ChallengeData,
  CouponsCount,
  CouponData,
  StreakInfo,
} from "types";
import { gameDataUpdaters } from "./helperFunctions";
import { Timestamp, OwInfo } from "types";

// TODO:

const initialState: BackgroundState = {
  events: [],
  infos: [],
  gameId: 21640,
  gameData: {
    21640: {
      match_start: "2024-03-31T19:08:38.679Z",
      match_end: "2024-04-8T18:30:00.000Z",
      total_kills: 0,
      deaths: 0,
      assists: 0,
      headshot: 0,
      spikes_defuse: 0,
      spikes_planted: 0,
      damage_done: 0,
      team_scores: 0,
      agent: "",
      region: "",
      game_mode: "",
      damage_taken: 0,
      match_status: "false",
    },
    9898: {},
    7314: {},
  },
  player_name: "",
  userId: 1,
  recentlyCompletedChallenges: [],
  userInfo: {
    id: 0,
    userName: "",
    profilePicture: null,
    userCoustomeId: "",
    profileName: "",
    globalRanking: 0,
    balance: 0,
    Auth: "",
    level: 0,
    premiumUser: false,
  },
  flag: false,
  challenges: [] as ChallengeData[],
  couponsCount: [
    {
      game_id: 0,
      count: 0,
    },
  ],
  coupons: [] as CouponData[],
  dailyRewards: {
    lastRewardCollected: null as string | null,
    currentStreak: 0,
    rewards: [
      { day: 1, amount: 10, claimed: false },
      { day: 2, amount: 10, claimed: false },
      { day: 3, amount: 10, claimed: false },
      { day: 4, amount: 10, claimed: false },
      { day: 5, amount: 10, claimed: false },
    ],
  },
};

// export const fetchChallenges = createAsyncThunk(
//   "background/fetchChallenges",
//   async () => {
//     const response = await fetch(
//       `${process.env.REACT_APP_BACKEND_URL}/challenges/getAllChallenges`
//     );
//     const data = await response.json();
//     return data as ChallengeData[];
//   }
// );

export const fetchLastRewardTimestamp = createAsyncThunk(
  "background/fetchLastRewardTimestamp",
  async (userId: number) => {
    const response = await fetchApi(
      `${process.env.REACT_APP_BACKEND_URL}/user/last-reward/${userId}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch last reward timestamp");
    }
    const data = await response.json();
    return {
      lastRewardCollected: data.lastRewardTimestamp,
      currentStreak: data.currentStreak,
    };
  }
);

const backgroundSlice = createSlice({
  name: "backgroundScreen",
  initialState,
  reducers: {
    setEvent(state, action: EventPayload) {
      console.log("setEvent action received:", action.payload);
      state.events.push(action.payload);

      // Update game data based on events
      action.payload.events.forEach((event) => {
        switch (event.name) {
          case "match_start":
            state.gameData[state.gameId].match_start = new Date().toISOString();
            state.gameData[state.gameId].match_status = "true";
            break;
          case "match_end":
            if (state.gameData[state.gameId].match_status === "true") {
              state.gameData[state.gameId].match_end = new Date().toISOString();
              state.gameData[state.gameId].match_status = "false";
              console.log("match has ended");
              gameDataUpdaters(
                state.userId,
                state.gameId,
                state.gameData[state.gameId]
              );
            }
            break;
          // Add more cases for other event types
        }
      });
    },
    setInfo(state, action: PayloadAction<Timestamp & OwInfo>) {
      console.log("setInfo action received:", action.payload);
      state.infos.push(action.payload);
      if ("info" in action.payload && action.payload.info) {
        // This is an InfoUpdates2Event
        const info = action.payload.info;
        Object.entries(info).forEach(([category, categoryInfo]) => {
          if (typeof categoryInfo === "object" && categoryInfo !== null) {
            Object.entries(categoryInfo).forEach(([key, value]) => {
              if (typeof value === "string" && key.startsWith("scoreboard_")) {
                try {
                  const scorecard = JSON.parse(value);
                  if (scorecard.is_local) {
                    state.player_name = scorecard.name;
                    Object.entries(scorecard).forEach(
                      ([scorecardKey, scorecardValue]) => {
                        if (scorecardKey === "kills") {
                          (state.gameData[state.gameId] as any)["total_kills"] =
                            scorecardValue;
                        }
                        if (scorecardKey in state.gameData[state.gameId]) {
                          (state.gameData[state.gameId] as any)[scorecardKey] =
                            scorecardValue;
                        }
                      }
                    );
                  }
                } catch (error) {
                  console.error("Error parsing scoreboard data:", error);
                }
              } else if (typeof value === "object" && value !== null) {
                Object.entries(value).forEach(([subKey, subValue]) => {
                  if (
                    typeof subKey === "string" &&
                    subKey in state.gameData[state.gameId]
                  ) {
                    (state.gameData[state.gameId] as any)[subKey] = subValue;
                  }
                });
              } else if (
                typeof key === "string" &&
                key in state.gameData[state.gameId]
              ) {
                (state.gameData[state.gameId] as any)[key] = value;
              }
            });
          }
        });
      }
    },
    setRecentlyCompletedChallenges(
      state,
      action: PayloadAction<{ [key: string]: ChallengeData }>
    ) {
      console.log("setRecentlyCompletedChallenges:", action.payload);
      state.recentlyCompletedChallenges = action.payload;
    },
    setGameId(state, action: PayloadAction<number>) {
      console.log("setGameId:", action.payload);
      state.gameId = action.payload;
    },
    setUserId(state, action: PayloadAction<number>) {
      state.userId = action.payload;
    },
    setUserInfo(state, action: PayloadAction<any>) {
      state.userInfo = action.payload;
    },
    setAuth(state, action: PayloadAction<string>) {
      state.userInfo.Auth = action.payload;
    },
    setChallenges(state, action: PayloadAction<ChallengeData[]>) {
      state.challenges = action.payload;
    },
    setCouponsCount(state, action: PayloadAction<CouponsCount[]>) {
      state.couponsCount = action.payload;
    },
    setCoupons(state, action: PayloadAction<CouponData[]>) {
      console.log("Setting coupons in Redux store:", action.payload);

      // Process and validate coupon data before setting
      const validCoupons = action.payload.filter((coupon) => {
        // Skip coupons with null item_id
        if (!coupon || coupon.item_id === null) {
          console.log("Skipping coupon with null item_id in Redux:", coupon);
          return false;
        }

        // Parse extraDetails if it's a string
        if (typeof coupon.extraDetails === "string") {
          try {
            coupon.extraDetails = JSON.parse(coupon.extraDetails);
            console.log("Parsed extraDetails in Redux:", coupon.extraDetails);
          } catch (e) {
            console.error("Failed to parse extraDetails in Redux:", e);
            return false;
          }
        }

        // Check if the coupon has all required properties
        const isValid =
          typeof coupon.item_id !== "undefined" &&
          coupon.item_id !== null &&
          typeof coupon.extraDetails !== "undefined" &&
          coupon.extraDetails !== null;

        if (!isValid) {
          console.error("Invalid coupon data in Redux:", coupon);
        }

        return isValid;
      });

      console.log(
        `Setting ${validCoupons.length} valid coupons in Redux store`
      );
      state.coupons = validCoupons;
    },
    setDailyRewards(
      state,
      action: PayloadAction<{
        lastRewardCollected: string | null;
        currentStreak: number;
      }>
    ) {
      state.dailyRewards.lastRewardCollected =
        action.payload.lastRewardCollected;
      state.dailyRewards.currentStreak = action.payload.currentStreak;

      // Update claimed status for rewards based on current streak
      if (action.payload.currentStreak > 0) {
        state.dailyRewards.rewards.forEach((reward) => {
          reward.claimed = reward.day <= action.payload.currentStreak;
        });
      }
    },
    claimDailyReward(
      state,
      action: PayloadAction<{ day: number; currentStreak: number }>
    ) {
      const { day, currentStreak } = action.payload;
      console.log("🎯 claimDailyReward - Incoming payload:", {
        day,
        currentStreak,
      });
      console.log("🎯 Current state before claim:", {
        lastRewardCollected: state.dailyRewards.lastRewardCollected,
        currentStreak: state.dailyRewards.currentStreak,
        rewards: state.dailyRewards.rewards,
      });

      const reward = state.dailyRewards.rewards.find((r) => r.day === day);
      if (reward && !reward.claimed) {
        reward.claimed = true;
        state.dailyRewards.lastRewardCollected = new Date().toISOString();
        state.dailyRewards.currentStreak = currentStreak;
        state.userInfo.balance += reward.amount;

        console.log("🎯 State after claiming reward:", {
          lastRewardCollected: state.dailyRewards.lastRewardCollected,
          currentStreak: state.dailyRewards.currentStreak,
          rewards: state.dailyRewards.rewards,
        });
      }
    },
    redeemCoupon(
      state,
      action: PayloadAction<{
        itemId: number;
        points: number;
        instanceId?: number;
      }>
    ) {
      const { itemId, points, instanceId } = action.payload;
      console.log("Redeeming coupon in Redux store:", {
        itemId,
        points,
        instanceId,
      });

      // Find the coupon and update its available instances
      const couponIndex = state.coupons.findIndex((c) => c.item_id === itemId);
      if (couponIndex !== -1) {
        const coupon = state.coupons[couponIndex];
        console.log("Found coupon to redeem:", coupon);

        // Create a new coupon object with updated values
        const updatedCoupon = {
          ...coupon,
          available_instances: Math.max(0, coupon.available_instances - 1),
          marketplace_ids: instanceId
            ? coupon.marketplace_ids.filter((id) => id !== instanceId)
            : coupon.marketplace_ids,
        };

        // Update the coupon in the state
        state.coupons[couponIndex] = updatedCoupon;

        console.log("Updated coupon state:", updatedCoupon);
      } else {
        console.error("Could not find coupon with itemId:", itemId);
      }

      // Update user's balance, ensuring it doesn't go below 0
      const newBalance = Math.max(0, state.userInfo.balance - points);
      console.log(
        "Updating user balance:",
        state.userInfo.balance,
        "->",
        newBalance
      );
      state.userInfo.balance = newBalance;

      // Update the coupon count for the game
      const gameId = state.coupons.find((c) => c.item_id === itemId)?.gameId;
      if (gameId) {
        const countIndex = state.couponsCount.findIndex(
          (c) => c.game_id === gameId
        );
        if (countIndex !== -1) {
          state.couponsCount[countIndex] = {
            ...state.couponsCount[countIndex],
            count: Math.max(0, state.couponsCount[countIndex].count - 1),
          };
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLastRewardTimestamp.pending, (state) => {
        // You could add loading state here if needed
      })
      .addCase(fetchLastRewardTimestamp.fulfilled, (state, action) => {
        state.dailyRewards.lastRewardCollected =
          action.payload.lastRewardCollected;
        state.dailyRewards.currentStreak = action.payload.currentStreak;

        // Update claimed status for all rewards based on lastRewardCollected
        if (action.payload.lastRewardCollected) {
          const lastRewardDate = new Date(action.payload.lastRewardCollected);
          const today = new Date();

          // Update claimed status based on current streak
          state.dailyRewards.rewards.forEach((reward) => {
            reward.claimed = reward.day <= state.dailyRewards.currentStreak;
          });
        } else {
          // First time user - no rewards claimed yet
          state.dailyRewards.currentStreak = 0;
          state.dailyRewards.rewards.forEach((reward) => {
            reward.claimed = false;
          });
        }
      })
      .addCase(fetchLastRewardTimestamp.rejected, (state, action) => {
        console.error("Failed to fetch last reward timestamp:", action.error);
      });
  },
});

export const {
  setEvent,
  setInfo,
  setRecentlyCompletedChallenges,
  setGameId,
  setUserId,
  setUserInfo,
  setAuth,
  setChallenges,
  setCouponsCount,
  setCoupons,
  setDailyRewards,
  claimDailyReward,
  redeemCoupon,
} = backgroundSlice.actions;

export default backgroundSlice.reducer;
