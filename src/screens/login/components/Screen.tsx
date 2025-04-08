import { Titlebar } from "components/TItlebar/Titlebar";
import AuthForm from "./AuthForm";
import { WINDOW_NAMES } from "app/shared/constants";
import { useSupLogin } from "lib/auth.utils";

export default function Screen() {
  useSupLogin();

  return (
    <>
      <Titlebar WINDOW_NAME={WINDOW_NAMES.LOGIN} />
      <section className="flex h-[95vh]">
        <section style={{ flexBasis: "60%" }}>
          <img
            src="/banner.jpg"
            alt="OneTap Banner"
            className="w-full h-full object-cover"
          />
        </section>
        <section
          style={{ flexBasis: "40%" }}
          className="flex flex-col justify-center items-center bg-[#000517] text-white"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6 md:mb-10">
            Sign in into OneTap
          </h2>
          <AuthForm />
        </section>
      </section>
    </>
  );
}
