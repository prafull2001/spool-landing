"use client";
import React from 'react';
import Logo from '../components/Logo/Logo.js';
import Footer from '../components/Footer/Footer.js';
import './TermsOfServicePage.css';

const TermsOfServicePage = () => {
  return (
    <>
      <Logo />
      <div className="terms-container">
        <h1>Terms of Service</h1>
        
        <p className="terms-intro">Effective Date: September 24, 2026</p>

        <section>
          <h2>1. Introduction</h2>
          <p>Welcome to Spool ("the App"). By downloading or using the App, you agree to be bound by these Terms of Service.</p>
        </section>

        <section>
          <h2>2. App Services</h2>
          
          <h3>2.1 Features</h3>
          <ul>
            <li>Block apps using iOS Family Controls APIs</li>
            <li>Track and monitor screen time statistics</li>
            <li>Access to historical screen time data</li>
            <li>Block entire app categories</li>
            <li>Filter selected social-media features inside Spool's Focus Web browser</li>
          </ul>

          <h3>2.2 Pricing and Payments</h3>
          <p>The App is available through in-app purchase with two subscription options:</p>
          <ul>
            <li>Monthly Subscription</li>
            <li>Annual Subscription (includes a 2-week free trial)</li>
          </ul>
          <p>All prices are shown in your local currency within the App. Prices may vary by region and are subject to change.</p>
          <p>For annual subscriptions, the 2-week trial period begins when you confirm your subscription. No charge will be applied during the trial period. Payment will be charged to your iTunes account at confirmation of purchase or after the trial period ends.</p>
          <p>The subscription automatically renews unless auto-renew is turned off at least 24 hours before the end of the current period. Your account will be charged for renewal within 24 hours prior to the end of the current period. You can manage and cancel subscriptions in your iTunes account settings.</p>
          <p>If you cancel during the trial period, access to App features will end immediately. Canceling does not automatically issue a refund for any paid subscription period; refund requests are handled by Apple under applicable law and App Store policies.</p>

          <h3>Refund requests and sharing with Apple</h3>
          <p>If you request a refund for an in-app purchase, you agree that Spool may share information about your purchase and your use of the app with Apple to help Apple decide on your request. We share this only when a refund is requested and only as permitted by Apple’s policies. You can withdraw your consent at any time by emailing <a href="mailto:team@thespoolapp.com">team@thespoolapp.com</a>.</p>
          <p>Apple handles App Store refund requests and makes the final decision, subject to applicable law and App Store policies. Opening the native Instagram, YouTube, X, Snapchat, or Facebook app instead of its filtered web version inside Spool, or leaving separate native-app blocking unconfigured, does not by itself mean Focus Web failed to work. We consider the specific purchase, setup, use, and any reported failure when reviewing a request and sharing information with Apple. This does not exclude refunds for an actual failure or any rights you have under applicable law.</p>

          <h3>2.3 Focus Web and App Blocking</h3>
          <p>Focus Web filters selected feeds and features only when you open a supported social-media website inside Spool. Depending on the settings you enable and the supported web interface, its controls include:</p>
          <ul>
            <li><strong>Instagram:</strong> a Following-only feed and controls for Reels, Explore, Stories, Messages, and suggested or sponsored posts. Shared Reel links may still open.</li>
            <li><strong>YouTube:</strong> hiding Shorts tabs and shelves; a Shorts link can open as a regular video instead of the Shorts swipe feed.</li>
            <li><strong>X:</strong> hiding Explore and Trends, with a separate optional Grok control. The For You timeline is not currently filtered.</li>
            <li><strong>Snapchat:</strong> hiding Spotlight and Stories/Discover, including Friend Stories. Chat remains available.</li>
            <li><strong>Facebook:</strong> hiding dedicated Reels and video hubs. Individual or shared video links may still open.</li>
          </ul>
          <p>These filters do not change the separate native Instagram, YouTube, X, Snapchat, or Facebook apps. To restrict a native app, you must separately select it in Spool's app-blocking setup, grant the required iOS Screen Time access, and enable the applicable blocking settings or schedule. Native-app blocking and Focus Web filtering are different features. See <a href="/focus-web">how Focus Web works</a>.</p>

          <h3>2.4 Advertising, Analytics, and Data Processing</h3>
          <p>The App uses third-party service providers to authenticate accounts, process subscriptions, analyze product usage, and measure and optimize our advertising. These include AppsFlyer, Meta (Facebook), Firebase (Google), RevenueCat, and PostHog. With your permission through Apple's App Tracking Transparency prompt, we access your device advertising identifier (IDFA) and share product-interaction and purchase events with our advertising and measurement partners, which may involve tracking across apps and websites owned by other companies. You can decline or withdraw this permission at any time through the App Tracking Transparency prompt or in iOS Settings. How we collect, use, and share this data — and how to opt out — is described in our <a href="/privacy">Privacy Policy</a>, which is incorporated into these Terms by reference. By using the App, you acknowledge the data practices described in the Privacy Policy.</p>
        </section>

        <section>
          <h2>3. User Rights and Obligations</h2>
          
          <h3>3.1 Age and Consent</h3>
          <p>The App is available for users of all ages. Users under 13 must have parent or guardian consent. You are responsible for maintaining the confidentiality of your account.</p>

          <h3>3.2 Acceptable Use</h3>
          <p>You agree not to:</p>
          <ul>
            <li>Circumvent or attempt to circumvent the App's blocking mechanisms.</li>
            <li>Use the App for any unlawful purpose.</li>
            <li>Reverse engineer or attempt to extract the source code.</li>
            <li>Use the App in any way that could damage or overburden our infrastructure.</li>
          </ul>
          <p>You are responsible for all activity that occurs under your account.</p>
        </section>

        <section>
          <h2>4. Changes to Service</h2>
          <p>We reserve the right to:</p>
          <ul>
            <li>Modify or discontinue any part of the service.</li>
            <li>Change subscription prices or availability.</li>
            <li>Update these Terms with reasonable notice.</li>
          </ul>
        </section>

        <section>
          <h2>5. Limitation of Liability</h2>
          <p>The App is provided "as is" without warranties. We are not responsible for:</p>
          <ul>
            <li>Inability to access blocked apps.</li>
            <li>Any consequences of app blocking or unblocking.</li>
            <li>Screen time tracking accuracy.</li>
            <li>Interruptions in service availability.</li>
            <li>Any losses or damages resulting from your use of the App.</li>
          </ul>
        </section>

        <section>
          <h2>6. Termination</h2>
          <p>We reserve the right to terminate or suspend access to the App for violations of these Terms or for any other reason at our discretion.</p>
        </section>

        <section>
          <h2>7. Contact</h2>
          <p>If you have any questions about these Terms, please contact us at <a href="mailto:team@thespoolapp.com">team@thespoolapp.com</a>.</p>
        </section>

        <div className="terms-footer">
          <p>© 2025 Spool. All rights reserved.</p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default TermsOfServicePage;
