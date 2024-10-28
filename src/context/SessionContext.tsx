import { endpoints, fullUrl } from "@/api";
import {
  ApiResponse,
  EndSessionRequest,
  FlashcardProgress,
  Session,
  StartSessionRequest,
  StartSessionResponse,
} from "@/ts/interface";
import { post, put } from "@/utils";
import { createContext, useEffect, useState } from "react";
import { SlControlStart } from "react-icons/sl";

export const SessionContext = createContext<undefined | Session>(undefined);

export const SesssionContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [hasEnded, setHasEnded] = useState<boolean>(false);
  const [setId, setSetId] = useState<number>();
  const [sessionId, setSessionId] = useState<number>();
  const [sessionFlashcards, setSessionFlashcards] = useState<
    FlashcardProgress[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const handleStartSession = async () => {
      if (setId === undefined) return;
      try {
        setIsLoading(true);
        const res = await post<
          StartSessionRequest,
          ApiResponse<StartSessionResponse>
        >(fullUrl(endpoints.sessions), { flashcard_set_id: setId });
        setSessionFlashcards(res.data.flashcards);
        setSessionId(res.data.session_id);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };
    if (hasStarted) handleStartSession();
  }, [hasStarted, setId]);

  useEffect(() => {
    const handleEndSession = async () => {
      if (sessionId === undefined) return;
      if (setId === undefined) return;
      try {
        setIsLoading(true);
        await put<EndSessionRequest, ApiResponse<undefined>>(
          fullUrl(endpoints.sessionById(sessionId?.toString())),
          {
            session_id: sessionId,
            flashcard_set_id: setId,
            flashcards: sessionFlashcards,
          }
        );
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };
    if (hasEnded) handleEndSession();
  }, [hasEnded, sessionId, sessionFlashcards, setId]);

  console.log(hasStarted, "fetching session");

  return (
    <SessionContext.Provider
      value={{
        hasEnded,
        hasStarted,
        isLoading,
        sessionFlashcards,
        sessionId,
        setHasEnded,
        setHasStarted,
        setId,
        setIsLoading,
        setSessionFlashcards,
        setSessionId,
        setSetId,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};