"use client";

import * as React from "react";

type SidebarContextProps = {
  state: "collapsed" | "expanded";
  open: boolean;
  isMobile: boolean;
  toggleSidebar: () => void;
};

const SidebarContext = React.createContext<SidebarContextProps | null>(null);

export function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }

  return context;
}

export { SidebarContext };
export type { SidebarContextProps };
