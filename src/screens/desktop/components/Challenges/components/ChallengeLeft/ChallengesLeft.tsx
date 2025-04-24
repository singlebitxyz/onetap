import { useEffect, useState } from "react";
import Challenge from "./Challenge";
import LevelCard from "./LevelCard";
import Progress from "./Progress";
import { useFilterContext } from "screens/desktop/components/Contexts/FilterContext";
import { useSelector, useDispatch } from "react-redux";
import { setUserInfo } from "screens/background/stores/background";

interface ChallengeData {
  id: number;
  requirements: {
    id: number;
    match_start: string;
    match_end: string;
    total_kills: number;
    deaths: number;
    assists: number;
    headshot: number;
    spikes_planted: number;
    spikes_defuse: number;
    damage_done: number;
    team_scores: number;
    match_status: boolean;
    agent: string;
    region: string;
    game_mode: string;
    damage_taken: number;
    userId: string;
  };
  startTime: string;
  endTime: string;
  type: string;
  name: string;
  reward: number;
  Game: {
    gameName: string;
    id: number;
  };
}

interface ChallengeProgress {
  challengeId: number;
  completed: number;
  total: number;
  isStarted: boolean;
  requirement?: {
    id: number;
    match_start: string;
    match_end: string;
    total_kills: number;
    deaths: number;
    assists: number;
    headshot: number;
    spikes_planted: number;
    spikes_defuse: number;
    damage_done: number;
    team_scores: number;
    match_status: boolean;
    agent: string;
    region: string;
    game_mode: string;
    damage_taken: number;
    userId: string;
  };
  userId?: string;
  id?: number;
}

interface Requirements {
  [key: string]: number | string | boolean;
}

