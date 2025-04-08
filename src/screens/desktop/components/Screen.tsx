import { Titlebar } from "components/TItlebar/Titlebar";
import UserForm from "./UserOnboarding/UserForm";
import Sidebar from "components/Sidebar/Sidebar";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Header from "components/Header/Header";
import Home from "./Home/Home";
import "./styles/Screen.css";
import Challenges from "./Challenges/Challenges";
import Leaderboard from "./Leaderboard/Leaderboard";
import { ActiveRouteProvider } from "./Contexts/ActiveRouteContext";
import { FilterProvider } from "./Contexts/FilterContext";
import { Inventory } from "./Inventory/Inventory";
import { Page } from "./Inventory/Page";
import Marketplace from "./Marketplace/Marketplace";
import { Overview } from "features/overview";
import UserProfile from "./UserProfile/UserProfile";
import { Subscription } from "./Subscription/Subscription";

export default function Screen() {
  return (
    <>
      <ActiveRouteProvider>
        <FilterProvider>
          <Titlebar className="fixed top-0 right-0" WINDOW_NAME="desktop" />
          <div className="grid grid-cols-5">
            <MemoryRouter>
              <Sidebar className="fixed left-0 top-0 col-span-1 row-span-5" />
              <Header className="col-start-2 col-span-4 row-span-2" />
              <Inventory />
              <Inventory />
              <Routes>
                <Route
                  path="/"
                  element={
                    <Home className="grow mt-10 col-start-2 col-span-4" />
                  }
                />
                <Route
                  path="/onboard"
                  element={<UserForm className="grow col-start-2 col-span-4" />}
                />
                <Route
                  path="/challenges"
                  element={
                    <Challenges className="grow col-start-2 col-span-4" />
                  }
                />
                <Route
                  path="/leaderboard"
                  element={
                    <Leaderboard className="grow col-start-2 col-span-4" />
                  }
                />
                <Route
                  path="/inventory"
                  element={<Page className="grow col-start-2 col-span-4" />}
                />
                <Route
                  path="/marketplace"
                  element={
                    <Marketplace className="grow col-start-2 col-span-4" />
                  }
                />
                <Route
                  path="/overview"
                  element={<Overview className="grow col-start-2 col-span-4" />}
                />
                <Route
                  path="/userProfile"
                  element={
                    <UserProfile className="grow col-start-2 col-span-4" />
                  }
                />
                <Route
                  path="/subscription"
                  element={
                    <Subscription className="grow col-start-2 col-span-4" />
                  }
                />
              </Routes>
            </MemoryRouter>
          </div>
        </FilterProvider>
      </ActiveRouteProvider>
    </>
  );
}
