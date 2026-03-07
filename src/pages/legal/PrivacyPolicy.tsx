import React from "react";
import { Link } from "react-router-dom";

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto p-6 text-gray-800 dark:text-gray-200">
      <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Last updated: [DATE]
      </p>

      {/* Scrollable content container */}
      <div className="max-h-[60vh] overflow-y-auto pr-2 space-y-4 text-sm leading-relaxed">
        <p>
          This Privacy Policy explains how{" "}
          <strong>SMART Healthcare Appointment Management System ("SHAMS", "we", "us")</strong>{" "}
          collects, uses, discloses, and protects your information when you use our
          website, application, and related services (the "Service"). By using the
          Service, you agree to the practices described in this Policy.
        </p>

        <h2 className="text-lg font-semibold mt-4">1. Information We Collect</h2>

        <h3 className="font-semibold mt-2">1.1 Information You Provide</h3>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <strong>Account Information:</strong> Name, email address, password,
            role (patient, doctor, admin), and contact details.
          </li>
          <li>
            <strong>Profile Information:</strong> Demographic details and, for
            providers, specialization and practice details.
          </li>
          <li>
            <strong>Health-Related Information (Patients):</strong> Appointment
            details, symptoms or chief complaints, and any medical information you
            choose to share.
          </li>
          <li>
            <strong>Communications:</strong> Messages, feedback, and support
            requests you send to us.
          </li>
        </ul>

        <h3 className="font-semibold mt-2">1.2 Information Collected Automatically</h3>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <strong>Usage Data:</strong> Pages viewed, features used, time spent,
            and interactions with the Service.
          </li>
          <li>
            <strong>Device and Log Information:</strong> IP address, browser type,
            operating system, device identifiers, and access times.
          </li>
          <li>
            <strong>Cookies and Similar Technologies:</strong> We may use cookies,
            local storage, and similar tools to remember your preferences and
            improve the Service.
          </li>
        </ul>

        <h3 className="font-semibold mt-2">1.3 Information from Third Parties</h3>
        <p>
          We may receive information from healthcare providers, clinics, or third
          parties (such as authentication or calendar services) where integrations
          are enabled, solely to support the operation of the Service.
        </p>

        <h2 className="text-lg font-semibold mt-4">2. How We Use Your Information</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>To create and manage user accounts.</li>
          <li>To schedule, manage, and track appointments.</li>
          <li>To enable communication between patients, providers, and admins.</li>
          <li>To improve and customize the Service, including analytics and research in aggregated or de-identified form.</li>
          <li>To send important notices, such as security alerts or changes to our terms and policies.</li>
          <li>To comply with legal obligations and protect against fraud or abuse.</li>
        </ul>

        <h2 className="text-lg font-semibold mt-4">3. How We Share Your Information</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <strong>With Healthcare Providers:</strong> For patients, relevant
            appointment and health information is shared with the doctor or clinic
            you select, as needed for care and scheduling.
          </li>
          <li>
            <strong>With Service Providers:</strong> We may share data with vendors
            who help us operate and secure the Service (e.g., hosting, analytics,
            email). They are bound by contractual obligations to protect your data.
          </li>
          <li>
            <strong>For Legal Reasons:</strong> We may disclose information when
            required by law or to protect the rights, property, or safety of SHAMS,
            our users, or others.
          </li>
          <li>
            <strong>Business Transfers:</strong> In connection with a merger, sale,
            or reorganization, your information may be transferred as part of that
            transaction, subject to appropriate safeguards.
          </li>
        </ul>
        <p>
          We do <strong>not</strong> sell your personal data.
        </p>

        <h2 className="text-lg font-semibold mt-4">4. Data Retention</h2>
        <p>
          We retain your information for as long as necessary to provide the
          Service, meet legal or regulatory obligations, resolve disputes, and
          enforce our agreements. When your data is no longer required, we will
          take reasonable steps to delete or anonymize it.
        </p>

        <h2 className="text-lg font-semibold mt-4">5. Data Security</h2>
        <p>
          We use reasonable technical and organizational measures to protect your
          data, such as encryption in transit, access controls, and monitoring.
          However, no system is completely secure, and we cannot guarantee absolute
          security.
        </p>
        <p>
          You are responsible for maintaining the confidentiality of your account
          credentials and for promptly notifying us of any suspected unauthorized
          access.
        </p>

        <h2 className="text-lg font-semibold mt-4">6. Your Rights and Choices</h2>
        <p>
          Depending on your jurisdiction, you may have rights to access, correct,
          delete, or restrict the processing of your personal data, as well as the
          right to object to certain processing or withdraw consent where
          applicable.
        </p>
        <p>
          To exercise your rights or make a privacy-related request, please contact
          us using the details in the "Contact Us" section. We may need to verify
          your identity before responding.
        </p>

        <h2 className="text-lg font-semibold mt-4">7. Children&apos;s Privacy</h2>
        <p>
          The Service is not intended for children under 18, and we do not knowingly
          collect personal data from children without appropriate consent where
          required by law. If you believe we have collected such data, please
          contact us so we can take appropriate action.
        </p>

        <h2 className="text-lg font-semibold mt-4">8. International Data Transfers</h2>
        <p>
          Your information may be processed and stored in countries other than your
          own, where data protection laws may differ. Where required, we implement
          appropriate safeguards to protect your data when it is transferred across
          borders.
        </p>

        <h2 className="text-lg font-semibold mt-4">9. Third-Party Links</h2>
        <p>
          The Service may contain links to third-party websites or services. We are
          not responsible for the privacy practices or content of those third
          parties and encourage you to review their privacy policies.
        </p>

        <h2 className="text-lg font-semibold mt-4">10. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. When we do, we will
          revise the "Last updated" date above. Your continued use of the Service
          after any changes become effective constitutes your acceptance of the
          updated Policy.
        </p>

        <h2 className="text-lg font-semibold mt-4">11. Contact Us</h2>
        <p>
          If you have any questions, concerns, or requests regarding this Privacy
          Policy or our data practices, please contact us at:
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
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          ← Back to Registration
        </Link>
      </div>
    </div>
  );
};