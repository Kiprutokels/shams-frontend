import React from "react";
import { Link } from "react-router-dom";

export const TermsOfService: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto p-6 text-gray-800 dark:text-gray-200">
      <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Last updated: [DATE]
      </p>

      {/* Scrollable content container */}
      <div className="max-h-[60vh] overflow-y-auto pr-2 space-y-4 text-sm leading-relaxed">
        <p>
          Welcome to <strong>SMART Healthcare Appointment Management System ("SHAMS")</strong>.
          These Terms of Service ("Terms") govern your access to and use of our
          website, application, and related services (collectively, the "Service").
          By creating an account or using the Service, you agree to be bound by
          these Terms. If you do not agree, you must not use the Service.
        </p>

        <h2 className="text-lg font-semibold mt-4">1. Eligibility</h2>
        <p>
          You must be at least 18 years old or the age of legal majority in your
          jurisdiction to use the Service. By using the Service, you represent that
          you have the legal capacity to enter into these Terms.
        </p>

        <h2 className="text-lg font-semibold mt-4">2. Accounts and Security</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>You are responsible for maintaining the confidentiality of your login credentials.</li>
          <li>You are responsible for all activities that occur under your account.</li>
          <li>You agree to notify us promptly of any unauthorized access or security breach.</li>
          <li>
            We may suspend or terminate your account if we suspect misuse, fraud, or a
            violation of these Terms.
          </li>
        </ul>

        <h2 className="text-lg font-semibold mt-4">3. Use of the Service</h2>
        <p>You agree to use the Service only for lawful purposes. You must not:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Violate any applicable laws or regulations.</li>
          <li>Provide false, inaccurate, or misleading information.</li>
          <li>Interfere with or disrupt the operation of the Service.</li>
          <li>Attempt to gain unauthorized access to other accounts or systems.</li>
          <li>Reverse engineer, decompile, or disassemble the Service except as permitted by law.</li>
        </ul>

        <h2 className="text-lg font-semibold mt-4">4. Healthcare Disclaimer</h2>
        <p>
          SHAMS is a software platform that helps manage appointments and related
          workflows between patients, healthcare providers, and administrators.
          <strong> SHAMS does not provide medical advice, diagnosis, or treatment.</strong>{" "}
          All medical decisions must be made by qualified healthcare professionals.
        </p>
        <p>
          Any information displayed through the Service (such as appointment details
          or general health content) is for informational and administrative
          purposes only and is not a substitute for professional medical advice. In
          an emergency, always contact your local emergency number or seek immediate
          medical attention.
        </p>

        <h2 className="text-lg font-semibold mt-4">5. Appointment Management</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Patients are responsible for providing accurate and up-to-date information.</li>
          <li>Healthcare providers are responsible for managing their schedules and availability.</li>
          <li>
            Cancellation, rescheduling, and no-show policies may be set by individual
            providers and are outside SHAMS&apos;s direct control.
          </li>
        </ul>

        <h2 className="text-lg font-semibold mt-4">6. User Content</h2>
        <p>
          "User Content" includes any information, text, or other material you submit
          through the Service. You are solely responsible for your User Content and
          confirm you have all necessary rights to share it.
        </p>
        <p>
          You grant SHAMS a non-exclusive, worldwide, royalty-free license to use,
          host, store, reproduce, and display your User Content as needed to provide
          and operate the Service.
        </p>

        <h2 className="text-lg font-semibold mt-4">7. Privacy</h2>
        <p>
          Your use of the Service is also governed by our{" "}
          <Link
            to="/privacy-policy"
            className="text-blue-600 dark:text-blue-400 underline"
          >
            Privacy Policy
          </Link>
          , which explains how we collect, use, and protect your data. Please review
          it carefully.
        </p>

        <h2 className="text-lg font-semibold mt-4">8. Intellectual Property</h2>
        <p>
          All content and materials in the Service (including software, designs,
          logos, and text) are owned by SHAMS or its licensors and are protected by
          intellectual property laws. You are granted a limited, non-transferable,
          revocable license to use the Service in accordance with these Terms.
        </p>

        <h2 className="text-lg font-semibold mt-4">9. Third-Party Services</h2>
        <p>
          The Service may link to or integrate with third-party websites or
          services. We do not control and are not responsible for the content,
          policies, or practices of third parties. Your use of third-party services
          is at your own risk and subject to their terms.
        </p>

        <h2 className="text-lg font-semibold mt-4">10. Service Availability and Changes</h2>
        <p>
          We aim to keep the Service available and reliable, but we do not guarantee
          uninterrupted or error-free operation. We may modify, suspend, or
          discontinue all or part of the Service at any time, with or without notice.
        </p>

        <h2 className="text-lg font-semibold mt-4">11. Disclaimer of Warranties</h2>
        <p>
          The Service is provided on an{" "}
          <strong>"AS IS" and "AS AVAILABLE"</strong> basis. To the fullest extent
          permitted by law, we disclaim all warranties, express or implied,
          including warranties of merchantability, fitness for a particular purpose,
          and non-infringement.
        </p>

        <h2 className="text-lg font-semibold mt-4">12. Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by law, SHAMS and its officers, directors,
          employees, and agents are not liable for any indirect, incidental, special,
          consequential, or punitive damages (including loss of profits, data, or
          goodwill) arising out of or related to your use of the Service.
        </p>

        <h2 className="text-lg font-semibold mt-4">13. Indemnification</h2>
        <p>
          You agree to indemnify and hold SHAMS harmless from any claims, damages,
          losses, or expenses (including reasonable legal fees) arising from your
          use of the Service or violation of these Terms.
        </p>

        <h2 className="text-lg font-semibold mt-4">14. Termination</h2>
        <p>
          We may suspend or terminate your access to the Service at any time, with
          or without notice, if we reasonably believe you have violated these Terms
          or engaged in harmful behavior. Upon termination, your right to use the
          Service will immediately cease.
        </p>

        <h2 className="text-lg font-semibold mt-4">15. Changes to These Terms</h2>
        <p>
          We may update these Terms from time to time. When we do, we will revise
          the "Last updated" date above. Your continued use of the Service after any
          changes become effective constitutes your acceptance of the updated Terms.
        </p>

        <h2 className="text-lg font-semibold mt-4">16. Contact Us</h2>
        <p>
          If you have questions about these Terms, please contact us at:
          <br />
          Email: [YOUR CONTACT EMAIL]
          <br />
          Address: [YOUR BUSINESS ADDRESS]
        </p>
      </div>

      {/* Back to Registration button */}
      <div className="mt-6">
        <Link
          to="/register"
          state={{ step: 3 }}
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          ← Back to Registration
        </Link>
      </div>
    </div>
  );
};