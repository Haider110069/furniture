import { LegalPage } from "@/components/legal-page"
import { SITE } from "@/lib/site-config"

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy">
      <p>
        {SITE.storeName} (&quot;we&quot;) respects your privacy. This policy describes how we collect and use personal
        information when you shop at our store in Karachi, Pakistan, or use our website.
      </p>
      <h2>Information we collect</h2>
      <ul>
        <li>Contact details you provide at checkout or on our contact form (name, email, phone, delivery address).</li>
        <li>Order history linked to your email so you can view orders under My Account.</li>
      </ul>
      <h2>How we use your information</h2>
      <ul>
        <li>To process and deliver your orders, and to contact you about delivery or support.</li>
        <li>To reply to messages sent to {SITE.email}.</li>
      </ul>
      <h2>Data retention</h2>
      <p>We keep order records as needed for accounting, refunds, and customer support under applicable law.</p>
      <h2>Contact</h2>
      <p>
        Questions about privacy: <a href={`mailto:${SITE.supportEmail}`}>{SITE.supportEmail}</a> · {SITE.phoneInternational}
      </p>
    </LegalPage>
  )
}
