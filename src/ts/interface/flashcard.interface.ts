export interface Flashcard {
  id: number;
  flashcard_set_id: number;
  term: string;
  definition: string;
}

export interface FlashcardBulkRes {
  id: number;
  status: number;
}
