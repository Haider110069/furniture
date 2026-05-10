import { LegalPage } from "@/components/legal-page"
import Link from "next/link"
import { SITE } from "@/lib/site-config"

export default function ShippingPage() {
  return (
    <LegalPage title="Shipping Information">
      <p>
        We ship furniture and home goods throughout Karachi and surrounding areas. For nationwide delivery, timelines and
        rates may vary—contact us with your PIN code for a quote.
      </p>
      <h2>Standard delivery</h2>
      <p>
        Most in-stock orders in Karachi metro are processed within 2–5 business days. Larger items may need a scheduled
        delivery slot. You will receive a call or WhatsApp update on <a href={`tel:${SITE.phone}`}>{SITE.phoneInternational}</a>{" "}
        when your order is out for delivery.
      </p>
      <h2>Express delivery</h2>
      <p>Select express at checkout where available for faster handling (extra fee applies).</p>
      <h2>Free shipping threshold</h2>
      <p>Orders above the minimum shown at checkout may qualify for free standard shipping.</p>
      <h2>Inspection</h2>
      <p>Please inspect items at delivery and note any transit damage before signing.</p>
      <h2>Returns</h2>
      <p>
        Unused items in original packaging may be returned according to our terms. Visit{" "}
        <Link href="/terms" className="text-primary hover:underline">
          Terms of service
        </Link>{" "}
        or email {SITE.supportEmail}.
      </p>
    </LegalPage>
  )
}
