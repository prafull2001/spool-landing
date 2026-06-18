import TermsOfServicePage from '@/views/TermsOfServicePage';

export const metadata = {
  title: 'Terms of Service',
  description: 'Spool Terms of Service and End User License Agreement.',
  alternates: { canonical: 'https://www.thespoolapp.com/terms' },
  openGraph: {
    title: 'Terms of Service | Spool',
    description: 'Spool Terms of Service and End User License Agreement.',
    url: 'https://www.thespoolapp.com/terms',
    type: 'website',
    images: [{ url: 'https://www.thespoolapp.com/og-homepage.jpg', width: 1200, height: 630 }],
  },
};

export default function Page() {
  return <TermsOfServicePage />;
}
