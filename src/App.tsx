/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { CatalogSection } from './components/CatalogSection';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { SocialShareModal } from './components/SocialShareModal';
import { AdminPortal } from './components/AdminPortal';
import { ProductEditModal } from './components/ProductEditModal';
import { SiteContentEditModal } from './components/SiteContentEditModal';
import { Footer } from './components/Footer';

function MainApp() {
  const { theme } = useStore();

  return (
    <div className={`min-h-screen ${theme === 'light' ? 'bg-zinc-100 text-zinc-900' : 'bg-zinc-950 text-zinc-100'} flex flex-col selection:bg-amber-400 selection:text-zinc-950 font-sans antialiased transition-colors duration-300`}>
      {/* Sticky Luxury Header Navigation */}
      <Navbar />

      {/* Main Storefront Flow */}
      <main className="flex-1">
        {/* Dynamic Hero Banner with Spotlight Kit */}
        <HeroBanner />

        {/* Core Products Catalogue with Filters (Team, Player, Style, Price, Stock) */}
        <CatalogSection />
      </main>

      {/* Modals & Interactive Portals */}
      <ProductDetailModal />
      <CartDrawer />
      <CheckoutModal />
      <OrderTrackerModal />
      <SocialShareModal />
      <AdminPortal />
      <ProductEditModal />
      <SiteContentEditModal />

      {/* Clean Athletic Store Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <MainApp />
    </StoreProvider>
  );
}
