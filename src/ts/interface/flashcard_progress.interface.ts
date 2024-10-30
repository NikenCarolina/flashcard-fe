export interface FlashcardProgress {
  id: number;
  flashcard_set_id: number;
  term: string;
  definition: string;
  repetition_number: number;
  easiness_factor: number;
  interval: number;
  last_review: Date;
  due_date: Date;
  is_correct: null | boolean;
}
