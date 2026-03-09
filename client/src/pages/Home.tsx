import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ProjectsSection from "@/components/ProjectsSection";
import SkillsSection from "@/components/SkillsSection";
import ExperienceSection from "@/components/ExperienceSection";
import ContactSection from "@/components/ContactSection";
import { useTranslation } from "react-i18next";
import { Menu, X, Languages, User, Briefcase, Code, GraduationCap, Send } from "lucide-react";
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
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const elementListenersRef = useRef<Map<Element, { enter: () => void; leave: () => void }>>(new Map());

  // Using standard Lucide icons directly to avoid "undefined" component errors
  const navItems = [
    { href: "#about", label: t('nav.about'), id: "about", icon: <User className="w-6 h-6" /> },
    { href: "#projects", label: t('nav.projects'), id: "projects", icon: <Code className="w-6 h-6" /> },
    { href: "#skills", label: t('nav.skills'), id: "skills", icon: <Briefcase className="w-6 h-6" /> },
    { href: "#experience", label: t('nav.experience'), id: "experience", icon: <GraduationCap className="w-6 h-6" /> },
    { href: "#contact", label: t('nav.contact'), id: "contact", icon: <Send className="w-6 h-6" /> },
  ];

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
      rootMargin: isMobile ? "-25% 0px -25% 0px" : "-10% 0px -10% 0px",
      threshold: isMobile ? [0, 0.2, 0.5, 0.8] : [0, 0.1, 0.5],
    };

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
          if (!hoveredElement) {
            document.querySelectorAll(".focus-section.active").forEach(el => el.classList.remove("active"));
            entry.target.classList.add("active");
            if (isMobile) {
              entry.target.classList.add("mobile-scroll-focus");
              document.querySelectorAll(".focus-section").forEach(el => {
                if (el !== entry.target) el.classList.add("mobile-dimmed");
                else el.classList.remove("mobile-dimmed");
              });
            }
            setActiveSection(entry.target.id);
          }
        } else if (!entry.isIntersecting || entry.intersectionRatio < 0.2) {
          entry.target.classList.remove("active");
          if (isMobile) {
            entry.target.classList.remove("mobile-scroll-focus");
            entry.target.classList.remove("mobile-dimmed");
          }
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);
    
    const observeElements = () => {
      const elements = document.querySelectorAll(".scroll-reveal, .focus-section");
      elements.forEach((el) => {
        if (elementListenersRef.current.has(el)) return;

        observer.observe(el);
        
        const handleMouseEnter = () => {
          setHoveredElement(el.id);
          document.querySelectorAll(".focus-section.active").forEach((e) => {
            e.classList.remove("active");
          });
        };
        
        const handleMouseLeave = () => {
          setHoveredElement(null);
          if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
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

        elementListenersRef.current.set(el, { enter: handleMouseEnter, leave: handleMouseLeave });
        
        if (!isMobile) {
          el.addEventListener("mouseenter", handleMouseEnter);
          el.addEventListener("mouseleave", handleMouseLeave);
        }
        
        const handleTouchStart = () => { if (isMobile) handleMouseEnter(); };
        const handleTouchEnd = () => { if (isMobile) setTimeout(handleMouseLeave, 150); };
        
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
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
      elementListenersRef.current.forEach((listeners, el) => {
        el.removeEventListener("mouseenter", listeners.enter);
        el.removeEventListener("mouseleave", listeners.leave);
      });
      elementListenersRef.current.clear();
    };
  }, [hoveredElement]);

  const activeIndex = navItems.findIndex(item => item.id === activeSection);

  return (
    <div className={`min-h-screen bg-background text-foreground ${isRtl ? 'rtl' : 'ltr'}`}>
      {/* Language Switcher Floating Button - Enhanced Shadow & Prominence */}
      <div className={`fixed bottom-8 ${isRtl ? 'left-8' : 'right-8'} z-[100] pointer-events-auto`}>
        <div 
          className={`flex items-center bg-background/90 backdrop-blur-md border border-primary/40 rounded-full shadow-[0_15px_50px_rgba(0,0,0,0.6),0_0_25px_rgba(37,150,190,0.4)] lang-switcher-expand overflow-hidden group hover:border-primary hover:shadow-[0_0_40px_rgba(37,150,190,0.7)] ${isLangExpanded ? 'max-w-[240px] px-4' : 'max-w-[70px] px-0'}`}
          style={{ height: '70px' }}
        >
          <button
            onClick={() => setIsLangExpanded(!isLangExpanded)}
            className="flex items-center justify-center min-w-[70px] h-full transition-transform duration-500 group-hover:scale-110 pointer-events-auto"
            aria-label="Toggle Language Menu"
          >
            <Languages className={`w-8 h-8 text-primary transition-transform duration-500 ${isLangExpanded ? 'rotate-180' : 'rotate-0'}`} />
          </button>
          
          <div className={`flex items-center lang-text-fade ${isLangExpanded ? 'opacity-100 translate-x-0 w-auto ml-3 mr-3' : 'opacity-0 translate-x-8 w-0 pointer-events-none'}`}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleLanguage();
                setIsLangExpanded(false);
              }}
              className="whitespace-nowrap font-extrabold text-lg text-foreground hover:text-primary transition-colors py-2 pointer-events-auto"
            >
              {currentLang === 'en' ? 'العربية' : 'English'}
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Magic Navigation - Fixed at top with spacing */}
      <nav className="fixed top-8 left-0 right-0 z-50 hidden md:flex justify-center pointer-events-none">
        <div className="magic-nav-container pointer-events-auto">
          <div className="magic-navigation">
            <ul className="relative flex">
              {navItems.map((item, index) => (
                <li 
                  key={item.href} 
                  className={`magic-list ${activeSection === item.id ? 'active' : ''}`}
                >
                  <a href={item.href} className="flex flex-col items-center justify-center text-center">
                    {/* Reversed: Text on Top, Icon on Bottom */}
                    <span className="magic-text">{item.label}</span>
                    <span className="magic-icon">
                      {item.icon}
                    </span>
                  </a>
                </li>
              ))}
              <div 
                className="magic-indicator" 
                style={{ 
                  transform: `translateX(calc(80px * ${activeIndex >= 0 ? activeIndex : 0}))`,
                  opacity: activeIndex >= 0 ? 1 : 0
                }}
              ></div>
            </ul>
          </div>
        </div>
      </nav>

      {/* Mobile Curve Menu - Curve-Tab style */}
      <div className="md:hidden">
        <div className={`mobile-curve-nav-overlay ${isMenuOpen ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}></div>
        <div className={`mobile-curve-navigation ${isMenuOpen ? 'active' : ''}`}>
          <div className="mobile-menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </div>
          <ul className="mobile-ul">
            {navItems.map((item) => (
              <li 
                key={item.href} 
                className={`mobile-list ${activeSection === item.id ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <a href={item.href} className="flex items-center">
                  <span className="mobile-icon">{item.icon}</span>
                  <span className="mobile-title">{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <main className="pt-24 md:pt-32">
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
