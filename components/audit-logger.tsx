"use client"

import type React from "react"

import { useEffect } from "react"

interface AuditEvent {
  action: string
  resource: string
  resourceId?: string
  details: string
  metadata?: Record<string, any>
  severity?: "info" | "warning" | "error" | "success"
  category?: string
}

class AuditLogger {
  private static instance: AuditLogger
  private events: AuditEvent[] = []

  static getInstance(): AuditLogger {
    if (!AuditLogger.instance) {
      AuditLogger.instance = new AuditLogger()
    }
    return AuditLogger.instance
  }

  log(event: AuditEvent) {
    const auditEntry = {
      ...event,
      timestamp: new Date(),
      user: this.getCurrentUser(),
      ip: this.getClientIP(),
      userAgent: navigator.userAgent,
      sessionId: this.getSessionId(),
      severity: event.severity || "info",
      category: event.category || "general",
    }

    this.events.push(auditEntry)

    // In a real application, you would send this to your backend
    console.log("Audit Log:", auditEntry)

    // Store in localStorage for demo purposes
    const existingLogs = JSON.parse(localStorage.getItem("auditLogs") || "[]")
    existingLogs.push(auditEntry)
    localStorage.setItem("auditLogs", JSON.stringify(existingLogs.slice(-1000))) // Keep last 1000 entries
  }

  private getCurrentUser() {
    // In a real app, get from auth context
    return {
      name: "John Doe",
      email: "john@acme.com",
      id: "user-123",
    }
  }

  private getClientIP() {
    // In a real app, this would be handled server-side
    return "192.168.1.100"
  }

  private getSessionId() {
    let sessionId = sessionStorage.getItem("sessionId")
    if (!sessionId) {
      sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      sessionStorage.setItem("sessionId", sessionId)
    }
    return sessionId
  }

  getEvents() {
    return this.events
  }
}

// Hook to use audit logging
export function useAuditLogger() {
  const logger = AuditLogger.getInstance()

  const logActivity = (event: AuditEvent) => {
    logger.log(event)
  }

  return { logActivity }
}

// Component to automatically track page views
export function AuditTracker({ page }: { page: string }) {
  const { logActivity } = useAuditLogger()

  useEffect(() => {
    logActivity({
      action: "viewed",
      resource: "Page",
      resourceId: page,
      details: `Viewed ${page} page`,
      category: "navigation",
      severity: "info",
    })
  }, [page, logActivity])

  return null
}

// Higher-order component to wrap components with audit logging
export function withAuditLogging<T extends object>(WrappedComponent: React.ComponentType<T>, componentName: string) {
  return function AuditLoggedComponent(props: T) {
    const { logActivity } = useAuditLogger()

    useEffect(() => {
      logActivity({
        action: "loaded",
        resource: "Component",
        resourceId: componentName,
        details: `${componentName} component loaded`,
        category: "component",
        severity: "info",
      })
    }, [logActivity])

    return <WrappedComponent {...props} />
  }
}

export default AuditLogger
