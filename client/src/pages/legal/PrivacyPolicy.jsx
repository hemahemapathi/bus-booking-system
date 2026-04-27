import BackButton from '../../components/BackButton'

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-red-600 text-white px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3">
            <BackButton />
            <div>
              <h1 className="text-2xl font-bold">Privacy Policy</h1>
              <p className="text-red-200 text-sm mt-0.5">Last updated: April 2026</p>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        {[
          {
            title: '1. Information We Collect',
            content: 'We collect information you provide when registering or booking, including your name, email address, phone number, and payment details. Payment information is processed securely through Stripe and is never stored on our servers.',
          },
          {
            title: '2. How We Use Your Information',
            content: 'We use your information to process bookings, send confirmation emails and ticket PDFs, provide customer support, send journey reminders, and improve our services. We do not sell your personal data to third parties.',
          },
          {
            title: '3. Data Security',
            content: 'All data is transmitted over HTTPS. Passwords are hashed using bcrypt. Payment processing is handled by Stripe, which is PCI-DSS compliant. We implement industry-standard security measures to protect your data.',
          },
          {
            title: '4. Cookies',
            content: 'We use local storage to keep you logged in during your session. We do not use tracking cookies or third-party advertising cookies.',
          },
          {
            title: '5. Your Rights',
            content: 'You have the right to access, update, or delete your personal data at any time. To request data deletion, contact us at support@gobus.in.',
          },
          {
            title: '6. Contact Us',
            content: 'For any privacy-related questions, email us at support@GoBus.in or call 1800-123-4567.',
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
