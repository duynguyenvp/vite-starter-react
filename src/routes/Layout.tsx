import { Suspense } from 'react';
import { Link, Outlet, useLocation } from 'react-router';
import { LoadingFallback } from '@/components/Loading';

const Layout = () => {
  const { pathname } = useLocation();

  const navLinkClass = (path: string) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
      pathname === path
        ? 'bg-blue-800 !text-white'
        : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
    }`;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <nav className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">
          <h3 className="text-lg font-semibold text-blue-600">Vite Starter Kit</h3>
          <div className="flex space-x-2">
            <Link to="/" className={navLinkClass('/')}>
              Page 1
            </Link>
            <Link to="/page2" className={navLinkClass('/page2')}>
              Page 2
            </Link>
            <Link to="/page3" className={navLinkClass('/page3')}>
              Page 3
            </Link>
          </div>
        </nav>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-6">
        <Suspense fallback={<LoadingFallback message="Loading page..." />}>
          <Outlet />
        </Suspense>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t text-center py-3 text-sm text-gray-500">
        © {new Date().getFullYear()} — Built with 💙
      </footer>
    </div>
  );
};

export default Layout;
