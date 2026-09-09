import type { Metadata } from "next";
import { appUrl } from "@/lib/env";
import { LegalDoc } from "@/components/legal-doc";

const description =
  "How YEEP Somalia collects, uses, and protects the personal information you share with us.";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description,
  alternates: { canonical: `${appUrl}/privacy` },
  openGraph: { title: "Privacy Policy — YEEP Somalia", description, url: `${appUrl}/privacy` },
};

export default function PrivacyPage() {
  return (
    <LegalDoc
      title="Privacy Policy"
      updated="9 September 2026"
      intro="YEEP Somalia (the Youth Engagement and Empowerment Programme) is committed to protecting the privacy of the people who use this website and take part in our work. This policy explains what information we collect, why we collect it, and the choices you have."
    >
      <section>
        <h2>Information we collect</h2>
        <p>We only collect information that you choose to give us, or that is needed to run the site:</p>
        <ul>
          <li><strong>Contact form:</strong> your name, email address, subject and message.</li>
          <li><strong>Volunteer applications:</strong> your name, email, phone number, preferred role, availability and motivation.</li>
          <li><strong>Newsletter:</strong> your email address.</li>
          <li><strong>Accounts:</strong> if you create an account, your name, email, and (for password sign-in) a securely hashed password; if you use Google sign-in, your name, email and profile photo from Google.</li>
          <li><strong>Event registrations:</strong> a record that your account registered for a given event.</li>
          <li><strong>Volunteer hours:</strong> activities and hours you log through your dashboard.</li>
          <li><strong>Technical data:</strong> standard server logs (such as IP address and browser type) generated when any website is used.</li>
        </ul>
      </section>

      <section>
        <h2>How we use your information</h2>
        <ul>
          <li>To respond to your enquiries and process volunteer applications.</li>
          <li>To send you the newsletter and programme updates you asked for.</li>
          <li>To manage your account, event registrations and volunteer records.</li>
          <li>To understand how our programmes are reaching young people and to report results to our partners in aggregate (without identifying you).</li>
          <li>To keep the site secure and prevent abuse.</li>
        </ul>
        <p>We do not sell your personal information, and we do not use it for advertising.</p>
      </section>

      <section>
        <h2>Service providers</h2>
        <p>We share data only with the providers that help us operate the site, under agreements that require them to protect it:</p>
        <ul>
          <li>A cloud database provider that stores the site&apos;s records.</li>
          <li>An email delivery provider used to send transactional and newsletter emails.</li>
          <li>An image hosting and delivery service for photos published on the site.</li>
          <li>Google, if you choose to sign in with Google.</li>
        </ul>
      </section>

      <section>
        <h2>Cookies</h2>
        <p>We use a small number of cookies that are necessary for the site to work:</p>
        <ul>
          <li>A session cookie that keeps you signed in.</li>
          <li>A preference cookie that remembers your chosen language.</li>
        </ul>
        <p>We do not use third-party advertising or tracking cookies.</p>
      </section>

      <section>
        <h2>Data retention</h2>
        <p>We keep personal information only as long as we need it for the purpose it was collected, or as required for our records and reporting. You can ask us to delete your account and associated data at any time.</p>
      </section>

      <section>
        <h2>Your rights</h2>
        <p>You can ask us to access, correct, or delete the personal information we hold about you, and you can unsubscribe from the newsletter using the link in any email. To make a request, contact us using the details below.</p>
      </section>

      <section>
        <h2>Children</h2>
        <p>Some of our programmes involve people under 18. Where that is the case, we follow our safeguarding policy and seek appropriate consent. This website is not directed at children under 13.</p>
      </section>

      <section>
        <h2>Changes to this policy</h2>
        <p>We may update this policy from time to time. The date at the top of this page shows when it was last changed.</p>
      </section>

      <section>
        <h2>Contact us</h2>
        <p>For any question about this policy or your data, please reach us through our <a href="/contact">contact page</a>.</p>
      </section>
    </LegalDoc>
  );
}
