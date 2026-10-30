import { MainNav } from "@/components/layout/main-nav";
import { Footer } from "@/components/layout/footer";
import { AccountClient } from "./account-client";

export default function AccountPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-neutral-900 selection:bg-primary-100 selection:text-primary-900">
      <MainNav />

      <main className="flex-1">
        <AccountClient />
      </main>

      <Footer />
    </div>
  );
}
