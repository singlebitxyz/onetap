import Button from "components/Button/Button";
import { FilterProvider, useFilter } from "./MarketplaceFilterContext";
import { useState, useEffect } from "react";
import Modal from "components/Modal/Modal";
import { useDispatch, useSelector } from "react-redux"; // Updated import
import {
  setCoupons,
  redeemCoupon,
  setUserInfo,
} from "screens/background/stores/background";
import { gameMapper } from "utils/gameMapper"; // Import gameMapper
import { CouponData, CouponRedemptionResponse } from "types";

// Add a SuccessNotification component
const SuccessNotification = ({
  message,
  onClose,
}: {
  message: string;
  onClose: () => void;
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000); // Auto-close after 3 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50 flex items-center">
      <svg
        className="w-6 h-6 mr-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M5 13l4 4L19 7"
        ></path>
      </svg>
      <span>{message}</span>
      <button onClick={onClose} className="ml-4 text-white hover:text-gray-200">
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          ></path>
        </svg>
      </button>
    </div>
  );
};

export function MarketBanner() {
  return (
    <div className="flex justify-between relative overflow-hidden border-2">
      <img className="absolute -left-10" src="/shroom_bg.png" alt="dice" />
      <img
        className="z-20 h-64 bottom-0 absolute"
        src="/shroom.png"
        alt="dice"
      />
      <div className="flex ml-80">
        <div className="flex flex-col justify-center gap-2 items-center">
          <h1 className="text-xl font-Impact">
            Explore Marketplace. Buy Your favourite gaming items
          </h1>
          <form className="w-full">
            <input
              type="text"
              style={{ caretColor: "black" }}
              className="text-xl h-10 w-full focus:outline-none p-2 bg-[#939393] border-[1px] rounded border-white font-Impact"
            />
          </form>
        </div>
        <img className="" src="/dice.png" alt="dice" />
      </div>
    </div>
  );
}

