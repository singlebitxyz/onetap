import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { GameEarnings, Transaction, TransactionHistory } from "../types";
import { fetchCoinsSummary } from "../../../services/coinsService";

interface CoinsEarnedSectionProps {
  isVisible: boolean;
}

interface GameEarningsAcc {
  [key: string]: GameEarnings;
}

export const CoinsEarnedSection = ({ isVisible }: CoinsEarnedSectionProps) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<TransactionHistory | null>(null);
  const { userId } = useSelector((state: any) => state.background);

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log("Loading data for userId:", userId);
        setLoading(true);
        setError(null);
        const summary = await fetchCoinsSummary(userId);
        console.log("Received summary data:", JSON.stringify(summary, null, 2));
        setData(summary);
      } catch (err) {
        console.error("Error loading data:", err);
        setError("Failed to load transaction history");
      } finally {
        setLoading(false);
      }
    };

    if (isVisible && userId) {
      loadData();
    }
  }, [isVisible, userId]);

  if (!isVisible) {
    console.log("Component not visible, returning null");
    return null;
  }
  if (loading) {
    console.log("Component in loading state");
    return <div className="p-4 text-center">Loading...</div>;
  }
  if (error) {
    console.log("Component in error state:", error);
    return <div className="p-4 text-center text-red-400">{error}</div>;
  }
  if (!data) {
    console.log("No data available");
    return null;
  }

  console.log(
    "Processing challenges data:",
    JSON.stringify(data.earned.challenges, null, 2)
  );

  // Group challenge transactions by game
  const gameEarnings: GameEarnings[] = data.earned.challenges.byGame.map(
    (game) => {
      console.log("Processing game:", game);
      const transaction = game.transactions[0];
      const source = transaction.source;

      if (source.type !== "CHALLENGE") {
        console.error("Unexpected source type:", source.type);
        return {
          gameName: `Game ${game.gameId}`,
          gameImage: `/images/default.png`,
          totalEarned: game.totalEarned,
          transactions: game.transactions,
        };
      }

      return {
        gameName: source.gameName,
        gameImage: source.gameImage,
        totalEarned: game.totalEarned,
        transactions: game.transactions,
      };
    }
  );

  console.log(
    "Transformed game earnings:",
    JSON.stringify(gameEarnings, null, 2)
  );
  console.log(
    "Daily rewards data:",
    JSON.stringify(data.earned.dailyRewards, null, 2)
  );

  return (
    <div className="flex flex-col">
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <span className="font-Impact text-xl">Total Earned</span>
          <span className="font-Impact text-xl text-green-400">
            +{data.earned.total}
          </span>
        </div>
      </div>

      <div className="flex flex-col w-full overflow-y-scroll scrollbar p-2 max-h-[60vh]">
        {/* Daily Rewards Section */}
        <div className="mb-4">
          <h3 className="font-Impact text-lg mb-2 px-2">Daily Rewards</h3>
          {data.earned.dailyRewards.transactions.length > 0 ? (
            data.earned.dailyRewards.transactions.map((reward) => (
              <div
                key={reward.id}
                className="flex justify-between w-full px-5 py-3 bg-[#1C1C1C] rounded mb-2 hover:bg-[#252525] transition-colors"
              >
                <div className="flex tracking-wider font-Impact gap-4 items-center">
                  <div className="flex flex-col">
                    <p className="text-white">Daily Reward</p>
                    <p className="text-sm text-gray-400">
                      {new Date(reward.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex font-Impact tracking-wider items-center gap-2">
                  <img className="w-5 h-5" src="/icons/coin.svg" alt="coin" />
                  <p className="text-green-400">+{reward.amount}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-gray-400 text-center py-2">
              No daily rewards yet
            </div>
          )}
        </div>

        {/* Game Earnings Section */}
        <div>
          <h3 className="font-Impact text-lg mb-2 px-2">Game Earnings</h3>
          {gameEarnings.length > 0 ? (
            gameEarnings.map((game) => (
              <div
                key={game.gameName}
                className="flex justify-between w-full px-5 py-3 bg-[#1C1C1C] rounded mb-2 hover:bg-[#252525] transition-colors"
              >
                <div className="flex tracking-wider font-Impact gap-4 items-center">
                  <img
                    className="rounded w-12 h-12 object-cover"
                    src={game.gameImage}
                    alt={game.gameName}
                  />
                  <p className="text-white">{game.gameName}</p>
                </div>
                <div className="flex font-Impact tracking-wider items-center gap-2">
                  <img className="w-5 h-5" src="/icons/coin.svg" alt="coin" />
                  <p className="text-green-400">+{game.totalEarned}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-gray-400 text-center py-2">
              No game earnings yet
            </div>
          )}
        </div>
      </div>
      <div className="p-4 border-t border-gray-800">
        <p className="font-Impact text-xl mb-2">Get More Coins</p>
        <div className="flex flex-row overflow-x-scroll scrollbar"></div>
      </div>
    </div>
  );
};
