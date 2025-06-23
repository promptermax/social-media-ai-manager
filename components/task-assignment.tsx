'use client';

import React, { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Select } from './ui/select'
import { Label } from './ui/label'
import { toast } from '@/hooks/use-toast'

interface User {
  id: string
  name: string
  email: string
}

interface Props {
  onTaskCreated?: () => void
}

export default function TaskAssignment({ onTaskCreated }: Props) {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    title: '',
    description: '',
    type: 'CONTENT',
    dueDate: '',
    assignedToId: '',
    priority: 'MEDIUM',
  })

  useEffect(() => {
    // Fetch users for assignee dropdown
    fetch('/api/teams/members')
      .then(res => res.json())
      .then(data => setUsers(data.members || []))
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setLoading(false)
    if (res.ok) {
      toast({ title: 'Task created', description: 'The task was assigned successfully.' })
      setForm({ title: '', description: '', type: 'CONTENT', dueDate: '', assignedToId: '', priority: 'MEDIUM' })
      onTaskCreated?.()
    } else {
      const err = await res.json()
      toast({ title: 'Error', description: err.error || 'Failed to create task', variant: 'destructive' })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 max-w-md mx-auto bg-white rounded shadow">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" value={form.title} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" value={form.description} onChange={handleChange} />
      </div>
      <div>
        <Label htmlFor="type">Type</Label>
        <Select id="type" name="type" value={form.type} onChange={handleChange} required>
          <option value="CONTENT">Content</option>
          <option value="ENGAGEMENT">Engagement</option>
        </Select>
      </div>
      <div>
        <Label htmlFor="dueDate">Due Date</Label>
        <Input id="dueDate" name="dueDate" type="date" value={form.dueDate} onChange={handleChange} />
      </div>
      <div>
        <Label htmlFor="assignedToId">Assignee</Label>
        <Select id="assignedToId" name="assignedToId" value={form.assignedToId} onChange={handleChange} required>
          <option value="">Select user</option>
          {users.map(u => (
            <option key={u.id} value={u.id}>{u.name || u.email}</option>
          ))}
        </Select>
      </div>
      <div>
        <Label htmlFor="priority">Priority</Label>
        <Select id="priority" name="priority" value={form.priority} onChange={handleChange} required>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="URGENT">Urgent</option>
        </Select>
      </div>
      <Button type="submit" disabled={loading} className="w-full">{loading ? 'Assigning...' : 'Assign Task'}</Button>
    </form>
  )
} 