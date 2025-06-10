```ts
import { z } from "zod";

/* ---------- enums & atoms ---------- */

export const CriterionScope = z
  .enum(["general", "task"])
  .describe(
    "Whether this criterion is applied across the entire interview (`general`) or only within a single task (`task`)."
  );

export const CriterionType = z
  .enum(["rating", "numeric", "boolean", "text"])
  .describe(
    "The value-type the grader/LLM should return: `rating` → 1-5 or similar, `numeric` → any number, `boolean` → true/false, `text` → freeform string."
  );

export const CriterionSchema = z
  .object({
    id: z
      .string()
      .uuid()
      .describe("Stable UUID used as the primary key for joining scores later."),
    name: z
      .string()
      .min(1)
      .describe(
        "Human-readable label shown in the UI and included in the LLM function schema."
      ),
    description: z
      .string()
      .max(500)
      .optional()
      .describe(
        "Optional extra context for evaluators / LLM. Not shown to candidates."
      ),
    type: CriterionType,
    scope: CriterionScope,
  })
  .describe("Atomic scoring dimension, reused in general or task-specific rubrics.");

export const AIBehavior = z
  .enum(["passive", "neutral", "active", "very_active"])
  .describe(
    "Preset governing how chatty the interviewer agent is during the task."
  );

export const TaskRequirementsSchema = z
  .object({
    audio: z
      .boolean()
      .default(true)
      .describe("Candidate may speak with (and hear) the AI agent."),
    screenShare: z
      .boolean()
      .default(false)
      .describe("Candidate must share their screen during this task."),
    webcam: z
      .boolean()
      .default(false)
      .describe("Candidate's camera must be on."),
    fileUpload: z
      .boolean()
      .default(false)
      .describe("Candidate must or may upload a file as part of the answer."),
  })
  .describe("Binary flags for the interaction modalities required in the task.");

export const SupportingFileSchema = z
  .object({
    name: z
      .string()
      .describe("Friendly filename shown to candidates (e.g. 'Case.pdf')."),
    url: z
      .string()
      .url()
      .describe("Signed URL or CDN link from which the client fetches the file."),
  })
  .describe("Static reference materials attached to a task.");

export const TaskSchema = z
  .object({
    id: z
      .string()
      .uuid()
      .describe("Primary key for task ordering and results mapping."),
    title: z
      .string()
      .min(1)
      .describe("Label shown on the task card (e.g. 'Merger Math')."),
    prompt: z
      .string()
      .min(1)
      .describe(
        "System prompt / script delivered verbatim to the interviewer agent."
      ),
    aiBehavior: AIBehavior,
    durationMinutes: z
      .number()
      .int()
      .positive()
      .optional()
      .describe("Time limit after which the platform auto-advances."),
    requirements: TaskRequirementsSchema,
    supportingFiles: z
      .array(SupportingFileSchema)
      .default([])
      .describe("Zero or more reference docs the candidate can open."),
    criteria: z
      .array(CriterionSchema)
      .refine(
        (arr) => arr.every((c) => c.scope === "task"),
        { message: "All task criteria must have scope 'task'" }
      )
      .describe("Rubric dimensions specific to this task."),
    order: z
      .number()
      .int()
      .nonnegative()
      .describe(
        "Zero-based position in the interview flow; used for drag-drop reordering."
      ),
  })
  .describe("Config block for one section/question of the interview.");

export const InterviewStatus = z
  .enum(["draft", "live", "closed"])
  .describe(
    "`draft` → editable, not yet shared; `live` → link sent to candidates; `closed` → no longer accepting submissions."
  );

export const StatsSchema = z
  .object({
    invited: z
      .number()
      .int()
      .nonnegative()
      .describe("How many candidate links/emails have been generated."),
    completed: z
      .number()
      .int()
      .nonnegative()
      .describe("Candidates who reached the final screen."),
    graded: z
      .number()
      .int()
      .nonnegative()
      .describe(
        "Candidates for whom every criterion now has a score (manual or automatic)."
      ),
  })
  .describe("Read-only analytics filled in by the backend.");

export const InterviewSchema = z
  .object({
    id: z
      .string()
      .uuid()
      .describe("Primary key for the interview configuration document."),
    title: z
      .string()
      .min(1)
      .describe("Card header shown on the company dashboard."),
    status: InterviewStatus.default("draft"),
    createdAt: z
      .string()
      .datetime()
      .describe("ISO timestamp when the interview was first saved."),
    updatedAt: z
      .string()
      .datetime()
      .describe("ISO timestamp of the most recent change."),
    generalCriteria: z
      .array(CriterionSchema)
      .refine(
        (arr) => arr.every((c) => c.scope === "general"),
        { message: "All general criteria must have scope 'general'" }
      )
      .describe(
        "Rubric dimensions scored across the whole interview (e.g. Communication)."
      ),
    tasks: z
      .array(TaskSchema)
      .min(1, { message: "Interview must contain at least one task" })
      .describe("Ordered list of tasks that make up the interview."),
    stats: StatsSchema.optional(),
  })
  .describe(
    "Top-level container that can fully reconstruct the interview UI and agent prompts."
  );



/////////////
// CANDIDATE
/////////////
// 
export const NoteSchema = z
  .object({
    author: z
      .string()
      .min(1)
      .describe("Name or identifier of the person who wrote this note."),
    column: z
      .string()
      .min(1)
      .describe("The criterion/column this note relates to."),
    content: z
      .string()
      .min(1)
      .describe("The actual note content/text."),
  })
  .describe("Individual note about a candidate with author, column reference, and content.");
```