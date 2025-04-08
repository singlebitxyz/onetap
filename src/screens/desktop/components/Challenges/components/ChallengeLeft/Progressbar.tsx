import { useEffect, useState } from "react";

export default function Progressbar({
  completed,
  total,
  color = "#692CCD",
  className,
}: {
  completed: number;
  total: number;
  color?: string;
  className?: string;
}) {
  const [currentProgress, setCurrentProgress] = useState<number>(completed);
  const updateProgress = (newProgress: number) => {
    setCurrentProgress(newProgress); // Clamp between 0 and 100
  };

  useEffect(() => {
    updateProgress(completed);
  });

  return (
    <div className={`w-full ${className}`}>
      <div
        className={`flex items-center justify-start w-full rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 h-3`}
      >
        <div
          className={`h-full rounded-full text-transparent bg-[${color}]`}
          style={{
            width: `${Math.min(Math.max(0, Math.floor((currentProgress / total) * 100)), 100)}%`,
          }}
        />
      </div>
    </div>
  );
}
