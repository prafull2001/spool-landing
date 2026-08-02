import GetRedirect from './GetRedirect';

export const metadata = {
  title: 'Get Spool',
  robots: {
    index: false,
    follow: false,
  },
};

export default function GetPage() {
  return <GetRedirect />;
}
