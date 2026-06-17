import { redirect } from 'next/navigation'

// Demo scorecard — redirects to the static demo ID
export default function DemoScorecard() {
  redirect('/scorecard/demo-session-001')
}
