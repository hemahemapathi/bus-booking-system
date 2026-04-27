import BackButton from '../../components/BackButton'

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-red-600 text-white px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3">
            <BackButton />
            <div>
              <h1 className="text-2xl font-bold">Refund Policy</h1>
              <p className="text-red-200 text-sm mt-0.5">Last updated: April 2026</p>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">

        {/* Refund Table */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="font-bold text-gray-800 mb-4">Cancellation & Refund Schedule</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-red-50 text-red-700">
                  <th className="px-4 py-3 text-left rounded-l-xl">Time Before Departure</th>
                  <th className="px-4 py-3 text-left">Refund Amount</th>
                  <th className="px-4 py-3 text-left rounded-r-xl">Processing Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { time: 'More than 24 hours', refund: '100% Full Refund', processing: '5-7 business days' },
                  { time: '12 to 24 hours', refund: '75% Refund', processing: '5-7 business days' },
                  { time: '6 to 12 hours', refund: '50% Refund', processing: '7-10 business days' },
                  { time: 'Less than 6 hours', refund: 'No Refund', processing: '—' },
                ].map(r => (
                  <tr key={r.time} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-700">{r.time}</td>
                    <td className={`px-4 py-3 font-semibold ${r.refund === 'No Refund' ? 'text-red-500' : 'text-green-600'}`}>{r.refund}</td>
                    <td className="px-4 py-3 text-gray-500">{r.processing}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {[
          {
            title: 'How to Cancel',
            content: 'Log in to your account, go to My Bookings, find your booking and click the Cancel button. Cancellations are processed immediately and refunds are initiated within 24 hours.',
          },
          {
            title: 'Refund Method',
            content: 'Refunds are credited back to the original payment method used during booking. Stripe processes all refunds and the amount will reflect in your account within 5-10 business days depending on your bank.',
          },
          {
            title: 'Non-Refundable Cases',
            content: 'Bookings cancelled less than 6 hours before departure are non-refundable. No-shows (not boarding the bus) are also non-refundable.',
          },
          {
            title: 'Operator Cancellations',
            content: 'If a bus is cancelled by the operator, you will receive a 100% full refund automatically within 3-5 business days. You will also receive an email notification.',
          },
          {
            title: 'Contact for Refund Issues',
            content: 'If your refund has not been received within the stated timeframe, contact us at support@GoBus.in with your Booking ID and we will resolve it within 48 hours.',
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
