import { TeamMembersSection } from '@/components/team-members-section'
import { TeamInvitesSection } from '@/components/team-invites-section'
import { TeamPermissionsSection } from '@/components/team-permissions-section'

export default function TeamManagementPage() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold tracking-tight mb-4">Team Management</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <TeamMembersSection />
          <TeamInvitesSection />
        </div>
        <div>
          <TeamPermissionsSection />
        </div>
      </div>
    </div>
  )
} 