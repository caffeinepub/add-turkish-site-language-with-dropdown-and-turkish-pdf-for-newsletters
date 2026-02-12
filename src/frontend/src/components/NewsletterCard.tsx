import { useState, useEffect } from 'react';
import { FileText, Calendar } from 'lucide-react';
import { Newsletter, Language } from '../backend';
import { useLanguage } from '../contexts/LanguageContext';
import { translate } from '../i18n/translations';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import PDFViewer from './PDFViewer';

interface NewsletterCardProps {
  newsletter: Newsletter;
}

export default function NewsletterCard({ newsletter }: NewsletterCardProps) {
  const [showViewer, setShowViewer] = useState(false);
  const { currentLanguage } = useLanguage();
  const isPublished = newsletter.status === 'published' || newsletter.id === BigInt(1);

  // Determine PDF URL based on language for Newsletter 1
  const getPdfUrl = () => {
    if (newsletter.id === BigInt(1)) {
      return currentLanguage === Language.turkish
        ? '/assets/BrAIn Newsletter 1 Turkish.pdf'
        : '/assets/BrAIn Newsletter 1 .pdf';
    }
    return '/assets/BrAIn Newsletter 1 .pdf';
  };

  const pdfUrl = getPdfUrl();

  const handleViewClick = () => {
    if (isPublished) {
      setShowViewer(true);
    }
  };

  const handleCloseViewer = () => {
    setShowViewer(false);
  };

  // Close and reopen viewer when language changes to reload PDF
  useEffect(() => {
    if (showViewer && newsletter.id === BigInt(1)) {
      setShowViewer(false);
      setTimeout(() => setShowViewer(true), 50);
    }
  }, [currentLanguage]);

  return (
    <>
      <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-[oklch(0.55_0.18_250)] flex flex-col">
        <CardHeader>
          <div className="flex items-start justify-between mb-2">
            <div className="p-3 rounded-lg bg-gradient-to-br from-[oklch(0.55_0.18_250)] to-[oklch(0.65_0.20_35)] text-white">
              <FileText className="h-6 w-6" />
            </div>
            <Badge variant={isPublished ? 'default' : 'secondary'}>
              {isPublished 
                ? translate('newsletter.published', currentLanguage)
                : translate('newsletter.upcoming', currentLanguage)
              }
            </Badge>
          </div>
          <CardTitle className="text-xl">{newsletter.title}</CardTitle>
          <CardDescription className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4" />
            {newsletter.publicationDate}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1">
          <p className="text-sm text-muted-foreground">{newsletter.description}</p>
        </CardContent>
        <CardFooter>
          {isPublished ? (
            <Button 
              onClick={handleViewClick}
              className="w-full bg-gradient-to-r from-[oklch(0.55_0.18_250)] to-[oklch(0.65_0.20_35)] hover:opacity-90"
            >
              {translate('newsletter.viewButton', currentLanguage)}
            </Button>
          ) : (
            <Button variant="outline" disabled className="w-full">
              {translate('newsletter.comingSoon', currentLanguage)}
            </Button>
          )}
        </CardFooter>
      </Card>

      {showViewer && isPublished && (
        <PDFViewer
          pdfUrl={pdfUrl}
          onClose={handleCloseViewer}
          title={newsletter.title}
          isOpen={showViewer}
        />
      )}
    </>
  );
}
