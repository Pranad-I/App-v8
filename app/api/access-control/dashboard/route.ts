import { NextResponse } from 'next/server'
import { getService } from '@/lib/defence-service'

export function GET() {
  const service = getService()
  return NextResponse.json(service.getDashboard())
}
