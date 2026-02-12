import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Header from './components/Header';
import NewsletterGrid from './components/NewsletterGrid';
import Footer from './components/Footer';
import { LanguageProvider } from './contexts/LanguageContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function AppContent() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-accent/5 animate-in fade-in duration-500">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <NewsletterGrid />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </QueryClientProvider>
  );
}
