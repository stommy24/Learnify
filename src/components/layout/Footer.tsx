import React from 'react';
import Link from 'next/link';

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-neutral-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-neutral-text-primary">Learnify</h3>
            <p className="mt-2 text-neutral-text-secondary">
              Making learning fun and accessible for everyone
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-neutral-text-primary">Resources</h4>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/courses" className="text-neutral-text-secondary hover:text-primary-main">
                  All Courses
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-neutral-text-secondary hover:text-primary-main">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-neutral-text-primary">Company</h4>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/about" className="text-neutral-text-secondary hover:text-primary-main">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-neutral-text-secondary hover:text-primary-main">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-neutral-text-primary">Legal</h4>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/privacy" className="text-neutral-text-secondary hover:text-primary-main">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-neutral-text-secondary hover:text-primary-main">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-neutral-border text-center text-neutral-text-secondary">
          <p>&copy; {new Date().getFullYear()} Learnify. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}; 
