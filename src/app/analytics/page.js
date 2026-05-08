import ClientAnalytics from './ClientPage';

export const metadata = {
  title: 'Admin Dashboard',
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return <ClientAnalytics />;
}
