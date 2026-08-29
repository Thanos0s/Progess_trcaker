import { CSE_SUBJECTS } from "./cse";
import { ECE_SUBJECTS } from "./ece";
import type { Branch, Subject, SubjectStatus, Topic } from "./types";

export * from "./types";
export { CSE_SUBJECTS } from "./cse";
export { ECE_SUBJECTS } from "./ece";
export { DAILY_TASKS } from "./dailyTasks";

export const BRANCHES: Branch[] = ["CSE", "ECE"];

export const BRANCH_LABEL: Record<Branch, string> = {
  CSE: "Computer Science (CS)",
  ECE: "Electrical / Electronics (EE)",
};

export const SYLLABUS: Record<Branch, Subject[]> = {
  CSE: CSE_SUBJECTS,
  ECE: ECE_SUBJECTS,
};

export const GATE_EXAM_DATE = "2027-02-06";

export function subjectsFor(branch: Branch): Subject[] {
  return SYLLABUS[branch];
}

export function topicsFor(branch: Branch): Topic[] {
  return SYLLABUS[branch].flatMap((s) => s.topics);
}

const TOPIC_INDEX = new Map<string, { branch: Branch; subject: Subject; topic: Topic }>();
for (const branch of BRANCHES) {
  for (const subject of SYLLABUS[branch]) {
    for (const topic of subject.topics) {
      TOPIC_INDEX.set(topic.id, { branch, subject, topic });
    }
  }
}

export function lookupTopic(topicId: string) {
  return TOPIC_INDEX.get(topicId);
}

export function subjectStatus(subject: Subject, today: string): SubjectStatus {
  if (today > subject.end) return "done";
  if (today < subject.start) return "upcoming";
  return "current";
}

export function daysToExam(today: string): number {
  const ms = new Date(GATE_EXAM_DATE).getTime() - new Date(today).getTime();
  return Math.max(0, Math.round(ms / 86_400_000));
}
