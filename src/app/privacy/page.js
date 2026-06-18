import PrivacyPolicyPage from '@/views/PrivacyPolicyPage';

export const metadata = {
  title: 'Privacy Policy',
  description: 'Learn how Spool protects your privacy and handles your screen time data securely.',
  alternates: { canonical: 'https://www.thespoolapp.com/privacy' },
  openGraph: {
    title: 'Privacy Policy | Spool',
    description: 'Learn how Spool protects your privacy and handles your screen time data securely.',
    url: 'https://www.thespoolapp.com/privacy',
    type: 'website',
    images: [{ url: 'https://www.thespoolapp.com/og-homepage.jpg', width: 1200, height: 630 }],
  },
};

export default function Page() {
  return <PrivacyPolicyPage />;
}
