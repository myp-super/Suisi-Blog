import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { auth } from "@/lib/auth";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <>
      <Navbar isLoggedIn={!!session?.user} />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
