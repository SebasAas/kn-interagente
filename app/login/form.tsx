"use client";

import { useState } from "react";

// Next
import type { NextPage } from "next";
import { useSearchParams, useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Image from "next/image";

// Components
import { Input, Card, CardBody, Progress } from "@nextui-org/react";

// Assets
import { MailIcon } from "../(assets)/MailIcon";
import { EyeSlashFilledIcon } from "../(assets)/EyeSlashFilledIcon";
import { EyeFilledIcon } from "../(assets)/EyeFilledIcon";

const Login: NextPage = () => {
  const router = useRouter();

  const searchParams: any = useSearchParams();

  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isInvalid, setIsInvalid] = useState({
    email: false,
    password: false,
  });
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isValidEmail = validateEmail(formValues.email);

    if (!isValidEmail) {
      setIsInvalid({
        ...isInvalid,
        email: true,
      });
      return;
    }

    try {
      setLoading(true);

      const res = await signIn("credentials", {
        redirect: false,
        email: formValues.email,
        password: formValues.password,
        callbackUrl,
      });

      setLoading(false);

      if (!res?.error) {
        window.location.href = callbackUrl;
      } else {
        console.error(res?.error);

        setError(res?.error);
      }
    } catch (error: any) {
      setLoading(false);
      setError(error);
    }
  };

  // const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = event.target;
  //   setFormValues({ ...formValues, [name]: value });
  // };

  const validateEmail = (value: string) =>
    value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i);

  return (
    <form className="flex flex-row h-full" onSubmit={onSubmit}>
      <div className="w-[70%]">
        <Image
          className="w-full h-full object-cover"
          alt="woman with phone"
          src="/pexelstimamiroshnichenko6169659-1@2x.png"
          width="0"
          height="0"
          sizes="vh"
        />
      </div>
      <div className="w-[30%]">
        <div className="w-auto flex flex-col p-12 h-full box-border items-center justify-around">
          <div className="self-stretch flex flex-col items-start justify-start gap-6">
            <div className="w-full flex flex-col items-center justify-center">
              <div className="relative w-[203px] h-[39px]">
                <Image
                  className="h-full w-full object-cover"
                  alt="k+n logo"
                  src="/kuehnenagellogoblue-4@2x.png"
                  width="203"
                  height="39"
                />
              </div>
              <Progress
                size="sm"
                isIndeterminate={loading ? true : false}
                aria-label="Loading..."
                className="mt-8 w-full"
                classNames={{
                  base: "h-[2px] bg-gray-200",
                  indicator: "h-[2px] bg-blue-900",
                }}
              />
            </div>
            {error && (
              <Card
                classNames={{
                  base: "w-full rounded-sm",
                  body: "bg-red-100 w-full p-3 text-center",
                }}
              >
                <CardBody>
                  <p className="text-red-500 text-sm capitalize">{error}</p>
                </CardBody>
              </Card>
            )}
            <div className="self-stretch flex flex-col items-center justify-start gap-4">
              <Input
                type="email"
                label="Email"
                placeholder="Enter your email"
                value={formValues.email}
                onValueChange={(value: string) => {
                  if (isInvalid.email)
                    setIsInvalid({ ...isInvalid, email: false });

                  setFormValues({
                    ...formValues,
                    email: value,
                  });
                }}
                labelPlacement="outside"
                endContent={
                  <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                }
                variant="bordered"
                radius="sm"
                isInvalid={isInvalid.email}
                errorMessage={isInvalid.email && "Please enter a valid email"}
                classNames={{
                  label: "text-[0.8rem]",
                }}
              />
              <Input
                type={isVisible ? "text" : "password"}
                label="Password"
                placeholder="Enter your password"
                value={formValues.password}
                onValueChange={(value: string) =>
                  setFormValues({
                    ...formValues,
                    password: value,
                  })
                }
                labelPlacement="outside"
                endContent={
                  <button
                    className="focus:outline-none"
                    type="button"
                    onClick={toggleVisibility}
                  >
                    {isVisible ? (
                      <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                    ) : (
                      <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                    )}
                  </button>
                }
                variant="bordered"
                radius="sm"
                classNames={{
                  label: "text-[0.8rem]",
                }}
              />
              <div className="self-stretch flex flex-row items-start justify-start mt-2 text-[0.67rem]">
                <div className="flex-1 flex flex-row items-center justify-start gap-[0.44rem]">
                  <div className="flex-1 relative tracking-[0.3px] leading-[1.11rem]">
                    {/* Remember me */}
                  </div>
                </div>
                <div className="flex-1 relative tracking-[0.3px] leading-[1.11rem] text-main-color text-right">
                  Forgot password?
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="self-stretch bg-blue-950 rounded-md bg-main-color flex flex-col py-[0.56rem] px-[1.33rem] items-center justify-center cursor-pointer text-center text-[0.89rem] text-white"
            >
              Sign In
            </button>
          </div>
          <div></div>
        </div>
      </div>
    </form>
  );
};

export default Login;
