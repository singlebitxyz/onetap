import {
  Transaction,
  TransactionHistory,
  GameChallenges,
  ChallengesData,
  EarnedData,
  GameTransactions,
} from "../components/Inventory/types";
import { gameMapper } from "utils/gameMapper";

const getGameName = (gameId: number): string => {
  const gameName = gameMapper(gameId);
  // Convert snake_case to Title Case
  return gameName
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

interface CoinsSummaryResponse {
  coins_earned: {
    challenges: {
      [gameId: string]: {
        total_rewards: number;
      };
    };
    daily_rewards: {
      streak: number;
      lastCollected: string;
    };
  }[];
  coins_spent: {
    itemName: string;
    cost: number;
    purchasedAt: string;
    gameId: number;
  }[];
}

export const fetchCoinsSummary = async (
  userId: string
): Promise<TransactionHistory> => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/user/coins-summary`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch coins summary");
    }

    const data: CoinsSummaryResponse = await response.json();
    console.log("Raw API Response:", JSON.stringify(data, null, 2));

    // Transform API response to match our UI data structure
    const gameChallenges: GameTransactions[] = Object.entries(
      data.coins_earned[0].challenges
    ).map(([gameId, { total_rewards }]) => {
      console.log(`Processing game ${gameId} with rewards:`, total_rewards);
      const numericGameId = parseInt(gameId);
      const gameName = getGameName(numericGameId);
      return {
        gameId: gameId,
        totalEarned: total_rewards,
        transactions: [
          {
            id: `challenge-${gameId}`,
            amount: total_rewards,
            timestamp: new Date().toISOString(),
            transactionType: "EARNED",
            source: {
              type: "CHALLENGE",
              gameId: numericGameId,
              gameName,
              gameImage: `/images/${gameMapper(numericGameId)}.png`,
              challengeId: `challenge-${gameId}`,
              challengeName: `${gameName} Challenge`,
            },
          },
        ],
      };
    });

    console.log(
      "Transformed game challenges:",
      JSON.stringify(gameChallenges, null, 2)
    );

    const challengesData: ChallengesData = {
      byGame: gameChallenges,
      total: gameChallenges.reduce((sum, game) => sum + game.totalEarned, 0),
    };

    console.log(
      "Challenges data with total:",
      JSON.stringify(challengesData, null, 2)
    );

    const dailyRewardStreak = data.coins_earned[0].daily_rewards.streak;
    const lastCollected = new Date(
      data.coins_earned[0].daily_rewards.lastCollected
    );
    console.log(
      "Daily reward streak:",
      dailyRewardStreak,
      "Last collected:",
      lastCollected
    );

    // Generate daily reward transactions for the streak
    const dailyRewardTransactions: Transaction[] = [];
    for (let i = 0; i < dailyRewardStreak; i++) {
      const date = new Date(lastCollected);
      date.setDate(date.getDate() - i);
      dailyRewardTransactions.push({
        id: `daily-reward-${date.toISOString()}`,
        amount: 10, // Hardcoded daily reward amount
        timestamp: date.toISOString(),
        transactionType: "EARNED",
        source: {
          type: "DAILY_REWARD",
        },
      });
    }

    const earned: EarnedData = {
      challenges: challengesData,
      dailyRewards: {
        transactions: dailyRewardTransactions,
        total: dailyRewardStreak * 10,
        totalEarned: dailyRewardStreak * 10,
      },
      total: challengesData.total + dailyRewardStreak * 10,
    };

    console.log("Final earned data:", JSON.stringify(earned, null, 2));

    const purchases = data.coins_spent.map((purchase) => {
      const gameName = getGameName(purchase.gameId);
      return {
        id: `purchase-${purchase.itemName}-${purchase.purchasedAt}`,
        amount: purchase.cost,
        timestamp: purchase.purchasedAt,
        transactionType: "SPENT" as const,
        source: {
          type: "PURCHASE" as const,
          gameName,
          gameImage: `/images/${gameMapper(purchase.gameId)}.png`,
          itemId: `${purchase.gameId}-${purchase.itemName}`,
          itemName: purchase.itemName,
        },
      };
    });

    const result: TransactionHistory = {
      earned,
      spent: {
        total: purchases.reduce((sum, purchase) => sum + purchase.amount, 0),
        purchases: {
          byGame: [
            {
              gameId: "all",
              totalEarned: purchases.reduce(
                (sum, purchase) => sum + purchase.amount,
                0
              ),
              transactions: purchases,
            },
          ],
        },
      },
    };

    console.log("Final transformed data:", JSON.stringify(result, null, 2));
    return result;
  } catch (error) {
    console.error("Error fetching coins summary:", error);
    throw error;
  }
};
