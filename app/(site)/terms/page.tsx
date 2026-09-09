import type { Metadata } from "next";
import { appUrl } from "@/lib/env";
import { LegalDoc } from "@/components/legal-doc";

const description = "The terms that apply when you use the YEEP Somalia website and its services.";

export const metadata: Metadata = {
  title: "Terms of Service",
  description,
  alternates: { canonical: `${appUrl}/terms` },
  openGraph: { title: "Terms of Service — YEEP Somalia", description, url: `${appUrl}/terms` },
};

export default function TermsPage() {
  return (
    <LegalDoc
      title="Terms of Service"
      updated="9 September 2026"
      intro="These terms apply to your use of the YEEP Somalia website and any accounts, forms, or services offered through it. By using the site, you agree to these terms."
    >
      <section>
        <h2>Using the site</h2>
        <p>You may use this site for lawful purposes only. You agree not to misuse it — for example by attempting to disrupt the service, access data that is not yours, submit false information, or upload harmful content.</p>
      </section>

      <section>
        <h2>Accounts</h2>
        <ul>
          <li>You are responsible for keeping your account credentials secure and for activity under your account.</li>
          <li>Provide accurate information when you register and keep it up to date.</li>
          <li>We may suspend or remove accounts that breach these terms or are used to abuse the service.</li>
        </ul>
      </section>

      <section>
        <h2>Volunteer applications and event registrations</h2>
        <p>Submitting a volunteer application or registering for an event is a request to take part, not a guarantee of a place. Places may be limited, and we may contact you to confirm details. You can cancel an event registration from your dashboard.</p>
      </section>

      <section>
        <h2>Content and intellectual property</h2>
        <p>The text, graphics, logos and images on this site belong to YEEP Somalia or its partners and are protected by law. You may share links to our pages and quote short extracts with attribution, but you may not republish substantial content or use our name and logo to imply endorsement without written permission.</p>
        <p>Any information you submit through a form remains yours; by submitting it you give us permission to use it for the purpose described on that form and in our <a href="/privacy">Privacy Policy</a>.</p>
      </section>

      <section>
        <h2>Third-party links</h2>
        <p>The site may link to other websites. We are not responsible for the content or practices of those sites.</p>
      </section>

      <section>
        <h2>Disclaimer</h2>
        <p>We work to keep the information on this site accurate and the service available, but we provide it &ldquo;as is&rdquo; without warranties. To the extent permitted by law, YEEP Somalia is not liable for any loss arising from your use of the site.</p>
      </section>

      <section>
        <h2>Changes</h2>
        <p>We may update these terms from time to time. Continued use of the site after a change means you accept the updated terms. The date at the top of this page shows when they were last changed.</p>
      </section>

      <section>
        <h2>Governing law</h2>
        <p>These terms are governed by the laws of the Federal Republic of Somalia.</p>
      </section>

      <section>
        <h2>Contact us</h2>
        <p>Questions about these terms can be sent through our <a href="/contact">contact page</a>.</p>
      </section>
    </LegalDoc>
  );
}
