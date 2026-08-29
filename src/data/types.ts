export type Branch = "CSE" | "ECE";

export type Importance = "high" | "med" | "low";

export type SubjectStatus = "done" | "current" | "upcoming";

export type Topic = {
  id: string;
  name: string;
  imp: Importance;
};

export type Subject = {
  id: string;
  name: string;
  weight: string;
  color: string;
  dates: string;
  start: string;
  end: string;
  topics: Topic[];
};

export type DailyTask = {
  id: string;
  text: string;
  meta: string;
  time: string;
};
