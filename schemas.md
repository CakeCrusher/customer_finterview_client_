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
    "The value‑type the grader/LLM should return: `rating` → 1‑5, `numeric` → any number, `boolean` → true/false, `text` → free‑form string."
  );

export const CriterionSchema = z
  .object({
    id: z.string().uuid().describe("Stable UUID used as the primary key for joining scores later."),
    name: z.string().min(1).describe("Human‑readable label shown in the UI."),
    description: z.string().max(500).optional().describe("Optional context for evaluators / LLM."),
    type: CriterionType,
    scope: CriterionScope,
  })
  .describe("Atomic scoring dimension, reused in general or task‑specific rubrics.");

export const AIBehavior = z
  .enum(["passive", "neutral", "active", "very_active"])
  .describe("Preset governing how chatty the interviewer agent is during the task.");

/* ---------- supporting files ---------- */

export const SupportingFileSchema = z
  .object({
    name: z.string().describe("Friendly filename shown to candidates (e.g. 'Case.pdf')."),
    url: z.string().url().describe("Signed URL or CDN link from which the client fetches the file."),
  })
  .describe("Static reference materials attached to a task.");

/* ---------- TASK ---------- */

export const TaskSchema = z
  .object({
    id: z.string().uuid().describe("Primary key for task ordering and results mapping."),
    title: z.string().min(1).describe("Label shown on the task card (e.g. 'Merger Math')."),
    prompt: z.string().min(1).describe("System prompt / script delivered verbatim to the interviewer agent."),

    aiBehavior: AIBehavior,

    durationMinutes: z.number().int().positive().optional().default(undefined).describe("Time limit after which the platform auto‑advances."),

    /* ---- requirements flattened ---- */
    audio: z.boolean().default(true).describe("Candidate may speak with (and hear) the AI agent."),
    screenShare: z.boolean().default(false).describe("Candidate must share their screen during this task."),
    webcam: z.boolean().default(false).describe("Candidate's camera must be on."),
    fileUpload: z.boolean().default(false).describe("Candidate must or may upload a file as part of the answer."),

    supportingFiles: z.array(SupportingFileSchema).default([]).describe("Zero or more reference docs the candidate can open."),

    criteria: z
      .array(CriterionSchema)
      .default([])
      .refine((arr) => arr.every((c) => c.scope === "task"), {
        message: "All task criteria must have scope 'task'",
      })
      .describe("Rubric dimensions specific to this task."),

    taskOrder: z.number().int().nonnegative().describe("Zero‑based position in the interview flow; used for drag‑drop reordering."),
  })
  .describe("Config block for one section/question of the interview.");

/* ---------- INTERVIEW ---------- */

export const InterviewStatus = z
  .enum(["draft", "live", "closed"])
  .describe("`draft` → editable, `live` → link sent, `closed` → no longer accepting submissions.");

export const StatsSchema = z
  .object({
    invited: z.number().int().nonnegative().describe("Invitations generated."),
    completed: z.number().int().nonnegative().describe("Candidates who reached the final screen."),
    graded: z.number().int().nonnegative().describe("Candidates fully scored (manual or automatic)."),
  })
  .describe("Read‑only analytics filled in by the backend.");

export const InterviewSchema = z
  .object({
    id: z.string().uuid().describe("Primary key for the interview configuration document."),
    title: z.string().min(1).describe("Card header shown on the company dashboard."),
    status: InterviewStatus.default("draft"),

    createdAt: z.string().datetime({ offset: true }).describe("ISO timestamp when the interview was first saved."),
    updatedAt: z.string().datetime({ offset: true }).describe("ISO timestamp of the most recent change."),

    /** Email of the user who created this interview (FK to users.email). */
    ownerEmail: z.string().email().describe("Creator's user email."),

    generalCriteria: z
      .array(CriterionSchema)
      .default([])
      .refine((arr) => arr.every((c) => c.scope === "general"), {
        message: "All general criteria must have scope 'general'",
      })
      .describe("Rubric dimensions scored across the whole interview."),

    tasks: z.array(TaskSchema).min(1, { message: "Interview must contain at least one task" }).describe("Ordered list of tasks that make up the interview."),

    stats: StatsSchema.optional(),
  })
  .describe("Top‑level container that fully reconstructs the interview UI and agent prompts.");

