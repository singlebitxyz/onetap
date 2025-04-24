import { SubscriptionData } from "types";
import { Check } from "lucide-react";
import { HiSparkles } from "react-icons/hi";

interface SubscriptionCardProps {
  id: number;
  tier: string;
  cost: number;
  benefits: {
    benefit: string;
    description: string;
  }[];
  planIsActive: SubscriptionData;
  hero?: string;
}

const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  id,
  tier,
  cost,
  benefits,
  planIsActive,
  hero,
}) => {
  const isActive = planIsActive.id === id;
  const isPremium = tier.toLowerCase() === "premium";

  return (
    <div
      className={`border overflow-hidden w-full h-max flex flex-col font-Impact ${
        isPremium ? "border-yellow-600" : "border-gray-700"
      }`}
    >
      <div
        className={`p-6 flex flex-col items-center relative h-[30vh] ${
          isPremium
            ? "bg-gradient-to-b from-[#A98848] to-[#F5D0873D]"
            : "bg-[#1A1717]"
        }`}
      >
        {isActive && (
          <span className="absolute top-0 right-0 bg-green-500 text-white text-sm font-bold px-3 py-1">
            Active Plan
          </span>
        )}

        {isPremium ? (
          <div className="rounded-full w-28 h-28 p-2 bg-yellow-500 border-5 border-white mb-4">
            <HiSparkles className="w-full h-full text-white" />
          </div>
        ) : (
          <img
            src={hero}
            alt="Basic Plan"
            className="w-28 h-28 mb-4"
            style={{ transform: "rotate(-25deg)" }}
          />
        )}

        <h2 className="text-xl font-bold font-Impact tracking-wider">
          {tier.toUpperCase()} PLAN
        </h2>
        <p
          className={`text-lg font-bold tracking-wider ${
            isPremium ? "text-yellow-200" : "text-purple-400"
          }`}
        >
          {cost === 0 ? "Free" : `Rs ${cost} / Month`}
        </p>
      </div>
      <div className="bg-[#262626] h-max min-h-[30vh] p-4 font-Poppins">
        {isPremium && (
          <p className="text-yellow-400 font-semibold mb-2 text-center">
            Everything included in basic plan plus
          </p>
        )}
        <ul className="space-y-3">
          {benefits.map((benefit, index: number) => (
            <li key={index} className="flex items-center space-x-8 pl-5">
              <Check
                className={isPremium ? "text-yellow-500" : "text-purple-500"}
                size={20}
              />
              <div>
                <span className="font-semibold">{benefit.benefit}</span>
                <p className="text-sm text-gray-400">{benefit.description}</p>
              </div>
            </li>
          ))}
        </ul>
        {isPremium && (
          <div className="flex items-center justify-center mt-8">
            <button className="bg-gradient-to-b font-Ranchers tracking-widest from-[#AB8E55] to-[#AE780F] text-white font-bold w-60 py-2 hover:bg-gradient-to-b hover:from-[#AB8E55] hover:to-[#AE780F]">
              Upgrade To Premium
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionCard;
