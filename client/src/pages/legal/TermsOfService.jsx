import BackButton from '../../components/BackButton'

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-red-600 text-white px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3">
            <BackButton />
            <div>
              <h1 className="text-2xl font-bold">Terms of Service</h1>
              <p className="text-red-200 text-sm mt-0.5">Last updated: April 2026</p>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        {[
          {
            title: '1. Acceptance of Terms',
            content: 'By using GoBus, you agree to these Terms of Service. If you do not agree, please do not use our platform.',
          },
          {
            title: '2. Booking & Payment',
            content: 'All bookings are subject to seat availability. Payment must be completed at the time of booking. Prices are displayed in Indian Rupees (INR) and are inclusive of all applicable taxes.',
          },
          {
            title: '3. User Responsibilities',
            content: 'You are responsible for providing accurate passenger details. You must carry a valid ID proof during travel. Misuse of the platform, including fraudulent bookings, will result in account termination.',
          },
          {
            title: '4. Cancellation Policy',
            content: 'Bookings can be cancelled from the My Bookings page before the journey date. Cancellations made more than 24 hours before departure are eligible for a full refund. Cancellations within 24 hours may be subject to a cancellation fee.',
          },
          {
            title: '5. Limitation of Liability',
            content: 'GoBus acts as a booking platform and is not responsible for delays, cancellations, or service quality of bus operators. We are not liable for any indirect or consequential damages arising from use of our platform.',
          },
          {
            title: '6. Changes to Terms',
            content: 'We reserve the right to update these terms at any time. Continued use of the platform after changes constitutes acceptance of the new terms.',
          },
          {
            title: '7. Contact',
            content: 'For any questions about these terms, contact us at support@GoBus.in.',
          },
        ].map(s => (
          <div key={s.title} className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="font-bold text-gray-800 mb-2">{s.title}</h2>
            <p className="text-sm text-gray-600 leading-relaxed">{s.content}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
