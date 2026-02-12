import { useNewsletters } from '../hooks/useQueries';
import { useLanguage } from '../contexts/LanguageContext';
import { translate } from '../i18n/translations';
import NewsletterCard from './NewsletterCard';
import { Skeleton } from './ui/skeleton';

export default function NewsletterGrid() {
  const { data: newsletters, isLoading } = useNewsletters();
  const { currentLanguage } = useLanguage();

  // Placeholder newsletters to always display
  const placeholderNewsletters = [
    {
      id: BigInt(1),
      title: translate('newsletter1.title', currentLanguage),
      description: translate('newsletter1.description', currentLanguage),
      status: 'published',
      publicationDate: 'December 2025',
      pdf: undefined,
    },
    {
      id: BigInt(2),
      title: translate('newsletter2.title', currentLanguage),
      description: translate('newsletter2.description', currentLanguage),
      status: 'upcoming',
      publicationDate: 'July 2026',
      pdf: undefined,
    },
    {
      id: BigInt(3),
      title: translate('newsletter3.title', currentLanguage),
      description: translate('newsletter3.description', currentLanguage),
      status: 'upcoming',
      publicationDate: 'January 2027',
      pdf: undefined,
    },
    {
      id: BigInt(4),
      title: translate('newsletter4.title', currentLanguage),
      description: translate('newsletter4.description', currentLanguage),
      status: 'upcoming',
      publicationDate: 'September 2027',
      pdf: undefined,
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in duration-300">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-80 rounded-lg" />
        ))}
      </div>
    );
  }

  // Always use placeholder newsletters for stable display
  const displayNewsletters = placeholderNewsletters;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in duration-500">
      {displayNewsletters.map((newsletter) => (
        <NewsletterCard key={newsletter.id.toString()} newsletter={newsletter} />
      ))}
    </div>
  );
}
