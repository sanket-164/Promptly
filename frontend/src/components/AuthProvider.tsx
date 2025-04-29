"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { UserBasicOps } from "@/lib/interactions/dataPosters";
import { toaster } from "./ui/toaster";

type Props = {
  children: React.ReactNode;
};

const AuthProvider = ({ children }: Props) => {
  const { mutate } = useMutation({
    mutationFn: UserBasicOps.verifyToken,
  });
  const router = useRouter();
  useEffect(() => {
    mutate(
      {},
      {
        onSuccess(data) {
          if (!data.success) {
            toaster.warning({
              title: "Session expired",
              description: "Please log in again.",
            });

            router.push("/login");
          }
        },
      }
    );
  }, [mutate, router]);

  return <div>{children}</div>;
};

export default AuthProvider;
