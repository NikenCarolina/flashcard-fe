import { SessionContext } from "@/context";
import { Session } from "@/ts/interface";
import { useContext } from "react";

export const useSession = (): Session => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionContextProvider");
  }
  return context;
};
