import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { gameMapper } from "utils/gameMapper";

interface InventoryItem {
  id: string;
  createdAt: string;
  amount: number;
  Item: {
    itemName: string;
    itemType: string;
    itemValue: string;
    itemImage: string;
    gameId: number;
    extraDetails: string;
  };
}

interface InventoryResponse {
  inventory: InventoryItem[];
}

interface PageProps {
  className?: string;
}

export const Page = ({ className }: PageProps) => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { userId } = useSelector((state: any) => state.background);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/inventory/user-inventory`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId,
            }),
          }
        );

        const data: InventoryResponse = await response.json();
        setInventory(data.inventory);
      } catch (error) {
        console.error("Failed to fetch inventory:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchInventory();
    }
  }, [userId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `Purchased on: ${date.getDate()}th ${date.toLocaleString("default", { month: "long" })} ${date.getFullYear()}`;
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center h-full ${className}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className={`p-6 ${className}`}>
      <h1 className="text-2xl font-bold text-white mb-6">
        Items bought by you
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {inventory.map((item) => (
          <div
            key={item.id}
            className="bg-[#2A2A2A] rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div className="relative aspect-video bg-gradient-to-r from-purple-500/20 to-blue-500/20 p-4">
              {item.Item.itemImage ? (
                <img
                  src={item.Item.itemImage}
                  alt={item.Item.itemName}
                  className="h-full w-full object-contain"
                />
              ) : (
                <img
                  src={`/images/${gameMapper(item.Item.gameId)}.png`}
                  alt={item.Item.itemName}
                  className="h-full w-full object-contain"
                />
              )}
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-white">
                  {item.Item.itemName}
                </h3>
                <span className="text-white font-medium flex items-center gap-1">
                  {item.amount}{" "}
                  <img className="h-5" src="/icons/coin.svg" alt="coin" />
                </span>
              </div>
              <p className="text-sm text-gray-400">
                {formatDate(item.createdAt)}
              </p>
              {item.Item.extraDetails && (
                <p className="mt-4 text-sm text-gray-300">
                  {JSON.parse(item.Item.extraDetails).description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
