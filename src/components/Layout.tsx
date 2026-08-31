import { Outlet } from 'react-router';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

/** Layout + nested-route pattern: renders <Outlet/>; App.tsx must nest routes inside it. */
export default function Layout() {
  return (
    <div className="flex min-h-[100dvh] flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
