import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import path from 'path'
import fs from 'fs/promises'

const BRAND_LOGO_DIR = path.join(process.cwd(), 'public', 'brand-logos')
const BRAND_ASSETS_DIR = path.join(process.cwd(), 'public', 'brand-assets')

// Security: Sanitize filename to prevent path traversal
function sanitizeFileName(filename: string): string {
  // Remove any path separators and dangerous characters
  return filename
    .replace(/[<>:"/\\|?*\x00-\x1f]/g, '_')
    .replace(/\.\./g, '_')
    .substring(0, 100) // Limit length
}

// Security: Validate file path is within allowed directory
function validateFilePath(filePath: string, allowedDir: string): boolean {
  const resolvedPath = path.resolve(filePath)
  const resolvedAllowedDir = path.resolve(allowedDir)
  return resolvedPath.startsWith(resolvedAllowedDir)
}

// Security: Validate file type and size
function validateFile(file: File, maxSize: number = 5 * 1024 * 1024): { valid: boolean; error?: string } {
  // Check file size
  if (file.size > maxSize) {
    return { valid: false, error: `File size exceeds ${maxSize / 1024 / 1024}MB limit` }
  }

  // Check file type by extension
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp']
  const fileExtension = path.extname(file.name).toLowerCase()
  
  if (!allowedExtensions.includes(fileExtension)) {
    return { valid: false, error: 'Invalid file type. Only image files are allowed.' }
  }

  return { valid: true }
}

async function ensureDir(dir: string) {
  try { 
    await fs.mkdir(dir, { recursive: true }) 
  } catch (error) {
    console.error('Error creating directory:', error)
    throw new Error('Failed to create upload directory')
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const user = await prisma.user.findUnique({ 
      where: { id: session.user.id }, 
      select: { brandVoice: true, brandLogo: true } 
    })
    
    return NextResponse.json({ 
      brandVoice: user?.brandVoice || '', 
      logoUrl: user?.brandLogo || '' 
    })
  } catch (error) {
    console.error('Error fetching brand settings:', error)
    return NextResponse.json({ error: 'Failed to fetch brand settings' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const form = await req.formData()
    const brandVoice = form.get('brandVoice') as string
    
    // Security: Validate brand voice length
    if (brandVoice && brandVoice.length > 5000) {
      return NextResponse.json({ error: 'Brand voice too long. Maximum 5000 characters.' }, { status: 400 })
    }

    let logoUrl = ''
    const logo = form.get('logo') as File | null
    
    if (logo) {
      // Security: Validate file
      const validation = validateFile(logo, 5 * 1024 * 1024) // 5MB limit
      if (!validation.valid) {
        return NextResponse.json({ error: validation.error }, { status: 400 })
      }

      await ensureDir(BRAND_LOGO_DIR)
      
      // Security: Sanitize filename and create safe path
      const sanitizedFileName = sanitizeFileName(logo.name)
      const fileExtension = path.extname(sanitizedFileName)
      const fileName = `${session.user.id}${fileExtension}`
      const filePath = path.join(BRAND_LOGO_DIR, fileName)
      
      // Security: Validate final path
      if (!validateFilePath(filePath, BRAND_LOGO_DIR)) {
        return NextResponse.json({ error: 'Invalid file path' }, { status: 400 })
      }

      try {
        const arrayBuffer = await logo.arrayBuffer()
        await fs.writeFile(filePath, Buffer.from(arrayBuffer))
        logoUrl = `/brand-logos/${fileName}`
      } catch (error) {
        console.error('Error saving logo:', error)
        return NextResponse.json({ error: 'Failed to save logo' }, { status: 500 })
      }
    }

    // Security: Handle assets with proper validation
    const assets = form.getAll('assets') as File[]
    if (assets.length > 0) {
      await ensureDir(BRAND_ASSETS_DIR)
      
      for (const file of assets) {
        // Security: Validate each asset file
        const validation = validateFile(file, 10 * 1024 * 1024) // 10MB limit for assets
        if (!validation.valid) {
          return NextResponse.json({ error: validation.error }, { status: 400 })
        }

        // Security: Sanitize filename and create safe path
        const sanitizedFileName = sanitizeFileName(file.name)
        const timestamp = Date.now()
        const fileName = `${session.user.id}-${timestamp}-${sanitizedFileName}`
        const filePath = path.join(BRAND_ASSETS_DIR, fileName)
        
        // Security: Validate final path
        if (!validateFilePath(filePath, BRAND_ASSETS_DIR)) {
          return NextResponse.json({ error: 'Invalid file path' }, { status: 400 })
        }

        try {
          const arrayBuffer = await file.arrayBuffer()
          await fs.writeFile(filePath, Buffer.from(arrayBuffer))
        } catch (error) {
          console.error('Error saving asset:', error)
          return NextResponse.json({ error: 'Failed to save asset' }, { status: 500 })
        }
      }
    }

    // Update user profile
    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        ...(brandVoice ? { brandVoice } : {}),
        ...(logoUrl ? { brandLogo: logoUrl } : {}),
      },
      select: { brandVoice: true, brandLogo: true },
    })

    return NextResponse.json({ 
      brandVoice: user.brandVoice, 
      logoUrl: user.brandLogo 
    })
  } catch (error) {
    console.error('Error updating brand settings:', error)
    return NextResponse.json({ error: 'Failed to update brand settings' }, { status: 500 })
  }
} 