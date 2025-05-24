
import React from 'react';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <main>
        <Hero />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