export const ChallengesLeft = () => {
  const { userId } = useSelector((state: any) => state.background);
  const { userInfo } = useSelector((state: any) => state.background);
  const dispatch = useDispatch();
  const [levelRewards, setLevelRewards] = useState<{
    [key: string]: { totalReward: number; challengeCount: number };
  }>({});
  const [totalAvailableRewards, setTotalAvailableRewards] = useState(0);
  const [challenges, setChallenges] = useState<ChallengeData[]>([
    {
      id: 0,
      requirements: {
        id: 0,
        match_start: "",
        match_end: "",
        total_kills: 0,
        deaths: 0,
        assists: 0,
        headshot: 0,
        spikes_planted: 0,
        spikes_defuse: 0,
        damage_done: 0,
        team_scores: 0,
        match_status: false,
        agent: "",
        region: "",
        game_mode: "",
        damage_taken: 0,
        userId: "",
      },
      startTime: "",
      endTime: "",
      type: "",
      name: "",
      reward: 0,
      Game: {
        gameName: "",
        id: 0,
      },
    },
  ]);
  const [filteredChallenges, setFilteredChallenges] = useState<ChallengeData[]>(
    [
      {
        id: 0,
        requirements: {
          id: 0,
          match_start: "",
          match_end: "",
          total_kills: 0,
          deaths: 0,
          assists: 0,
          headshot: 0,
          spikes_planted: 0,
          spikes_defuse: 0,
          damage_done: 0,
          team_scores: 0,
          match_status: false,
          agent: "",
          region: "",
          game_mode: "",
          damage_taken: 0,
          userId: "",
        },
        startTime: "",
        endTime: "",
        type: "",
        name: "",
        reward: 0,
        Game: {
          gameName: "",
          id: 0,
        },
      },
    ]
  );
  const [gameId, setGameId] = useState(0);
  const [countProgress, setCountProgress] = useState({
    ongoing: 0,
    total: 0,
    completedOutOfOngoing: 0,
  });
  const [challengeProgress, setChallengeProgress] = useState<
    ChallengeProgress[]
  >([]);

  const filterChangeHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
    event.preventDefault();
    setGameId(parseInt(event.target.value));
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

  const fetchChallengeProgress = async (
    challengeIds: number[],
    gameId: number
  ) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/challenges/multiple-challenge-progress`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            challengeIds,
            gameId: gameId as unknown as number,
          }),
        }
      );
      const data = await response.json();
      // If data is empty array, set progress with isStarted: false
      if (Array.isArray(data) && data.length === 0) {
        // For each challenge ID, find the challenge and determine its total requirement
        const emptyProgress = challengeIds.map((id) => {
          const challenge = challenges.find((c) => c.id === id);
          let total = 2; // Default to 2 if no challenge found or no specific requirement

          if (challenge) {
            const requirements = challenge.requirements;
            // Determine total from requirements
            if (requirements.total_kills > 0) total = requirements.total_kills;
            else if (requirements.headshot > 0) total = requirements.headshot;
            else if (requirements.spikes_planted > 0)
              total = requirements.spikes_planted;
            else if (requirements.spikes_defuse > 0)
              total = requirements.spikes_defuse;
            else if (requirements.damage_done > 0)
              total = requirements.damage_done;
            else if (requirements.team_scores > 0)
              total = requirements.team_scores;
          }

          return {
            challengeId: id,
            completed: 0,
            total,
            isStarted: false,
          };
        });
        setChallengeProgress(emptyProgress);
      } else {
        // Add isStarted flag to existing progress data
        const progressWithStarted = data.map((item: any) => ({
          ...item,
          isStarted: true,
        }));
        setChallengeProgress(progressWithStarted);

        // Check if any challenge was just completed and update coins
        const previousProgress = challengeProgress;
        const newlyCompletedChallenges = progressWithStarted.filter(
          (newProgress: any) => {
            const oldProgress = previousProgress.find(
              (p: any) => p.challengeId === newProgress.challengeId
            );
            return (
              oldProgress &&
              oldProgress.completed < oldProgress.total &&
              newProgress.completed >= newProgress.total
            );
          }
        );

        if (newlyCompletedChallenges.length > 0) {
          await updateUserCoins();
        }
      }
    } catch (error) {
      console.error("Error fetching challenge progress:", error);
    }
  };

  const fetchData = async (selectedGameId: number) => {
    try {
      let ongoingUrl = `${process.env.REACT_APP_BACKEND_URL}/challenges/all-ongoing-challenges`;
      let completedUrl = `${process.env.REACT_APP_BACKEND_URL}/challenges/all-completed-challenges/${userId}`;

      // If a game is selected, use the filtered endpoints
      if (selectedGameId !== 0) {
        ongoingUrl = `${process.env.REACT_APP_BACKEND_URL}/challenges/ongoing-challenges/${selectedGameId}`;
        completedUrl = `${process.env.REACT_APP_BACKEND_URL}/challenges/completed-challenges/${userId}/${selectedGameId}`;
      }

      // Fetch ongoing challenges
      const ongoingData = await fetch(ongoingUrl, { method: "GET" }).then(
        (res) => res.json()
      );
      setChallenges(ongoingData);
      setFilteredChallenges(ongoingData);
      setCountProgress((prev) => ({ ...prev, ongoing: ongoingData.length }));

      // Fetch completed challenges
      const completedData = await fetch(completedUrl, { method: "GET" }).then(
        (res) => res.json()
      );

      // Count how many completed challenges are from ongoing challenges
      const completedOutOfOngoing = completedData.filter((completed: any) =>
        ongoingData.some(
          (ongoing: ChallengeData) => ongoing.id === completed.challengeId
        )
      ).length;

      // Calculate total available rewards from incomplete challenges
      const completedChallengeIds = completedData.map(
        (c: any) => c.challengeId
      );
      const incompleteChallenges = ongoingData.filter(
        (challenge: ChallengeData) =>
          !completedChallengeIds.includes(challenge.id)
      );
      const totalRewards = incompleteChallenges.reduce(
        (sum: number, challenge: ChallengeData) =>
          sum + (challenge.reward || 0),
        0
      );
      setTotalAvailableRewards(totalRewards);

      setCountProgress((prev) => ({
        ...prev,
        total: ongoingData.length,
        completedOutOfOngoing,
      }));

      // Fetch progress for ongoing challenges
      if (ongoingData.length > 0) {
        // Get all challenge IDs and their game ID
        const allChallengeIds = ongoingData.map(
          (challenge: ChallengeData) => challenge.id
        );
        const gameId = ongoingData[0].Game.id;

        // Fetch progress for all challenges at once
        await fetchChallengeProgress(
          allChallengeIds,
          gameId as unknown as number
        );
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Add new useEffect for fetching level rewards
  useEffect(() => {
    const fetchLevelRewards = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/challenges/grouped-by-level`
        );
        const data = await response.json();
        setLevelRewards(data);
      } catch (error) {
        console.error("Error fetching level rewards:", error);
      }
    };

    fetchLevelRewards();
  }, []);

  // Initial data fetch
  useEffect(() => {
    if (userId) {
      fetchData(0);
    }
  }, [userId]);

  // Fetch data when filter changes
  useEffect(() => {
    if (userId) {
      fetchData(gameId);
    }
  }, [gameId, userId]);

  const getChallengeProgress = (challengeId: number) => {
    const progress = challengeProgress.find(
      (p) => p.challengeId === challengeId
    );
    console.log("progress 💪", progress);

    if (progress) {
      const challenge = challenges.find((c) => c.id === challengeId);
      if (!challenge) {
        return { ...progress, total: 2, completed: 0 };
      }

      const progressRequirements = progress.requirement || {};
      const challengeRequirements = challenge.requirements;
      let total = 0;
      let completed = 0;

      // Check all possible requirement fields
      const fieldsToCheck = [
        "total_kills",
        "kills",
        "headshot",
        "spikes_planted",
        "spikes_defuse",
        "damage_done",
        "team_scores",
        "total_shots",
        "physical_damage_dealt_players",
        "creep_score",
        "health",
        "shield",
        "revived",
        "knockout",
        "damage_taken",
      ];

      for (const field of fieldsToCheck) {
        if ((challengeRequirements as any)[field] > 0) {
          total = (challengeRequirements as any)[field];
          completed = Math.min(
            total,
            (progressRequirements as any)[field] || 0
          );
          break;
        }
      }

      if (total === 0) {
        total = progress.total || 2;
        completed = progress.completed || 0;
      }

      return { ...progress, total, completed };
    }

    const challenge = challenges.find((c) => c.id === challengeId);
    if (challenge) {
      let total = 0;
      const requirements = challenge.requirements;

      const fieldsToCheck = [
        "total_kills",
        "kills",
        "headshot",
        "spikes_planted",
        "spikes_defuse",
        "damage_done",
        "team_scores",
        "total_shots",
        "physical_damage_dealt_players",
        "creep_score",
        "health",
        "shield",
        "revived",
        "knockout",
        "damage_taken",
      ];

      for (const field of fieldsToCheck) {
        if ((requirements as any)[field] > 0) {
          total = (requirements as any)[field];
          break;
        }
      }

      if (total === 0) total = 2;

      return { challengeId, completed: 0, total, isStarted: false };
    }

    return { challengeId, completed: 0, total: 1, isStarted: false };
  };

  const getChallengeRequirementText = (requirements: any) => {
    const fieldsToCheck = [
      { key: "total_kills", label: "kills" },
      { key: "kills", label: "kills" },
      { key: "deaths", label: "deaths" },
      { key: "assists", label: "assists" },
      { key: "headshot", label: "headshots" },
      { key: "spikes_planted", label: "spikes planted" },
      { key: "spikes_defuse", label: "spikes defused" },
      { key: "damage_done", label: "damage" },
      { key: "team_scores", label: "team scores" },
      { key: "total_shots", label: "shots" },
      { key: "physical_damage_dealt_players", label: "physical damage" },
      { key: "creep_score", label: "creep score" },
      { key: "health", label: "health" },
      { key: "shield", label: "shield" },
      { key: "revived", label: "revives" },
      { key: "knockout", label: "knockouts" },
      { key: "damage_taken", label: "damage taken" },
    ];

    for (const field of fieldsToCheck) {
      if (requirements[field.key] > 0) {
        return `${requirements[field.key]} ${field.label}`;
      }
    }
    return "";
  };

  return (
    <div className="border-[1px] rounded mt-2 border-[#414141]">
      <div className="mx-4 my-2 flex items-center justify-between">
        <select
          className="focus:outline-none flex p-2 text-center bg-[#383838] text-[#C6C6C6] font-Poppins mt-2"
          onChange={filterChangeHandler}
          value={gameId}
        >
          <option value={0}>No filter</option>
          {Object.entries(filterOptions).map(([key, value]) => (
            <option key={key} value={key}>
              {value}
            </option>
          ))}
        </select>
        <p className="font-Impact text-2xl">Filter</p>
      </div>
      <div className="bg-[#1C1C1C] px-5 flex">
        <LevelCard
          className="w-3/5"
          level={userInfo.level || 1}
          challengeCount={countProgress.total}
          showReward={true}
          totalReward={
            levelRewards[String(userInfo.level || 1)]?.totalReward || 0
          }
        />
        <Progress
          completed={countProgress.completedOutOfOngoing}
          total={countProgress.total}
          totalReward={totalAvailableRewards}
        />
      </div>
      <div className="bg-[#242424] p-5">
        <h1 className="font-Impact py-2">Challenges</h1>
        <div className="flex flex-col">
          <ul className="flex flex-col gap-5 h-[25vh] overflow-y-auto">
            {filteredChallenges &&
              filteredChallenges.map((challenge: ChallengeData, key: any) => {
                const progress = getChallengeProgress(challenge.id);
                const requirementText = getChallengeRequirementText(
                  challenge.requirements
                );
                return (
                  <Challenge
                    total={progress.total}
                    completed={progress.completed}
                    name={challenge.name}
                    requirement={challenge.requirements}
                    isStarted={progress.isStarted}
                    requirementText={requirementText}
                    key={key}
                  />
                );
              })}
          </ul>
        </div>
      </div>
    </div>
  );
};