export const MarketTitleBar: React.FC = () => {
  const { filter, updateFilter } = useFilter(); // Use the single filter and its update function

  // Handle the change for the select dropdown
  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    // Update the filter with the selected option
    updateFilter(event.target.value);
  };

  // Explicitly type your filter options
  const filterOptions: string[] = ["Valorant", "COD", "PUBG"];

  return (
    <div className="flex py-10 mx-2 justify-between">
      <p className="text-2xl font-Impact">Shop Now</p>
      <div className="flex items-center gap-4">
        <p className="font-Impact text-2xl">Filter</p>
        <select
          className="focus:outline-none flex p-2 text-center bg-[#383838] text-[#C6C6C6] font-Poppins"
          onChange={handleFilterChange}
          value={filter}
        >
          <option value="">By Game</option>
          {filterOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export function MarketCard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toggleModal = () => setIsModalOpen(!isModalOpen);
  return (
    <div className="rounded bg-[#FFC3C3] w-fit">
      <div className="flex">
        <img className="w-40" src="/marketplace_cards/image 50.svg" alt="" />
        <div className="p-2">
          <img className="" src="/marketplace_icons/pubg.svg" alt="" />
          <p className="text-2xl font-Impact">600 UC</p>
        </div>
      </div>
      <div className="bg-[#222222] p-2">
        <h2>PUBG 600 UC</h2>
        <div className="flex items-center gap-2">
          <img src="/icons/coin.svg" alt="" /> <span>200</span>{" "}
          <span className="line-through text-[#C6C6C6]">500</span>{" "}
          <span className="bg-red-500 px-1">60% off</span>{" "}
        </div>
        <div className="text-red-400">
          <p>Expires in 2 days.</p>
        </div>
        <div>
          <p>Bought by 200 people today.</p>
        </div>
        <div>
          <Button onClick={toggleModal} className="w-full">
            Buy Now
          </Button>
        </div>
      </div>
      <Modal isOpen={isModalOpen} toggle={toggleModal}>
        <PromotionCard
          points="600"
          imgSrc="/images/dod_valorant.png"
          discount="60"
          gameName="Valorant"
          description="Valorant is a very competitive game, and it has a large and active esports scene. The game is also very popular among casual players."
          email="jakejonas@gmail.com"
          onClaim={() => console.log("Claim button clicked")}
          itemId={0}
          availableInstances={1}
          onSuccess={() => {}}
        />
      </Modal>
    </div>
  );
}

const PromotionCard = ({
  points,
  imgSrc,
  discount,
  gameName,
  description,
  email,
  onClaim,
  itemId,
  availableInstances,
  onSuccess,
}: {
  points: string;
  imgSrc?: string;
  discount?: string;
  gameName: string;
  description: string;
  email: string;
  onClaim: VoidFunction;
  itemId: number;
  availableInstances: number;
  onSuccess: (message: string) => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const userInfo = useSelector(
    (state: {
      background: { userInfo: { id: number; balance: number; Auth: string } };
    }) => state.background.userInfo
  );

  const updateUserCoins = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/user/basic-info/${userInfo.Auth}`,
        { method: "GET" }
      );
      const data = await response.json();
      if (data) {
        dispatch(setUserInfo(data));
      }
    } catch (error) {
      console.error("Failed to update user coins:", error);
    }
  };

  const handleClaim = async () => {
    if (isLoading) return;

    if (userInfo.balance < Number(points)) {
      setError("Insufficient balance");
      return;
    }

    if (availableInstances <= 0) {
      setError("This coupon is currently sold out");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/marketplace/redeem-coupons`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            itemId,
            userId: userInfo.id,
            points: Number(points),
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.message === "Coupon redeemed successfully") {
        // Update Redux store for coupon
        dispatch(
          redeemCoupon({
            itemId,
            points: Number(points),
            instanceId: data.purchase?.id,
          })
        );

        // Update user's coins
        await updateUserCoins();

        // Show success notification
        onSuccess(
          `Successfully redeemed ${gameName} coupon for ${points} points!`
        );

        // Close modal
        onClaim();
      } else {
        setError(data.error || "Failed to redeem coupon");
      }
    } catch (err) {
      setError("Failed to redeem coupon");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-lg p-4 text-white w-full max-w-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">
          {gameName} {points} points
        </h2>
        <span className="bg-blue-600 text-xs font-bold py-1 px-3 rounded-full">
          {discount}% off
        </span>
      </div>
      <div className="mb-4">
        <img
          className="object-cover h-32 w-full rounded-md"
          src={imgSrc}
          alt={`${gameName} Characters`}
        />
      </div>
      <div className="mb-6">
        <p className="text-sm">{description || "No description available"}</p>
      </div>

      <p>The code will be sent to the following email id:</p>
      <div className="flex mt-2 mb-4">
        <input
          type="email"
          placeholder={email}
          className="bg-gray-700 p-2 rounded-l-lg flex-1 text-white"
          readOnly
        />
        <button
          onClick={handleClaim}
          disabled={isLoading || availableInstances <= 0}
          className={`${
            isLoading || availableInstances <= 0
              ? "bg-gray-500"
              : "bg-blue-500 hover:bg-blue-700"
          } transition-colors text-white font-bold py-2 px-4 rounded-r-lg`}
        >
          {isLoading
            ? "Processing..."
            : availableInstances <= 0
              ? "Sold Out"
              : "Claim Now"}
        </button>
      </div>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      {availableInstances > 0 && (
        <p className="text-green-500 text-sm mt-2">
          {availableInstances} coupons available
        </p>
      )}
    </div>
  );
};

