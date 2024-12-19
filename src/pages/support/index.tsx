import { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { FAQSection } from '@/components/support/FAQSection';
import { ContactForm } from '@/components/support/ContactForm';
import { TutorialsList } from '@/components/support/TutorialsList';
import { DocumentationSearch } from '@/components/support/DocumentationSearch';

export default function Support() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <MainLayout>
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Help & Support</h1>

        <DocumentationSearch 
          query={searchQuery}
          onSearch={setSearchQuery}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <FAQSection />
          </div>
          <div>
            <ContactForm />
          </div>
        </div>

        <TutorialsList />
      </div>
    </MainLayout>
  );
} 