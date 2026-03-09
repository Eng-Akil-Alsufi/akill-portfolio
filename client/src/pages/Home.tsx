import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ProjectsSection from "@/components/ProjectsSection";
import SkillsSection from "@/components/SkillsSection";
import ExperienceSection from "@/components/ExperienceSection";
import ContactSection from "@/components/ContactSection";
import { useTranslation } from "react-i18next";
import { Menu, X, Languages, Home as HomeIcon, FileText, Code2, Briefcase, Mail, User } from "lucide-react";
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
  const [activeSection, setActiveSection] = useState("about");
  const [isLangExpanded, setIsLangExpanded] = useState(false);
  const [hoveredElement, setHoveredElement] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const elementListenersRef = useRef<Map<Element, { enter: () => void; leave: () => void }>>(new Map());

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
            setActiveSection(entry.target.id);
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
          document.querySelectorAll(".focus-section.active").forEach((e) => e.classList.remove("active"));
        };
        
        const handleMouseLeave = () => {
          setHoveredElement(null);
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
      
      {/* Desktop Navigation - Curve Outside Magic Style */}
      <div className="desktop-nav-container">
        <div className="desktop-navigation">
          <ul>
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <li key={item.id} className={`list ${isActive ? 'active' : ''}`}>
                  <a href={item.href}>
                    <span className="icon"><Icon size={24} /></span>
                    <span className="text">{item.label}</span>
                  </a>
                </li>
              );
            })}
            <div className="indicator"></div>
          </ul>
        </div>
      </div>

      {/* Mobile Navigation - Curve Tab Style */}
      <div className="mobile-nav-container">
        <div className={`mobile-toggle`} onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </div>
        <div className={`mobile-navigation ${isMenuOpen ? 'open' : ''}`}>
          <ul>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <li key={item.id} className={`${isActive ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>
                  <a href={item.href}>
                    <span className="icon"><Icon size={24} /></span>
                    <span className="title">{item.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Language Switcher Floating Button */}
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

      <main className="relative">
        <section id="hero" className="focus-section active">
          <HeroSection />
        </section>
        <section id="about" className="focus-section scroll-reveal">
          <AboutSection />
        </section>
        <section id="projects" className="focus-section scroll-reveal">
          <ProjectsSection />
        </section>
        <section id="skills" className="focus-section scroll-reveal">
          <SkillsSection />
        </section>
        <section id="experience" className="focus-section scroll-reveal">
          <ExperienceSection />
        </section>
        <section id="contact" className="focus-section scroll-reveal">
          <ContactSection />
        </section>
      </main>

      <footer className="py-12 border-t border-border/50 bg-background/50 backdrop-blur-sm">
        <div className="container text-center text-muted-foreground">
          <p>© {new Date().getFullYear()} {t('hero.name')}. {t('footer.rights')}</p>
        </div>
      </footer>
    </div>
  );
}
