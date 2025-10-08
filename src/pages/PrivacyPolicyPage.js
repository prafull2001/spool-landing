import React from 'react';
import Header from '../components/Header/Header.js';
import Footer from '../components/Footer/Footer.js';
import './PrivacyPolicyPage.css';

const PrivacyPolicyPage = () => {
  return (
    <>
      <Header />
      <div className="privacy-policy-container">
        <h1>Privacy Policy</h1>
        
        <p className="privacy-intro">At Spool, we believe your privacy is fundamental. This Privacy Policy explains how we collect, use, and protect your information when you use our app and services.</p>

        <section>
          <h2>1. Information We Collect</h2>
          
          <h3>Information You Provide</h3>
          <ul>
            <li><strong>Account Information:</strong> Name and email address when you download our app</li>
            <li><strong>App Usage Data:</strong> Screen time metrics and app usage patterns to help you reduce screen time</li>
            <li><strong>Settings & Preferences:</strong> Your app settings, notifications preferences, and goals</li>
          </ul>
          
          <h3>Automatically Collected Information</h3>
          <ul>
            <li><strong>Device Information:</strong> Device type, operating system, and app version</li>
            <li><strong>Usage Analytics:</strong> How you interact with Spool to improve our services</li>
            <li><strong>Performance Data:</strong> Crash reports and performance metrics to ensure app reliability</li>
          </ul>
        </section>

        <section>
          <h2>2. How We Use Your Information</h2>
          <p>We use your information to:</p>
          <ul>
            <li>Provide personalized screen time insights and recommendations</li>
            <li>Help you track and achieve your digital wellness goals</li>
            <li>Send you important updates about Spool (you can opt out anytime)</li>
            <li>Improve our app's features and performance</li>
            <li>Ensure the security and proper functioning of our services</li>
          </ul>
        </section>

        <section>
          <h2>3. Information Sharing</h2>
          <p>We do not sell, rent, or share your personal information with third parties for marketing purposes. We may share information only in these limited circumstances:</p>
          <ul>
            <li><strong>With Your Consent:</strong> When you explicitly agree to sharing</li>
            <li><strong>Service Providers:</strong> Trusted partners who help us operate Spool (under strict privacy agreements)</li>
            <li><strong>Legal Requirements:</strong> When required by law or to protect our users' safety</li>
            <li><strong>Business Transfers:</strong> In the unlikely event of a merger or acquisition</li>
          </ul>
        </section>

        <section>
          <h2>4. Your Privacy Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li><strong>Access:</strong> Request a copy of your personal information</li>
            <li><strong>Update:</strong> Correct any inaccurate information</li>
            <li><strong>Delete:</strong> Request deletion of your account and data</li>
            <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
          </ul>
        </section>

        <section>
          <h2>5. Data Retention</h2>
          <p>We retain your information only as long as necessary to provide our services and comply with legal obligations. When you delete your account, we remove your personal information within 30 days, though some anonymized data may be retained for analytics purposes.</p>
        </section>

        <section>
          <h2>6. Children's Privacy</h2>
          <p>Spool is not intended for children under 13. We do not knowingly collect personal information from children under 13. If we discover we have collected such information, we will delete it promptly.</p>
        </section>

        <section>
          <h2>7. Changes to This Policy</h2>
          <p>We may update this Privacy Policy occasionally. We'll notify you of any material changes via email or through the app. Your continued use of Spool after such changes constitutes acceptance of the new policy.</p>
        </section>

        <section>
          <h2>Contact Us</h2>
          <p>If you have any questions about this Privacy Policy or your personal information, please contact us:</p>
          <p><strong>Email:</strong> <a href="mailto:spoolappteam@gmail.com">spoolappteam@gmail.com</a></p>
          <p>We're committed to addressing your privacy concerns promptly and transparently.</p>
        </section>

        <div className="privacy-footer">
          <p>Thank you for trusting Spool with your digital wellness journey. We're here to help you spend more time living and less time unravelling.</p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PrivacyPolicyPage;