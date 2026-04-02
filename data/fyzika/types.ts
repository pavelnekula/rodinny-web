export type LectureSection = {
  id: string;
  title: string;
  /** Odstavec výkladu (plain text, může obsahovat emoji) */
  paragraphs: string[];
  /** Volitelný vzorec jako prostý text */
  formula?: string;
};

export type ExerciseStep = {
  title: string;
  detail: string;
};

export type ExerciseDef = {
  id: string;
  question: string;
  /** Očekávaná odpověď po normalizaci (číslo jako řetězec s tečkou) */
  expected: string;
  hint: string;
  steps: ExerciseStep[];
};

export type PexesoPair = {
  id: string;
  sideA: string;
  sideB: string;
  explanation: string;
};

export type TopicContent = {
  slug: string;
  lecture: LectureSection[];
  exercises: ExerciseDef[];
  pexeso: PexesoPair[];
};
