"use client";

import { createContext, useContext, ReactNode } from "react";
import { RegionsData } from "../types/regions";

interface RegionsContextType {
  regions: RegionsData["data"];
}

const RegionsContext = createContext<RegionsContextType | undefined>(undefined);

interface RegionsProviderProps {
  children: ReactNode;
  regions: RegionsData["data"];
}

export function RegionsProvider({ children, regions }: RegionsProviderProps) {
  return (
    <RegionsContext.Provider value={{ regions }}>
      {children}
    </RegionsContext.Provider>
  );
}

export function useRegions() {
  const context = useContext(RegionsContext);
  if (context === undefined) {
    throw new Error("useRegions must be used within a RegionsProvider");
  }
  return context;
}
