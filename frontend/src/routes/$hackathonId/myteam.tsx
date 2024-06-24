import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$hackathonId/myteam')({
  component: () => <div>Hello /$hackathonId/myteam!</div>
})