/* ---------- CANDIDATE NOTES ---------- */

export const NoteSchema = z
  .object({
    author: z.string().min(1).describe("Name or identifier of the person who wrote this note."),
    column: z.string().min(1).describe("The criterion/column this note relates to."),
    content: z.string().min(1).describe("The actual note content/text."),
  })
  .describe("Individual note about a candidate with author, column reference, and content.");

/* ---------- PATCH SCHEMAS ---------- */

export const InterviewPatchSchema = InterviewSchema.partial();
export const TaskPatchSchema = TaskSchema.partial();
export const CriterionPatchSchema = CriterionSchema.partial();


```

```sql
/* ---------- ENUMS ---------- */
CREATE TYPE criterion_scope   AS ENUM ('general', 'task');
CREATE TYPE criterion_type    AS ENUM ('rating', 'numeric', 'boolean', 'text');
CREATE TYPE ai_behavior       AS ENUM ('passive', 'neutral', 'active', 'very_active');
CREATE TYPE interview_status  AS ENUM ('draft', 'live', 'closed');

/* ---------- USERS ---------- */
CREATE TABLE users (
    email TEXT PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

/* ---------- ROOT INTERVIEW DOCUMENT ---------- */
CREATE TABLE interviews (
    id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_email  text      NOT NULL REFERENCES users(email) ON DELETE CASCADE,
    title        text      NOT NULL,
    status       interview_status NOT NULL DEFAULT 'draft',
    created_at   timestamptz NOT NULL DEFAULT now(),
    updated_at   timestamptz NOT NULL DEFAULT now()
);

/* ---------- TASKS (ordered children of an interview) ---------- */
CREATE TABLE tasks (
    id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    interview_id     uuid NOT NULL REFERENCES interviews(id) ON DELETE CASCADE,
    title            text      NOT NULL,
    prompt           text      NOT NULL,
    ai_behavior      ai_behavior NOT NULL,
    duration_minutes integer    CHECK (duration_minutes > 0),
    /* flattened TaskRequirements */
    req_audio        boolean NOT NULL DEFAULT true,
    req_screen_share boolean NOT NULL DEFAULT false,
    req_webcam       boolean NOT NULL DEFAULT false,
    req_file_upload  boolean NOT NULL DEFAULT false,
    /* zero-based sequence index inside its interview */
    task_order       integer  NOT NULL CHECK (task_order >= 0),

    UNIQUE (interview_id, task_order)  -- keeps ordering atomic
);

/* ---------- SUPPORTING FILES PER TASK ---------- */
CREATE TABLE supporting_files (
    id        serial PRIMARY KEY,
    task_id   uuid NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    name      text NOT NULL,
    url       text NOT NULL
);

/* ---------- CRITERIA (general OR task-specific) ---------- */
CREATE TABLE criteria (
    id           uuid PRIMARY KEY,                       -- supplied by client; keep stable
    interview_id uuid REFERENCES interviews(id) ON DELETE CASCADE,
    task_id      uuid REFERENCES tasks(id)      ON DELETE CASCADE,
    name         text      NOT NULL,
    description  text,
    type         criterion_type  NOT NULL,
    scope        criterion_scope NOT NULL,

    /* Enforce correct parentage: */
    CHECK (
        (scope = 'general' AND interview_id IS NOT NULL AND task_id IS NULL) OR
        (scope = 'task'    AND task_id      IS NOT NULL AND interview_id IS NULL)
    )
);

/* ---------- OPTIONAL RUNTIME STATS ---------- */
CREATE TABLE interview_stats (
    interview_id uuid PRIMARY KEY REFERENCES interviews(id) ON DELETE CASCADE,
    invited   integer NOT NULL DEFAULT 0 CHECK (invited   >= 0),
    completed integer NOT NULL DEFAULT 0 CHECK (completed >= 0),
    graded    integer NOT NULL DEFAULT 0 CHECK (graded    >= 0)
);
```