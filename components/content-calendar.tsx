"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DayPicker } from "react-day-picker"
import "react-day-picker/dist/style.css"

const PLATFORMS = ["INSTAGRAM", "FACEBOOK", "TWITTER", "LINKEDIN"]

export function ContentCalendar() {
  const [events, setEvents] = useState([])
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [modalOpen, setModalOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  // Fetch events from API
  useEffect(() => {
    fetch("/api/calendar/scheduled-posts")
      .then(async (res) => {
        if (!res.ok) return [];
        try {
          return await res.json();
        } catch {
          return [];
        }
      })
      .then(setEvents)
  }, [])

  // Helper to compare dates ignoring time zone
  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  // Filter events for the selected date
  const dayEvents = events.filter((e: any) =>
    selectedDate && isSameDay(new Date(e.scheduledAt), selectedDate)
  )

  // Handlers for create/edit/delete
  const handleCreate = () => {
    setEditingEvent({ title: "", content: "", platform: "INSTAGRAM", scheduledAt: selectedDate })
    setModalOpen(true)
  }
  const handleEdit = (event: any) => {
    setEditingEvent(event)
    setModalOpen(true)
  }
  const handleDelete = async (id: string) => {
    setLoading(true)
    try {
      await fetch("/api/calendar/scheduled-posts", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
      setEvents((prev: any) => prev.filter((e: any) => e.id !== id))
    } catch (e) {
      // Optionally show error
    } finally {
      setLoading(false)
    }
  }
  const handleSave = async () => {
    setLoading(true)
    try {
      if (editingEvent?.id) {
        // Edit existing
        await fetch("/api/calendar/scheduled-posts", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingEvent),
        })
      } else {
        // Create new
        await fetch("/api/calendar/scheduled-posts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingEvent),
        })
      }
      setModalOpen(false)
      setEditingEvent(null)
      // Refresh events
      fetch("/api/calendar/scheduled-posts")
        .then(async (res) => {
          if (!res.ok) return [];
          try {
            return await res.json();
          } catch {
            return [];
          }
        })
        .then(setEvents)
    } catch (e) {
      // Optionally show error
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="rounded-2xl border border-gray-200">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Content Calendar</CardTitle>
        <Button onClick={handleCreate}>+ Schedule Post</Button>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col lg:flex-row gap-8">
          <div>
            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-lg border"
            />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold mb-2">Scheduled Posts for {selectedDate?.toLocaleDateString()}</h3>
            {dayEvents.length === 0 && <div className="text-gray-500">No posts scheduled.</div>}
            <ul className="space-y-3">
              {dayEvents.map((event: any) => (
                <li key={event.id} className="p-4 border rounded-lg flex flex-col gap-1 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <span className="font-bold">{event.title}</span>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(event)}>Edit</Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(event.id)}>Delete</Button>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">{event.platform} • {new Date(event.scheduledAt).toLocaleTimeString()}</div>
                  <div className="text-sm">{event.content}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingEvent?.id ? "Edit Scheduled Post" : "Schedule New Post"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Title"
              value={editingEvent?.title || ""}
              onChange={e => setEditingEvent((ev: any) => ({ ...ev, title: e.target.value }))}
            />
            <Textarea
              placeholder="Content"
              value={editingEvent?.content || ""}
              onChange={e => setEditingEvent((ev: any) => ({ ...ev, content: e.target.value }))}
            />
            <Select
              value={editingEvent?.platform || "INSTAGRAM"}
              onValueChange={val => setEditingEvent((ev: any) => ({ ...ev, platform: val }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Platform" />
              </SelectTrigger>
              <SelectContent>
                {PLATFORMS.map(p => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="datetime-local"
              value={editingEvent?.scheduledAt ? new Date(editingEvent.scheduledAt).toISOString().slice(0, 16) : ""}
              onChange={e => setEditingEvent((ev: any) => ({ ...ev, scheduledAt: new Date(e.target.value) }))}
            />
          </div>
          <DialogFooter>
            <Button onClick={handleSave} disabled={loading}>{editingEvent?.id ? "Save Changes" : "Create Post"}</Button>
            <Button variant="ghost" onClick={() => setModalOpen(false)} disabled={loading}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
