import TermsOfServicePage from '@/views/TermsOfServicePage';

export const metadata = {
  title: 'Terms of Service',
  description: 'Spool Terms of Service for Focus Web, app blocking, subscriptions, and refunds.',
  alternates: { canonical: 'https://www.thespoolapp.com/terms' },
  openGraph: {
    title: 'Terms of Service | Spool',
    description: 'Spool Terms of Service for Focus Web, app blocking, subscriptions, and refunds.',
    url: 'https://www.thespoolapp.com/terms',
    type: 'website',
    images: [{ url: 'https://www.thespoolapp.com/og-homepage-20k.jpg', width: 1200, height: 630 }],
  },
};

export default function Page() {
  return <TermsOfServicePage />;
}
