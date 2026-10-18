import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Profile",
  description: "Your account, past orders and saved addresses on Mishi Pooja Products.",
  alternates: { canonical: "/profile" },
  robots: {
    index: false,
    follow: false,
  },
};

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return children;
}
