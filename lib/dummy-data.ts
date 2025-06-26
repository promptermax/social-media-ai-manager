// Dummy data to replace Prisma during development
// This will be replaced with Supabase in the future

export enum UserRole {
  ADMIN = 'ADMIN',
  TEAM_LEAD = 'TEAM_LEAD',
  TEAM_MEMBER = 'TEAM_MEMBER'
}

export enum Platform {
  TWITTER = 'TWITTER',
  FACEBOOK = 'FACEBOOK',
  INSTAGRAM = 'INSTAGRAM',
  LINKEDIN = 'LINKEDIN'
}

export enum PostStatus {
  DRAFT = 'DRAFT',
  SCHEDULED = 'SCHEDULED',
  PUBLISHED = 'PUBLISHED',
  FAILED = 'FAILED'
}

export enum TaskType {
  CONTENT = 'CONTENT',
  ENGAGEMENT = 'ENGAGEMENT',
  ANALYTICS = 'ANALYTICS',
  MODERATION = 'MODERATION'
}

export enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

export enum TemplateType {
  POST = 'POST',
  STORY = 'STORY',
  AD = 'AD',
  EMAIL = 'EMAIL'
}

export enum DocumentType {
  BRAND_GUIDE = 'BRAND_GUIDE',
  CONTENT_CALENDAR = 'CONTENT_CALENDAR',
  REPORT = 'REPORT',
  STRATEGY = 'STRATEGY'
}

// Dummy users
export const dummyUsers = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: UserRole.ADMIN,
    image: '/placeholder-user.jpg',
    brandVoice: 'Professional and engaging',
    brandLogo: '/placeholder-logo.png',
    password: 'hashedpassword123',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: UserRole.TEAM_LEAD,
    image: '/placeholder-user.jpg',
    password: 'hashedpassword456',
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-16')
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    role: UserRole.TEAM_MEMBER,
    image: '/placeholder-user.jpg',
    password: 'hashedpassword789',
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-17')
  }
]

// Dummy posts
export const dummyPosts = [
  {
    id: '1',
    title: 'Welcome to our new product!',
    content: 'We are excited to announce our latest feature...',
    platform: Platform.TWITTER,
    status: PostStatus.PUBLISHED,
    publishedAt: new Date('2024-01-10'),
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-10'),
    userId: '1'
  },
  {
    id: '2',
    title: 'Behind the scenes',
    content: 'Take a look at how we create amazing content...',
    platform: Platform.INSTAGRAM,
    status: PostStatus.SCHEDULED,
    scheduledAt: new Date('2024-01-20'),
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    userId: '2'
  },
  {
    id: '3',
    title: 'Tips for social media success',
    content: 'Here are some proven strategies...',
    platform: Platform.FACEBOOK,
    status: PostStatus.PUBLISHED,
    publishedAt: new Date('2024-01-12'),
    createdAt: new Date('2024-01-11'),
    updatedAt: new Date('2024-01-12'),
    userId: '1'
  }
]

// Dummy messages
export const dummyMessages = [
  {
    id: '1',
    content: 'Great post! Love the new features.',
    platform: Platform.TWITTER,
    senderName: '@customer1',
    type: 'COMMENT',
    sentiment: 'positive',
    priority: Priority.MEDIUM,
    isRead: false,
    isReplied: false,
    createdAt: new Date('2024-01-10T10:30:00'),
    updatedAt: new Date('2024-01-10T10:30:00'),
    userId: '1',
    replies: []
  },
  {
    id: '2', 
    content: 'Having trouble with the login process.',
    platform: Platform.FACEBOOK,
    senderName: 'Customer Support',
    type: 'DIRECT_MESSAGE',
    sentiment: 'negative',
    priority: Priority.HIGH,
    isRead: true,
    isReplied: true,
    createdAt: new Date('2024-01-11T14:20:00'),
    updatedAt: new Date('2024-01-11T14:20:00'),
    userId: '2',
    replies: [{ id: 'r1', content: 'Let me help you with that...' }]
  }
]

// Dummy documents
export const dummyDocuments = [
  {
    id: '1',
    name: 'Brand Guidelines 2024',
    type: DocumentType.BRAND_GUIDE,
    content: 'Our brand voice is professional yet approachable...',
    fileUrl: null,
    insights: JSON.stringify({ keyTerms: ['professional', 'approachable'], tone: 'formal' }),
    isProcessed: true,
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05'),
    userId: '1'
  }
]

