import style from "./index.module.css";
import { endpoints, fullUrl } from "@/api";
import { Button, SetCard } from "@/components";
import { commonContent, setsPageContent } from "@/content";
import { routes } from "@/constants";
import { get, post, ResponseError } from "@/utils";
import { ApiResponse, FlashcardSet } from "@/ts/interface";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const SetsPage = () => {
  const [flashcardSet, setFlashcardSet] = useState<FlashcardSet[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingCreate, setIsLoadingCreate] = useState<boolean>(false);
  const navigate = useNavigate();
  const handleGetFlashcardSets = async () => {
    try {
      setIsLoading(true);
      const res = await get<ApiResponse<FlashcardSet[]>>(
        fullUrl(endpoints.sets)
      );
      setFlashcardSet(res.data);
    } catch (err) {
      if (err instanceof ResponseError) {
        console.log(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    handleGetFlashcardSets();
  }, []);

  const handleCreate = async () => {
    try {
      setIsLoadingCreate(true);
      const res = await post<undefined, ApiResponse<FlashcardSet>>(
        fullUrl(endpoints.sets),
        undefined
      );
      navigate(routes.setsById(res.data.id.toString()));
    } catch (err) {
      if (err instanceof ResponseError) {
        console.log(err.message);
      }
    } finally {
      setIsLoadingCreate(false);
    }
  };
  return (
    <>
      <div className={style.header}>
        <h2>{setsPageContent.title}</h2>
        <Button onClick={handleCreate} disabled={isLoadingCreate}>
          {isLoadingCreate ? commonContent.loading : setsPageContent.newSet}
        </Button>
      </div>

      {!isLoading && (
        <div className={style.card_sets}>
          {flashcardSet.map((item, index) => (
            <Link to={routes.setsById(item.id.toString())} key={index}>
              <SetCard title={item.title} description={item.description} />
            </Link>
          ))}
        </div>
      )}

      {isLoading && <h3>{commonContent.loading}</h3>}
    </>
  );
};

export default SetsPage;
