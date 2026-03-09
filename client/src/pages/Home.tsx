import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ProjectsSection from "@/components/ProjectsSection";
import SkillsSection from "@/components/SkillsSection";
import ExperienceSection from "@/components/ExperienceSection";
import ContactSection from "@/components/ContactSection";
import { useTranslation } from "react-i18next";
import { Menu, X, Languages, Home, FileText, Code2, Briefcase, Mail, User } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useRef } from "react";

// Detect if device is mobile
const isMobileDevice = () => {
  if (typeof window === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
};

export default function Home() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language.startsWith('ar');
  const currentLang = (i18n.language.startsWith('ar') ? 'ar' : 'en') as 'en' | 'ar';

  const toggleLanguage = () => {
    const newLang = currentLang === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
  };
  const [activeSection, setActiveSection] = useState("");
  const [isLangExpanded, setIsLangExpanded] = useState(false);
  const [hoveredElement, setHoveredElement] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState(0);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const elementListenersRef = useRef<Map<Element, { enter: () => void; leave: () => void }>>(new Map());

  // Smooth scroll with performance optimization
  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;
    let isScrolling = false;

    const handleScroll = () => {
      if (!isScrolling) {
        isScrolling = true;
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          isScrolling = false;
        }, 100);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll, true as any);
  }, []);

  useEffect(() => {
    const isMobile = isMobileDevice();
    const observerOptions = {
      root: null,
      rootMargin: "-10% 0px -10% 0px",
      threshold: [0, 0.1, 0.5],
    };

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
          // Only add active class if not currently hovered
          if (!hoveredElement) {
            // Remove active from others first to ensure only one is focused
            document.querySelectorAll(".focus-section.active").forEach(el => el.classList.remove("active"));
            entry.target.classList.add("active");
            // Add mobile-specific class for scroll focus effects
            if (isMobile) {
              entry.target.classList.add("mobile-scroll-focus");
            }
            setActiveSection(entry.target.id);
          }
        } else if (!entry.isIntersecting || entry.intersectionRatio < 0.2) {
          entry.target.classList.remove("active");
          if (isMobile) {
            entry.target.classList.remove("mobile-scroll-focus");
          }
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);
    
    const observeElements = () => {
      const elements = document.querySelectorAll(".scroll-reveal, .focus-section");
      elements.forEach((el) => {
        // Skip if already observed
        if (elementListenersRef.current.has(el)) {
          return;
        }

        observer.observe(el);
        
        // Create event handlers for this element
        const handleMouseEnter = () => {
          setHoveredElement(el.id);
          // Remove active from all focus-sections when hovering
          document.querySelectorAll(".focus-section.active").forEach((e) => {
            e.classList.remove("active");
          });
        };
        
        const handleMouseLeave = () => {
          setHoveredElement(null);
          // Restore active to the currently visible section based on scroll position
          if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
          }
          hoverTimeoutRef.current = setTimeout(() => {
            const visibleSections = document.querySelectorAll(".focus-section");
            visibleSections.forEach((section) => {
              const rect = (section as HTMLElement).getBoundingClientRect();
              if (rect.top < window.innerHeight * 0.9 && rect.bottom > window.innerHeight * 0.1) {
                section.classList.add("active");
              }
            });
          }, 100);
        };

        // Store listeners for cleanup
        elementListenersRef.current.set(el, { enter: handleMouseEnter, leave: handleMouseLeave });
        
        // Only add hover listeners on desktop
        if (!isMobile) {
          el.addEventListener("mouseenter", handleMouseEnter);
          el.addEventListener("mouseleave", handleMouseLeave);
        }
        
        // Mobile touch handling to prevent sticky hover
        const handleTouchStart = () => {
          if (isMobile) handleMouseEnter();
        };
        const handleTouchEnd = () => {
          // Small delay to allow click events but clear hover state
          if (isMobile) {
            setTimeout(handleMouseLeave, 150);
          }
        };
        
        el.addEventListener("touchstart", handleTouchStart, { passive: true });
        el.addEventListener("touchend", handleTouchEnd, { passive: true });
      });
    };

    observeElements();

    const mutationObserver = new MutationObserver(() => {
      observeElements();
    });

    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      // Clean up event listeners
      elementListenersRef.current.forEach((listeners, el) => {
        el.removeEventListener("mouseenter", listeners.enter);
        el.removeEventListener("mouseleave", listeners.leave);
      });
      elementListenersRef.current.clear();
    };
  }, [hoveredElement]);

  const navItems = [
    { href: "#about", label: t('nav.about'), icon: User, id: 'about' },
    { href: "#projects", label: t('nav.projects'), icon: Code2, id: 'projects' },
    { href: "#skills", label: t('nav.skills'), icon: FileText, id: 'skills' },
    { href: "#experience", label: t('nav.experience'), icon: Briefcase, id: 'experience' },
    { href: "#contact", label: t('nav.contact'), icon: Mail, id: 'contact' },
  ];

  return (
    <div className={`min-h-screen bg-background text-foreground ${isRtl ? 'rtl' : 'ltr'}`}>
      {/* Language Switcher Floating Button - Enhanced */}
      <div className={`fixed bottom-8 ${isRtl ? 'left-8' : 'right-8'} z-[100] pointer-events-auto`}>
        <div 
          className={`flex items-center bg-background/90 backdrop-blur-md border border-primary/40 rounded-full shadow-xl lang-switcher-expand overflow-hidden group hover:border-primary ${isLangExpanded ? 'max-w-[220px] px-4' : 'max-w-[60px] px-0'}`}
          style={{ height: '60px' }}
        >
          <button
            onClick={() => setIsLangExpanded(!isLangExpanded)}
            className="flex items-center justify-center min-w-[60px] h-full transition-transform duration-500 group-hover:scale-110 pointer-events-auto"
            aria-label="Toggle Language Menu"
          >
            <Languages className={`w-6 h-6 text-primary transition-transform duration-500 ${isLangExpanded ? 'rotate-180' : 'rotate-0'}`} />
          </button>
          
          <div className={`flex items-center lang-text-fade ${isLangExpanded ? 'opacity-100 translate-x-0 w-auto ml-2 mr-2' : 'opacity-0 translate-x-8 w-0 pointer-events-none'}`}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleLanguage();
                setIsLangExpanded(false);
              }}
              className="whitespace-nowrap font-bold text-base text-foreground hover:text-primary transition-colors py-2 pointer-events-auto"
            >
              {currentLang === 'en' ? 'العربية' : 'English'}
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Navigation - Curve Outside Magic Style */}
      <nav className="hidden md:block fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50 hover:border-border transition-all duration-300">
        <div className={`container flex items-center justify-between h-20 ${isRtl ? 'flex-row-reverse' : ''}`}>
          <a href="#" className="font-bold text-xl gradient-text hover:scale-110 transition-transform duration-300">
            AT
          </a>
          
          {/* Curve Outside Magic Navigation */}
          <div className="flex-1 flex justify-center">
            <div className="relative flex items-start gap-2 pt-2 px-6 py-2 bg-[#2B343B]/20 rounded-2xl backdrop-blur-sm">
              {navItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <a 
                    key={item.href}
                    href={item.href}
                    onClick={() => setActiveNavItem(index)}
                    className={`group relative flex flex-col items-center gap-1 px-4 py-3 rounded-xl transition-all duration-500 ${
                      isActive ? 'text-primary' : 'text-muted-foreground hover:text-primary'
                    }`}
                  >
                    {/* Indicator Circle - Top */}
                    <div className={`w-10 h-10 rounded-full border-2 border-primary/30 flex items-center justify-center transition-all duration-500 ${
                      isActive 
                        ? 'bg-primary/20 border-primary shadow-[0_0_20px_rgba(0,214,255,0.5)]' 
                        : 'group-hover:border-primary/60 group-hover:bg-primary/10'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    
                    {/* Text - Bottom */}
                    <span className={`text-xs font-medium whitespace-nowrap transition-all duration-500 ${
                      isActive ? 'opacity-100 scale-100' : 'opacity-60 group-hover:opacity-100 scale-95 group-hover:scale-100'
                    }`}>
                      {item.label}
                    </span>

                    {/* Animated Background */}
                    {isActive && (
                      <div className="absolute inset-0 -z-10 bg-primary/5 rounded-xl blur-xl animate-pulse"></div>
                    )}
                  </a>
                );
              })}
            </div>
          </div>

          <div></div>
        </div>
      </nav>

      {/* Mobile Menu - Curve Tab Style */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50 h-16 flex items-center justify-between px-4">
        <a href="#" className="font-bold text-lg gradient-text">
          AT
        </a>
        
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-foreground hover:bg-primary/10 hover:text-primary transition-all duration-300 hover:scale-110 relative w-10 h-10 flex items-center justify-center"
            >
              <div className="relative w-6 h-6 flex items-center justify-center">
                <Menu 
                  className={`w-6 h-6 transition-all duration-500 absolute ${
                    isMenuOpen 
                      ? 'opacity-0 rotate-90 scale-0' 
                      : 'opacity-100 rotate-0 scale-100'
                  }`} 
                />
                <X 
                  className={`w-6 h-6 transition-all duration-500 absolute ${
                    isMenuOpen 
                      ? 'opacity-100 rotate-0 scale-100' 
                      : 'opacity-0 -rotate-90 scale-0'
                  }`} 
                />
              </div>
            </Button>
          </SheetTrigger>
          <SheetContent 
            side={isRtl ? "left" : "right"} 
            className="bg-background/95 backdrop-blur-xl border-primary/10 w-[300px] sm:w-[400px] transition-all duration-500 ease-out p-0" 
            showCloseButton={false}
          >
            {/* Curve Tab Navigation Menu */}
            <div className="h-full flex flex-col">
              <div className={`flex items-center gap-4 p-6 border-b border-border/30 ${isRtl ? 'flex-row-reverse' : ''}`}>
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Menu className="w-6 h-6" />
                </div>
                <SheetTitle className={`text-2xl font-bold gradient-text ${isRtl ? 'text-right' : 'text-left'}`}>
                  {isRtl ? 'القائمة' : 'Menu'}
                </SheetTitle>
              </div>

              {/* Curve Tab Menu Items */}
              <nav className="flex-1 overflow-y-auto p-4">
                <ul className="space-y-2">
                  {navItems.map((item, index) => {
                    const Icon = item.icon;
                    const isActive = activeSection === item.id;
                    return (
                      <li key={item.href} className="relative">
                        <a 
                          href={item.href}
                          onClick={() => {
                            setActiveNavItem(index);
                            setIsMenuOpen(false);
                          }}
                          className={`group relative flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-500 ${
                            isActive 
                              ? 'bg-primary/20 text-primary' 
                              : 'text-muted-foreground hover:text-primary hover:bg-primary/10'
                          }`}
                        >
                          {/* Curve decoration - Top */}
                          {isActive && (
                            <div className="absolute -top-3 right-0 w-6 h-6 bg-background rounded-full shadow-lg"></div>
                          )}
                          
                          {/* Icon */}
                          <Icon className="w-5 h-5 flex-shrink-0" />
                          
                          {/* Label */}
                          <span className="font-medium text-sm flex-1">
                            {item.label}
                          </span>

                          {/* Curve decoration - Bottom */}
                          {isActive && (
                            <div className="absolute -bottom-3 right-0 w-6 h-6 bg-background rounded-full shadow-lg"></div>
                          )}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              {/* Footer */}
              <div className="border-t border-border/30 p-6">
                <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/20 to-transparent mb-4"></div>
                <p className="text-center text-xs text-muted-foreground">
                  © {new Date().getFullYear()} <span className="gradient-text font-bold">Akill Talal</span>
                </p>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <main className="pt-16 md:pt-20">
        <HeroSection />
        <AboutSection />
        <ProjectsSection />
        <SkillsSection />
        <ExperienceSection />
        <ContactSection />
      </main>
    </div>
  );
}
