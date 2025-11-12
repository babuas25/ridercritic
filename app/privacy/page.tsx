import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | RiderCritic',
  description: 'Privacy Policy for RiderCritic - Motorcycle Review Platform',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
      <p className="text-gray-600 mb-4">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

      <div className="prose prose-lg max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
          <p className="mb-4">
            Welcome to RiderCritic ("we," "our," or "us"). We are committed to protecting your privacy and ensuring you have a positive experience on our website and in using our products and services. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website <strong>ridercritic.com</strong> (the "Service").
          </p>
          <p className="mb-4">
            Please read this Privacy Policy carefully. If you do not agree with the terms of this Privacy Policy, please do not access the Service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
          
          <h3 className="text-xl font-semibold mb-3">2.1 Information You Provide to Us</h3>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Account Information:</strong> When you register for an account, we collect your email address, name, and any other information you choose to provide.</li>
            <li><strong>Profile Information:</strong> You may provide additional information such as your date of birth, gender, and profile picture.</li>
            <li><strong>Content:</strong> We collect the content you post, including motorcycle reviews, comments, ratings, and other user-generated content.</li>
            <li><strong>Communication:</strong> When you contact us, we collect the information you provide in your communications.</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3">2.2 Information Automatically Collected</h3>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Usage Data:</strong> We automatically collect information about how you interact with our Service, including pages visited, time spent, and actions taken.</li>
            <li><strong>Device Information:</strong> We collect information about your device, including IP address, browser type, operating system, and device identifiers.</li>
            <li><strong>Location Data:</strong> We may collect approximate location information based on your IP address.</li>
            <li><strong>Cookies and Tracking Technologies:</strong> We use cookies and similar tracking technologies to track activity on our Service and store certain information.</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3">2.3 Information from Third Parties</h3>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Authentication Providers:</strong> If you sign in using Google OAuth, we receive information from Google as permitted by your account settings.</li>
            <li><strong>Analytics Services:</strong> We use analytics services that may collect information about your use of our Service.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
          <p className="mb-4">We use the information we collect for various purposes, including:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>To provide, maintain, and improve our Service</li>
            <li>To create and manage your account</li>
            <li>To process and display your reviews and content</li>
            <li>To communicate with you about your account and our Service</li>
            <li>To send you marketing communications (with your consent)</li>
            <li>To detect, prevent, and address technical issues and security threats</li>
            <li>To comply with legal obligations</li>
            <li>To enforce our Terms of Service</li>
            <li>To personalize your experience</li>
            <li>To analyze usage patterns and improve our Service</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. How We Share Your Information</h2>
          <p className="mb-4">We may share your information in the following circumstances:</p>
          
          <h3 className="text-xl font-semibold mb-3">4.1 Public Information</h3>
          <p className="mb-4">
            Your reviews, comments, ratings, and profile information (as you choose to make public) are visible to other users of the Service.
          </p>

          <h3 className="text-xl font-semibold mb-3">4.2 Service Providers</h3>
          <p className="mb-4">
            We may share your information with third-party service providers who perform services on our behalf, including:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Hosting and Infrastructure:</strong> Vercel (hosting), Firebase (database and storage)</li>
            <li><strong>Analytics:</strong> Vercel Analytics, LogRocket (error tracking and session replay)</li>
            <li><strong>Authentication:</strong> NextAuth, Google OAuth</li>
            <li><strong>Email Services:</strong> For sending notifications and communications</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3">4.3 Legal Requirements</h3>
          <p className="mb-4">
            We may disclose your information if required to do so by law or in response to valid requests by public authorities.
          </p>

          <h3 className="text-xl font-semibold mb-3">4.4 Business Transfers</h3>
          <p className="mb-4">
            If we are involved in a merger, acquisition, or asset sale, your information may be transferred as part of that transaction.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Data Security</h2>
          <p className="mb-4">
            We implement appropriate technical and organizational security measures to protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your information, we cannot guarantee its absolute security.
          </p>
          <p className="mb-4">
            Our security measures include:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Encryption of data in transit (HTTPS/TLS)</li>
            <li>Secure authentication and authorization</li>
            <li>Regular security assessments</li>
            <li>Access controls and monitoring</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Your Privacy Rights</h2>
          <p className="mb-4">Depending on your location, you may have certain rights regarding your personal information:</p>
          
          <h3 className="text-xl font-semibold mb-3">6.1 Access and Portability</h3>
          <p className="mb-4">You have the right to access and receive a copy of your personal information.</p>

          <h3 className="text-xl font-semibold mb-3">6.2 Correction</h3>
          <p className="mb-4">You have the right to correct inaccurate or incomplete personal information.</p>

          <h3 className="text-xl font-semibold mb-3">6.3 Deletion</h3>
          <p className="mb-4">You have the right to request deletion of your personal information, subject to certain exceptions.</p>

          <h3 className="text-xl font-semibold mb-3">6.4 Objection and Restriction</h3>
          <p className="mb-4">You have the right to object to processing of your personal information or request restriction of processing.</p>

          <h3 className="text-xl font-semibold mb-3">6.5 Withdraw Consent</h3>
          <p className="mb-4">Where we rely on your consent, you have the right to withdraw it at any time.</p>

          <p className="mb-4">
            To exercise these rights, please contact us at the email address provided below.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Cookies and Tracking Technologies</h2>
          <p className="mb-4">
            We use cookies and similar tracking technologies to track activity on our Service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Service.
          </p>
          <p className="mb-4">
            We use the following types of cookies:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Essential Cookies:</strong> Required for the Service to function properly</li>
            <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our Service</li>
            <li><strong>Functional Cookies:</strong> Remember your preferences and settings</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Children's Privacy</h2>
          <p className="mb-4">
            Our Service is not intended for children under the age of 13 (or the applicable age of consent in your jurisdiction). We do not knowingly collect personal information from children. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">9. International Data Transfers</h2>
          <p className="mb-4">
            Your information may be transferred to and processed in countries other than your country of residence. These countries may have data protection laws that differ from those in your country. We take steps to ensure that your information receives adequate protection.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">10. Data Retention</h2>
          <p className="mb-4">
            We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. When we no longer need your information, we will delete or anonymize it.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">11. Changes to This Privacy Policy</h2>
          <p className="mb-4">
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy Policy periodically for any changes.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">12. Contact Us</h2>
          <p className="mb-4">
            If you have any questions about this Privacy Policy or wish to exercise your privacy rights, please contact us:
          </p>
          <ul className="list-none mb-4">
            <li><strong>Email:</strong> privacy@ridercritic.com</li>
            <li><strong>Website:</strong> <a href="/contact" className="text-blue-600 hover:underline">Contact Page</a></li>
          </ul>
        </section>
      </div>
    </div>
  );
}

