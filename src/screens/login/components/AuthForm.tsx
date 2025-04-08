import { SetStateAction, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  ConsoleAuthError,
  loginEP,
  UseloginProvider,
  signUp,
  forgotPassword,
} from "lib/auth.utils";
import { useWindow } from "overwolf-hooks";
import {
  DISPLAY_OVERWOLF_HOOKS_LOGS,
  WINDOW_NAMES,
} from "app/shared/constants";

type formValues = {
  email: string;
  password: string;
  confirmPassword?: string;
};

const initialValues: formValues = {
  email: "",
  password: "",
  confirmPassword: "",
};

// Validation schemas
const loginValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const signupValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
});

const handleSubmit = async (
  values: formValues,
  isSignup: SetStateAction<boolean>
) => {
  if (isSignup) {
    const error = await signUp(values.email, values.password);
    if (error) ConsoleAuthError(error);
  } else {
    const error = await loginEP(values.email, values.password);
    if (error) ConsoleAuthError(error);
    // Window management is now handled by useSupLogin
  }
};

const AuthForm = () => {
  const [isSignup, setIsSignup] = useState(false);
  const discordLogin = UseloginProvider("discord");
  const googleLogin = UseloginProvider("google");
  const switchMode = () => {
    setIsSignup(!isSignup);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={
        isSignup ? signupValidationSchema : loginValidationSchema
      }
      onSubmit={(values, { setSubmitting }) => {
        setSubmitting(true);
        handleSubmit(values, isSignup).finally(() => setSubmitting(false));
      }}
    >
      {({ values }) => (
        <Form className="flex flex-col gap-1 overflow-y-auto">
          {/* Email Field */}
          <div className="flex flex-col mb-2">
            <label
              htmlFor="email"
              className="text-sm font-light text-gray-400 mb-1"
            >
              Email
            </label>
            <Field
              name="email"
              type="email"
              className="w-full p-2 rounded bg-[#1C2B3A] text-white"
            />
            <ErrorMessage
              name="email"
              component="div"
              className="text-red-600 text-sm"
            />
          </div>

          {/* Password Field */}
          <div className="flex flex-col mb-2">
            <label
              htmlFor="password"
              className="text-sm font-light text-gray-400 mb-1"
            >
              Password
            </label>
            <Field
              name="password"
              type="password"
              className="w-full p-2 rounded bg-[#1C2B3A] text-white"
            />
            <ErrorMessage
              name="password"
              component="div"
              className="text-red-600 text-sm"
            />
          </div>

          {/* Confirm Password Field */}
          {isSignup && (
            <div className="flex flex-col mb-2">
              <label
                htmlFor="confirmPassword"
                className="text-sm font-light text-gray-400 mb-1"
              >
                Confirm Password
              </label>
              <Field
                name="confirmPassword"
                type="password"
                className="w-full p-2 rounded bg-[#1C2B3A] text-white"
              />
              <ErrorMessage
                name="confirmPassword"
                component="div"
                className="text-red-600 text-sm"
              />
            </div>
          )}

          {/* Reset Password and Switch Mode */}
          <div className="flex items-end justify-between mt-4">
            <button
              type="button"
              onClick={() => forgotPassword(values.email)}
              className="px-4 py-2.5 border-none rounded hover:underline text-white hover:text-blue-300"
            >
              Reset Password!
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-white">
              {isSignup ? "Already have an account?" : "Don't have an account?"}
            </span>
            <button
              type="button"
              onClick={switchMode}
              className="px-4 py-2.5 border-none rounded hover:underline text-white hover:text-blue-300"
            >
              {isSignup ? "Sign In" : "Sign Up"}
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full mt-4 bg-blue-600 text-white p-3 rounded hover:bg-blue-700"
          >
            {isSignup ? "Sign Up" : "Login"}
          </button>

          {/* Social Login Buttons */}
          <div className="flex gap-4 mt-5">
            <button
              onClick={discordLogin}
              className="px-4 py-2.5 rounded hover:opacity-60 flex items-center justify-center"
            >
              <img
                src="/discord-icon.svg"
                alt="Login with Discord"
                className="h-6"
              />
            </button>
            <button
              onClick={googleLogin}
              className="px-4 py-2.5 rounded hover:opacity-60 flex items-center justify-center"
            >
              <img
                src="/google-icon.svg"
                alt="Login with Google"
                className="h-6"
              />
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default AuthForm;
