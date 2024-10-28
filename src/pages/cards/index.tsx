import { endpoints, fullUrl } from "@/api";
import { Button, Card } from "@/components";
import {
  ApiResponse,
  Flashcard,
  FlashcardBulkRes,
  FlashcardSet,
} from "@/ts/interface";
import { ResponseError, del, get, post, put } from "@/utils";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { cardsPageContent, commonContent } from "@/content";
import style from "./index.module.css";
import { useSession } from "@/hooks";
import { routes } from "@/constants";

const CardsPage = () => {
  const navigate = useNavigate();
  const { setHasEnded, setHasStarted, setSetId, hasStarted } = useSession();
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [flashcardsOnEdit, setFlashcardsOnEdit] = useState<Flashcard[]>([]);
  const [set, setSet] = useState<FlashcardSet>();
  const [isEditAll, setIsEditAll] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingCreate, setIsLoadingCreate] = useState<boolean>(false);

  const { id } = useParams();

  useEffect(() => {
    const handleGet = async () => {
      try {
        setIsLoading(true);
        const [flashcards, setById] = await Promise.all([
          get<ApiResponse<Flashcard[]>>(fullUrl(endpoints.cardsBySetId(id))),
          get<ApiResponse<FlashcardSet>>(fullUrl(endpoints.setById(id))),
        ]);
        setFlashcards(flashcards.data);
        setSet(setById.data);
      } catch (err) {
        if (err instanceof ResponseError) {
          console.log(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    };
    handleGet();
  }, [id]);

  const handleDelete = async (cardId: number) => {
    try {
      await del(fullUrl(endpoints.cardById(id!.toString(), cardId.toString())));
      setFlashcards(flashcards.filter((card) => card.id !== cardId));
    } catch (err) {
      if (err instanceof ResponseError) {
        console.log(err.message);
      }
    }
  };

  const registerEditing = (card: Flashcard, isEditing: boolean) => {
    setFlashcardsOnEdit((prev) => {
      if (isEditing) {
        const existingIndex = prev.findIndex((f) => f.id === card.id);
        if (existingIndex !== -1) {
          const updated = [...prev];
          updated[existingIndex] = card;
          return updated;
        } else {
          return [...prev, card];
        }
      } else {
        return prev.filter((f) => f.id !== card.id);
      }
    });
  };

  const handleEditAll = async () => {
    if (flashcardsOnEdit.length === 0) return;
    try {
      setIsEditAll(true);
      const res = await put<Flashcard[], ApiResponse<FlashcardBulkRes[]>>(
        fullUrl(endpoints.cardsBySetId(id)),
        flashcardsOnEdit
      );

      const successfulIds = res.data
        .filter((item) => item.status === 200)
        .map((item) => item.id);

      setFlashcardsOnEdit((prev) =>
        prev.filter((card) => !successfulIds.includes(card.id))
      );

      setFlashcards((prev) =>
        prev.map((card) =>
          successfulIds.includes(card.id)
            ? {
                ...card,
                ...flashcardsOnEdit.find((editCard) => editCard.id === card.id),
              }
            : card
        )
      );
    } catch (err) {
      if (err instanceof ResponseError) {
        console.log(err.message);
      }
    } finally {
      setIsEditAll(false);
    }
  };

  const handleEdit = (card: Flashcard) => {
    setFlashcards((prev) =>
      prev.map((prevCard) => (prevCard.id === card.id ? card : prevCard))
    );
  };

  const handleCreate = async () => {
    try {
      setIsLoadingCreate(true);
      const flashcard = await post<undefined, ApiResponse<Flashcard>>(
        fullUrl(endpoints.cardsBySetId(id)),
        undefined
      );
      setFlashcards((prev) => [...prev, flashcard.data]);
    } catch (err) {
      if (err instanceof ResponseError) {
        console.log(err.message);
      }
    } finally {
      setIsLoadingCreate(false);
    }
  };

  const handleStartSession = () => {
    const setId = Number(id);
    if (isNaN(setId)) return;
    setSetId(setId);
    navigate(routes.lesson);
  };

  if (isLoading) return <p>{commonContent.loading}</p>;

  return (
    <>
      <div className={style.set}>
        <div className={style.set_text}>
          <h2>{set?.title}</h2>
          <p>{set?.description}</p>
        </div>
      </div>
      <div className={style.buttons}>
        <Button onClick={handleStartSession}>{commonContent.study}</Button>
        <Button onClick={handleCreate} disabled={isLoadingCreate}>
          {isLoadingCreate ? commonContent.loading : cardsPageContent.newCard}
        </Button>
        <Button onClick={handleEditAll} disabled={isLoadingCreate}>
          {commonContent.editAll}
        </Button>
      </div>
      <div className={style.cards}>
        {flashcards.map((item) => (
          <Card
            card={item}
            key={item.id}
            onDelete={() => handleDelete(item.id)}
            onEdit={handleEdit}
            registerEditAll={registerEditing}
            isEditing={flashcardsOnEdit.some((card) => card.id === item.id)}
            isEditAll={isEditAll}
          />
        ))}
      </div>
    </>
  );
};

export default CardsPage;
