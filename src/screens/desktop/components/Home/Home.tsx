import Carousel from "components/CardsCarousel/Carousel";
import GamesBanner from "./GamesBanner";
import { useDesktopHooks } from "../Desktop.hooks";
import PopCards from "components/CardsCarousel/PopCards";
import DodCards from "components/CardsCarousel/DodCards";
import Banner from "../../../../components/Banner/Banner";
import CODBanner from "./CODBanner";
import { supabase } from "app";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setUserId,
  setAuth,
  setUserInfo,
  setChallenges,
  setCouponsCount,
} from "screens/background/stores/background";
import ChallengeCards from "components/CardsCarousel/ChallengeCards";

export default function Home({ className }: { className: string }) {
  useDesktopHooks();
  const { userId, userInfo } = useSelector((state: any) => state.background);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch<any>();

  useEffect(() => {
    console.log("UserProfile - AuthId:", userInfo.Auth);
    console.log("UserProfile - UserId:", userId);
    console.log("UserProfile - UserInfo:", userInfo);
  }, [userInfo.Auth, userId, userInfo]);

  useEffect(() => {
    async function fetchAndSetChallenges() {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/challenges/all-ongoing-challenges`
        );
        const data = await response.json();
        console.log(data);
        dispatch(setChallenges(data));
      } catch (error) {
        console.error("Failed to fetch challenges:", error);
      }
    }

    async function fetchAndSetCouponsCount() {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/marketplace/coupon-count-by-game`
        );
        const data = await response.json();
        dispatch(setCouponsCount(data));
      } catch (error) {
        console.error("Failed to fetch coupons count:", error);
      }
    }

    fetchAndSetChallenges();
    fetchAndSetCouponsCount();
  }, [dispatch]);

  async function checkUserExists(authId: string) {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/user/basic-info/${authId}`,
        { method: "GET" }
      ).then((res) => res.json());
      return response;
    } catch (error) {
      console.error("Failed to check if user exists:", error);
      return null;
    }
  }

  async function fetchUserIdFromDb(authId: string) {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/user/profile-data/${authId}`,
        {
          method: "POST",
          body: JSON.stringify({
            Auth: authId,
            userName: `user ${authId}`,
          }),
          headers: { "Content-Type": "application/json" },
        }
      ).then((res) => res.json());
      if (response) {
        await dispatch(setUserId(response.id));
        return response.id;
      }
    } catch (error) {
      console.error("Failed to fetch user ID:", error);
    }
  }

  useEffect(() => {
    async function fetchAndSetUserInfo() {
      setIsLoading(true);
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error) throw error;
        if (data.user) {
          const fetchedAuthId = data.user.id;
          console.log("Fetched AuthId:", fetchedAuthId);

          await dispatch(setAuth(fetchedAuthId));

          const userExists = await checkUserExists(fetchedAuthId);
          if (!userExists) {
            const newUserId = await fetchUserIdFromDb(fetchedAuthId);
            console.log("New User Created:", newUserId);
          } else {
            console.log("Existing User:", userExists);
            await dispatch(setUserInfo(userExists));
            await dispatch(setUserId(userExists.id));
          }
        }
      } catch (error) {
        console.error("Error fetching or setting user info:", error);
      } finally {
        setIsLoading(false);
      }
    }

    // if (!userInfo.Auth) {
    fetchAndSetUserInfo();
    // }
  }, [dispatch, userInfo.Auth]);

  return (
    <div className={`${className}`}>
      <GamesBanner />
      <Carousel title="Top challenges">
        <ChallengeCards />
      </Carousel>
      <Carousel title="Top Games">
        <DodCards />
      </Carousel>
      <Banner className="ml-2 mr-20" imgSrc="pubg">
        <CODBanner />
      </Banner>
      {/* <Carousel>
        <DodCards />
      </Carousel> */}
    </div>
  );
}
