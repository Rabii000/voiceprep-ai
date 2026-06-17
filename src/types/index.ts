export interface UserProfile {
  id: string
  email: string
  full_name?: string
  target_role?: string
  industry?: string
  experience_level?: 'entry' | 'mid' | 'senior' | 'executive'
  created_at: string
}

export interface Session {
  id: string
  user_id: string
  resume_text?: string
  jd_text?: string
  duration_minutes: number
  interview_type: 'hr_screen' | 'technical' | 'panel' | 'final_round'
  interviewer_persona: 'friendly_hr' | 'stern_technical' | 'executive_panel'
  voice_id: string
  mode: 'solo' | 'panel' | 'stress' | 'shadow' | 'blind'
  status: 'setup' | 'active' | 'completed' | 'abandoned'
  score?: number
  created_at: string
  completed_at?: string
}

export interface Question {
  id: string
  session_id: string
  text: string
  category: 'behavioral' | 'situational' | 'technical' | 'culture' | 'weakness' | 'closing'
  difficulty: 1 | 2 | 3 | 4 | 5
  order_index: number
  pinned: boolean
  answer_transcript?: string
  score?: number
  feedback?: string
}

export interface Scorecard {
  session_id: string
  overall_score: number
  completeness_score: number
  star_compliance_score: number
  filler_word_rate: number
  confidence_score: number
  talk_time_balance: number
  skipped_count: number
  strongest_questions: string[]
  weakest_questions: string[]
  coaching_notes: string
  ai_feedback: Record<string, QuestionFeedback>
}

export interface QuestionFeedback {
  question_id: string
  score: number
  feedback: string
  suggested_rewrite?: string
  strengths: string[]
  improvements: string[]
}

export type InterviewerVoice = {
  id: string
  name: string
  description: string
  persona: string
}

export const INTERVIEWER_VOICES: InterviewerVoice[] = [
  { id: 'voice_1', name: 'Alex', description: 'Professional & Warm', persona: 'friendly_hr' },
  { id: 'voice_2', name: 'Jordan', description: 'Analytical & Direct', persona: 'stern_technical' },
  { id: 'voice_3', name: 'Morgan', description: 'Executive & Strategic', persona: 'executive_panel' },
  { id: 'voice_4', name: 'Riley', description: 'Encouraging & Thorough', persona: 'friendly_hr' },
  { id: 'voice_5', name: 'Taylor', description: 'Challenging & Precise', persona: 'stern_technical' },
  { id: 'voice_6', name: 'Casey', description: 'Panel Chair', persona: 'executive_panel' },
]
