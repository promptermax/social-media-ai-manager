export function logError(error: any, context?: string) {
  if (process.env.NODE_ENV === 'production') {
    // TODO: Integrate with Sentry or another logging service
    // Example: Sentry.captureException(error)
  } else {
    console.error(context ? `[${context}]` : '', error)
  }
} 