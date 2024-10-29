import Button from "../Button";
import style from "./index.module.css";
import { toClassNames } from "@/utils";
import { GoKebabHorizontal } from "react-icons/go";
import { commonContent } from "@/content";
import { useEffect, useRef, useState } from "react";
import { ResponseError, put } from "@/utils";
import { endpoints, fullUrl } from "@/api";
import { Flashcard } from "@/ts/interface";

interface CardProps {
  card: Flashcard;
  onDelete: () => void;
  onEdit: (card: Flashcard) => void;
  registerEditAll: (card: Flashcard, isEditing: boolean) => void;
  isEditing: boolean;
  isEditAll: boolean;
}

const Card: React.FC<CardProps> = ({
  card,
  onDelete,
  onEdit,
  registerEditAll,
  isEditing,
  isEditAll,
}) => {
  const [isDropdownActive, setIsDropdownActive] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [temp, setTemp] = useState<Flashcard>(card);
  const definitionRef = useRef<HTMLTextAreaElement>(null);
  const termRef = useRef<HTMLTextAreaElement>(null);

  const handleInput = (ref: React.RefObject<HTMLTextAreaElement>) => {
    if (ref != null)
      if (ref.current != null) {
        ref.current.style.height = "auto";
        ref.current.style.height = `${ref.current.scrollHeight}px`;
      }
  };

  const handleEdit = async () => {
    if (!isEditing) return;
    try {
      setIsLoading(true);
      await put(
        fullUrl(
          endpoints.cardById(
            card.flashcard_set_id.toString(),
            card.id.toString()
          )
        ),
        temp
      );
      onEdit(temp);
      registerEditAll(temp, false);
    } catch (err) {
      if (err instanceof ResponseError) {
        console.log(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isEditAll && isEditing) {
      setIsLoading(true);
      registerEditAll(temp, false);
    } else {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditAll]);
  const handleDelete = () => {
    setIsLoading(true);
    onDelete();
    setIsLoading(false);
  };

  const handleBlur = () => {
    setTimeout(() => {
      setIsDropdownActive(false);
    }, 250);
  };

  useEffect(() => {
    handleInput(definitionRef);
    handleInput(termRef);
    registerEditAll(temp, isEditing);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [temp]);

  return (
    <div className={style.card}>
      <textarea
        placeholder={commonContent.placeholderTerm}
        ref={termRef}
        value={temp.term}
        onClick={() => registerEditAll(temp, true)}
        onInput={() => registerEditAll(temp, true)}
        className={toClassNames(style.input, style.term_input, {
          [style.is_not_active]: !isEditing,
          [style.is_active]: isEditing,
          [style.is_loading]: isLoading || isDeleting,
        })}
        disabled={isLoading || isDeleting}
        onChange={(e) => setTemp({ ...temp, term: e.target.value })}
      ></textarea>
      <textarea
        placeholder={commonContent.placeholderDefinition}
        ref={definitionRef}
        value={temp.definition}
        onClick={() => registerEditAll(temp, true)}
        onInput={() => registerEditAll(temp, true)}
        className={toClassNames(style.input, style.definition_input, {
          [style.is_not_active]: !isEditing,
          [style.is_active]: isEditing,
          [style.is_loading]: isLoading || isDeleting,
        })}
        disabled={isLoading || isDeleting}
        onChange={(e) => setTemp({ ...temp, definition: e.target.value })}
      ></textarea>
      <div
        className={toClassNames(style.actions, {
          [style.actions_is_active]: isEditing,
        })}
      >
        {isEditing && (
          <div className={style.edit_actions}>
            <Button
              variant="yellow"
              className={style.button}
              onClick={handleEdit}
              disabled={isLoading}
            >
              {commonContent.edit}
            </Button>
            <Button
              variant="yellow"
              className={style.button}
              onClick={() => {
                setTemp({
                  ...card,
                  term: card.term,
                  definition: card.definition,
                });
                registerEditAll(temp, false);
              }}
              disabled={isLoading}
            >
              {commonContent.cancel}
            </Button>
          </div>
        )}

        {isDeleting && (
          <div className={style.delete_confirmation}>
            <p>{commonContent.deleteConfirmation}</p>
            <Button
              variant="yellow"
              className={style.button}
              onClick={handleDelete}
              disabled={isLoading}
            >
              {commonContent.proceed}
            </Button>
            <Button
              variant="yellow"
              className={style.button}
              onClick={() => setIsDeleting(false)}
              disabled={isLoading}
            >
              {commonContent.cancel}
            </Button>
          </div>
        )}

        <div className={style.delete_action} onBlur={handleBlur}>
          {!isDeleting && !isEditing && (
            <Button
              className={style.button}
              variant="yellow"
              onClick={() => setIsDropdownActive(!isDropdownActive)}
              disabled={isLoading}
            >
              <GoKebabHorizontal />
            </Button>
          )}
          {isDropdownActive && (
            <div className={style.buttons}>
              <Button
                className={style.button}
                title={commonContent.delete}
                variant="yellow"
                onClick={() => setIsDeleting(true)}
                disabled={isLoading}
              >
                {commonContent.delete}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;
