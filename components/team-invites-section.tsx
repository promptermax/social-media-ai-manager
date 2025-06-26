'use client';

import { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from '@/hooks/use-toast'
import { UserRole } from '@/lib/dummy-data'

const TEAM_ID = 'mock-team-id' // TODO: Replace with real teamId from context or props

const ROLE_LABELS: Record<UserRole, string> = {
  ADMIN: 'Admin',
  TEAM_MEMBER: 'Team Member',
  CLIENT: 'Client',
}

export function TeamInvitesSection() {
  const [invites, setInvites] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [revoking, setRevoking] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<UserRole>('TEAM_MEMBER')

  useEffect(() => {
    fetchInvites()
  }, [])

  async function fetchInvites() {
    setLoading(true)
    try {
      const res = await fetch(`/api/teams/invites?teamId=${TEAM_ID}`)
      const data = await res.json()
      setInvites(data.invites || [])
    } catch (e) {
      toast({ title: 'Error', description: 'Failed to load invites', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  async function handleSendInvite(e: React.FormEvent) {
    e.preventDefault()
    setSending(true)
    try {
      const res = await fetch('/api/teams/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, teamId: TEAM_ID, role }),
      })
      if (!res.ok) throw new Error()
      toast({ title: 'Invite sent' })
      setEmail('')
      setRole('TEAM_MEMBER')
      fetchInvites()
    } catch {
      toast({ title: 'Error', description: 'Failed to send invite', variant: 'destructive' })
    } finally {
      setSending(false)
    }
  }

  async function handleRevoke(inviteId: string) {
    setRevoking(inviteId)
    try {
      const res = await fetch(`/api/teams/invites?inviteId=${inviteId}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      toast({ title: 'Invite revoked' })
      fetchInvites()
    } catch {
      toast({ title: 'Error', description: 'Failed to revoke invite', variant: 'destructive' })
    } finally {
      setRevoking(null)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Invites</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="flex flex-col md:flex-row gap-2 mb-4" onSubmit={handleSendInvite}>
          <Input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="md:w-64"
          />
          <Select value={role} onValueChange={val => setRole(val as UserRole)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(ROLE_LABELS).map(([role, label]) => (
                <SelectItem key={role} value={role}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button type="submit" disabled={sending}>
            {sending ? 'Sending...' : 'Invite'}
          </Button>
        </form>
        {loading ? (
          <div className="text-muted-foreground">Loading...</div>
        ) : invites.length === 0 ? (
          <div className="text-muted-foreground">No pending invites.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-2 px-2 text-left">Email</th>
                  <th className="py-2 px-2 text-left">Role</th>
                  <th className="py-2 px-2 text-left">Status</th>
                  <th className="py-2 px-2 text-left">Sent</th>
                  <th className="py-2 px-2"></th>
                </tr>
              </thead>
              <tbody>
                {invites.map((invite) => (
                  <tr key={invite.id} className="border-b">
                    <td className="py-2 px-2">{invite.email}</td>
                    <td className="py-2 px-2">{ROLE_LABELS[invite.role]}</td>
                    <td className="py-2 px-2">{invite.status}</td>
                    <td className="py-2 px-2">{invite.createdAt ? new Date(invite.createdAt).toLocaleDateString() : ''}</td>
                    <td className="py-2 px-2">
                      {invite.status === 'PENDING' && (
                        <Button
                          variant="destructive"
                          size="sm"
                          disabled={revoking === invite.id}
                          onClick={() => handleRevoke(invite.id)}
                        >
                          Revoke
                        </Button>
                      )}
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