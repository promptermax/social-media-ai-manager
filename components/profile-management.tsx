import React, { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { toast } from '@/hooks/use-toast'

export default function ProfileManagement() {
  const [profile, setProfile] = useState({ name: '', email: '' })
  const [loading, setLoading] = useState(false)
  const [pwForm, setPwForm] = useState({ current: '', new: '', confirm: '' })
  const [pwLoading, setPwLoading] = useState(false)

  useEffect(() => {
    fetch('/api/profile').then(res => res.json()).then(data => setProfile({ name: data.name || '', email: data.email || '' }))
  }, [])

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const res = await fetch('/api/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    })
    setLoading(false)
    if (res.ok) {
      toast({ title: 'Profile updated', description: 'Your info was updated.' })
    } else {
      toast({ title: 'Error', description: 'Failed to update profile', variant: 'destructive' })
    }
  }

  const handlePwChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPwForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handlePwSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (pwForm.new !== pwForm.confirm) {
      toast({ title: 'Error', description: 'Passwords do not match', variant: 'destructive' })
      return
    }
    setPwLoading(true)
    const res = await fetch('/api/profile/password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ current: pwForm.current, new: pwForm.new }),
    })
    setPwLoading(false)
    if (res.ok) {
      toast({ title: 'Password changed', description: 'Your password was updated.' })
      setPwForm({ current: '', new: '', confirm: '' })
    } else {
      const err = await res.json()
      toast({ title: 'Error', description: err.error || 'Failed to change password', variant: 'destructive' })
    }
  }

  return (
    <div className="max-w-lg mx-auto p-4 space-y-8">
      <form onSubmit={handleProfileSubmit} className="space-y-4 bg-white rounded shadow p-4">
        <h2 className="font-semibold text-lg mb-2">Profile Info</h2>
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" value={profile.name} onChange={handleProfileChange} required />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" value={profile.email} onChange={handleProfileChange} required />
        </div>
        <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Update Info'}</Button>
      </form>
      <form onSubmit={handlePwSubmit} className="space-y-4 bg-white rounded shadow p-4">
        <h2 className="font-semibold text-lg mb-2">Change Password</h2>
        <div>
          <Label htmlFor="current">Current Password</Label>
          <Input id="current" name="current" type="password" value={pwForm.current} onChange={handlePwChange} required />
        </div>
        <div>
          <Label htmlFor="new">New Password</Label>
          <Input id="new" name="new" type="password" value={pwForm.new} onChange={handlePwChange} required />
        </div>
        <div>
          <Label htmlFor="confirm">Confirm New Password</Label>
          <Input id="confirm" name="confirm" type="password" value={pwForm.confirm} onChange={handlePwChange} required />
        </div>
        <Button type="submit" disabled={pwLoading}>{pwLoading ? 'Changing...' : 'Change Password'}</Button>
      </form>
    </div>
  )
} 