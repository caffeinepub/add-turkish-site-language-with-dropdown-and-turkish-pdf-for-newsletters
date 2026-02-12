import { Language } from '../backend';

type TranslationKey =
  | 'header.title'
  | 'newsletter.viewButton'
  | 'newsletter.comingSoon'
  | 'newsletter.published'
  | 'newsletter.upcoming'
  | 'newsletter.download'
  | 'newsletter.pageIndicator'
  | 'newsletter1.title'
  | 'newsletter1.description'
  | 'newsletter2.title'
  | 'newsletter2.description'
  | 'newsletter3.title'
  | 'newsletter3.description'
  | 'newsletter4.title'
  | 'newsletter4.description';

type Translations = {
  [key in TranslationKey]: string;
};

const translations: Record<Language, Translations> = {
  [Language.english]: {
    'header.title': 'BrAIn Newsletters',
    'newsletter.viewButton': 'View Newsletter',
    'newsletter.comingSoon': 'Coming Soon',
    'newsletter.published': 'Published',
    'newsletter.upcoming': 'Upcoming',
    'newsletter.download': 'Download',
    'newsletter.pageIndicator': 'Page {current} of {total}',
    'newsletter1.title': 'Newsletter 1',
    'newsletter1.description': 'First edition of BrAIn Newsletter',
    'newsletter2.title': 'Newsletter 2',
    'newsletter2.description': 'Will be published in the 2nd 6 months of the project.',
    'newsletter3.title': 'Newsletter 3',
    'newsletter3.description': 'Will be published in the 3rd 6 months of the project.',
    'newsletter4.title': 'Newsletter 4',
    'newsletter4.description': 'Will be published at the end of the Project – September 2027.',
  },
  [Language.turkish]: {
    'header.title': 'BrAIn Bültenleri',
    'newsletter.viewButton': 'Bülteni Görüntüle',
    'newsletter.comingSoon': 'Yakında',
    'newsletter.published': 'Yayınlandı',
    'newsletter.upcoming': 'Yaklaşan',
    'newsletter.download': 'İndir',
    'newsletter.pageIndicator': 'Sayfa {current} / {total}',
    'newsletter1.title': 'Bülten 1',
    'newsletter1.description': 'BrAIn Bülteninin ilk sayısı',
    'newsletter2.title': 'Bülten 2',
    'newsletter2.description': 'Projenin 2. 6 ayında yayınlanacaktır.',
    'newsletter3.title': 'Bülten 3',
    'newsletter3.description': 'Projenin 3. 6 ayında yayınlanacaktır.',
    'newsletter4.title': 'Bülten 4',
    'newsletter4.description': 'Projenin sonunda yayınlanacaktır – Eylül 2027.',
  },
  [Language.danish]: {
    'header.title': 'BrAIn Newsletters',
    'newsletter.viewButton': 'View Newsletter',
    'newsletter.comingSoon': 'Coming Soon',
    'newsletter.published': 'Published',
    'newsletter.upcoming': 'Upcoming',
    'newsletter.download': 'Download',
    'newsletter.pageIndicator': 'Page {current} of {total}',
    'newsletter1.title': 'Newsletter 1',
    'newsletter1.description': 'First edition of BrAIn Newsletter',
    'newsletter2.title': 'Newsletter 2',
    'newsletter2.description': 'Will be published in the 2nd 6 months of the project.',
    'newsletter3.title': 'Newsletter 3',
    'newsletter3.description': 'Will be published in the 3rd 6 months of the project.',
    'newsletter4.title': 'Newsletter 4',
    'newsletter4.description': 'Will be published at the end of the Project – September 2027.',
  },
  [Language.bulgarian]: {
    'header.title': 'BrAIn Newsletters',
    'newsletter.viewButton': 'View Newsletter',
    'newsletter.comingSoon': 'Coming Soon',
    'newsletter.published': 'Published',
    'newsletter.upcoming': 'Upcoming',
    'newsletter.download': 'Download',
    'newsletter.pageIndicator': 'Page {current} of {total}',
    'newsletter1.title': 'Newsletter 1',
    'newsletter1.description': 'First edition of BrAIn Newsletter',
    'newsletter2.title': 'Newsletter 2',
    'newsletter2.description': 'Will be published in the 2nd 6 months of the project.',
    'newsletter3.title': 'Newsletter 3',
    'newsletter3.description': 'Will be published in the 3rd 6 months of the project.',
    'newsletter4.title': 'Newsletter 4',
    'newsletter4.description': 'Will be published at the end of the Project – September 2027.',
  },
  [Language.spanish]: {
    'header.title': 'BrAIn Newsletters',
    'newsletter.viewButton': 'View Newsletter',
    'newsletter.comingSoon': 'Coming Soon',
    'newsletter.published': 'Published',
    'newsletter.upcoming': 'Upcoming',
    'newsletter.download': 'Download',
    'newsletter.pageIndicator': 'Page {current} of {total}',
    'newsletter1.title': 'Newsletter 1',
    'newsletter1.description': 'First edition of BrAIn Newsletter',
    'newsletter2.title': 'Newsletter 2',
    'newsletter2.description': 'Will be published in the 2nd 6 months of the project.',
    'newsletter3.title': 'Newsletter 3',
    'newsletter3.description': 'Will be published in the 3rd 6 months of the project.',
    'newsletter4.title': 'Newsletter 4',
    'newsletter4.description': 'Will be published at the end of the Project – September 2027.',
  },
};

export function translate(
  key: TranslationKey,
  language: Language,
  params?: Record<string, string | number>
): string {
  let text = translations[language]?.[key] || translations[Language.english][key];

  if (params) {
    Object.entries(params).forEach(([paramKey, value]) => {
      text = text.replace(`{${paramKey}}`, String(value));
    });
  }

  return text;
}
