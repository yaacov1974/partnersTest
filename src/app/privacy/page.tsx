import { Metadata } from "next";
import { SimpleHeader } from "@/components/SimpleHeader";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy - Partnerz.ai",
  description: "Privacy Policy for Partnerz.ai",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-black text-zinc-300">
      <SimpleHeader />
      <div className="container mx-auto max-w-4xl px-4 py-16">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl mb-4">
            Partnerz.ai Privacy Policy
          </h1>
          <p className="text-lg text-zinc-400">
            Effective Date: December 5, 2025
          </p>
        </div>

        <div className="space-y-12">
          <section>
            <p className="mb-4">
              This Privacy Policy describes how Partnerz.ai ("Partnerz.ai," "We," "Us," or "Our") collects, uses, processes, and discloses your Personal Information in connection with your use of our website, platform, and services (collectively, the "Services").
            </p>
            <p>
              We are committed to protecting the privacy of our users and clients.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">1. Introduction and Scope</h2>
            <p className="mb-4">
              Partnerz.ai, the provider of intelligent AI partnership tools, respects your privacy. This policy applies to individuals who visit our website, individuals who register for a Partnerz.ai account, and individuals whose information we receive in connection with the Services we provide to our business clients ("Clients").
            </p>
            <p className="mb-2 font-medium text-white">For the purposes of this policy:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <span className="text-white font-medium">Controller:</span> Partnerz.ai acts as a Data Controller when we process data related to our website visitors and account holders (Client representatives).
              </li>
              <li>
                <span className="text-white font-medium">Processor:</span> Partnerz.ai acts as a Data Processor when we process data on behalf of our Clients (e.g., customer data input into our AI tools). The Client is the Data Controller in this instance.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">2. Personal Information We Collect</h2>
            <p className="mb-6">
              We collect information directly from you, automatically through your use of the Services, and from third-party sources.
            </p>

            <h3 className="text-xl font-medium text-white mb-3">A. Information You Provide Directly to Us</h3>
            <p className="mb-4">
              This information is typically collected during account registration, customer support interactions, and billing:
            </p>
            <div className="overflow-x-auto mb-8">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800">
                    <th className="py-3 pr-4 font-semibold text-white">Category</th>
                    <th className="py-3 pr-4 font-semibold text-white">Examples of Data</th>
                    <th className="py-3 font-semibold text-white">Purpose and Legal Basis (GDPR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  <tr>
                    <td className="py-3 pr-4 align-top text-white">Account Data</td>
                    <td className="py-3 pr-4 align-top">Full Name, Professional Email Address, Password, Job Title, Company Name.</td>
                    <td className="py-3 align-top">Contractual Necessity (To create and manage your account and deliver the Services).</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 align-top text-white">Financial Data</td>
                    <td className="py-3 pr-4 align-top">Billing Address, payment card details (processed securely by third-party processors), Subscription details.</td>
                    <td className="py-3 align-top">Contractual Necessity (To process payments and manage subscriptions).</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 align-top text-white">Communication Data</td>
                    <td className="py-3 pr-4 align-top">Records of support tickets, emails, and chat communications with our support team.</td>
                    <td className="py-3 align-top">Legitimate Interest (To respond to inquiries, improve support quality, and resolve issues).</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-xl font-medium text-white mb-3">B. Information We Collect Automatically</h3>
            <p className="mb-4">
              When you access or use our website and platform, we automatically collect the following data:
            </p>
            <div className="overflow-x-auto mb-8">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800">
                    <th className="py-3 pr-4 font-semibold text-white">Category</th>
                    <th className="py-3 pr-4 font-semibold text-white">Examples of Data</th>
                    <th className="py-3 font-semibold text-white">Purpose and Legal Basis (GDPR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  <tr>
                    <td className="py-3 pr-4 align-top text-white">Usage Data</td>
                    <td className="py-3 pr-4 align-top">Pages viewed, features used, time spent on the platform, crash reports, diagnostic data.</td>
                    <td className="py-3 align-top">Legitimate Interest (To monitor and analyze Service performance, maintain security, and improve user experience).</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 align-top text-white">Technical Data</td>
                    <td className="py-3 pr-4 align-top">Internet Protocol (IP) address, device type, browser type and version, operating system, and referral source.</td>
                    <td className="py-3 align-top">Legitimate Interest (For security, fraud prevention, and system stability).</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 align-top text-white">Cookies and Tracking</td>
                    <td className="py-3 pr-4 align-top">Cookies, pixel tags, and similar tracking technologies.</td>
                    <td className="py-3 align-top">Consent (For non-essential cookies, through a cookie banner) and Legitimate Interest (For necessary cookies).</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-xl font-medium text-white mb-3">C. Client Data (When We Act as a Processor)</h3>
            <p className="mb-4">
              If you are a Client, you may submit data, including Personal Information of your customers or employees, to our platform for AI processing. This data is governed by the contract (Data Processing Addendum, or DPA) between Partnerz.ai and the Client.
            </p>
            <p>
              We do not use Client Data for any purpose other than providing the Services requested by the Client.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">3. How We Use Your Personal Information</h2>
            <p className="mb-4">We use the information we collect for the following key business purposes:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <span className="text-white font-medium">To Provide the Services:</span> To create, maintain, and secure your account; to authenticate your access; and to operate the core AI functions of the platform.
              </li>
              <li>
                <span className="text-white font-medium">To Communicate with You:</span> To send transactional messages (invoices, service notifications, password resets) and, with your consent, marketing and promotional communications.
              </li>
              <li>
                <span className="text-white font-medium">For Research and Development:</span> To analyze usage data to test, research, analyze, and develop new features and improve the quality of our AI models and Services.
              </li>
              <li>
                <span className="text-white font-medium">For Security and Safety:</span> To detect and prevent fraudulent, unauthorized, or illegal activities; to enforce our Terms of Service; and to protect the rights and property of Partnerz.ai and others.
              </li>
              <li>
                <span className="text-white font-medium">For Legal Compliance:</span> To comply with applicable laws, legal requests, and legal processes, such as responding to subpoenas or government authorities.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">4. Disclosure and Sharing of Personal Information</h2>
            <p className="mb-4">
              We do not sell your Personal Information. We share data only in the following circumstances:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800">
                    <th className="py-3 pr-4 font-semibold text-white">Recipient Category</th>
                    <th className="py-3 font-semibold text-white">Purpose of Sharing</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  <tr>
                    <td className="py-3 pr-4 align-top text-white">Service Providers</td>
                    <td className="py-3 align-top">Third parties who perform functions on our behalf, such as payment processing, cloud hosting (e.g., AWS, Google Cloud), customer support, and email delivery. These providers are bound by confidentiality agreements.</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 align-top text-white">Affiliates and Subsidiaries</td>
                    <td className="py-3 align-top">With companies under common ownership or control with Partnerz.ai, to provide integrated and consistent service delivery.</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 align-top text-white">Business Transfers</td>
                    <td className="py-3 align-top">In connection with any merger, sale of company assets, financing, or acquisition of all or a portion of our business by another company. We will notify you of any change in ownership.</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 align-top text-white">Legal Requirements</td>
                    <td className="py-3 align-top">To comply with a legal obligation, such as a court order or subpoena, or to protect the rights, property, or safety of Partnerz.ai, our Clients, or the public.</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 align-top text-white">With Your Consent</td>
                    <td className="py-3 align-top">We may share your information with any third party when you have provided explicit consent to do so.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">5. Security of Your Personal Information</h2>
            <p className="mb-4">
              Partnerz.ai takes technical, physical, and organizational measures to protect your Personal Information from unauthorized access, use, alteration, and disclosure. These measures include:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Using SSL/TLS encryption for data transmission.</li>
              <li>Employing data pseudonymization and encryption at rest where appropriate.</li>
              <li>Implementing access controls and internal policies to restrict access to Personal Information to authorized personnel only.</li>
              <li>Regularly reviewing our information collection, storage, and processing practices.</li>
            </ul>
            <p>
              However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to protect your data, we cannot guarantee its absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">6. Your Data Protection Rights (GDPR and CCPA)</h2>
            <p className="mb-6">
              Depending on your location, you may have the following rights regarding your Personal Information:
            </p>

            <h3 className="text-xl font-medium text-white mb-3">A. Rights for Individuals in the EEA, UK, and Switzerland (GDPR)</h3>
            <ul className="list-disc pl-6 space-y-2 mb-6">
              <li><span className="text-white font-medium">Right to Access:</span> The right to request copies of the Personal Data we hold about you.</li>
              <li><span className="text-white font-medium">Right to Rectification:</span> The right to request that we correct any information you believe is inaccurate or complete information you believe is incomplete.</li>
              <li><span className="text-white font-medium">Right to Erasure (Right to be Forgotten):</span> The right to request that we erase your Personal Data, under certain conditions.</li>
              <li><span className="text-white font-medium">Right to Restrict Processing:</span> The right to request that we restrict the processing of your Personal Data, under certain conditions.</li>
              <li><span className="text-white font-medium">Right to Object to Processing:</span> The right to object to our processing of your Personal Data where we rely on legitimate interests.</li>
              <li><span className="text-white font-medium">Right to Data Portability:</span> The right to request that we transfer the data we have collected to another organization, or directly to you, under certain conditions.</li>
              <li><span className="text-white font-medium">Right to Withdraw Consent:</span> Where we rely on consent for processing, you have the right to withdraw that consent at any time.</li>
            </ul>

            <h3 className="text-xl font-medium text-white mb-3">B. Rights for California Residents (CCPA/CPRA)</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><span className="text-white font-medium">Right to Know:</span> The right to request disclosure of the categories and specific pieces of Personal Information collected about you.</li>
              <li><span className="text-white font-medium">Right to Delete:</span> The right to request deletion of Personal Information we have collected, subject to certain exceptions.</li>
              <li><span className="text-white font-medium">Right to Opt-Out of Sale or Sharing:</span> Partnerz.ai does not sell your personal information.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">7. International Data Transfers</h2>
            <p className="mb-4">
              Your information, including Personal Information, may be transferred to — and maintained on — computers located outside of your state, province, country, or other governmental jurisdiction where the data protection laws may differ from those in your jurisdiction.
            </p>
            <p>
              If we transfer Personal Data originating from the European Economic Area (EEA), the UK, or Switzerland to a country not deemed adequate by the European Commission, we rely on appropriate safeguards, such as Standard Contractual Clauses (SCCs) approved by the European Commission, to protect your data.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">8. Children's Privacy</h2>
            <p>
              Our Services are not intended for use by individuals under the age of 18 ("Children"). We do not knowingly collect personally identifiable information from anyone under the age of 18. If you are a parent or guardian and you are aware that your Children have provided us with Personal Information, please contact us. If we become aware that we have collected Personal Information from children without verification of parental consent, we take steps to remove that information from our servers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">9. Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Effective Date" at the top of this policy. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">10. Contact Us</h2>
            <p className="mb-2">
              If you have any questions about this Privacy Policy, or if you wish to exercise any of your data protection rights, please contact us:
            </p>
            <ul className="space-y-1 text-zinc-400">
              <li><span className="text-white font-medium">Email:</span> privacy@partnerz.ai</li>
              <li><span className="text-white font-medium">Website:</span> [Your Website URL Here]</li>
              <li><span className="text-white font-medium">Address:</span> [Your Company Address Here]</li>
            </ul>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}
