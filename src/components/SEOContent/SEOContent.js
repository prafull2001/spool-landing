import React from 'react';
import './SEOContent.css';

const SEOContent = () => {
  return (
    <section className="seo-content">
      <div className="seo-content-container">
        
        {/* Section 1 */}
        <div className="seo-section" data-aos="fade-up">
          <h2 className="seo-title">How Spool Breaks Your Doom Scrolling Habit</h2>
          <p className="seo-description">
            Spool interrupts your automatic phone habits with a simple question: "Why am I opening this app?" 
            Our 5-second voice check-in creates the mindful pause you need to break free from endless scrolling. 
            Users reduce their screen time by an average of 25% within the first week—without willpower or 
            complex blocking systems.
          </p>
        </div>

        {/* Section 2 */}
        <div className="seo-section" data-aos="fade-up" data-aos-delay="200">
          <h2 className="seo-title">Transform Screen Time Into Intentional Time</h2>
          <p className="seo-description">
            Turn mindless app usage into conscious choices. Spool helps you build awareness around your 
            digital habits through voice journaling, friend accountability, and personalized insights. 
            Whether you're trying to focus at work or be more present with family, Spool gives you back 
            control over your attention.
          </p>
        </div>

        {/* Section 3 */}
        <div className="seo-section" data-aos="fade-up" data-aos-delay="400">
          <h2 className="seo-title">Join Thousands Breaking Free From Phone Addiction</h2>
          <p className="seo-description">
            Download Spool today and start building healthier phone habits that stick. With AI-powered insights, 
            flexible app blocking, and a supportive community, you'll finally have the tools to reclaim your 
            time and mental energy from the endless scroll.
          </p>
          <div className="seo-cta">
            <a href="https://apps.apple.com/us/app/spool-save-your-thread/id6749428484?platform=iphone" 
               className="seo-download-btn" 
               target="_blank" 
               rel="noopener noreferrer">
              Start Your Digital Wellness Journey
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};

export default SEOContent;