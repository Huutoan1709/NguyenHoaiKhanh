"use client";

import { createContext, useContext, ReactNode } from "react";

interface LayoutContextType {
  showHeader: boolean;
  showFooter: boolean;
}

const LayoutContext = createContext<LayoutContextType>({
  showHeader: true, 
  showFooter: true
});

export const useLayout = () => useContext(LayoutContext);

interface LayoutProviderProps {
  children: ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
}

export function LayoutProvider({ 
  children,
  showHeader = true,
  showFooter = true
}: LayoutProviderProps) {
  return (
    <LayoutContext.Provider value={{ showHeader, showFooter }}>
      {children}
    </LayoutContext.Provider>
  );
}