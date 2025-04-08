import { PayloadAction } from "@reduxjs/toolkit";

export interface Timestamp {
  timestamp: number;
}

export type ChallengeData = {
  id: number;
  userId: number;
  challengeId: number;
  gameId: number;
  Game: {
    gameName: string;
  };
  game_challenges: {
    name: string;
  };
};

export interface CompletedChallengeData {
  challengeId: number;
  gameId: number;
  game_challenges: {
    name: string;
    reward: number;
    id: number;
    userId: number;
  };
  Game: {
    gameName: string;
  };
}

export type CouponData = {
  item_id: number;
  available_instances: number;
  marketplace_ids: number[];
  points_to_redeem: number;
  itemName: string;
  itemType: string;
  itemValue: any;
  itemImage: string | null;
  gameId: number;
  extraDetails:
    | string
    | {
        description: string;
        points_to_redeem: number;
      };
};

export interface CouponRedemptionResponse {
  success: boolean;
  purchaseData?: {
    instanceId: number;
    itemId: number;
    userId: number;
    pointsSpent: number;
  };
  error?: string;
}

export interface gameData {
  match_start: string;
  match_end: string;
  match_status: string;
}

export interface valorantGameData extends gameData {
  total_kills: number;
  deaths: number;
  assists: number;
  headshot: number;
  spikes_defuse: number;
  spikes_planted: number;
  damage_done: number;
  team_scores: number;
  agent: string;
  region: string;
  game_mode: string;
  damage_taken: number;
}

export interface UserInfo {
  id: number;
  userName: string;
  profilePicture: string | null;
  userCoustomeId: string;
  profileName: string;
  globalRanking: number;
  balance: number;
  Auth: string;
  level: number;
  premiumUser: boolean;
}

export interface SubscriptionData {
  id: number;
  tier: string;
  cost: number;
  startTime: string;
  endTime: string | null;
  benefits: {
    benefit: string;
    description: string;
  }[];
  active: boolean;
}

export interface CouponsCount {
  game_id: number;
  count: number;
}

export type OwInfo =
  | overwolf.games.events.InfoUpdates2Event
  | overwolf.games.InstalledGameInfo;
export type OwEvent = overwolf.games.events.NewGameEvents;
export type InfoPayload = PayloadAction<Timestamp & OwInfo>;
export type EventPayload = PayloadAction<Timestamp & OwEvent>;

export interface DailyReward {
  day: number;
  amount: number;
  claimed: boolean;
}

export interface DailyRewardsState {
  lastRewardCollected: string | null;
  currentStreak: number;
  rewards: DailyReward[];
}

export interface StreakInfo {
  currentStreak: number;
  reward: number;
  baseReward: number;
  streakBonus: number;
}

export interface BackgroundState {
  events: Array<Timestamp & OwEvent>;
  infos: Array<Timestamp & OwInfo>;
  player_name: string;
  gameId: number;
  gameData: { [gameId: number]: any };
  flag: boolean;
  recentlyCompletedChallenges: { [key: string]: any };
  userInfo: UserInfo;
  userId: number;
  challenges: Array<ChallengeData>;
  couponsCount: Array<CouponsCount>;
  coupons: Array<CouponData>;
  dailyRewards: DailyRewardsState;
}
