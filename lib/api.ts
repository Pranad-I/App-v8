export type RiskLevel = 'Low' | 'Medium' | 'High'

export interface DeviceDTO {
  id: string
  name: string
  ipAddress: string
  macAddress: string
  platform: string
}

export interface RiskFactorDTO {
  label: string
  level: RiskLevel
}

export interface AccessRequestDTO {
  id: string
  device: DeviceDTO
  requestedAt: string
  riskScore: number
  riskLevel: RiskLevel
  status: string
  riskFactors: RiskFactorDTO[]
}

export interface TrustedDeviceDTO extends DeviceDTO {
  addedOn: string
}

export interface HistoryEntryDTO {
  id: string
  timestamp: string
  action: string
  deviceLabel: string
  riskLevel: RiskLevel
}

export interface SegmentDTO {
  key: string
  label: string
  deviceCount: number
  color: string
}

export interface NodeDTO {
  name: string
  role: string
  online: boolean
}

export interface SummaryDTO {
  pendingRequests: number
  approvedToday: number
  deniedToday: number
  quarantinedDevices: number
  totalControlled: number
}

export interface DashboardDTO {
  summary: SummaryDTO
  systemStatus: { state: string; lastScan: string }
  nodes: NodeDTO[]
  pendingRequests: AccessRequestDTO[]
  decision: AccessRequestDTO | null
  trustedDevices: TrustedDeviceDTO[]
  history: HistoryEntryDTO[]
  segmentation: SegmentDTO[]
}

export const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error('Request failed')
    return res.json()
  })

export type DecisionAction = 'approve' | 'deny' | 'quarantine'

export async function resolveRequest(
  requestId: string,
  action: DecisionAction,
): Promise<DashboardDTO> {
  const res = await fetch(
    `/api/access-control/requests/${requestId}/${action}`,
    { method: 'POST' },
  )
  if (!res.ok) throw new Error('Action failed')
  return res.json()
}
