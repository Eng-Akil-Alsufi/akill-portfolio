import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ProjectsSection from "@/components/ProjectsSection";
import SkillsSection from "@/components/SkillsSection";
import ExperienceSection from "@/components/ExperienceSection";
import ContactSection from "@/components/ContactSection";
import { useTranslation } from "react-i18next";
import { Languages, User, Briefcase, Code, GraduationCap, Mail, Home as HomeIcon } from "lucide-react";
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
  const [activeSection, setActiveSection] = useState("hero");
  const [isLangExpanded, setIsLangExpanded] = useState(false);
  const [hoveredElement, setHoveredElement] = useState<string | null>(null);
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
      rootMargin: "-20% 0px -20% 0px",
      threshold: [0, 0.1, 0.5],
    };

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.4) {
          if (!hoveredElement) {
            document.querySelectorAll(".focus-section.active").forEach(el => el.classList.remove("active"));
            entry.target.classList.add("active");
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
              if (rect.top < window.innerHeight * 0.8 && rect.bottom > window.innerHeight * 0.2) {
                section.classList.add("active");
                setActiveSection(section.id);
              }
            });
          }, 100);
        };

        elementListenersRef.current.set(el, { enter: handleMouseEnter, leave: handleMouseLeave });
        
        if (!isMobile) {
          el.addEventListener("mouseenter", handleMouseEnter);
          el.addEventListener("mouseleave", handleMouseLeave);
        }
      });
    };

    observeElements();
    const mutationObserver = new MutationObserver(() => observeElements());
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

  const navItems = [
    { id: "hero", href: "#hero", label: isRtl ? "الرئيسية" : "Home", icon: HomeIcon },
    { id: "about", href: "#about", label: t('nav.about'), icon: User },
    { id: "projects", href: "#projects", label: t('nav.projects'), icon: Code },
    { id: "skills", href: "#skills", label: t('nav.skills'), icon: GraduationCap },
    { id: "experience", href: "#experience", label: t('nav.experience'), icon: Briefcase },
    { id: "contact", href: "#contact", label: t('nav.contact'), icon: Mail },
  ];

  const activeIndex = navItems.findIndex(item => item.id === activeSection);

  return (
    <div className={`min-h-screen bg-background text-foreground ${isRtl ? 'rtl' : 'ltr'}`}>
      {/* Language Switcher Floating Button */}
      <div className={`fixed bottom-24 md:bottom-8 ${isRtl ? 'left-8' : 'right-8'} z-[100] pointer-events-auto`}>
        <div 
          className={`flex items-center bg-background/95 backdrop-blur-xl border-2 border-primary/50 rounded-full lang-switcher-expand overflow-hidden group shadow-[0_10px_40px_rgba(0,0,0,0.5),0_0_20px_rgba(0,214,255,0.2)] hover:border-primary hover:shadow-[0_15px_50px_rgba(0,0,0,0.6),0_0_30px_rgba(0,214,255,0.4)] transition-all duration-500 ${isLangExpanded ? 'max-w-[240px] px-4' : 'max-w-[65px] px-0'}`}
          style={{ height: '65px' }}
        >
          <button
            onClick={() => setIsLangExpanded(!isLangExpanded)}
            className="flex items-center justify-center min-w-[65px] h-full transition-all duration-500 group-hover:scale-110 pointer-events-auto bg-primary/10 group-hover:bg-primary/20"
            aria-label="Toggle Language Menu"
          >
            <Languages className={`w-7 h-7 text-primary transition-all duration-500 ${isLangExpanded ? 'rotate-180 scale-110' : 'rotate-0 scale-100'}`} />
          </button>
          
          <div className={`flex items-center lang-text-fade ${isLangExpanded ? 'opacity-100 translate-x-0 w-auto ml-3 mr-3' : 'opacity-0 translate-x-10 w-0 pointer-events-none'}`}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleLanguage();
                setIsLangExpanded(false);
              }}
              className="whitespace-nowrap font-black text-lg text-foreground hover:text-primary transition-all duration-300 py-2 px-4 rounded-xl hover:bg-primary/10 pointer-events-auto"
            >
              {currentLang === 'en' ? 'العربية' : 'English'}
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Magic Navigation Menu */}
      <nav className="hidden md:flex fixed top-0 left-1/2 -translate-x-1/2 z-50">
        <div className="magic-nav">
          <ul>
            {navItems.map((item, index) => (
              <li key={item.id} className={activeSection === item.id ? 'active' : ''}>
                <a href={item.href} onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
                }}>
                  <span className="text">{item.label}</span>
                  <span className="icon"><item.icon className="w-6 h-6" /></span>
                </a>
              </li>
            ))}
            <div 
              className="indicator" 
              style={{ 
                transform: `translateX(${activeIndex * 100}px)`,
                left: '0'
              }}
            ></div>
          </ul>
        </div>
      </nav>

      {/* Mobile Curve Tab Menu */}
      <nav className="md:hidden mobile-curve-nav">
        <ul>
          {navItems.map((item, index) => (
            <li key={item.id} className={activeSection === item.id ? 'active' : ''}>
              <a href={item.href} onClick={(e) => {
                e.preventDefault();
                document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
              }}>
                <span className="icon"><item.icon className="w-6 h-6" /></span>
                <span className="text">{item.label}</span>
              </a>
            </li>
          ))}
          <div 
            className="indicator" 
            style={{ 
              transform: `translateX(calc(100vw / ${navItems.length} * ${activeIndex} + (100vw / ${navItems.length} / 2) - 35px))`,
              left: '0'
            }}
          ></div>
        </ul>
      </nav>

      <main className="relative">
        <div id="hero" className="focus-section active">
          <HeroSection />
        </div>
        <div id="about" className="focus-section">
          <AboutSection />
        </div>
        <div id="projects" className="focus-section">
          <ProjectsSection />
        </div>
        <div id="skills" className="focus-section">
          <SkillsSection />
        </div>
        <div id="experience" className="focus-section">
          <ExperienceSection />
        </div>
        <div id="contact" className="focus-section">
          <ContactSection />
        </div>
      </main>

      <footer className="bg-card border-t border-border py-12 pb-32 md:pb-12">
        <div className="container text-center">
          <p className="text-muted-foreground">
            © {new Date().getFullYear()} {currentLang === 'ar' ? 'أكيل طلال محيوب عبده' : 'Akill Talal Mahyoub Abdo'}. {t('footer.rights')}
          </p>
        </div>
      </footer>
    </div>
  );
}
