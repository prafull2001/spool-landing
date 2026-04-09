import ClientAnalytics from './ClientPage';

export const metadata = {
  title: 'Analytics | Spool',
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return <ClientAnalytics />;
}
