-- ============================================================
-- VoicePrep AI — Full Database Schema
-- Run this in: Supabase → SQL Editor → New Query → Run
-- ============================================================

-- ─── Extensions ──────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ─── Enums ───────────────────────────────────────────────────
create type interview_type  as enum ('behavioral','technical','panel','case_study','executive','culture_fit');
create type session_mode    as enum ('solo','panel','stress','shadow','blind');
create type session_status  as enum ('setup','active','completed','abandoned');
create type question_category as enum ('behavioral','situational','technical','culture','weakness','closing');
create type difficulty_level  as enum ('1','2','3','4','5');
create type self_rating       as enum ('good','ok','retry');
create type mastery_stage     as enum ('full','keywords','memory');

-- ─── Helpers ─────────────────────────────────────────────────
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ─── 1. PROFILES ─────────────────────────────────────────────
-- Extends Supabase auth.users with app-specific data
create table profiles (
  id               uuid primary key references auth.users(id) on delete cascade,
  full_name        text,
  email            text,
  avatar_url       text,
  target_role      text,
  target_industry  text,
  experience_level text,         -- 'student' | 'junior' | 'mid' | 'senior' | 'executive'
  plan             text not null default 'free', -- 'free' | 'pro' | 'teams'
  sessions_used    int  not null default 0,
  streak_days      int  not null default 0,
  last_active_date date,
  timezone         text default 'UTC',
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create trigger profiles_updated_at
  before update on profiles
  for each row execute function set_updated_at();

alter table profiles enable row level security;
create policy "Users can read own profile"
  on profiles for select using (auth.uid() = id);
create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);
create policy "Users can insert own profile"
  on profiles for insert with check (auth.uid() = id);

