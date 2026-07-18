import IgRedirect from "./IgRedirect";

export const metadata = {
  title: "Opening Instagram",
  robots: {
    index: false,
    follow: false,
  },
};

export default function InstagramRedirectPage() {
  return <IgRedirect />;
}
