"use client";

import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { ColorModeProvider, type ColorModeProviderProps } from "./color-mode";
import { Toaster } from "./toaster";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Loader from "../Loader";

export function Provider(props: ColorModeProviderProps) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider value={defaultSystem}>
        <ColorModeProvider {...props} />
        <Toaster />
        <Loader />
      </ChakraProvider>
    </QueryClientProvider>
  );
}
