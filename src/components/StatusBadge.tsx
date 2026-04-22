import { AdStatus } from '@/types'

interface StatusBadgeProps {
  status: AdStatus
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const labels: Record<AdStatus, string> = {
    draft: 'Draft',
    submitted: 'Submitted',
    under_review: 'Reviewing',
    approved: 'Approved',
    rejected: 'Rejected',
    payment_pending: 'Paying',
    verified: 'Verified',
    published: 'Live',
    expired: 'Expired',
  }

  return (
    <span className={`status-badge status-${status}`}>
      {labels[status]}
    </span>
  )
}
