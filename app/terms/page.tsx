import React from 'react';

export default function Terms() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Terms and Conditions</h1>
      
      <div className="space-y-6 text-gray-600">
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">1. Acceptance of Terms</h2>
          <p>By accessing and using ridercritic, you accept and agree to be bound by the terms and provision of this agreement.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">2. User Account</h2>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>You must be 13 years or older to use this service</li>
            <li>You are responsible for maintaining the security of your account</li>
            <li>You are responsible for all activities that occur under your account</li>
            <li>You must notify us immediately of any unauthorized use of your account</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">3. User Content</h2>
          <p>When posting content on ridercritic, you agree that:</p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>You own or have the necessary rights to the content</li>
            <li>The content is accurate and not misleading</li>
            <li>The content does not violate these terms or any applicable laws</li>
            <li>The content does not infringe upon any third-party rights</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">4. Prohibited Activities</h2>
          <p>Users are prohibited from:</p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>Posting false or misleading content</li>
            <li>Harassing or abusing other users</li>
            <li>Attempting to manipulate ratings or reviews</li>
            <li>Using the service for any illegal purposes</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">5. Termination</h2>
          <p>We reserve the right to terminate or suspend access to our service immediately, without prior notice or liability, for any reason whatsoever.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">6. Contact</h2>
          <p>If you have any questions about these Terms, please contact us at:</p>
          <p className="mt-2">Email: terms@ridercritic.com</p>
        </section>

        <p className="text-sm mt-8">Last updated: {new Date().toLocaleDateString()}</p>
      </div>
    </div>
  );
} 