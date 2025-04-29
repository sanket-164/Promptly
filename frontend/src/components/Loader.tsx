"use client";

import { Spinner } from "@chakra-ui/react";

import useLoader from "@/hooks/useLoader";

export default function Loader() {
  const { isLoading } = useLoader();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <Spinner size="xl" />
    </div>
  );
}
