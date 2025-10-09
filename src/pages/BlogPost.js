import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import './BlogPost.css';

const blogContent = {
  'doom-scrolling-habit': {
    title: 'How Spool Breaks Your Doom Scrolling Habit',
    date: 'October 9, 2025',
    readTime: '5 min read',
    category: 'Digital Wellness',
    content: `
      <p>We've all been there. You pick up your phone to check one thing, and suddenly an hour has vanished into the endless scroll. This isn't a personal failing—it's by design. Social media apps are engineered to hijack your attention, and breaking free requires more than willpower alone.</p>

      <h2>The Psychology Behind Doom Scrolling</h2>
      <p>Doom scrolling isn't just a bad habit; it's a neurological trap. Every swipe triggers a small dopamine hit, creating what psychologists call a "variable ratio reinforcement schedule"—the same mechanism that powers gambling addiction. Your brain literally becomes wired to seek the next scroll, even when you consciously want to stop.</p>

      <p>Research from Stanford University shows that the average person checks their phone 96 times per day—once every 10 minutes. Even more concerning, 71% of Americans admit to checking their phone within the first 10 minutes of waking up, starting their day already caught in the scroll.</p>

      <h2>Why Traditional App Blockers Don't Work</h2>
      <p>Most screen time apps rely on hard blocks or time limits, but these approaches fail because they fight against your habits rather than working with them. When you hit a hard block, your brain—still craving that dopamine hit—finds workarounds. You might switch to a different app, grab another device, or simply disable the blocker entirely.</p>

      <p>The problem isn't that you lack self-control; it's that you're fighting an unfair battle against algorithms designed by teams of neuroscientists and behavioral psychologists.</p>

      <h2>The Power of the Mindful Pause</h2>
      <p>Spool takes a different approach. Instead of blocking apps entirely, we introduce a simple 5-second voice check-in before you can open distracting apps. This brief pause serves multiple purposes:</p>

      <ul>
        <li><strong>Breaks the automatic behavior loop:</strong> That split second between thought and action is where habits live. By interrupting this automatic sequence, you regain conscious control.</li>
        <li><strong>Creates awareness:</strong> Speaking your intention out loud forces you to acknowledge what you're doing and why.</li>
        <li><strong>Builds new neural pathways:</strong> Over time, this pause rewires your brain to approach phone use more intentionally.</li>
      </ul>

      <h2>The Science of Voice Activation</h2>
      <p>Why voice? Speaking engages different parts of your brain than thinking alone. When you verbalize your intention, you activate your prefrontal cortex—the brain's executive control center. This simple act shifts you from autopilot to conscious decision-making.</p>

      <p>Studies show that people who verbalize their goals are 42% more likely to achieve them. By asking yourself "Why am I opening this app?" out loud, you transform mindless scrolling into intentional action.</p>

      <h2>Real Results From Real Users</h2>
      <p>Our users report an average 25% reduction in screen time within the first week—without feeling restricted or frustrated. Unlike traditional blockers, Spool doesn't create friction; it creates awareness. Users tell us they don't feel like they're fighting their phones anymore. Instead, they're finally in control.</p>

      <blockquote>"I didn't realize how often I was opening Instagram without even thinking about it. Spool's voice check-in made me aware of my patterns, and now I actually choose when to scroll instead of doing it automatically."</blockquote>

      <h2>Breaking Free Starts With Awareness</h2>
      <p>Doom scrolling thrives in unconsciousness. The moment you become aware of what you're doing, its power begins to fade. Spool doesn't judge or shame—it simply asks you to pause and consider. This gentle intervention is often all it takes to break the spell of the endless scroll.</p>

      <p>Ready to reclaim your attention? Download Spool today and discover how a simple 5-second pause can transform your relationship with your phone.</p>
    `
  },
  'intentional-screen-time': {
    title: 'Transform Screen Time Into Intentional Time',
    date: 'October 9, 2025',
    readTime: '4 min read',
    category: 'Productivity',
    content: `
      <p>What if your phone could actually help you achieve your goals instead of distracting you from them? The problem isn't technology itself—it's unconscious usage. When you transform screen time from mindless to mindful, your device becomes a tool for growth rather than a source of guilt.</p>

      <h2>The Hidden Cost of Unconscious Phone Use</h2>
      <p>Every unconscious scroll carries a cost beyond just time. Research from the University of California, Irvine, found that it takes an average of 23 minutes to fully refocus after a distraction. When you mindlessly check your phone during work, you're not just losing those 5 minutes of scrolling—you're sacrificing nearly half an hour of deep focus.</p>

      <p>But the cost goes deeper than productivity. Unconscious phone use affects your relationships, sleep quality, mental health, and even your sense of self. When your days blur together in a haze of notifications and feeds, you lose the intentionality that gives life meaning.</p>

      <h2>The Intentionality Revolution</h2>
      <p>Intentional screen time isn't about using your phone less—it's about using it better. When you approach your device with purpose, amazing things happen:</p>

      <ul>
        <li>Social media becomes a way to genuinely connect, not mindlessly consume</li>
        <li>Your phone supports your goals instead of sabotaging them</li>
        <li>Technology enhances your life rather than escaping from it</li>
      </ul>

      <h2>Building Awareness Through Voice Journaling</h2>
      <p>Spool's voice journaling feature does more than just track your usage—it helps you understand your patterns. When you speak your intention before opening an app, you create a verbal record of your digital habits. Over time, patterns emerge:</p>

      <blockquote>"I noticed I always said 'I'm bored' before opening TikTok. Once I saw that pattern, I could address the real issue—I needed better ways to handle downtime."</blockquote>

      <p>This awareness becomes the foundation for lasting change. You can't improve what you don't measure, and you can't measure what you're not aware of.</p>

      <h2>The Power of Friend Accountability</h2>
      <p>Transformation doesn't happen in isolation. Spool's friend accountability features let you share your digital wellness journey with people who support your growth. This isn't about judgment—it's about encouragement and shared commitment.</p>

      <p>When you and your friends can see each other's progress, something powerful happens. You celebrate wins together, support each other through challenges, and create a culture of intentional living that extends beyond just phone use.</p>

      <h2>Personalized Insights That Drive Change</h2>
      <p>Spool's AI doesn't just show you numbers—it reveals insights. You'll discover:</p>

      <ul>
        <li>Your peak distraction times (and how to navigate them)</li>
        <li>Triggers that drive unconscious phone use</li>
        <li>Patterns in your digital habits you never noticed</li>
        <li>Personalized strategies based on your unique usage</li>
      </ul>

      <p>These insights transform vague goals like "use my phone less" into specific, actionable strategies tailored to your life.</p>

      <h2>From Restriction to Intention</h2>
      <p>Traditional screen time apps focus on restriction—blocking, limiting, preventing. Spool focuses on intention—awareness, choice, purpose. This shift from negative to positive creates sustainable change.</p>

      <p>When you use Spool, you're not fighting against your phone. You're partnering with it to create the life you want. Every voice check-in is a small act of self-respect, a moment where you choose intention over impulse.</p>

      <h2>Start Your Intentional Journey Today</h2>
      <p>Intentional screen time isn't a destination—it's a practice. Every conscious choice to open (or not open) an app is a victory. Every moment of awareness is progress. With Spool, you have the tools to transform your relationship with technology from unconscious consumption to intentional engagement.</p>

      <p>Your phone should work for you, not against you. Download Spool and discover what intentional screen time feels like.</p>
    `
  },
  'breaking-phone-addiction': {
    title: 'Join Thousands Breaking Free From Phone Addiction',
    date: 'October 9, 2025',
    readTime: '6 min read',
    category: 'Mental Health',
    content: `
      <p>Phone addiction is real, it's widespread, and it's not your fault. But here's the good news: thousands of people are successfully breaking free, and you can too. The key isn't willpower—it's having the right tools and support system.</p>

      <h2>The Phone Addiction Epidemic</h2>
      <p>Let's start with the numbers: The average American spends 5.4 hours on their phone daily. That's 38 hours per week—essentially a full-time job spent scrolling, tapping, and swiping. For Gen Z, these numbers jump to nearly 9 hours daily.</p>

      <p>But phone addiction isn't just about time. It's about what we're losing:</p>

      <ul>
        <li>Sleep quality (87% of people use phones within an hour of bed)</li>
        <li>Real connections (families report feeling disconnected despite being in the same room)</li>
        <li>Mental health (studies link excessive phone use to increased anxiety and depression)</li>
        <li>Productivity (knowledge workers lose 2.5 hours daily to phone distractions)</li>
      </ul>

      <h2>Why Your Brain Gets Hooked</h2>
      <p>Smartphone addiction follows the same neural pathways as substance addiction. Each notification triggers a dopamine release, creating a feedback loop that your brain craves. App designers intentionally exploit this—from pull-to-refresh mechanics to variable reward schedules.</p>

      <p>Dr. Anna Lembke, author of "Dopamine Nation," explains that our brains aren't equipped to handle the constant stimulation smartphones provide. We're essentially overdosing on dopamine, leading to tolerance (needing more stimulation for the same satisfaction) and withdrawal (anxiety when separated from our phones).</p>

      <h2>The Community Solution</h2>
      <p>Breaking any addiction alone is incredibly difficult. That's why Spool built community support into our foundation. When you join Spool, you're not just downloading an app—you're joining thousands of people committed to digital wellness.</p>

      <blockquote>"Seeing other people's voice check-ins made me realize I wasn't alone. We're all struggling with the same things, and that made it easier to change."</blockquote>

      <p>Our community features include:</p>

      <ul>
        <li>Friend circles for mutual accountability</li>
        <li>Progress sharing to celebrate wins together</li>
        <li>Challenges that make digital wellness fun</li>
        <li>Support when you're struggling</li>
      </ul>

      <h2>AI-Powered Insights for Personal Growth</h2>
      <p>Everyone's phone addiction is different. Some doom scroll when anxious, others when bored. Some lose hours to social media, others to news or games. Spool's AI analyzes your unique patterns and provides personalized strategies.</p>

      <p>Our AI doesn't judge—it understands. It recognizes when you're making progress, identifies when you might be struggling, and offers support exactly when you need it. Think of it as a personal digital wellness coach that's always there for you.</p>

      <h2>The Tools That Make a Difference</h2>
      <p>Spool provides a comprehensive toolkit for breaking phone addiction:</p>

      <ul>
        <li><strong>Voice Check-ins:</strong> Create awareness before unconscious use</li>
        <li><strong>Flexible Blocking:</strong> Set boundaries that work with your life</li>
        <li><strong>Usage Analytics:</strong> Understand your patterns to change them</li>
        <li><strong>Mindfulness Prompts:</strong> Build better habits gradually</li>
        <li><strong>Progress Tracking:</strong> Celebrate every victory, no matter how small</li>
      </ul>

      <h2>Success Stories From Our Community</h2>
      <p>The Spool community is filled with inspiring transformations:</p>

      <blockquote>"I went from 7 hours to 3 hours daily in just one month. I've read more books in the past three months than in the previous three years."</blockquote>

      <blockquote>"My kids actually thanked me for being more present. I didn't realize how much my phone use was affecting them until I started using Spool."</blockquote>

      <blockquote>"I thought I'd never break my TikTok addiction. Now I use it intentionally for 30 minutes a day instead of losing entire evenings."</blockquote>

      <h2>Your Journey to Freedom Starts Now</h2>
      <p>Breaking phone addiction isn't about perfection—it's about progress. Every conscious choice, every mindful pause, every moment of awareness is a step toward freedom. You don't have to do this alone. Thousands of people are on this journey with you, and Spool provides the tools and support you need to succeed.</p>

      <p>Phone addiction might not be your fault, but breaking free is your opportunity. Download Spool today and join a community committed to reclaiming their lives from the endless scroll. Your future self will thank you.</p>
    `
  }
};

