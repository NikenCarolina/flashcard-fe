import style from "./index.module.css";
import { Button, LessonCard } from "@/components";
import {
  ApiResponse,
  EndSessionRequest,
  FlashcardProgress,
} from "@/ts/interface";
import { commonContent } from "@/content";
import { routes } from "@/constants";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@/hooks";
import { IoCloseSharp } from "react-icons/io5";
import { put, toClassNames } from "@/utils";
import { endpoints, fullUrl } from "@/api";

const LessonPage = () => {
  const {
    isLoading,
    sessionFlashcards,
    setSessionFlashcards,
    setHasEnded,
    setHasStarted,
    hasStarted,
    hasEnded,
    setId,
    sessionId,
  } = useSession();
  const navigate = useNavigate();

  const [endSessionPrompt, setEndSessionPrompt] = useState<boolean>(false);
  const [current, setCurrent] = useState<FlashcardProgress | null>(null);
  const [index, setIndex] = useState<number>(0);
  const [correct, setCorrect] = useState<number>(0);
  const [isEndLoading, setIsEndLoading] = useState<boolean>(false);

  useEffect(() => {
    const handleRefresh = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", handleRefresh);
    return () => {
      window.removeEventListener("beforeunload", handleRefresh);
    };
  }, []);

  useEffect(() => {
    if (setId === undefined) navigate(routes.sets);
  }, [setId, navigate]);

  useEffect(() => {
    setHasStarted(true);
    setHasEnded(false);
    return () => {
      setHasStarted(false);
      setHasEnded(false);
    };
  }, [setHasStarted, setHasEnded]);

  useEffect(() => {
    if (
      !isLoading &&
      sessionFlashcards.length > 0 &&
      sessionFlashcards[index] !== undefined
    )
      setCurrent(sessionFlashcards[index]);
  }, [index, sessionFlashcards, isLoading]);

  const handleNextCard = async (isCorrect: boolean) => {
    if (isCorrect) setCorrect(correct + 1);
    setSessionFlashcards((prev) => {
      const newCard = [...prev];
      newCard[index] = { ...newCard[index], is_correct: isCorrect };
      return newCard;
    });
    if (index + 1 >= sessionFlashcards.length) {
      if (sessionId === undefined) return;
      if (setId === undefined) return;
      try {
        setIsEndLoading(true);
        const newCard = [...sessionFlashcards];
        newCard[index] = { ...newCard[index], is_correct: isCorrect };
        await put<EndSessionRequest, ApiResponse<undefined>>(
          fullUrl(endpoints.sessionById(sessionId?.toString())),
          {
            session_id: sessionId,
            flashcard_set_id: setId,
            flashcards: newCard,
          }
        );
        setHasEnded(true);
        setHasStarted(false);
        setCurrent(null);
      } catch (err) {
        console.log(err);
      } finally {
        setIsEndLoading(false);
      }
    }
    setIndex(index + 1);
  };

  const handleEndSessionPrompt = () => {
    setEndSessionPrompt(true);
  };

  return (
    <>
      <div className={style.content_wrapper}>
        {isLoading && <p>{commonContent.loading}</p>}
        {!isLoading && hasStarted && !hasEnded && current !== null && (
          <>
            <div className={style.header}>
              <Button onClick={handleEndSessionPrompt} style={{ zIndex: 1 }}>
                <IoCloseSharp size={20} />
              </Button>
              <div
                className={style.loading}
                style={
                  {
                    "--loading-width": `${
                      isEndLoading
                        ? 100
                        : (index / sessionFlashcards.length) * 100
                    }%`,
                  } as React.CSSProperties
                }
              ></div>
              <div>
                <p className={style.percentage}>
                  {isEndLoading
                    ? 100
                    : Math.round((index / sessionFlashcards.length) * 100)}{" "}
                  %
                </p>
              </div>
            </div>
            <div className={style.assesments_wrapper}>
              <LessonCard term={current.term} definition={current.definition} />
              <div className={style.actions}>
                <Button
                  onClick={() => handleNextCard(true)}
                  className={style.action}
                  variant="green"
                  disabled={isEndLoading}
                >
                  {commonContent.correct}
                </Button>
                <Button
                  onClick={() => handleNextCard(false)}
                  className={style.action}
                  variant="red"
                  disabled={isEndLoading}
                >
                  {commonContent.incorrect}
                </Button>
              </div>
            </div>
          </>
        )}

        {!isLoading && hasEnded && setId !== undefined && (
          <div className={style.assesments_wrapper}>
            <h2>{commonContent.review}</h2>
            <div className={style.assesments}>
              <div className={toClassNames(style.assesment, style.green)}>
                <h3>{commonContent.correct}</h3>
                <p>{correct}</p>
              </div>
              <div className={toClassNames(style.assesment, style.red)}>
                <h3>{commonContent.incorrect}</h3>
                <p>{sessionFlashcards.length - correct}</p>
              </div>
            </div>
            <div className={style.actions}>
              <Button
                onClick={() => navigate(routes.setsById(setId!.toString()))}
                className={style.action}
              >
                {commonContent.back}
              </Button>
            </div>
          </div>
        )}
      </div>
      {endSessionPrompt && (
        <div className={style.prompt_wrapper}>
          <button
            onClick={() => setEndSessionPrompt(false)}
            className={style.background_prompt}
          ></button>
          <div className={style.prompt}>
            <div className={style.confirmation}>
              <p>{commonContent.endSessionConfirmation}</p>
            </div>

            <div className={style.actions}>
              <Button
                onClick={() => navigate(routes.setsById(setId?.toString()))}
                className={style.action}
              >
                {commonContent.proceed}
              </Button>
              <Button
                onClick={() => setEndSessionPrompt(false)}
                className={style.action}
              >
                {commonContent.cancel}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LessonPage;
