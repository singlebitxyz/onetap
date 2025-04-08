import { ReactNode, useContext } from "react";
import { NavLink } from "react-router-dom";
import { ActiveRouteContext } from "screens/desktop/components/Contexts/ActiveRouteContext";

export default function ListCompoenent({
  children,
  to,
  iconSrc,
  className,
}: {
  children: ReactNode;
  to: string;
  iconSrc: string;
  className?: string;
}) {
  const { handleRouteChange, activeRoute } = useContext(ActiveRouteContext);
  const activeIconSrc = iconSrc + "Active";

  return (
    <li
      onClick={() => handleRouteChange(`${to}`)}
      className={`flex my-5 py-0 items-center ${className}`}
    >
      <img
        className={`h-5 w-5`}
        src={`/icons/${activeRoute === to ? activeIconSrc : iconSrc}.svg`}
        alt=""
      />
      <NavLink
        to={to}
        className={`text-xl px-2 ${activeRoute === to ? "bg-clip-text text-transparent bg-gradient-to-r from-[#9B6CFF] to-[#DBBBFF]" : ""}`}
      >
        {" "}
        {children}
      </NavLink>
    </li>
  );
}
