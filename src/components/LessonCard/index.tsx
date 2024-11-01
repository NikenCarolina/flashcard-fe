import style from "./index.module.css";
import { useEffect, useState } from "react";
import { toClassNames } from "@/utils";
import Button from "../Button";

const LessonCard: React.FC<{ term: string; definition: string }> = ({
  term,
  definition,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const [isTransitionEnabled, setIsTransitionEnabled] = useState(true);

  useEffect(() => {
    setIsFlipped(false);
    setIsTransitionEnabled(false);
    const timeoutId = setTimeout(() => setIsTransitionEnabled(true), 100);
    return () => clearTimeout(timeoutId);
  }, [term, definition]);

  return (
    <div className={style.flip_card}>
      <Button
        variant="yellow"
        onClick={() => setIsFlipped(!isFlipped)}
        className={toClassNames(style.flip_card_inner, {
          [style.is_not_active]: !isTransitionEnabled,
          [style.is_flipped]: isFlipped,
        })}
      >
        <div className={style.flip_card_front}>
          <h3>{term}</h3>
        </div>
        <div className={style.flip_card_back}>
          <h3>{definition}</h3>
        </div>
      </Button>
    </div>
  );
};

export default LessonCard;
