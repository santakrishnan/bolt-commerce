export interface InspectionFeature {
  id: string
  title: string
  description: string
  icon: 'arrow-circle' | 'certified-document' | 'verified-badge' | 'guarantee'
  image: string
}

export const inspectionFeatures: InspectionFeature[] = [
  {
    id: '160-point-inspection',
    title: '160-Point Inspection',
    description: 'Every vehicle undergoes our rigorous 160-point certification process',
    icon: 'arrow-circle',
    image: '/images/qualities/160-point-inspection.png',
  },
  {
    id: 'verified-vin',
    title: 'Verified VIN & Full History Check',
    description: 'Complete vehicle history with no hidden accidents or major repairs',
    icon: 'certified-document',
    image: '/images/qualities/verified-vin.png',
  },
  {
    id: 'no-hidden-damage',
    title: 'No Hidden Damage Guarantee',
    description: 'All damage disclosed upfront with detailed condition reports',
    icon: 'verified-badge',
    image: '/images/qualities/no-hidden-damage.png',
  },
  {
    id: '7-day-return',
    title: '7-Day Return or Exchange',
    description: 'Not satisfied? Return or exchange within 7 days, no questions asked',
    icon: 'guarantee',
    image: '/images/qualities/7-day-return.png',
  },
]
