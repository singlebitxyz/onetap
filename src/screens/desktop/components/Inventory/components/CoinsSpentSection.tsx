import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { GameEarnings, Transaction, TransactionHistory } from "../types";
import { fetchCoinsSummary } from "../../../services/coinsService";

interface CoinsSpentSectionProps {
  isVisible: boolean;
}

export const CoinsSpentSection = ({ isVisible }: CoinsSpentSectionProps) => {
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
    "Processing purchases data:",
    JSON.stringify(data.spent.purchases, null, 2)
  );

  // Group purchase transactions by game
  const gameSpending = data.spent.purchases.byGame.map((game) => {
    console.log("Processing game:", game);
    const transaction = game.transactions[0];
    const source = transaction.source;

    if (source.type !== "PURCHASE") {
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
  });

  console.log(
    "Transformed game spending:",
    JSON.stringify(gameSpending, null, 2)
  );

  return (
    <div className="flex flex-col">
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <span className="font-Impact text-xl">Total Spent</span>
          <span className="font-Impact text-xl text-red-400">
            -{data.spent.total}
          </span>
        </div>
      </div>

      <div className="flex flex-col w-full overflow-y-scroll scrollbar p-2 max-h-[60vh]">
        {/* Game Spending Section */}
        <div>
          <h3 className="font-Impact text-lg mb-2 px-2">Game Spending</h3>
          {gameSpending.length > 0 ? (
            gameSpending.map((game) => (
              <div key={game.gameName}>
                <div className="flex items-center justify-between px-2 py-1">
                  <span className="font-Impact text-sm text-gray-400">
                    {game.gameName}
                  </span>
                  <span className="font-Impact text-sm text-red-400">
                    -{game.totalEarned}
                  </span>
                </div>
                {game.transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex justify-between w-full px-5 py-3 bg-[#1C1C1C] rounded mb-2 hover:bg-[#252525] transition-colors"
                  >
                    <div className="flex tracking-wider font-Impact gap-4 items-center">
                      <img
                        className="rounded w-12 h-12 object-cover"
                        src={game.gameImage}
                        alt={game.gameName}
                      />
                      <div className="flex flex-col">
                        <p className="text-white">{game.gameName}</p>
                        <p className="text-sm text-gray-400">
                          {new Date(transaction.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex font-Impact tracking-wider items-center gap-2">
                      <img
                        className="w-5 h-5"
                        src="/icons/coin.svg"
                        alt="coin"
                      />
                      <p className="text-red-400">-{transaction.amount}</p>
                    </div>
                  </div>
                ))}
              </div>
            ))
          ) : (
            <div className="text-gray-400 text-center py-2">
              No game spending yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
