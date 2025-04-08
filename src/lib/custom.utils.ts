interface Item {
  [key: string]: number | boolean | string;
}

interface Result {
  aggregate: number;
  anyTrue: boolean;
  firstString: string | null;
}

type FinalResult = number | boolean | string | null;

interface Results {
  [key: string]: Result;
}

interface FinalResults {
  [key: string]: FinalResult;
}

interface TypeStrategy {
  isApplicable: (value: any) => boolean;
  execute: (key: string, value: any, results: Results) => void;
}

// Defining type strategies
const numberStrategy: TypeStrategy = {
  isApplicable: (value): value is number => typeof value === "number",
  execute: (key, value, results) => {
    results[key].aggregate += value;
  },
};

const booleanStrategy: TypeStrategy = {
  isApplicable: (value): value is boolean => typeof value === "boolean",
  execute: (key, value, results) => {
    if (value) {
      results[key].anyTrue = true;
    }
  },
};

const stringStrategy: TypeStrategy = {
  isApplicable: (value): value is string => typeof value === "string",
  execute: (key, value, results) => {
    if (results[key].firstString === null) {
      results[key].firstString = value;
    }
  },
};

const strategies: TypeStrategy[] = [
  numberStrategy,
  booleanStrategy,
  stringStrategy,
];

interface ChallengeData {
  id: number;
  requirements: Record<string, any>; // Change the type to `any` to allow mixed types
  startTime: string;
  endTime: string;
  type: string;
  name: string;
  Game: {
    gameName: string;
  };
}

function aggregateRequirements(challengeDataArray: ChallengeData[]): {
  [key: string]: string | boolean | number;
} {
  const aggregatedRequirements: Record<string, any> = {};

  challengeDataArray.forEach((challengeData) => {
    Object.entries(challengeData.requirements).forEach(([key, value]) => {
      // Assuming type based on key - need to adjust according to actual data structure
      if (typeof value === "number") {
        if (!aggregatedRequirements[key]) {
          aggregatedRequirements[key] = 0;
        }
        aggregatedRequirements[key] += value;
      } else if (typeof value === "boolean") {
        if (!aggregatedRequirements[key]) {
          aggregatedRequirements[key] = false;
        }
        aggregatedRequirements[key] = aggregatedRequirements[key] || value;
      } else if (typeof value === "string") {
        if (!aggregatedRequirements[key]) {
          aggregatedRequirements[key] = value;
        }
      }
    });
  });

  return aggregatedRequirements;
}
