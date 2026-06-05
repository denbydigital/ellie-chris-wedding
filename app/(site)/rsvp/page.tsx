import SectionHeader from '@/components/site/SectionHeader'
import RSVPForm from '@/components/site/RSVPForm'

export default function RSVPPage() {
  return (
    <div>
      <SectionHeader eyebrow="You're on the list" title="Update your reply" intro="If anything changes — your party size, a dietary need — update your reply below." />
      <section className="bg-cream px-8 py-16 pb-24">
        <RSVPForm />
      </section>
    </div>
  )
}
