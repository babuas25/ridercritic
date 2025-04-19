import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      
      <div className="space-y-6 text-gray-600">
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">1. Information We Collect</h2>
          <p>We collect information you provide directly to us when you:</p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>Create an account</li>
            <li>Post reviews or comments</li>
            <li>Contact us for support</li>
            <li>Sign up for our newsletter</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">2. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>Provide and improve our services</li>
            <li>Send you updates and marketing communications</li>
            <li>Respond to your comments and questions</li>
            <li>Protect against fraudulent or illegal activity</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">3. Information Sharing</h2>
          <p>We do not sell or rent your personal information to third parties. We may share your information only in the following circumstances:</p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>With your consent</li>
            <li>To comply with legal obligations</li>
            <li>To protect our rights and prevent fraud</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">4. Data Security</h2>
          <p>We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">5. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us at:</p>
          <p className="mt-2">Email: privacy@ridercritic.com</p>
        </section>

        <p className="text-sm mt-8">Last updated: {new Date().toLocaleDateString()}</p>
      </div>
    </div>
  );
} 