-- Auto-create profile on signup
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into profiles (id, full_name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.email
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();


-- ─── 2. SESSIONS ─────────────────────────────────────────────
create table sessions (
  id                  uuid primary key default uuid_generate_v4(),
  user_id             uuid not null references profiles(id) on delete cascade,
  status              session_status not null default 'setup',

  -- Config
  interview_type      interview_type,
  mode                session_mode not null default 'solo',
  voice_id            text,
  interviewer_persona text default 'friendly_hr',
  duration_minutes    int  not null default 30,
  nervous_mode        boolean not null default false,

  -- Documents
  resume_text         text,
  jd_text             text,
  target_role         text,
  target_company      text,

  -- Scores (populated after completion)
  overall_score       int  check (overall_score between 0 and 100),
  completeness_score  int  check (completeness_score between 0 and 100),
  star_score          int  check (star_score between 0 and 100),
  confidence_score    int  check (confidence_score between 0 and 100),
  talk_time_score     int  check (talk_time_score between 0 and 100),
  filler_rate         numeric(5,2),
  questions_skipped   int  not null default 0,
  questions_total     int  not null default 0,

  -- Audio
  audio_url           text,   -- Supabase Storage signed URL
  audio_duration_sec  int,

  -- Timestamps
  started_at          timestamptz,
  completed_at        timestamptz,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index sessions_user_id_idx  on sessions(user_id);
create index sessions_status_idx   on sessions(status);
create index sessions_created_idx  on sessions(created_at desc);

create trigger sessions_updated_at
  before update on sessions
  for each row execute function set_updated_at();

alter table sessions enable row level security;
create policy "Users can read own sessions"
  on sessions for select using (auth.uid() = user_id);
create policy "Users can insert own sessions"
  on sessions for insert with check (auth.uid() = user_id);
create policy "Users can update own sessions"
  on sessions for update using (auth.uid() = user_id);
create policy "Users can delete own sessions"
  on sessions for delete using (auth.uid() = user_id);


-- ─── 3. QUESTIONS ────────────────────────────────────────────
create table questions (
  id              uuid primary key default uuid_generate_v4(),
  session_id      uuid not null references sessions(id) on delete cascade,
  user_id         uuid not null references profiles(id) on delete cascade,

  text            text not null,
  category        question_category not null default 'behavioral',
  difficulty      difficulty_level  not null default '3',
  position        int  not null default 0,   -- order in session

  -- User interaction
  pinned          boolean not null default false,
  skipped         boolean not null default false,

  -- Expected answer guidance (from AI generation)
  expected_framework  text,   -- e.g. 'STAR' | 'RICE' | 'free-form'
  sample_answer       text,   -- AI-generated model answer

  created_at      timestamptz not null default now()
);

create index questions_session_id_idx on questions(session_id);
create index questions_user_id_idx    on questions(user_id);

alter table questions enable row level security;
create policy "Users can read own questions"
  on questions for select using (auth.uid() = user_id);
create policy "Users can insert own questions"
  on questions for insert with check (auth.uid() = user_id);
create policy "Users can update own questions"
  on questions for update using (auth.uid() = user_id);
create policy "Users can delete own questions"
  on questions for delete using (auth.uid() = user_id);


-- ─── 4. SESSION ANSWERS ──────────────────────────────────────
-- One row per question answered in a session
create table session_answers (
  id                  uuid primary key default uuid_generate_v4(),
  session_id          uuid not null references sessions(id) on delete cascade,
  question_id         uuid not null references questions(id) on delete cascade,
  user_id             uuid not null references profiles(id) on delete cascade,

  -- Transcript
  transcript          text,
  word_count          int,
  duration_sec        int,
  wpm                 int,

  -- Scores
  answer_score        int  check (answer_score between 0 and 100),
  completeness        int  check (completeness between 0 and 100),
  star_compliance     int  check (star_compliance between 0 and 100),
  specificity         int  check (specificity between 0 and 100),
  filler_count        int  not null default 0,
  filler_words        text[],   -- array of flagged words

  -- AI feedback
  ai_feedback         text,
  strengths           text[],
  improvements        text[],
  suggested_rewrite   text,

  -- Audio clip (segment of full session audio)
  audio_start_sec     int,
  audio_end_sec       int,

  created_at          timestamptz not null default now()
);

create index session_answers_session_id_idx  on session_answers(session_id);
create index session_answers_question_id_idx on session_answers(question_id);
create index session_answers_user_id_idx     on session_answers(user_id);

alter table session_answers enable row level security;
create policy "Users can read own answers"
  on session_answers for select using (auth.uid() = user_id);
create policy "Users can insert own answers"
  on session_answers for insert with check (auth.uid() = user_id);
create policy "Users can update own answers"
  on session_answers for update using (auth.uid() = user_id);


-- ─── 5. SCORECARDS ───────────────────────────────────────────
-- Summary coaching report generated after session completion
create table scorecards (
  id              uuid primary key default uuid_generate_v4(),
  session_id      uuid not null unique references sessions(id) on delete cascade,
  user_id         uuid not null references profiles(id) on delete cascade,

  -- Composite scores (mirrors sessions but stored separately for fast reads)
  overall_score   int  check (overall_score between 0 and 100),
  grade           text,   -- 'A' | 'B' | 'C' | 'D' | 'F'

  -- AI coaching summary
  coach_summary   text,
  top_strengths   text[],
  focus_areas     text[],
  next_steps      jsonb,   -- [{priority: 'high', text: '...'}]

  -- Comparison to previous session
  prev_session_id uuid references sessions(id),
  score_delta     int,   -- positive = improvement

  -- Share
  share_token     text unique default encode(gen_random_bytes(12), 'hex'),
  is_public       boolean not null default false,

  created_at      timestamptz not null default now()
);

create index scorecards_session_id_idx on scorecards(session_id);
create index scorecards_user_id_idx    on scorecards(user_id);

alter table scorecards enable row level security;
create policy "Users can read own scorecards"
  on scorecards for select using (auth.uid() = user_id);
create policy "Public scorecards readable by anyone"
  on scorecards for select using (is_public = true);
create policy "Users can insert own scorecards"
  on scorecards for insert with check (auth.uid() = user_id);
create policy "Users can update own scorecards"
  on scorecards for update using (auth.uid() = user_id);


-- ─── 6. FLUENCY ITEMS ────────────────────────────────────────
-- Q&A pairs for the Fluency Coach mode
create table fluency_items (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid not null references profiles(id) on delete cascade,

  question        text not null,
  answer          text not null,
  category        question_category not null default 'behavioral',

  -- Mastery tracking
  sessions_count  int  not null default 0,
  mastery_score   int  not null default 0 check (mastery_score between 0 and 100),
  current_stage   mastery_stage not null default 'full',

  -- Source
  source          text default 'manual',  -- 'manual' | 'upload' | 'ai_generated'

  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index fluency_items_user_id_idx on fluency_items(user_id);

create trigger fluency_items_updated_at
  before update on fluency_items
  for each row execute function set_updated_at();

alter table fluency_items enable row level security;
create policy "Users can manage own fluency items"
  on fluency_items for all using (auth.uid() = user_id);


-- ─── 7. FLUENCY SESSIONS ─────────────────────────────────────
-- Each time a user runs a Fluency Coach practice session
create table fluency_sessions (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid not null references profiles(id) on delete cascade,
  items_practiced int  not null default 0,
  avg_mastery     int,
  completed_at    timestamptz not null default now()
);

create table fluency_session_results (
  id              uuid primary key default uuid_generate_v4(),
  fluency_session_id uuid not null references fluency_sessions(id) on delete cascade,
  fluency_item_id    uuid not null references fluency_items(id) on delete cascade,
  user_id            uuid not null references profiles(id) on delete cascade,
  rating             self_rating not null,
  score              int check (score between 0 and 100),
  stage_at_time      mastery_stage not null
);

alter table fluency_sessions enable row level security;
create policy "Users can manage own fluency sessions"
  on fluency_sessions for all using (auth.uid() = user_id);

alter table fluency_session_results enable row level security;
create policy "Users can manage own fluency results"
  on fluency_session_results for all using (auth.uid() = user_id);


-- ─── 8. ANSWER LIBRARY ───────────────────────────────────────
-- Saved best-delivery recordings (Gold Masters)
create table answer_library (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid not null references profiles(id) on delete cascade,
  session_id      uuid references sessions(id) on delete set null,
  question_id     uuid references questions(id) on delete set null,

  question_text   text not null,
  category        question_category,
  transcript      text,
  score           int  check (score between 0 and 100),
  is_gold_master  boolean not null default false,

  -- Delivery metrics
  confidence_score int,
  filler_rate      numeric(5,2),
  wpm              int,
  duration_sec     int,
  improvement_pts  int,   -- delta vs previous best for this question

  -- Audio
  audio_url        text,

  created_at       timestamptz not null default now()
);

create index answer_library_user_id_idx on answer_library(user_id);
create index answer_library_gold_idx    on answer_library(user_id, is_gold_master);

alter table answer_library enable row level security;
create policy "Users can manage own library"
  on answer_library for all using (auth.uid() = user_id);


-- ─── 9. INTERVIEWS (Countdown) ───────────────────────────────
create table interviews (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid not null references profiles(id) on delete cascade,

  role            text not null,
  company         text not null,
  interview_date  date not null,
  interview_type  interview_type,
  round           text,   -- 'Phone Screen' | 'First Round' etc.
  notes           text,

  -- Prep tracking
  tasks_done      jsonb default '[]',  -- array of completed task keys

  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index interviews_user_id_idx   on interviews(user_id);
create index interviews_date_idx      on interviews(interview_date);

create trigger interviews_updated_at
  before update on interviews
  for each row execute function set_updated_at();

alter table interviews enable row level security;
create policy "Users can manage own interviews"
  on interviews for all using (auth.uid() = user_id);


-- ─── 10. PRONUNCIATION FLAGS ─────────────────────────────────
create table pronunciation_flags (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid not null references profiles(id) on delete cascade,
  word            text not null,
  count           int  not null default 1,
  phonetic        text,
  tip             text,
  session_dates   text[],
  last_seen_at    timestamptz not null default now(),
  created_at      timestamptz not null default now(),
  unique (user_id, word)
);

create index pronunciation_flags_user_id_idx on pronunciation_flags(user_id);

alter table pronunciation_flags enable row level security;
create policy "Users can manage own pronunciation flags"
  on pronunciation_flags for all using (auth.uid() = user_id);


-- ─── 11. USEFUL VIEWS ────────────────────────────────────────

-- Dashboard stats per user
create or replace view user_stats as
select
  p.id                                                      as user_id,
  count(distinct s.id) filter (where s.status = 'completed') as sessions_done,
  round(avg(s.overall_score) filter (where s.status = 'completed'))  as avg_score,
  max(s.overall_score)                                       as best_score,
  p.streak_days,
  round(
    sum(s.duration_minutes) filter (where s.status = 'completed') / 60.0, 1
  )                                                          as hours_practiced,
  count(distinct fl.id)                                      as fluency_items_count,
  round(avg(fl.mastery_score))                               as avg_mastery
from profiles p
left join sessions s  on s.user_id = p.id
left join fluency_items fl on fl.user_id = p.id
group by p.id, p.streak_days;

-- Recent sessions with scorecard joined
create or replace view session_summaries as
select
  s.id,
  s.user_id,
  s.target_role,
  s.target_company,
  s.interview_type,
  s.mode,
  s.duration_minutes,
  s.overall_score,
  s.filler_rate,
  s.questions_total,
  s.questions_skipped,
  s.status,
  s.completed_at,
  s.created_at,
  sc.coach_summary,
  sc.grade,
  sc.share_token
from sessions s
left join scorecards sc on sc.session_id = s.id;


-- ─── Done ────────────────────────────────────────────────────
-- Tables created:
--   profiles, sessions, questions, session_answers,
--   scorecards, fluency_items, fluency_sessions,
--   fluency_session_results, answer_library,
--   interviews, pronunciation_flags
-- Views: user_stats, session_summaries
