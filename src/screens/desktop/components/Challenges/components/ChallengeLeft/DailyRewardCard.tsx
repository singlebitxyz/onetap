import Button from "components/Button/Button";
import { useDispatch, useSelector } from "react-redux";
import {
  claimDailyReward,
  fetchLastRewardTimestamp,
} from "screens/background/stores/background";
import { RootReducer } from "app/shared/rootReducer";
import { DailyReward } from "types";
import { useEffect } from "react";
import { AppDispatch } from "app/shared/store";

export default function DailyRewardCard({
  className,
  day,
}: {
  className?: string;
  day: number;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const { dailyRewards, userInfo } = useSelector(
    (state: RootReducer) => state.background
  );

  useEffect(() => {
    if (userInfo.id) {
      dispatch(fetchLastRewardTimestamp(userInfo.id));
    }
  }, [dispatch, userInfo.id]);

  const reward = dailyRewards.rewards.find((r: DailyReward) => r.day === day);

  // Determine if this day's reward is claimed
  const isClaimed = () => {
    if (!dailyRewards.lastRewardCollected) return false;
    return day <= dailyRewards.currentStreak;
  };

  // Determine if this day's reward is available to collect
  const isAvailable = () => {
    if (!dailyRewards.lastRewardCollected) {
      return day === 1; // First time user can only claim day 1
    }

    const lastRewardDate = new Date(dailyRewards.lastRewardCollected);
    const now = new Date();

    // Check if it's a different calendar date
    const isDifferentDate =
      lastRewardDate.getDate() !== now.getDate() ||
      lastRewardDate.getMonth() !== now.getMonth() ||
      lastRewardDate.getFullYear() !== now.getFullYear();

    // Can only claim the next day in sequence and only on a different calendar date
    return isDifferentDate && day === dailyRewards.currentStreak + 1;
  };

  // Calculate next reward availability time
  const getNextRewardTime = () => {
    if (!dailyRewards.lastRewardCollected) return null;

    const lastRewardDate = new Date(dailyRewards.lastRewardCollected);
    const now = new Date();

    // If reward was claimed on the current calendar date
    if (
      lastRewardDate.getDate() === now.getDate() &&
      lastRewardDate.getMonth() === now.getMonth() &&
      lastRewardDate.getFullYear() === now.getFullYear()
    ) {
      // Next reward is available at midnight (00:00:00) of the next day
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      return tomorrow;
    }

    return null;
  };

  const nextRewardTime = getNextRewardTime();
  const timeUntilNextReward = nextRewardTime
    ? Math.max(0, nextRewardTime.getTime() - new Date().getTime())
    : 0;

  // Only show countdown for the next available day
  const shouldShowCountdown = () => {
    if (!dailyRewards.lastRewardCollected) return false;

    const lastRewardDate = new Date(dailyRewards.lastRewardCollected);
    const now = new Date();

    // Check if the reward was claimed today
    const isClaimedToday =
      lastRewardDate.getDate() === now.getDate() &&
      lastRewardDate.getMonth() === now.getMonth() &&
      lastRewardDate.getFullYear() === now.getFullYear();

    // Show countdown only if claimed today and this is the next day in sequence
    return isClaimedToday && day === dailyRewards.currentStreak + 1;
  };

  // Determine if this card should be highlighted (next in sequence)
  const shouldHighlight = () => {
    if (!dailyRewards.lastRewardCollected) {
      return day === 1; // First time user, highlight day 1
    }

    // Always highlight the next day in sequence
    return day === dailyRewards.currentStreak + 1;
  };

  // Get the appropriate day label
  const getDayLabel = () => {
    if (day === 1 && !dailyRewards.lastRewardCollected) {
      return "Today"; // First time user, day 1 is today
    }
    if (shouldShowCountdown()) {
      return "Tomorrow"; // Next reward is available tomorrow
    }
    return `Day ${day}`;
  };

  const handleCollect = async () => {
    if (!isAvailable() || isClaimed()) return;

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/user/credit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: userInfo.id,
            lastLoginTime: new Date().toISOString(),
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        dispatch(
          claimDailyReward({
            day,
            currentStreak: dailyRewards.currentStreak + 1,
          })
        );
      }
    } catch (error) {
      console.error("Failed to claim daily reward:", error);
    }
  };

  return (
    <div
      className={`bg-[#282828] ${className} ${
        shouldHighlight() ? "border-[1px] border-[#C38CFF]" : ""
      } rounded my-2 flex flex-col`}
    >
      <img
        alt=""
        className={`w-full h-auto p-[0.1rem] text-white ${
          isAvailable() ? "" : "opacity-30"
        }`}
        src={`/images/treasure.png`}
      />
      <div className="h-[81px] flex items-center justify-center">
        <div className="flex flex-col items-center">
          <h1 className="m-2 font-Impact font-[400]">{getDayLabel()}</h1>
          {shouldShowCountdown() && (
            <div className="text-sm text-gray-400 mb-1">
              Available in {Math.ceil(timeUntilNextReward / (1000 * 60 * 60))}h
            </div>
          )}
          <Button
            onClick={isAvailable() && !isClaimed() ? handleCollect : undefined}
            className={`flex p-2 my-2 border-none gap-2 items-center justify-center ${
              isAvailable() && !isClaimed()
                ? ""
                : "cursor-not-allowed opacity-30"
            }`}
          >
            {isClaimed() ? "Claimed" : "Collect"}
            <img className="h-5" src="/icons/coin.svg" alt="coin" />
            {reward?.amount || 10}
          </Button>
        </div>
      </div>
    </div>
  );
}
