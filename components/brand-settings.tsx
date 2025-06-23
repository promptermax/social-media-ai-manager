'use client';

import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Label } from './ui/label'
import { toast } from '@/hooks/use-toast'

export default function BrandSettings() {
  const [logo, setLogo] = useState<File | null>(null)
  const [logoUrl, setLogoUrl] = useState('')
  const [brandVoice, setBrandVoice] = useState('')
  const [assets, setAssets] = useState<FileList | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch('/api/brand-settings').then(res => res.json()).then(data => {
      setLogoUrl(data.logoUrl || '')
      setBrandVoice(data.brandVoice || '')
    })
  }, [])

  const handleLogoChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogo(e.target.files[0])
      setLogoUrl(URL.createObjectURL(e.target.files[0]))
    }
  }

  const handleAssetsChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAssets(e.target.files)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData()
    if (logo) formData.append('logo', logo)
    formData.append('brandVoice', brandVoice)
    if (assets) {
      Array.from(assets).forEach((file, i) => formData.append('assets', file))
    }
    const res = await fetch('/api/brand-settings', {
      method: 'POST',
      body: formData,
    })
    setLoading(false)
    if (res.ok) {
      toast({ title: 'Brand settings updated', description: 'Your brand info was saved.' })
    } else {
      toast({ title: 'Error', description: 'Failed to update brand settings', variant: 'destructive' })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-4 space-y-6 bg-white rounded shadow">
      <h2 className="font-semibold text-lg mb-2">Brand Settings</h2>
      <div>
        <Label htmlFor="logo">Brand Logo</Label>
        <Input id="logo" name="logo" type="file" accept="image/*" onChange={handleLogoChange} />
        {logoUrl && <img src={logoUrl} alt="Brand Logo" className="h-16 mt-2" />}
      </div>
      <div>
        <Label htmlFor="brandVoice">Brand Voice</Label>
        <Textarea id="brandVoice" name="brandVoice" value={brandVoice} onChange={e => setBrandVoice(e.target.value)} rows={3} />
      </div>
      <div>
        <Label htmlFor="assets">Other Brand Assets</Label>
        <Input id="assets" name="assets" type="file" multiple onChange={handleAssetsChange} />
      </div>
      <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Settings'}</Button>
    </form>
  )
} 