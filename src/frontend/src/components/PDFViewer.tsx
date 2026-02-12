import { useState, useEffect, useRef } from 'react';
import { Download, ZoomIn, ZoomOut, Maximize, Minimize, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { translate } from '../i18n/translations';
import { Button } from './ui/button';
import { Dialog, DialogContent } from './ui/dialog';
import { Separator } from './ui/separator';

interface PDFViewerProps {
  pdfUrl: string;
  onClose: () => void;
  title: string;
  isOpen: boolean;
}

export default function PDFViewer({ pdfUrl, onClose, title, isOpen }: PDFViewerProps) {
  const [zoom, setZoom] = useState(85);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { currentLanguage } = useLanguage();
  const fullscreenContainerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Load PDF and detect total pages
  useEffect(() => {
    if (!isOpen || !pdfUrl) return;

    setIsLoading(true);
    
    // Use PDF.js to get page count
    const loadPDF = async () => {
      try {
        // Create a script to load PDF.js from CDN if not already loaded
        if (!(window as any).pdfjsLib) {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
          script.async = true;
          document.head.appendChild(script);
          
          await new Promise((resolve) => {
            script.onload = resolve;
          });
          
          // Set worker
          (window as any).pdfjsLib.GlobalWorkerOptions.workerSrc = 
            'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        }

        const pdfjsLib = (window as any).pdfjsLib;
        const loadingTask = pdfjsLib.getDocument(pdfUrl);
        const pdf = await loadingTask.promise;
        setTotalPages(pdf.numPages);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading PDF:', error);
        // Fallback: assume it's a multi-page document
        setTotalPages(10);
        setIsLoading(false);
      }
    };

    loadPDF();
  }, [pdfUrl, isOpen]);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `${title}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 25, 50));
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const toggleFullscreen = async () => {
    if (!fullscreenContainerRef.current) return;

    if (!isFullscreen) {
      const elem = fullscreenContainerRef.current;
      try {
        if (elem.requestFullscreen) {
          await elem.requestFullscreen();
        } else if ((elem as any).webkitRequestFullscreen) {
          await (elem as any).webkitRequestFullscreen();
        } else if ((elem as any).mozRequestFullScreen) {
          await (elem as any).mozRequestFullScreen();
        } else if ((elem as any).msRequestFullscreen) {
          await (elem as any).msRequestFullscreen();
        }
        setIsFullscreen(true);
      } catch (err) {
        console.error('Error entering fullscreen:', err);
      }
    } else {
      try {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          await (document as any).webkitExitFullscreen();
        } else if ((document as any).mozCancelFullScreen) {
          await (document as any).mozCancelFullScreen();
        } else if ((document as any).msExitFullscreen) {
          await (document as any).msExitFullscreen();
        }
        setIsFullscreen(false);
      } catch (err) {
        console.error('Error exiting fullscreen:', err);
      }
    }
  };

  // Listen for fullscreen changes (e.g., user pressing ESC)
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      );
      
      setIsFullscreen(isCurrentlyFullscreen);
    };

    if (isOpen) {
      document.addEventListener('fullscreenchange', handleFullscreenChange);
      document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.addEventListener('mozfullscreenchange', handleFullscreenChange);
      document.addEventListener('MSFullscreenChange', handleFullscreenChange);
    }

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, [isOpen]);

  // Reset state when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setZoom(85);
      setCurrentPage(1);
      setTotalPages(0);
      setIsLoading(true);
      
      // Exit fullscreen if active
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else if ((document as any).webkitFullscreenElement) {
        (document as any).webkitExitFullscreen();
      } else if ((document as any).mozFullScreenElement) {
        (document as any).mozCancelFullScreen();
      } else if ((document as any).msFullscreenElement) {
        (document as any).msExitFullscreen();
      }
    }
  }, [isOpen]);

  // Build PDF URL with parameters
  const getPDFUrl = () => {
    const zoomParam = zoom / 100;
    return `${pdfUrl}#page=${currentPage}&zoom=${zoomParam * 100}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className={`${
          isFullscreen 
            ? 'max-w-[100vw] w-[100vw] h-[100vh] m-0 rounded-none border-0' 
            : 'max-w-7xl w-[96vw] h-[92vh]'
        } p-0 gap-0 transition-all duration-500 ease-in-out flex flex-col [&>button]:hidden`}
      >
        <div 
          ref={fullscreenContainerRef}
          className={`${
            isFullscreen 
              ? 'fixed inset-0 z-[100] bg-background flex flex-col' 
              : 'flex flex-col h-full'
          }`}
        >
          {/* Header with title and close button */}
          <div className={`px-6 py-4 border-b flex items-center justify-between flex-shrink-0 transition-all duration-300 ${
            isFullscreen ? 'bg-background/95 backdrop-blur-sm' : ''
          }`}>
            <h2 className="text-xl font-semibold">{title}</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 rounded-full"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Toolbar */}
          <div className={`flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-3 bg-muted/30 border-b flex-shrink-0 transition-all duration-300 ${
            isFullscreen ? 'bg-background/95 backdrop-blur-sm' : ''
          }`}>
            {/* Page Navigation */}
            {totalPages > 0 && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1 || isLoading}
                  className="h-9"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium min-w-[100px] text-center">
                  {translate('newsletter.pageIndicator', currentLanguage, {
                    current: currentPage,
                    total: totalPages,
                  })}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages || isLoading}
                  className="h-9"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Controls */}
            <div className="flex items-center gap-2 flex-wrap justify-center">
              {/* Zoom Controls */}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleZoomOut} 
                disabled={zoom <= 50}
                className="h-9"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium min-w-[60px] text-center">{zoom}%</span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleZoomIn} 
                disabled={zoom >= 200}
                className="h-9"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              
              <Separator orientation="vertical" className="h-6 mx-2 hidden sm:block" />
              
              {/* Fullscreen */}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={toggleFullscreen}
                className="h-9"
              >
                {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
              </Button>
              
              {/* Download */}
              <Button 
                variant="default" 
                size="sm" 
                onClick={handleDownload}
                className="bg-gradient-to-r from-[oklch(0.55_0.18_250)] to-[oklch(0.65_0.20_35)] h-9"
              >
                <Download className="h-4 w-4 mr-2" />
                {translate('newsletter.download', currentLanguage)}
              </Button>
            </div>
          </div>

          {/* PDF Viewer */}
          <div className={`flex-1 overflow-hidden bg-muted/20 flex items-center justify-center transition-all duration-300 ${
            isFullscreen ? 'p-2 sm:p-4 bg-background' : 'p-4 sm:p-6'
          }`}>
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[oklch(0.55_0.18_250)]"></div>
              </div>
            ) : (
              <div 
                className={`bg-white shadow-2xl transition-all duration-300 ease-in-out rounded-lg overflow-hidden ${
                  isFullscreen ? 'w-full h-full' : 'w-full h-full'
                }`}
              >
                <iframe
                  ref={iframeRef}
                  key={`${currentPage}-${zoom}`}
                  src={getPDFUrl()}
                  className="w-full h-full border-0"
                  title={title}
                  style={{
                    display: 'block',
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