const BlogPost = () => {
  const { id } = useParams();
  const post = blogContent[id];

  if (!post) {
    return (
      <>
        <Header />
        <div className="blog-post-container">
          <div className="blog-post-content">
            <h1>Post Not Found</h1>
            <p>Sorry, we couldn't find the blog post you're looking for.</p>
            <Link to="/blog" className="back-to-blog">← Back to Blog</Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <article className="blog-post-container">
        <div className="blog-post-header">
          <Link to="/blog" className="back-to-blog">← Back to Blog</Link>
          <span className="blog-post-category">{post.category}</span>
          <h1>{post.title}</h1>
          <div className="blog-post-meta">
            <span>{post.date}</span>
            <span>•</span>
            <span>{post.readTime}</span>
          </div>
        </div>
        
        <div className="blog-post-content" dangerouslySetInnerHTML={{ __html: post.content }} />
        
        <div className="blog-post-cta">
          <h3>Ready to break free from mindless scrolling?</h3>
          <p>Join thousands who've transformed their relationship with their phones.</p>
          <a href="https://apps.apple.com/us/app/spool-save-your-thread/id6749428484?platform=iphone" 
             className="blog-cta-button" 
             target="_blank" 
             rel="noopener noreferrer">
            Download Spool Now
          </a>
        </div>
      </article>
      <Footer />
    </>
  );
};

export default BlogPost;