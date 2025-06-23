'use client';

import { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar } from '@/components/ui/avatar'
import { toast } from '@/hooks/use-toast'
import { UserRole } from '@prisma/client'

const TEAM_ID = 'mock-team-id' // TODO: Replace with real teamId from context or props

const ROLE_LABELS: Record<UserRole, string> = {
  ADMIN: 'Admin',
  TEAM_MEMBER: 'Team Member',
  CLIENT: 'Client',
}

export function TeamMembersSection() {
  const [members, setMembers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)
  const [removing, setRemoving] = useState<string | null>(null)

  useEffect(() => {
    fetchMembers()
  }, [])

  async function fetchMembers() {
    setLoading(true)
    try {
      const res = await fetch(`/api/teams/members?teamId=${TEAM_ID}`)
      const data = await res.json()
      setMembers(data.members || [])
    } catch (e) {
      toast({ title: 'Error', description: 'Failed to load team members', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  async function handleRoleChange(memberId: string, newRole: UserRole) {
    setUpdating(memberId)
    try {
      const res = await fetch('/api/teams/members', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memberId, role: newRole }),
      })
      if (!res.ok) throw new Error()
      toast({ title: 'Role updated' })
      fetchMembers()
    } catch {
      toast({ title: 'Error', description: 'Failed to update role', variant: 'destructive' })
    } finally {
      setUpdating(null)
    }
  }

  async function handleRemove(memberId: string) {
    setRemoving(memberId)
    try {
      const res = await fetch(`/api/teams/members?memberId=${memberId}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      toast({ title: 'Member removed' })
      fetchMembers()
    } catch {
      toast({ title: 'Error', description: 'Failed to remove member', variant: 'destructive' })
    } finally {
      setRemoving(null)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Members</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-muted-foreground">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-2 px-2 text-left">User</th>
                  <th className="py-2 px-2 text-left">Email</th>
                  <th className="py-2 px-2 text-left">Role</th>
                  <th className="py-2 px-2 text-left">Joined</th>
                  <th className="py-2 px-2"></th>
                </tr>
              </thead>
              <tbody>
                {members.map((member) => (
                  <tr key={member.id} className="border-b">
                    <td className="py-2 px-2 flex items-center gap-2">
                      <Avatar src={member.user?.image} alt={member.user?.name || member.user?.email} />
                      <span>{member.user?.name || member.user?.email}</span>
                    </td>
                    <td className="py-2 px-2">{member.user?.email}</td>
                    <td className="py-2 px-2">
                      <Select
                        value={member.role}
                        onValueChange={(val) => handleRoleChange(member.id, val as UserRole)}
                        disabled={updating === member.id}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(ROLE_LABELS).map(([role, label]) => (
                            <SelectItem key={role} value={role}>{label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="py-2 px-2">{member.joinedAt ? new Date(member.joinedAt).toLocaleDateString() : ''}</td>
                    <td className="py-2 px-2">
                      <Button
                        variant="destructive"
                        size="sm"
                        disabled={removing === member.id}
                        onClick={() => handleRemove(member.id)}
                      >
                        Remove
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 