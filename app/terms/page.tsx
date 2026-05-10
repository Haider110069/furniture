import { LegalPage } from "@/components/legal-page"
import { SITE } from "@/lib/site-config"

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service">
      <p>
        Welcome to {SITE.storeName}. By using our website or placing an order you agree to these terms. Our business operates
        from {SITE.city}, {SITE.country}.
      </p>
      <h2>Orders and pricing</h2>
      <p>
        Product prices shown on the site are subject to confirmation at checkout. We may cancel orders in case of pricing
        errors or stock issues, and will notify you by email or phone.
      </p>
      <h2>Payments</h2>
      <p>
        Supported methods include cash on delivery and mobile wallets (e.g. JazzCash, EasyPaisa) as shown at checkout,
        plus card checkout where integrated. Wallet and COD instructions must be accurate so we can fulfil your order.
      </p>
      <h2>Returns</h2>
      <p>
        Return and exchange policies follow what we communicate at purchase and on our shipping page. Damaged goods should
        be reported with photos within 48 hours of delivery where possible.
      </p>
      <h2>Limitation</h2>
      <p>
        To the extent allowed by Pakistani law, {SITE.storeName} is not liable for indirect losses. Our liability for any
        order is limited to the amount you paid for that order.
      </p>
      <h2>Contact</h2>
      <p>
        For legal notices: <a href={`mailto:${SITE.supportEmail}`}>{SITE.supportEmail}</a> · {SITE.phoneInternational} ·{" "}
        {SITE.addressLines.join(", ")}, {SITE.city}.
      </p>
    </LegalPage>
  )
}
