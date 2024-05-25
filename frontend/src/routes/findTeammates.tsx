import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/findTeammates')({
  component: () => <div>Hello /FindTeammates!</div>
})