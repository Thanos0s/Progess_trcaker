import type { DailyTask } from "./types";

export const DAILY_TASKS: { weekday: DailyTask[]; weekend: DailyTask[] } = {
  weekday: [
    { id: "dt1", text: "Study new topic (Concept + Notes)", meta: "Slot 1 of 2", time: "1 hr" },
    { id: "dt2", text: "Solve 10 PYQs from current subject", meta: "Slot 2 of 2", time: "45 min" },
    { id: "dt3", text: "Update checklist & review mistakes", meta: "Daily habit", time: "15 min" },
  ],
  weekend: [
    { id: "dw1", text: "Deep practice — 30 PYQs (timed)", meta: "Weekend deep work", time: "2 hr" },
    { id: "dw2", text: "Revise previous week's topics", meta: "Spaced repetition", time: "1.5 hr" },
    { id: "dw3", text: "Watch 1 concept video from KnowledgeGate", meta: "Visual learning", time: "1 hr" },
    { id: "dw4", text: "Write formula/concept summary sheet", meta: "Active recall", time: "30 min" },
    { id: "dw5", text: "Update checklist progress", meta: "Weekly review", time: "15 min" },
  ]
};
