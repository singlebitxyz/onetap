import React from "react";
import Progressbar from "./Progressbar";

function toCamelCase(str: string) {
  return str.split("_").reduce((result, word, index) => {
    // If it's the first word, keep it as is. If it's not, capitalize the first letter.
    return (
      result +
      (index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1))
    );
  }, "");
}

interface ChallengeProps {
  completed: number;
  total: number;
  name: string;
  requirement: {
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
  isStarted: boolean;
}

// Default values for comparison
const DEFAULT_VALUES = {
  agent: "",
  deaths: 0,
  region: "",
  assists: 0,
  headshot: 0,
  game_mode: "",
  damage_done: 0,
  team_scores: 0,
  total_kills: 0,
  damage_taken: 0,
  match_status: false,
  spikes_defuse: 0,
  spikes_planted: 0,
};

function formatRequirement(requirement: ChallengeProps["requirement"]) {
  // Find all requirements that differ from default values
  const relevantRequirements = Object.entries(requirement).filter(
    ([key, value]) => {
      const defaultValue = DEFAULT_VALUES[key as keyof typeof DEFAULT_VALUES];
      return defaultValue !== undefined && value !== defaultValue;
    }
  );

  if (relevantRequirements.length === 0) return "No requirements";

  // Format each requirement
  const requirements = relevantRequirements
    .map(([key, value]) => {
      // Convert snake_case to Title Case and remove 'total_' prefix
      const formattedKey = key
        .replace("total_", "")
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      return `${value} ${formattedKey}`;
    })
    .join(" and ");

  return requirements;
}

function calculateProgress(requirement: ChallengeProps["requirement"]): {
  completed: number;
  total: number;
} {
  // For now, we'll focus on total_kills as that's what we see in the data
  if (requirement.total_kills > 0) {
    return {
      completed: Math.min(requirement.total_kills, 2), // Cap the completed value at 2
      total: 2,
    };
  }

  return { completed: 0, total: 2 };
}

export default function Challenge({
  completed,
  total,
  name,
  requirement,
  isStarted,
}: ChallengeProps) {
  // Ensure we have valid values for rendering
  const validTotal = total || 0;
  const validCompleted = completed || 0;
  const progressPercentage =
    validTotal > 0 ? (validCompleted / validTotal) * 100 : 0;

  return (
    <li>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <h2 className="font-Impact text-xl">{name}</h2>
          <div className="flex items-center gap-2">
            <div className="w-32 h-2 bg-[#383838] rounded-full">
              <div
                className="h-full bg-[#00FF00] rounded-full"
                style={{
                  width: `${progressPercentage}%`,
                }}
              />
            </div>
            <span className="font-Poppins text-sm">
              {isStarted
                ? `${validCompleted}/${validTotal}`
                : `0/${validTotal}`}
            </span>
          </div>
        </div>
        <p className="font-Poppins text-sm text-[#C6C6C6]">
          {formatRequirement(requirement)}
        </p>
      </div>
    </li>
  );
}
