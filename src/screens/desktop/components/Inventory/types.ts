export type TransactionType = "EARNED" | "SPENT";

export type SourceType = "CHALLENGE" | "DAILY_REWARD" | "PURCHASE";

export interface PurchaseSource {
  type: "PURCHASE";
  gameName: string;
  gameImage: string;
  itemId: string;
  itemName: string;
}

export interface ChallengeSource {
  type: "CHALLENGE";
  gameName: string;
  gameImage: string;
  challengeId: string;
  challengeName: string;
}

export interface DailyRewardSource {
  type: "DAILY_REWARD";
}

export type TransactionSource =
  | ChallengeSource
  | DailyRewardSource
  | PurchaseSource;

export interface Transaction {
  id: string;
  amount: number;
  timestamp: string;
  transactionType: TransactionType;
  source: TransactionSource;
}

export interface GameTransactions {
  gameId: string;
  totalEarned: number;
  transactions: Transaction[];
}

export interface DailyRewardTransactions {
  totalEarned: number;
  total: number;
  transactions: Transaction[];
}

export interface GameChallenges {
  gameId: number;
  totalEarned: number;
  transactions: Transaction[];
}

export interface ChallengesData {
  byGame: GameTransactions[];
  total: number;
}

export interface DailyRewardsData {
  transactions: Transaction[];
  total: number;
}

export interface EarnedData {
  total: number;
  challenges: {
    byGame: GameTransactions[];
  };
  dailyRewards: DailyRewardTransactions;
}

export interface GameEarnings {
  gameName: string;
  gameImage: string;
  totalEarned: number;
  transactions: Transaction[];
}

export interface TransactionHistory {
  earned: {
    total: number;
    challenges: {
      byGame: GameTransactions[];
    };
    dailyRewards: DailyRewardTransactions;
  };
  spent: {
    total: number;
    purchases: {
      byGame: GameTransactions[];
    };
  };
}

export interface Data {
  earnedByGame: GameEarnings[];
  dailyRewards: Transaction[];
  purchases: Transaction[];
  totalEarned: number;
  totalSpent: number;
}
