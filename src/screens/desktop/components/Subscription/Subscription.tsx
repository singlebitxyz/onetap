import { useState, useEffect } from "react";
import { SubscriptionData } from "types";
import SubscriptionCard from "./components/SubscriptionCard";
import { useSelector } from "react-redux";

export const Subscription = ({ className }: { className: string }) => {
  const { userInfo } = useSelector((state: any) => state.background);

  const defaultSubscriptionData: SubscriptionData[] = [];
  const defaultActivePlan: SubscriptionData = {
    id: 0,
    tier: "",
    cost: 0,
    startTime: "",
    endTime: null,
    benefits: [],
    active: false,
  };

  const subscriptionHeros = ["/dice.png", "/stars.png"];

  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData[]>(
    defaultSubscriptionData
  );
  const [activePlan, setActivePlan] =
    useState<SubscriptionData>(defaultActivePlan);

  useEffect(() => {
    async function fetchSubscriptionData() {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/subscriptions/get-subscriptions`
        );
        const data = await response.json();
        setSubscriptionData(data);
      } catch (error) {
        console.error("Failed to fetch subscription data:", error);
      }
    }

    fetchSubscriptionData();
  }, []);

  useEffect(() => {
    function checkActivePlan() {
      if (userInfo.premiumUser) {
        setActivePlan(
          subscriptionData?.find(
            (subscription: SubscriptionData) => subscription.tier === "premium"
          ) || defaultActivePlan
        );
      } else {
        setActivePlan(
          subscriptionData?.find(
            (subscription: SubscriptionData) => subscription.tier === "free"
          ) || defaultActivePlan
        );
      }
    }

    checkActivePlan();
  }, [subscriptionData, userInfo.premiumUser]);

  return (
    <div className={`${className} min-h-screen`}>
      <h1 className="font-Impact text-2xl">Subscription Plans</h1>
      <div className="mt-4">
        <div className="flex gap-8 max-w-6xl">
          {subscriptionData?.map((subscription, index) => (
            <div key={subscription.id} className="w-[500px] font-Impact">
              <SubscriptionCard
                hero={subscriptionHeros[index]}
                {...subscription}
                planIsActive={activePlan}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
