import { endpoints, fullUrl } from "@/api";
import { Button, Card } from "@/components";
import {
  ApiResponse,
  Flashcard,
  FlashcardBulkRes,
  FlashcardSet,
} from "@/ts/interface";
import { ResponseError, del, get, post, put } from "@/utils";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { cardsPageContent, commonContent } from "@/content";
import style from "./index.module.css";
import { useSession } from "@/hooks";
import { routes } from "@/constants";
import { toClassNames } from "@/utils";
import { GoKebabHorizontal } from "react-icons/go";

const CardsPage = () => {
  const navigate = useNavigate();
  const { setSetId } = useSession();
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [flashcardsOnEdit, setFlashcardsOnEdit] = useState<Flashcard[]>([]);
  const [set, setSet] = useState<FlashcardSet>();
  const [temp, setTemp] = useState<FlashcardSet>();

  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isEditAll, setIsEditAll] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingSet, setIsLoadingSet] = useState<boolean>(false);
  const [isLoadingCreate, setIsLoadingCreate] = useState<boolean>(false);
  const [isDropdownActive, setIsDropdownActive] = useState(false);

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
        setTemp(setById.data);
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
    if (flashcards.length === 0) {
      alert("To study there must be at least one card");
      return;
    }
    navigate(routes.lesson);
  };

  const definitionRef = useRef<HTMLTextAreaElement>(null);
  const termRef = useRef<HTMLTextAreaElement>(null);

  const handleEditSet = async () => {
    if (!isEditing) return;
    if (set === undefined) return;
    try {
      setIsLoadingSet(true);
      await put(fullUrl(endpoints.setById(set.id.toString())), temp);
      setIsEditing(false);
      setSet(temp);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoadingSet(false);
    }
  };

  const handleDeleteSet = async () => {
    if (!isDeleting) return;
    if (set === undefined) return;
    try {
      setIsLoadingSet(true);
      await del(fullUrl(endpoints.setById(set.id.toString())));
      navigate(routes.sets);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoadingSet(false);
    }
  };

  const handleBlur = () => {
    setTimeout(() => {
      setIsDropdownActive(false);
    }, 250);
  };

  const handleInput = (ref: React.RefObject<HTMLTextAreaElement>) => {
    if (ref != null)
      if (ref.current != null) {
        ref.current.style.height = "auto";
        ref.current.style.height = `${ref.current.scrollHeight}px`;
      }
  };

  useEffect(() => {
    handleInput(definitionRef);
    handleInput(termRef);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [temp]);

  if (isLoading) return <p>{commonContent.loading}</p>;

  return (
    <>
      <div className={style.set}>
        <div className={style.set_text}>
          <textarea
            placeholder={commonContent.placeholderTitle}
            ref={termRef}
            value={temp?.title}
            onClick={() => setIsEditing(true)}
            onInput={() => setIsEditing(true)}
            className={toClassNames(style.input, style.title_input, {
              [style.is_not_active]: !isEditing,
              [style.is_active]: isEditing,
              [style.is_loading]: isLoadingSet || isDeleting,
            })}
            disabled={isLoadingSet || isDeleting}
            onChange={(e) =>
              setTemp((prev) => {
                if (prev !== undefined)
                  return { ...prev, title: e.target.value };
                else return prev;
              })
            }
          ></textarea>
          <textarea
            placeholder={commonContent.placeholderDescription}
            ref={definitionRef}
            value={temp?.description}
            onClick={() => setIsEditing(true)}
            onInput={() => setIsEditing(true)}
            className={toClassNames(style.input, style.description_input, {
              [style.is_not_active]: !isEditing,
              [style.is_active]: isEditing,
              [style.is_loading]: isLoadingSet || isDeleting,
            })}
            disabled={isLoadingSet || isDeleting}
            onChange={(e) =>
              setTemp((prev) => {
                if (prev !== undefined)
                  return { ...prev, description: e.target.value };
                else return prev;
              })
            }
          ></textarea>

          <div
            className={toClassNames(style.actions, {
              [style.actions_is_active]: isEditing,
            })}
          >
            {isEditing && set !== undefined && (
              <div className={style.edit_actions}>
                <Button
                  variant="transparent"
                  className={style.button}
                  onClick={handleEditSet}
                  disabled={isLoading || isLoadingSet}
                >
                  {commonContent.edit}
                </Button>
                <Button
                  variant="transparent"
                  className={style.button}
                  onClick={() => {
                    setTemp({
                      ...set,
                      title: set.title,
                      description: set.description,
                    });
                    setIsEditing(false);
                  }}
                  disabled={isLoading || isLoadingSet}
                >
                  {commonContent.cancel}
                </Button>
              </div>
            )}

            {isDeleting && (
              <div className={style.delete_confirmation}>
                <p>{commonContent.deleteSetConfirmation}</p>
                <Button
                  variant="transparent"
                  className={style.button}
                  onClick={handleDeleteSet}
                  disabled={isLoading || isLoadingSet}
                >
                  {commonContent.proceed}
                </Button>
                <Button
                  variant="transparent"
                  className={style.button}
                  onClick={() => setIsDeleting(false)}
                  disabled={isLoading || isLoadingSet}
                >
                  {commonContent.cancel}
                </Button>
              </div>
            )}

            <div className={style.delete_action} onBlur={handleBlur}>
              {!isDeleting && !isEditing && (
                <Button
                  className={toClassNames(style.button, style.kebab_button)}
                  variant="transparent"
                  onClick={() => setIsDropdownActive(!isDropdownActive)}
                  disabled={isLoading || isLoadingSet}
                >
                  <GoKebabHorizontal size={"1rem"} />
                </Button>
              )}
              {isDropdownActive && (
                <div className={style.set_buttons}>
                  <Button
                    className={style.set_button}
                    title={commonContent.delete}
                    variant="transparent"
                    onClick={() => setIsDeleting(true)}
                    disabled={isLoading || isLoadingSet}
                  >
                    {commonContent.deleteSet}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <hr />
      <div className={style.buttons}>
        <Button onClick={handleCreate} disabled={isLoadingCreate || isEditAll}>
          {isLoadingCreate ? commonContent.loading : cardsPageContent.newCard}
        </Button>
        <Button onClick={handleEditAll} disabled={isLoadingCreate || isEditAll}>
          {commonContent.editAll}
        </Button>
        <Button
          onClick={handleStartSession}
          disabled={isLoadingCreate || flashcards.length === 0 || isEditAll}
          title={
            flashcards.length === 0
              ? "Create at least one card to study"
              : undefined
          }
        >
          {commonContent.study}
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
