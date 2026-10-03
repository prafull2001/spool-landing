import React from 'react';

export const STANDARD_PRICING = 'Standard US prices in USD: US$4.99 billed every week, or US$44.99 billed once per year. Prices and applicable taxes may vary by country or offer. The exact price and billing terms are displayed before you confirm an App Store purchase.';
export const TRIAL_TERMS = 'Standard subscriptions do not include a free trial and are charged upon purchase confirmation. If an eligible introductory trial or promotional offer is expressly shown before purchase, the terms displayed with that offer apply.';
export const FOCUS_WEB_LIMITS = 'Focus Web filters supported website features inside Spool. It does not remove Reels, Shorts, or other features from the separate native Instagram, YouTube, or other social apps. Native-app blocking is a separate feature requiring Screen Time permission and configuration.';

export function RefundDataSharing() {
  return (
    <>
      <p>When Apple assesses an App Store refund request, Spool may provide relevant purchase and app-use information, directly or through its subscription service provider, and a recommendation. This may include purchase and subscription identifiers, purchase dates and access status, whether content or features were delivered or used, and relevant setup, usage, or reported-failure information. Apple makes the final refund decision under its policies and applicable law.</p>
      <p>Any required affirmative consent for refund-data sharing is separate from acceptance of these Terms or this Privacy Policy. Signing up, paying, using the app, or requesting a refund does not by itself establish that consent. Accepting Terms, configuring blocking, or briefly using a feature does not automatically remove refund eligibility.</p>
      <p>To withdraw refund-data-sharing consent, email <a href="mailto:team@thespoolapp.com">team@thespoolapp.com</a>. Withdrawal concerns future sharing; it does not itself cancel a subscription, delete an account, or reverse information already sent. Email requests require support handling; sending an email is not confirmation that processing is complete.</p>
    </>
  );
}
