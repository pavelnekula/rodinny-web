import type { TopicContent } from "./types";
import { jednoducheStrojeContent } from "./jednoducheStroje";
import { mereniContent } from "./mereni";
import { pohybContent } from "./pohyb";
import { silyContent } from "./sily";
import { teploContent } from "./teplo";
import { vlastnostiLatekContent } from "./vlastnostiLatek";

export type { ExerciseDef, ExerciseStep, LectureSection, PexesoPair, TopicContent } from "./types";
export { FYZIKA_TOPICS, getTopicMeta } from "./topics";
export type { TopicMeta } from "./topics";

const topicContentBySlug: Record<string, TopicContent> = {
  mereni: mereniContent,
  "vlastnosti-latek": vlastnostiLatekContent,
  pohyb: pohybContent,
  sily: silyContent,
  "jednoduche-stroje": jednoducheStrojeContent,
  teplo: teploContent,
};

export function getTopicContent(slug: string): TopicContent | undefined {
  return topicContentBySlug[slug];
}
