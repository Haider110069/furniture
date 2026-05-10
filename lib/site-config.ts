/** Karachi, Pakistan storefront — use across footer, contact, legal pages */

export const SITE = {
  storeName: "Furni",
  addressLines: ["Clifton Road, Block 4", "Clifton, Karachi"],
  region: "Sindh",
  postalCode: "75600",
  country: "Pakistan",
  city: "Karachi",
  phone: "03148905818",
  phoneDisplay: "0314-8905818",
  phoneInternational: "+92 314 8905818",
  email: "hello@furni.pk",
  supportEmail: "support@furni.pk",
  hoursWeekday: "Mon - Sat: 10:00 AM - 8:00 PM",
  hoursSunday: "Sun: 12:00 PM - 6:00 PM",
} as const

export function fullAddressInline(): string {
  return `${SITE.addressLines.join(", ")}, ${SITE.city}, ${SITE.country}`
}
