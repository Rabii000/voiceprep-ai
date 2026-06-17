import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

export interface GeneratedQuestion {
  text: string
  category: 'behavioral' | 'situational' | 'technical' | 'culture' | 'weakness' | 'closing'
  difficulty: 1 | 2 | 3 | 4 | 5
  expected_framework?: string
}

export async function generateQuestions(
  resumeText: string,
  jdText: string,
  count = 30
): Promise<GeneratedQuestion[]> {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4096,
    messages: [
      {
        role: 'user',
        content: `You are an expert interview coach. Based on this resume and job description, generate ${count} tailored interview questions.

RESUME:
${resumeText}

JOB DESCRIPTION:
${jdText}

Generate questions across these categories:
- behavioral (STAR-based, tied to resume achievements)
- situational (hypothetical scenarios from JD responsibilities)
- technical (role-specific tools and concepts)
- culture (company values alignment)
- weakness (constructive challenge questions)
- closing (negotiation and offer handling)

Return ONLY a JSON array with this exact structure:
[
  {
    "text": "question text",
    "category": "behavioral",
    "difficulty": 3,
    "expected_framework": "STAR method - focus on quantifiable outcome"
  }
]

Distribute questions roughly: 30% behavioral, 25% situational, 20% technical, 10% culture, 10% weakness, 5% closing.
Assign difficulty 1-5 based on complexity.`,
      },
    ],
  })

  const content = response.content[0]
  if (content.type !== 'text') throw new Error('Unexpected response type')

  const jsonMatch = content.text.match(/\[[\s\S]*\]/)
  if (!jsonMatch) throw new Error('No JSON array found in response')

  return JSON.parse(jsonMatch[0]) as GeneratedQuestion[]
}

export async function analyzeDocuments(resumeText: string, jdText: string) {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2048,
    messages: [
      {
        role: 'user',
        content: `Analyze this resume and job description. Return a JSON object with:
{
  "candidate_name": "extracted name",
  "target_role": "role being applied for",
  "seniority_level": "entry|mid|senior|executive",
  "key_skills": ["skill1", "skill2"],
  "skill_gaps": ["missing skill 1"],
  "alignment_score": 85,
  "interview_type": "behavioral|technical|case|executive",
  "strengths": ["strength1"],
  "areas_to_prepare": ["area1"]
}

RESUME: ${resumeText}

JOB DESCRIPTION: ${jdText}`,
      },
    ],
  })

  const content = response.content[0]
  if (content.type !== 'text') throw new Error('Unexpected response type')
  const jsonMatch = content.text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('No JSON found')
  return JSON.parse(jsonMatch[0])
}

export async function scoreSession(
  transcript: { question: string; answer: string }[],
  resumeText: string,
  jdText: string
) {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4096,
    messages: [
      {
        role: 'user',
        content: `You are an expert interview evaluator. Score this mock interview session.

CONTEXT:
Resume: ${resumeText.substring(0, 1000)}
Job Description: ${jdText.substring(0, 500)}

TRANSCRIPT:
${transcript.map((t, i) => `Q${i + 1}: ${t.question}\nA${i + 1}: ${t.answer}`).join('\n\n')}

Return a JSON object:
{
  "overall_score": 78,
  "completeness_score": 80,
  "star_compliance_score": 75,
  "confidence_score": 72,
  "coaching_notes": "Overall summary...",
  "strongest_answers": [0, 2],
  "weakest_answers": [1, 3],
  "per_question": [
    {
      "score": 80,
      "feedback": "Good use of STAR...",
      "suggested_rewrite": "Consider adding...",
      "strengths": ["clear situation"],
      "improvements": ["quantify the result"]
    }
  ]
}`,
      },
    ],
  })

  const content = response.content[0]
  if (content.type !== 'text') throw new Error('Unexpected response type')
  const jsonMatch = content.text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('No JSON found')
  return JSON.parse(jsonMatch[0])
}
