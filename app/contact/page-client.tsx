'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Mail, Phone, MapPin, MessageSquare } from 'lucide-react'

export default function ContactPageClient() {
  // JSON-LD structured data for the contact page
  const generateJsonLd = () => {
    return {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      "name": "Contact RiderCritic",
      "description": "Get in touch with us for motorcycle reviews, critics, and riding culture insights.",
      "url": "https://ridercritic.com/contact",
      "publisher": {
        "@type": "Organization",
        "name": "ridercritic",
        "url": "https://ridercritic.com"
      },
      "contactPoint": [
        {
          "@type": "ContactPoint",
          "contactType": "General Inquiries",
          "email": "info@ridercritic.com"
        },
        {
          "@type": "ContactPoint",
          "contactType": "Phone Support",
          "telephone": "+1 (555) 123-4567"
        }
      ],
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "123 Motorcycle Ave",
        "addressLocality": "Rider City",
        "postalCode": "RC 12345"
      }
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateJsonLd()) }}
      />
      <div className="container py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold tracking-tight mb-4">Contact Us</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have questions or feedback? We&apos;d love to hear from you.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Send us a Message
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label htmlFor="contact-name" className="block text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    id="contact-name"
                    name="contactName"
                    placeholder="Your full name"
                    className="w-full border rounded-md px-3 py-2 text-sm"
                    disabled
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    id="contact-email"
                    name="contactEmail"
                    placeholder="your.email@example.com"
                    className="w-full border rounded-md px-3 py-2 text-sm"
                    disabled
                  />
                </div>
                <div>
                  <label htmlFor="contact-subject" className="block text-sm font-medium mb-1">Subject</label>
                  <input
                    type="text"
                    id="contact-subject"
                    name="contactSubject"
                    placeholder="What's this about?"
                    className="w-full border rounded-md px-3 py-2 text-sm"
                    disabled
                  />
                </div>
                <div>
                  <label htmlFor="contact-message" className="block text-sm font-medium mb-1">Message</label>
                  <textarea
                    id="contact-message"
                    name="contactMessage"
                    placeholder="Tell us more..."
                    rows={4}
                    className="w-full border rounded-md px-3 py-2 text-sm"
                    disabled
                  />
                </div>
                <Button className="w-full" disabled>
                  Send Message
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Other Ways to Reach Us
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <div className="font-medium">General Inquiries</div>
                  <div className="text-sm text-muted-foreground">info@ridercritic.com</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <div className="font-medium">Phone Support</div>
                  <div className="text-sm text-muted-foreground">+1 (555) 123-4567</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <div className="font-medium">Business Address</div>
                  <div className="text-sm text-muted-foreground">
                    123 Motorcycle Ave<br />
                    Rider City, RC 12345
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="font-medium mb-2">Response Times</div>
                <div className="text-sm text-muted-foreground space-y-1">
                  <div>• Email: Within 24 hours</div>
                  <div>• Phone: Business hours (9 AM - 6 PM)</div>
                  <div>• Emergency: Immediate response</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How do I submit a critic?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Contact us through the form above and we&apos;ll guide you through
                  the critic submission process.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Can I suggest a motorcycle for critic?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Absolutely! We&apos;d love to hear your suggestions for motorcycles
                  you&apos;d like to see critiqued.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}