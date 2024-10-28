import { FlashcardProgress } from "./flashcard_progress.interface";

export interface Session {
  hasEnded: boolean;
  hasStarted: boolean;
  isLoading: boolean;
  sessionFlashcards: FlashcardProgress[];
  sessionId: number | undefined;
  setHasEnded: React.Dispatch<React.SetStateAction<boolean>>;
  setHasStarted: React.Dispatch<React.SetStateAction<boolean>>;
  setId: number | undefined;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setSessionFlashcards: React.Dispatch<
    React.SetStateAction<FlashcardProgress[]>
  >;
  setSessionId: React.Dispatch<React.SetStateAction<number | undefined>>;
  setSetId: React.Dispatch<React.SetStateAction<number | undefined>>;
}

export interface StartSessionResponse {
  session_id: number;
  flashcards: FlashcardProgress[];
}

export interface StartSessionRequest {
  flashcard_set_id: number;
}

export interface EndSessionRequest {
  session_id: number;
  flashcard_set_id: number;
  flashcards: FlashcardProgress[];
}