// Dummy tasks
export const dummyTasks = [
  {
    id: '1',
    title: 'Create Instagram post for product launch',
    description: 'Design and schedule Instagram post for our new product launch',
    type: TaskType.CONTENT,
    status: TaskStatus.PENDING,
    priority: Priority.HIGH,
    dueDate: new Date('2024-01-25'),
    createdAt: new Date('2024-01-15'),
    userId: '1',
    assignedToId: '2'
  },
  {
    id: '2',
    title: 'Respond to customer inquiries',
    description: 'Review and respond to pending customer messages',
    type: TaskType.ENGAGEMENT,
    status: TaskStatus.IN_PROGRESS,
    priority: Priority.MEDIUM,
    dueDate: new Date('2024-01-18'),
    createdAt: new Date('2024-01-16'),
    userId: '2',
    assignedToId: '3'
  }
]

// Helper functions for mock database operations
function applyFilters(data: any[], where: any = {}): any[] {
  return data.filter(item => {
    for (const [key, value] of Object.entries(where)) {
      if (key === 'OR') {
        const orConditions = value as any[]
        const matches = orConditions.some(condition => 
          Object.entries(condition).every(([k, v]) => {
            if (typeof v === 'object' && v !== null && 'contains' in v) {
              return item[k]?.toLowerCase().includes((v as any).contains.toLowerCase())
            }
            return item[k] === v
          })
        )
        if (!matches) return false
      } else if (key === 'id' && typeof value === 'object' && 'in' in value) {
        if (!(value as any).in.includes(item.id)) return false
      } else if (key === 'createdAt' && typeof value === 'object') {
        const date = new Date(item.createdAt)
        if (value.gte && date < new Date(value.gte)) return false
        if (value.lte && date > new Date(value.lte)) return false
      } else if (item[key] !== value) {
        return false
      }
    }
    return true
  })
}

function applySelect(items: any[], select: any): any[] {
  if (!select) return items
  
  return items.map(item => {
    const result: any = {}
    for (const [key, value] of Object.entries(select)) {
      if (key === '_count' && typeof value === 'object') {
        result._count = {}
        for (const countKey of Object.keys(value as object)) {
          result._count[countKey] = Math.floor(Math.random() * 10) // Mock count
        }
      } else if (value === true) {
        result[key] = item[key]
      }
    }
    return result
  })
}

function applyOrderBy(items: any[], orderBy: any): any[] {
  if (!orderBy) return items
  
  const [key, direction] = Object.entries(orderBy)[0]
  return [...items].sort((a, b) => {
    const aVal = a[key]
    const bVal = b[key]
    if (direction === 'desc') {
      return aVal > bVal ? -1 : aVal < bVal ? 1 : 0
    }
    return aVal < bVal ? -1 : aVal > bVal ? 1 : 0
  })
}

function applyPagination(items: any[], skip: number = 0, take?: number): any[] {
  const start = skip
  const end = take ? start + take : undefined
  return items.slice(start, end)
}

