import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ProjectsSection from "@/components/ProjectsSection";
import SkillsSection from "@/components/SkillsSection";
import ExperienceSection from "@/components/ExperienceSection";
import ContactSection from "@/components/ContactSection";
import { useTranslation } from "react-i18next";
import { Menu, X, Languages, User, Award, GraduationCap, Sparkles, Mail } from "lucide-react";
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
    { href: "#about", label: t('nav.about') },
    { href: "#projects", label: t('nav.projects') },
    { href: "#skills", label: t('nav.skills') },
    { href: "#experience", label: t('nav.experience') },
    { href: "#contact", label: t('nav.contact') },
  ];

  const getNavIcon = (href: string) => {
    switch(href) {
      case '#about': return <User className="w-6 h-6" />;
      case '#projects': return <Sparkles className="w-6 h-6" />;
      case '#skills': return <Award className="w-6 h-6" />;
      case '#experience': return <GraduationCap className="w-6 h-6" />;
      case '#contact': return <Mail className="w-6 h-6" />;
      default: return null;
    }
  };

  return (
    <div className={`min-h-screen bg-background text-foreground ${isRtl ? 'rtl' : 'ltr'}`}>
      {/* Language Switcher Floating Button - Interactive & Professional */}
      <div className={`fixed bottom-8 ${isRtl ? 'left-8' : 'right-8'} z-[100] pointer-events-auto`}>
        <div 
          className={`flex items-center bg-background/95 backdrop-blur-xl border border-primary/40 rounded-full shadow-2xl lang-switcher-expand overflow-hidden group hover:border-primary hover:shadow-[0_0_30px_rgba(0,214,255,0.5)] transition-all duration-300 ${isLangExpanded ? 'max-w-[240px] px-5' : 'max-w-[70px] px-0'}`}
          style={{ height: '70px' }}
        >
          <button
            onClick={() => setIsLangExpanded(!isLangExpanded)}
            className="flex items-center justify-center min-w-[70px] h-full transition-all duration-500 group-hover:scale-125 pointer-events-auto hover:text-primary/80"
            aria-label="Toggle Language Menu"
          >
            <Languages className={`w-7 h-7 text-primary transition-all duration-500 drop-shadow-lg ${isLangExpanded ? 'rotate-180' : 'rotate-0'}`} />
          </button>
          
          <div className={`flex items-center lang-text-fade ${isLangExpanded ? 'opacity-100 translate-x-0 w-auto ml-3 mr-1' : 'opacity-0 translate-x-8 w-0 pointer-events-none'}`}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleLanguage();
                setIsLangExpanded(false);
              }}
              className="whitespace-nowrap font-bold text-lg text-foreground hover:text-primary transition-all duration-300 py-2 pointer-events-auto hover:scale-110"
            >
              {currentLang === 'en' ? 'العربية' : 'English'}
            </button>
          </div>
        </div>
      </div>

      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50 hover:border-border transition-all duration-300">
        <div className={`container flex items-center justify-between h-16 ${isRtl ? 'flex-row-reverse' : ''}`}>
          <a href="#" className="font-bold text-xl gradient-text hover:scale-110 transition-transform duration-300">
            AT
          </a>
          
          {/* Desktop Navigation - Curve Outside Magic Style */}
          <div className={`hidden md:flex gap-2 items-center justify-center curve-magic-nav`}>
            {navItems.map((item, index) => {
              const itemId = item.href.substring(1);
              const isActive = activeSection === itemId;
              return (
                <a 
                  key={item.href}
                  href={item.href}
                  data-index={index}
                  className={`curve-nav-item relative flex flex-col items-center justify-center w-20 h-20 transition-all duration-500 group`}
                >
                  {/* Icon Container */}
                  <div className={`flex items-center justify-center w-8 h-8 transition-all duration-500 ${
                    isActive ? 'scale-110 translate-y-0 text-primary' : 'scale-100 translate-y-1 text-muted-foreground group-hover:text-primary'
                  }`}>
                    {getNavIcon(item.href)}
                  </div>
                  
                  {/* Text Label - Top */}
                  <span className={`absolute top-1 text-xs font-bold transition-all duration-500 whitespace-nowrap ${
                    isActive 
                      ? 'opacity-100 scale-100 translate-y-0 text-primary' 
                      : 'opacity-0 scale-75 translate-y-3 text-muted-foreground group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0 group-hover:text-primary'
                  }`}>
                    {item.label}
                  </span>
                  
                  {/* Indicator Circle - Top with Curve Effect */}
                  {isActive && (
                    <>
                      <div className="absolute -top-5 w-14 h-14 rounded-full border-3 border-primary/40 animate-pulse"></div>
                      {/* Curve decorations */}
                      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-background rounded-full border-2 border-primary/50"></div>
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-background rounded-full border-2 border-primary/50"></div>
                    </>
                  )}
                </a>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
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
                className="bg-background/95 backdrop-blur-xl border-primary/10 w-[300px] sm:w-[400px] transition-all duration-500 ease-out curve-tab-menu" 
                showCloseButton={false}
              >
                <div className={`flex items-center gap-4 mb-8 ${isRtl ? 'flex-row-reverse' : ''}`}>
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <Menu className="w-6 h-6" />
                  </div>
                  <SheetTitle className={`text-2xl font-bold gradient-text ${isRtl ? 'text-right' : 'text-left'}`}>
                    {isRtl ? 'القائمة' : 'Menu'}
                  </SheetTitle>
                </div>
                <div className="flex flex-col gap-2 mt-4">
                  {navItems.map((item, index) => (
                    <a 
                      key={item.href}
                      href={item.href} 
                      onClick={() => setIsMenuOpen(false)}
                      className={`curve-tab-item group flex items-center justify-between p-4 rounded-2xl transition-all duration-500 animate-fade-in-up ${
                        activeSection === item.href.substring(1) ? 'bg-primary/10 text-primary' : 'hover:bg-primary/5'
                      }`}
                      style={{ animationDelay: `${(index + 1) * 100}ms` }}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`flex items-center justify-center w-8 h-8 transition-all duration-300 ${
                          activeSection === item.href.substring(1) ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'
                        }`}>
                          {getNavIcon(item.href)}
                        </div>
                        <span className="text-lg font-medium text-muted-foreground group-hover:text-primary transition-all duration-300">
                          {item.label}
                        </span>
                      </div>
                      <div className={`w-2 h-2 rounded-full bg-primary transition-all duration-300 shadow-[0_0_10px_rgba(0,214,255,0.8)] ${
                        activeSection === item.href.substring(1) ? 'opacity-100 scale-125' : 'opacity-0 group-hover:opacity-100'
                      }`}></div>
                    </a>
                  ))}
                </div>
                <div className="absolute bottom-10 left-0 right-0 px-8">
                  <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/20 to-transparent mb-8"></div>
                  <p className="text-center text-sm text-muted-foreground">
                    © {new Date().getFullYear()} <span className="gradient-text font-bold">Akill Talal</span>
                  </p>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      <main className="pt-16">
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
