import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react"
import { SITE } from "@/lib/site-config"

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <Link href="/" className="text-2xl font-bold">
              Furni<span className="text-primary">.</span>
            </Link>
            <p className="mt-4 text-secondary-foreground/80 text-sm leading-relaxed">
              Creating beautiful, functional spaces with carefully curated furniture pieces that blend timeless design with modern comfort.
            </p>
            <div className="flex items-center gap-4 mt-6">
              <a href="#" className="p-2 bg-secondary-foreground/10 rounded-full hover:bg-primary hover:text-primary-foreground transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 bg-secondary-foreground/10 rounded-full hover:bg-primary hover:text-primary-foreground transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 bg-secondary-foreground/10 rounded-full hover:bg-primary hover:text-primary-foreground transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 bg-secondary-foreground/10 rounded-full hover:bg-primary hover:text-primary-foreground transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/shop" className="text-secondary-foreground/80 hover:text-primary transition-colors text-sm">
                  Shop All
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-secondary-foreground/80 hover:text-primary transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-secondary-foreground/80 hover:text-primary transition-colors text-sm">
                  Our Services
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-secondary-foreground/80 hover:text-primary transition-colors text-sm">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-secondary-foreground/80 hover:text-primary transition-colors text-sm">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold text-lg mb-6">Categories</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/shop?category=chairs" className="text-secondary-foreground/80 hover:text-primary transition-colors text-sm">
                  Chairs
                </Link>
              </li>
              <li>
                <Link href="/shop?category=sofas" className="text-secondary-foreground/80 hover:text-primary transition-colors text-sm">
                  Sofas
                </Link>
              </li>
              <li>
                <Link href="/shop?category=tables" className="text-secondary-foreground/80 hover:text-primary transition-colors text-sm">
                  Tables
                </Link>
              </li>
              <li>
                <Link href="/shop?category=lighting" className="text-secondary-foreground/80 hover:text-primary transition-colors text-sm">
                  Lighting
                </Link>
              </li>
              <li>
                <Link href="/shop?category=storage" className="text-secondary-foreground/80 hover:text-primary transition-colors text-sm">
                  Storage
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-lg mb-6">Contact Info</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-secondary-foreground/80 text-sm">
                  {SITE.addressLines.join(", ")}, {SITE.city}, {SITE.country}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <a href={`tel:${SITE.phone}`} className="text-secondary-foreground/80 text-sm hover:text-primary">
                  {SITE.phoneInternational}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <a href={`mailto:${SITE.email}`} className="text-secondary-foreground/80 text-sm hover:text-primary">
                  {SITE.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-secondary-foreground/20 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-secondary-foreground/60 text-sm">
            &copy; {new Date().getFullYear()} Furni. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-secondary-foreground/60 hover:text-primary transition-colors text-sm">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-secondary-foreground/60 hover:text-primary transition-colors text-sm">
              Terms of Service
            </Link>
            <Link href="/shipping" className="text-secondary-foreground/60 hover:text-primary transition-colors text-sm">
              Shipping Info
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
