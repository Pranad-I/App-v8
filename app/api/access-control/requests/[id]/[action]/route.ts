import { NextResponse } from 'next/server'
import { getService, RequestNotFoundError } from '@/lib/defence-service'

export async function POST(
  _req: Request,
  { params }: { params: { id: string; action: string } },
) {
  const { id, action } = params
  const service = getService()

  try {
    if (action === 'approve') {
      service.approveRequest(id)
    } else if (action === 'deny') {
      service.denyRequest(id)
    } else if (action === 'quarantine') {
      service.quarantineRequest(id)
    } else {
      return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
    }
    return NextResponse.json(service.getDashboard())
  } catch (err) {
    if (err instanceof RequestNotFoundError) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 })
    }
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
