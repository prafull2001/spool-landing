
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
        
        <section>
          <h2>1. Information Collection</h2>
          <p>We collect information you provide directly to us, such as when you create an account, record a voice note, or communicate with us. This may include your name, email address, and voice recordings.</p>
        </section>

        <section>
          <h2>2. Data Usage and Protection</h2>
          <p>Your data is used to provide and improve the Spool service, including personalizing your experience and providing insights into your usage patterns. We implement industry-standard security measures to protect your data.</p>
        </section>

        <section>
          <h2>3. Data Collection and Usage Details</h2>
          <p>Voice notes are transcribed and analyzed to provide you with insights. This data is anonymized and aggregated to improve our services. We do not share your personal data with third parties without your consent, except as required by law.</p>
        </section>

        <section>
          <h2>4. Your Rights</h2>
          <p>You have the right to access, correct, or delete your personal data. You can manage your account settings and communication preferences within the app.</p>
        </section>

        <section>
          <h2>5. Data Retention</h2>
          <p>We retain your data for as long as your account is active or as needed to provide you with our services. We may retain anonymized data for analytical purposes.</p>
        </section>

        <section>
          <h2>6. Changes to Privacy Policy</h2>
          <p>We may update this privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page.</p>
        </section>

        <section>
          <h2>7. Contact Us</h2>
          <p>If you have any questions about this privacy policy, please contact us at privacy@spool.app.</p>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default PrivacyPolicyPage;
