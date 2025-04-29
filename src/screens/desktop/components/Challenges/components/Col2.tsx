import { useEffect, useState } from "react";
import LevelCard from "./ChallengeLeft/LevelCard";
import { useFilterContext } from "screens/desktop/components/Contexts/FilterContext";
import { useSelector } from "react-redux";
import fetchApi from "utils/api";

interface LevelData {
  totalReward: number;
  challengeCount: number;
}

interface GroupedChallenges {
  [level: string]: {
    totalReward: number;
    challengeCount: number;
  };
}

export default function Col2() {
  const [groupedChallenges, setGroupedChallenges] = useState<GroupedChallenges>(
    {}
  );
  const { gameId } = useFilterContext();
  const { userInfo } = useSelector((state: any) => state.background);
  const currentUserLevel = userInfo.level || 1;

  useEffect(() => {
    const fetchGroupedChallenges = async () => {
      try {
        const response = await fetchApi(
          `${process.env.REACT_APP_BACKEND_URL}/challenges/grouped-by-level`
        );
        const data = await response.json();
        setGroupedChallenges(data);
      } catch (error) {
        console.error("Error fetching grouped challenges:", error);
      }
    };

    fetchGroupedChallenges();
  }, []);

  // Create an array of 10 levels
  const levels = Array.from({ length: 10 }, (_, index) => {
    const level = index + 1;
    const levelData = groupedChallenges[level.toString()];
    const isLocked = level > currentUserLevel;

    return {
      level,
      challengeCount: levelData?.challengeCount || 0,
      totalReward: levelData?.totalReward || 0,
      isLocked,
    };
  });

  return (
    <div className="flex flex-row gap-3 px-5 flex-wrap h-fit">
      {levels.map((levelData) => (
        <LevelCard
          key={levelData.level}
          className="w-40"
          level={levelData.level}
          challengeCount={levelData.challengeCount}
          totalReward={levelData.totalReward}
          showReward={levelData.level === currentUserLevel}
          isLocked={levelData.isLocked}
        />
      ))}
    </div>
  );
}
