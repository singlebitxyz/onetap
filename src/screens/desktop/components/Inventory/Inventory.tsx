import { useState } from "react";
import { useDispatch } from "react-redux";
import { setInventoryOpen } from "screens/desktop/stores/desktop";
import { CoinsEarnedSection } from "./components/CoinsEarnedSection";
import { CoinsSpentSection } from "./components/CoinsSpentSection";

type InventoryProps = {
  className?: string;
  anchorEl?: HTMLElement | null;
};

export const Inventory = ({ className, anchorEl }: InventoryProps) => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState<"earned" | "spent">("earned");

  if (!anchorEl) return null;

  // Calculate position based on anchor element
  const rect = anchorEl.getBoundingClientRect();

  return (
    <div
      className={`${className} flex flex-col absolute bg-[#1C1C1C] rounded-lg shadow-lg z-50`}
      style={{
        top: rect.bottom + 8, // 8px gap below the coin icon
        right: window.innerWidth - rect.right,
        width: "400px",
        maxHeight: "80vh",
      }}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <h1 className="font-Impact text-xl text-white">Coins</h1>
        <button
          onClick={() => dispatch(setInventoryOpen(0))}
          className="text-gray-400 hover:text-white"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <div className="flex border-b border-gray-800">
        <button
          className={`flex-1 py-3 font-Impact text-base ${
            activeTab === "earned"
              ? "text-white border-b-2 border-[#9B6CFF]"
              : "text-gray-400"
          }`}
          onClick={() => setActiveTab("earned")}
        >
          Coins Earned
        </button>
        <button
          className={`flex-1 py-3 font-Impact text-base ${
            activeTab === "spent"
              ? "text-white border-b-2 border-[#9B6CFF]"
              : "text-gray-400"
          }`}
          onClick={() => setActiveTab("spent")}
        >
          Coins Spent
        </button>
      </div>

      <div className="flex-1 overflow-auto">
        <CoinsEarnedSection isVisible={activeTab === "earned"} />
        <CoinsSpentSection isVisible={activeTab === "spent"} />
      </div>
    </div>
  );
};
