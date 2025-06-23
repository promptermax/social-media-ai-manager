import React, { useEffect, useState } from 'react'
import { Button } from './ui/button'
import { Select } from './ui/select'
import { Input } from './ui/input'
import { toast } from '@/hooks/use-toast'

interface User {
  id: string
  name: string
  email: string
}

interface Task {
  id: string
  title: string
  type: string
  status: string
  dueDate: string
  assignedTo: User | null
  priority: string
}

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [filters, setFilters] = useState({ assignedToMe: false, status: '', type: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch('/api/teams/members').then(res => res.json()).then(data => setUsers(data.members || []))
  }, [])

  useEffect(() => {
    fetchTasks()
  }, [filters])

  const fetchTasks = async () => {
    setLoading(true)
    let url = '/api/tasks?'
    if (filters.assignedToMe) {
      // Assume current user is available via /api/auth/session
      const session = await fetch('/api/auth/session').then(res => res.json())
      if (session?.user?.id) url += `assignedToId=${session.user.id}&`
    }
    if (filters.status) url += `status=${filters.status}&`
    if (filters.type) url += `type=${filters.type}&`
    const res = await fetch(url)
    const data = await res.json()
    setTasks(data.tasks || [])
    setLoading(false)
  }

  const handleStatusChange = async (taskId: string, status: string) => {
    const res = await fetch('/api/tasks', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: taskId, status }),
    })
    if (res.ok) {
      toast({ title: 'Task updated', description: 'Status updated.' })
      fetchTasks()
    } else {
      toast({ title: 'Error', description: 'Failed to update status', variant: 'destructive' })
    }
  }

  const handleReassign = async (taskId: string, assignedToId: string) => {
    const res = await fetch('/api/tasks', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: taskId, assignedToId }),
    })
    if (res.ok) {
      toast({ title: 'Task updated', description: 'Assignee updated.' })
      fetchTasks()
    } else {
      toast({ title: 'Error', description: 'Failed to reassign', variant: 'destructive' })
    }
  }

  return (
    <div className="p-4">
      <div className="flex gap-4 mb-4">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={filters.assignedToMe} onChange={e => setFilters(f => ({ ...f, assignedToMe: e.target.checked }))} />
          Assigned to me
        </label>
        <Select value={filters.status} onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}>
          <option value="">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </Select>
        <Select value={filters.type} onChange={e => setFilters(f => ({ ...f, type: e.target.value }))}>
          <option value="">All Types</option>
          <option value="CONTENT">Content</option>
          <option value="ENGAGEMENT">Engagement</option>
        </Select>
        <Button onClick={fetchTasks} disabled={loading}>Refresh</Button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border bg-white rounded shadow">
          <thead>
            <tr>
              <th className="p-2">Title</th>
              <th className="p-2">Type</th>
              <th className="p-2">Status</th>
              <th className="p-2">Due Date</th>
              <th className="p-2">Assignee</th>
              <th className="p-2">Priority</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(task => (
              <tr key={task.id} className="border-t">
                <td className="p-2">{task.title}</td>
                <td className="p-2">{task.type}</td>
                <td className="p-2">
                  <Select value={task.status} onChange={e => handleStatusChange(task.id, e.target.value)}>
                    <option value="PENDING">Pending</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </Select>
                </td>
                <td className="p-2">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}</td>
                <td className="p-2">
                  <Select value={task.assignedTo?.id || ''} onChange={e => handleReassign(task.id, e.target.value)}>
                    <option value="">Unassigned</option>
                    {users.map(u => (
                      <option key={u.id} value={u.id}>{u.name || u.email}</option>
                    ))}
                  </Select>
                </td>
                <td className="p-2">{task.priority}</td>
                <td className="p-2">
                  {/* Future: Edit/Delete buttons */}
                </td>
              </tr>
            ))}
            {tasks.length === 0 && (
              <tr><td colSpan={7} className="text-center p-4">No tasks found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
} 