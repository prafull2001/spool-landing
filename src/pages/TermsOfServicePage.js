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
        
        <p className="terms-intro">Effective Date: September 23, 2025</p>

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
          <p>If you cancel during the trial period, access to App features will end immediately. No refunds will be issued for any unused portion of a subscription period.</p>

          <h3>2.3 App Blocking Functionality</h3>
          <p>The App uses iOS Family Controls APIs to restrict access to selected applications. Blocked apps remain inaccessible according to your settings and schedules. You can configure different blocking durations and schedules within the App.</p>
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
          <p>If you have any questions about these Terms, please contact us at <a href="mailto:spoolappteam@gmail.com">spoolappteam@gmail.com</a>.</p>
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