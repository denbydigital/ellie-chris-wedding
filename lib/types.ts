export type RSVPStatus = 'pending' | 'attending' | 'declined'

export interface GuestPerson {
  name: string
  meal: 'Chicken' | 'Beef' | 'Vegetarian' | 'Vegan' | 'Child'
}

export interface Guest {
  id: string
  name: string
  email: string
  status: RSVPStatus
  party_size: number
  guests_json: GuestPerson[]
  song: string
  notes: string
  invite_sent_at: string | null
  responded_at: string | null
  created_at: string
}

export interface RSVPFormData {
  attending: 'yes' | 'no'
  name: string
  email: string
  guests: GuestPerson[]
  song: string
  notes: string
}
