import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | RiderCritic',
  description: 'Terms of Service for RiderCritic - Motorcycle Review Platform',
};

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Terms of Service</h1>
      <p className="text-gray-600 mb-4">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

      <div className="prose prose-lg max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Agreement to Terms</h2>
          <p className="mb-4">
            By accessing or using RiderCritic ("we," "us," or "our") website located at <strong>ridercritic.com</strong> (the "Service"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of these Terms, then you may not access the Service.
          </p>
          <p className="mb-4">
            These Terms apply to all visitors, users, and others who access or use the Service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
          <p className="mb-4">
            RiderCritic is a motorcycle review and rider lifestyle platform that allows users to:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Read and write reviews about motorcycles</li>
            <li>Compare different motorcycle models</li>
            <li>Share riding experiences and insights</li>
            <li>Connect with other motorcycle enthusiasts</li>
            <li>Access motorcycle specifications, prices, and market data</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
          
          <h3 className="text-xl font-semibold mb-3">3.1 Account Creation</h3>
          <p className="mb-4">
            To access certain features of the Service, you must register for an account. You agree to:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Provide accurate, current, and complete information</li>
            <li>Maintain and update your information to keep it accurate</li>
            <li>Maintain the security of your account credentials</li>
            <li>Accept responsibility for all activities under your account</li>
            <li>Notify us immediately of any unauthorized use</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3">3.2 Account Types</h3>
          <p className="mb-4">
            We offer different account types with varying levels of access:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>NewStar:</strong> Basic access to read reviews and browse content</li>
            <li><strong>CriticStar:</strong> Can write reviews and rate motorcycles</li>
            <li><strong>CriticMaster:</strong> Can moderate content and approve reviews</li>
            <li><strong>Admin Roles:</strong> Various administrative roles with specific permissions</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. User Content</h2>
          
          <h3 className="text-xl font-semibold mb-3">4.1 Your Content</h3>
          <p className="mb-4">
            You retain ownership of any content you post, upload, or submit to the Service ("User Content"). By posting User Content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, adapt, publish, translate, and distribute your User Content in connection with operating and promoting the Service.
          </p>

          <h3 className="text-xl font-semibold mb-3">4.2 Content Standards</h3>
          <p className="mb-4">You agree that your User Content will not:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Violate any laws or regulations</li>
            <li>Infringe on any third-party rights (copyright, trademark, privacy, etc.)</li>
            <li>Contain false, misleading, or defamatory information</li>
            <li>Be spam, advertising, or promotional material (unless authorized)</li>
            <li>Contain viruses, malware, or harmful code</li>
            <li>Be offensive, abusive, harassing, or discriminatory</li>
            <li>Impersonate any person or entity</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3">4.3 Content Moderation</h3>
          <p className="mb-4">
            We reserve the right to review, edit, or remove any User Content at our sole discretion. We may remove content that violates these Terms or is otherwise objectionable, without prior notice.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Prohibited Uses</h2>
          <p className="mb-4">You agree not to use the Service:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>In any way that violates applicable laws or regulations</li>
            <li>To transmit any malicious code or harmful content</li>
            <li>To attempt to gain unauthorized access to the Service or related systems</li>
            <li>To interfere with or disrupt the Service or servers</li>
            <li>To collect or harvest information about other users</li>
            <li>To use automated systems (bots, scrapers) without permission</li>
            <li>To impersonate others or provide false information</li>
            <li>For any commercial purpose without our written consent</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Intellectual Property</h2>
          
          <h3 className="text-xl font-semibold mb-3">6.1 Our Content</h3>
          <p className="mb-4">
            The Service and its original content, features, and functionality are owned by RiderCritic and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
          </p>

          <h3 className="text-xl font-semibold mb-3">6.2 Third-Party Content</h3>
          <p className="mb-4">
            The Service may contain content from third parties, including motorcycle manufacturers. Such content is the property of its respective owners and is protected by applicable intellectual property laws.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Disclaimer of Warranties</h2>
          <p className="mb-4">
            THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
          </p>
          <p className="mb-4">
            We do not warrant that:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>The Service will be uninterrupted, secure, or error-free</li>
            <li>Defects will be corrected</li>
            <li>The Service is free of viruses or other harmful components</li>
            <li>The information on the Service is accurate, complete, or current</li>
          </ul>
          <p className="mb-4">
            Reviews and content on the Service reflect the opinions of users and do not necessarily reflect our views. We are not responsible for the accuracy of user-generated content.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Limitation of Liability</h2>
          <p className="mb-4">
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, RIDERCRITIC AND ITS AFFILIATES SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES RESULTING FROM:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Your use or inability to use the Service</li>
            <li>Any conduct or content of third parties on the Service</li>
            <li>Any unauthorized access to or use of our servers or data</li>
            <li>Any interruption or cessation of transmission to or from the Service</li>
            <li>Any bugs, viruses, or similar items transmitted through the Service</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">9. Indemnification</h2>
          <p className="mb-4">
            You agree to defend, indemnify, and hold harmless RiderCritic and its officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, and expenses, including reasonable attorneys' fees, arising out of or in any way connected with:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Your use of the Service</li>
            <li>Your violation of these Terms</li>
            <li>Your violation of any third-party rights</li>
            <li>Your User Content</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">10. Termination</h2>
          <p className="mb-4">
            We may terminate or suspend your account and access to the Service immediately, without prior notice, for any reason, including if you breach these Terms.
          </p>
          <p className="mb-4">
            Upon termination, your right to use the Service will cease immediately. We may delete your account and User Content at our discretion. Provisions of these Terms that by their nature should survive termination shall survive termination.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">11. Governing Law</h2>
          <p className="mb-4">
            These Terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction], without regard to its conflict of law provisions. Any disputes arising from these Terms or the Service shall be subject to the exclusive jurisdiction of the courts in [Your Jurisdiction].
          </p>
          <p className="mb-4 text-sm text-gray-600">
            <strong>Note:</strong> Please replace [Your Jurisdiction] with your actual jurisdiction (e.g., "Bangladesh" or "the State of [Your State]").
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">12. Changes to Terms</h2>
          <p className="mb-4">
            We reserve the right to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
          </p>
          <p className="mb-4">
            By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">13. Severability</h2>
          <p className="mb-4">
            If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions will remain in effect. These Terms constitute the entire agreement between us regarding our Service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">14. Contact Information</h2>
          <p className="mb-4">
            If you have any questions about these Terms of Service, please contact us:
          </p>
          <ul className="list-none mb-4">
            <li><strong>Email:</strong> legal@ridercritic.com</li>
            <li><strong>Website:</strong> <a href="/contact" className="text-blue-600 hover:underline">Contact Page</a></li>
          </ul>
        </section>
      </div>
    </div>
  );
}

