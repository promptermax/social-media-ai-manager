import { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { toast } from '@/hooks/use-toast'
import { UserRole } from '@prisma/client'

const TEAM_ID = 'mock-team-id' // TODO: Replace with real teamId from context or props

const ROLE_LABELS: Record<UserRole, string> = {
  ADMIN: 'Admin',
  TEAM_MEMBER: 'Team Member',
  CLIENT: 'Client',
}

const RESOURCE_OPTIONS = [
  'dashboard',
  'analytics',
  'messages',
  'calendar',
  'documents',
  'settings',
]
const ACTION_OPTIONS = ['view', 'edit', 'delete', 'manage']

export function TeamPermissionsSection() {
  const [role, setRole] = useState<UserRole>('TEAM_MEMBER')
  const [permissions, setPermissions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [newResource, setNewResource] = useState('')
  const [newAction, setNewAction] = useState('view')

  useEffect(() => {
    fetchPermissions()
    // eslint-disable-next-line
  }, [role])

  async function fetchPermissions() {
    setLoading(true)
    try {
      const res = await fetch(`/api/teams/permissions?teamId=${TEAM_ID}&role=${role}`)
      const data = await res.json()
      setPermissions(data.permissions || [])
    } catch (e) {
      toast({ title: 'Error', description: 'Failed to load permissions', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  async function handleTogglePermission(permission: any) {
    setSaving(true)
    try {
      await fetch('/api/teams/permissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teamId: TEAM_ID,
          role,
          resource: permission.resource,
          action: permission.action,
          allowed: !permission.allowed,
        }),
      })
      fetchPermissions()
    } catch {
      toast({ title: 'Error', description: 'Failed to update permission', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  async function handleAddPermission(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      await fetch('/api/teams/permissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teamId: TEAM_ID,
          role,
          resource: newResource,
          action: newAction,
          allowed: true,
        }),
      })
      setNewResource('')
      setNewAction('view')
      fetchPermissions()
    } catch {
      toast({ title: 'Error', description: 'Failed to add permission', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Role Permissions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Select value={role} onValueChange={val => setRole(val as UserRole)}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(ROLE_LABELS).map(([role, label]) => (
                <SelectItem key={role} value={role}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {loading ? (
          <div className="text-muted-foreground">Loading...</div>
        ) : (
          <div className="space-y-2">
            {permissions.length === 0 && (
              <div className="text-muted-foreground">No permissions for this role.</div>
            )}
            {permissions.map((perm) => (
              <div key={perm.id} className="flex items-center gap-2 border rounded px-3 py-2">
                <div className="flex-1">
                  <span className="font-medium">{perm.resource}</span>
                  <span className="mx-2 text-muted-foreground">/</span>
                  <span>{perm.action}</span>
                </div>
                <Switch
                  checked={perm.allowed}
                  onCheckedChange={() => handleTogglePermission(perm)}
                  disabled={saving}
                />
                <span className="text-xs text-muted-foreground ml-2">{perm.allowed ? 'Allowed' : 'Denied'}</span>
              </div>
            ))}
          </div>
        )}
        <form className="flex flex-col gap-2 mt-6" onSubmit={handleAddPermission}>
          <div className="flex gap-2">
            <Input
              placeholder="Resource (e.g. analytics)"
              value={newResource}
              onChange={e => setNewResource(e.target.value)}
              list="resource-options"
              required
              className="w-40"
            />
            <datalist id="resource-options">
              {RESOURCE_OPTIONS.map((r) => <option key={r} value={r} />)}
            </datalist>
            <Select value={newAction} onValueChange={setNewAction}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ACTION_OPTIONS.map((action) => (
                  <SelectItem key={action} value={action}>{action}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button type="submit" disabled={saving || !newResource}>
              Add
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
} 