// Mock database operations
export const mockDB = {
  user: {
    findUnique: async ({ where }: any) => {
      return dummyUsers.find(u => u.id === where.id || u.email === where.email) || null
    },
    findMany: async ({ where, select, orderBy, skip, take }: any = {}) => {
      let result = applyFilters(dummyUsers, where)
      result = applyOrderBy(result, orderBy)
      result = applyPagination(result, skip, take)
      return applySelect(result, select)
    },
    count: async ({ where }: any = {}) => {
      return applyFilters(dummyUsers, where).length
    },
    create: async ({ data, select }: any) => {
      const newUser = { 
        id: Date.now().toString(), 
        ...data, 
        createdAt: new Date(), 
        updatedAt: new Date() 
      }
      dummyUsers.push(newUser)
      return select ? applySelect([newUser], select)[0] : newUser
    },
    update: async ({ where, data }: any) => {
      const userIndex = dummyUsers.findIndex(u => u.id === where.id)
      if (userIndex !== -1) {
        dummyUsers[userIndex] = { ...dummyUsers[userIndex], ...data, updatedAt: new Date() }
        return dummyUsers[userIndex]
      }
      return null
    },
    groupBy: async ({ by, where, _count }: any) => {
      const filtered = applyFilters(dummyUsers, where)
      const groups: any = {}
      
      filtered.forEach(item => {
        const key = by.map((field: string) => item[field]).join('|')
        if (!groups[key]) {
          groups[key] = { ...by.reduce((obj: any, field: string) => ({ ...obj, [field]: item[field] }), {}), _count: 0 }
        }
        groups[key]._count++
      })
      
      return Object.values(groups)
    }
  },
  post: {
    findMany: async ({ where, select, orderBy, skip, take }: any = {}) => {
      let result = applyFilters(dummyPosts, where)
      result = applyOrderBy(result, orderBy)
      result = applyPagination(result, skip, take)
      return applySelect(result, select)
    },
    count: async ({ where }: any = {}) => {
      return applyFilters(dummyPosts, where).length
    },
    create: async ({ data }: any) => {
      const newPost = { id: Date.now().toString(), ...data, createdAt: new Date(), updatedAt: new Date() }
      dummyPosts.push(newPost)
      return newPost
    },
    groupBy: async ({ by, where, _count }: any) => {
      const filtered = applyFilters(dummyPosts, where)
      const groups: any = {}
      
      filtered.forEach(item => {
        const key = by.map((field: string) => item[field]).join('|')
        if (!groups[key]) {
          groups[key] = { ...by.reduce((obj: any, field: string) => ({ ...obj, [field]: item[field] }), {}), _count: 0 }
        }
        groups[key]._count++
      })
      
      return Object.values(groups)
    }
  },
  message: {
    findMany: async ({ where, select, orderBy, skip, take }: any = {}) => {
      let result = applyFilters(dummyMessages, where)
      result = applyOrderBy(result, orderBy)
      result = applyPagination(result, skip, take)
      return applySelect(result, select)
    },
    count: async ({ where }: any = {}) => {
      return applyFilters(dummyMessages, where).length
    },
    update: async ({ where, data }: any) => {
      const messageIndex = dummyMessages.findIndex(m => m.id === where.id)
      if (messageIndex !== -1) {
        dummyMessages[messageIndex] = { ...dummyMessages[messageIndex], ...data }
        return dummyMessages[messageIndex]
      }
      return null
    },
    groupBy: async ({ by, where, _count }: any) => {
      const filtered = applyFilters(dummyMessages, where)
      const groups: any = {}
      
      filtered.forEach(item => {
        const key = by.map((field: string) => item[field]).join('|')
        if (!groups[key]) {
          groups[key] = { ...by.reduce((obj: any, field: string) => ({ ...obj, [field]: item[field] }), {}), _count: 0 }
        }
        groups[key]._count++
      })
      
      return Object.values(groups)
    }
  },
  document: {
    findMany: async ({ where, select, orderBy, skip, take }: any = {}) => {
      let result = applyFilters(dummyDocuments, where)
      result = applyOrderBy(result, orderBy)
      result = applyPagination(result, skip, take)
      return applySelect(result, select)
    },
    count: async ({ where }: any = {}) => {
      return applyFilters(dummyDocuments, where).length
    },
    create: async ({ data }: any) => {
      const newDocument = { id: Date.now().toString(), ...data, createdAt: new Date(), updatedAt: new Date() }
      dummyDocuments.push(newDocument)
      return newDocument
    },
    findUnique: async ({ where }: any) => {
      return dummyDocuments.find(d => d.id === where.id) || null
    },
    update: async ({ where, data }: any) => {
      const docIndex = dummyDocuments.findIndex(d => d.id === where.id)
      if (docIndex !== -1) {
        dummyDocuments[docIndex] = { ...dummyDocuments[docIndex], ...data, updatedAt: new Date() }
        return dummyDocuments[docIndex]
      }
      return null
    }
  },
  task: {
    findMany: async ({ where, select, orderBy, skip, take }: any = {}) => {
      let result = applyFilters(dummyTasks, where)
      result = applyOrderBy(result, orderBy)
      result = applyPagination(result, skip, take)
      return applySelect(result, select)
    },
    count: async ({ where }: any = {}) => {
      return applyFilters(dummyTasks, where).length
    },
    create: async ({ data }: any) => {
      const newTask = { id: Date.now().toString(), ...data, createdAt: new Date() }
      dummyTasks.push(newTask)
      return newTask
    },
    update: async ({ where, data }: any) => {
      const taskIndex = dummyTasks.findIndex(t => t.id === where.id)
      if (taskIndex !== -1) {
        dummyTasks[taskIndex] = { ...dummyTasks[taskIndex], ...data }
        return dummyTasks[taskIndex]
      }
      return null
    }
  }
} 