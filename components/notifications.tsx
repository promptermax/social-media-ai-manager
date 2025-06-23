'use client';

import React, { useEffect, useState } from 'react'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { toast } from '@/hooks/use-toast'

interface Notification {
  id: string
  title: string
  message: string
  isRead: boolean
  createdAt: string
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open) fetchNotifications()
  }, [open])

  const fetchNotifications = async () => {
    setLoading(true)
    const res = await fetch('/api/notifications')
    const data = await res.json()
    setNotifications(data.notifications || [])
    setLoading(false)
  }

  const markAsRead = async (id: string) => {
    const res = await fetch(`/api/notifications`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, isRead: true }),
    })
    if (res.ok) {
      setNotifications(n => n.map(notif => notif.id === id ? { ...notif, isRead: true } : notif))
    } else {
      toast({ title: 'Error', description: 'Failed to mark as read', variant: 'destructive' })
    }
  }

  const unreadCount = notifications.filter(n => !n.isRead).length

  return (
    <div className="relative inline-block">
      <Button variant="ghost" onClick={() => setOpen(o => !o)} aria-label="Notifications">
        <span className="material-icons">notifications</span>
        {unreadCount > 0 && <Badge className="absolute -top-1 -right-1">{unreadCount}</Badge>}
      </Button>
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white border rounded shadow-lg z-50 max-h-96 overflow-y-auto">
          <div className="p-2 font-semibold border-b">Notifications</div>
          {loading ? (
            <div className="p-4 text-center">Loading...</div>
          ) : notifications.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No notifications</div>
          ) : (
            notifications.map(n => (
              <div key={n.id} className={`p-3 border-b last:border-b-0 flex items-start gap-2 ${n.isRead ? 'bg-gray-50' : 'bg-blue-50'}`}>
                <div className="flex-1">
                  <div className="font-medium">{n.title}</div>
                  <div className="text-sm text-gray-700">{n.message}</div>
                  <div className="text-xs text-gray-400 mt-1">{new Date(n.createdAt).toLocaleString()}</div>
                </div>
                {!n.isRead && (
                  <Button size="sm" variant="outline" onClick={() => markAsRead(n.id)}>Mark as read</Button>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
} 