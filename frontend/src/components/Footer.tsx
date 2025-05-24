
import React from 'react';

const Footer = () => {
  return (
    <footer className="py-6 border-t border-border/40">
      <div className="container mx-auto px-4">
        <div className="flex justify-center">
          <div className="text-sm text-foreground/60">
            © {new Date().getFullYear()} Chloris
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
