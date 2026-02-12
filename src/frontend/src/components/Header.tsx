import { Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Language } from '../backend';
import { translate } from '../i18n/translations';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Button } from './ui/button';

const languageNames: Record<Language, string> = {
  [Language.english]: 'English',
  [Language.turkish]: 'Türkçe',
  [Language.danish]: 'Dansk',
  [Language.bulgarian]: 'Български',
  [Language.spanish]: 'Español',
};

const availableLanguages = [Language.english, Language.turkish];

export default function Header() {
  const { currentLanguage, setLanguage } = useLanguage();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a
              href="https://www.projectbrain.eu"
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer transition-opacity hover:opacity-80"
              aria-label="Visit BrAIn Project website"
            >
              <img 
                src="/assets/9.png" 
                alt="BrAIn Logo" 
                className="h-12 w-12 md:h-16 md:w-16 object-contain"
              />
            </a>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[oklch(0.55_0.18_250)] to-[oklch(0.65_0.20_35)] bg-clip-text text-transparent">
              {translate('header.title', currentLanguage)}
            </h1>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="default" className="gap-2">
                <Globe className="h-4 w-4" />
                <span>{languageNames[currentLanguage]}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              {availableLanguages.map((lang) => (
                <DropdownMenuItem
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={currentLanguage === lang ? 'bg-accent' : ''}
                >
                  {languageNames[lang]}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