function CouponCard({
  name,
  description,
  points,
  gameId,
  itemId,
  availableInstances,
  onSuccess,
}: {
  name: string;
  description: string;
  points: number;
  gameId: number;
  itemId: number;
  availableInstances: number;
  onSuccess: (message: string) => void;
}) {
  console.log("CouponCard rendering with props:", {
    name,
    description,
    points,
    gameId,
    itemId,
    availableInstances,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const handleRedemptionComplete = () => {
    // Only close the modal after successful redemption
    setIsModalOpen(false);
  };

  return (
    <div className="rounded bg-[#222222] w-fit">
      <div className="flex">
        <div className="p-2">
          <img className="" src={`/images/${gameMapper(gameId)}.png`} alt="" />
          <p className="text-2xl font-Impact">{points} Points</p>
        </div>
      </div>
      <div className="p-2">
        <h2>{name}</h2>
        <p>{description}</p>
        <div>
          <Button onClick={() => setIsModalOpen(true)} className="w-full">
            Redeem Now
          </Button>
        </div>
      </div>
      <Modal isOpen={isModalOpen} toggle={toggleModal}>
        <PromotionCard
          points={points.toString()}
          imgSrc={`/images/${gameMapper(gameId)}.png`}
          gameName={name}
          description={description}
          email="jakejonas@gmail.com"
          onClaim={handleRedemptionComplete}
          itemId={itemId}
          availableInstances={availableInstances}
          onSuccess={onSuccess}
        />
      </Modal>
    </div>
  );
}

export default function Marketplace({ className }: { className: string }) {
  const dispatch = useDispatch<any>();
  const coupons = useSelector(
    (state: { background: { coupons: CouponData[] } }) =>
      state.background.coupons
  );
  const [filter, setFilter] = useState<number>(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    async function fetchAndSetCoupons() {
      try {
        console.log("Fetching coupons from backend...");
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/marketplace/get-coupons`
        );
        const data = await response.json();
        console.log("Received coupons data:", data);

        // Validate data structure before dispatching
        if (!Array.isArray(data)) {
          console.error("Expected array of coupons, received:", typeof data);
          return;
        }

        // Process and validate coupons
        const validCoupons = data.filter((coupon) => {
          // Skip coupons with null item_id
          if (!coupon || coupon.item_id === null) {
            console.log("Skipping coupon with null item_id:", coupon);
            return false;
          }

          // Parse extraDetails if it's a string
          if (typeof coupon.extraDetails === "string") {
            try {
              coupon.extraDetails = JSON.parse(coupon.extraDetails);
              console.log("Parsed extraDetails:", coupon.extraDetails);
            } catch (e) {
              console.error("Failed to parse extraDetails:", e);
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
            console.error("Invalid coupon data:", coupon);
          }

          return isValid;
        });

        console.log(
          `Found ${validCoupons.length} valid coupons out of ${data.length} total`
        );
        dispatch(setCoupons(validCoupons));
      } catch (error) {
        console.error("Failed to fetch coupons:", error);
      }
    }

    fetchAndSetCoupons();
  }, [dispatch]);

  const filteredCoupons = () => {
    console.log("Filtering coupons with filter value:", filter);
    console.log("Current coupons state:", coupons);

    if (filter === 0) return coupons;

    const filtered = coupons.filter((coupon) => coupon.gameId === filter);
    console.log("Filtered coupons:", filtered);
    return filtered;
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    event.preventDefault();
    setFilter(Number(event.target.value));
  };

  const filterOptions = {
    1: "Dota 2",
    2: "Valorant",
    3: "COD Warzone",
    4: "PUBG",
    5: "Fall Guys",
    6: "Fortnite",
    7: "Hearthstone",
  };

  return (
    <FilterProvider>
      <div className={`${className} pr-5`}>
        {showSuccess && (
          <SuccessNotification
            message={successMessage}
            onClose={() => setShowSuccess(false)}
          />
        )}
        <MarketBanner />
        <div className="flex py-10 mx-2 justify-between">
          <p className="text-2xl font-Impact">Shop Now</p>
          <div className="flex items-center gap-4">
            <p className="font-Impact text-2xl">Filter</p>
            <select
              className="focus:outline-none flex p-2 text-center bg-[#383838] text-[#C6C6C6] font-Poppins mt-2"
              onChange={handleFilterChange}
              value={filter}
            >
              <option value={0}>No filter</option>
              {Object.entries(filterOptions).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4 p-2">
          {(() => {
            const couponsToRender = filteredCoupons();
            console.log("Rendering coupons:", couponsToRender);

            if (!couponsToRender || couponsToRender.length === 0) {
              console.log("No coupons to render");
              return <p className="text-white">No coupons available</p>;
            }

            return couponsToRender.map((coupon: CouponData) => {
              console.log("Rendering coupon:", coupon);

              // Safety check for required properties
              if (!coupon || !coupon.extraDetails) {
                console.error("Invalid coupon data:", coupon);
                return null;
              }

              // Safely access description from extraDetails
              const description =
                typeof coupon.extraDetails === "string"
                  ? "No description available"
                  : coupon.extraDetails.description ||
                    "No description available";

              return (
                <CouponCard
                  key={coupon.item_id}
                  itemId={coupon.item_id}
                  name={coupon.itemName}
                  description={description}
                  points={coupon.points_to_redeem}
                  gameId={coupon.gameId}
                  availableInstances={coupon.available_instances}
                  onSuccess={(message) => {
                    setSuccessMessage(message);
                    setShowSuccess(true);
                  }}
                />
              );
            });
          })()}
        </div>
      </div>
    </FilterProvider>
  );
}
