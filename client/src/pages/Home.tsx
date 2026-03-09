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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMenuExpanded, setIsMenuExpanded] = useState(false);
  const elementListenersRef = useRef<Map<Element, { enter: () => void; leave: () => void }>>(new Map());

  useEffect(() => {
    const isMobile = isMobileDevice();
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -20% 0px",
      threshold: [0, 0.5],
    };

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.4) {
          document.querySelectorAll(".focus-section.active").forEach(el => el.classList.remove("active"));
          entry.target.classList.add("active");
          if (isMobile) {
            entry.target.classList.add("mobile-scroll-focus");
          }
          setActiveSection(entry.target.id);
        } else if (!entry.isIntersecting) {
          entry.target.classList.remove("active");
          if (isMobile) {
            entry.target.classList.remove("mobile-scroll-focus");
          }
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);
    const elements = document.querySelectorAll(".focus-section");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const navItems = [
    { href: "#about", label: t('nav.about'), icon: User, id: 'about' },
    { href: "#projects", label: t('nav.projects'), icon: Code2, id: 'projects' },
    { href: "#skills", label: t('nav.skills'), icon: FileText, id: 'skills' },
    { href: "#experience", label: t('nav.experience'), icon: Briefcase, id: 'experience' },
    { href: "#contact", label: t('nav.contact'), icon: Mail, id: 'contact' },
  ];

  return (
    <div className={`min-h-screen bg-background text-foreground ${isRtl ? 'rtl' : 'ltr'}`}>
      
      {/* Language Switcher Floating Button */}
      <button 
        onClick={toggleLanguage}
        className="lang-switcher-btn"
        aria-label="Toggle Language"
      >
        <Languages className="w-6 h-6" />
      </button>

      {/* Desktop Navigation - Curve Outside Magic (TOP POSITION) */}
      <nav className="hidden md:flex fixed top-0 left-0 right-0 z-50 justify-center pointer-events-none">
        <div className="magic-nav pointer-events-auto">
          <ul>
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <li key={item.href} className={`list ${isActive ? 'active' : ''}`}>
                  <a href={item.href} onClick={() => setActiveSection(item.id)}>
                    <span className="text">{item.label}</span>
                    <span className="icon">
                      <Icon className="w-6 h-6" />
                    </span>
                  </a>
                </li>
              );
            })}
            <div className="magic-indicator"></div>
          </ul>
        </div>
      </nav>

      {/* Mobile Menu - Curve Tab Style */}
      <div className="md:hidden">
        {/* Hamburger Button */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="fixed top-4 right-4 z-[1100] w-12 h-12 bg-[#2B343B] rounded-full flex items-center justify-center text-white border-2 border-primary shadow-lg"
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Navigation Container */}
        <div className={`mobile-nav-container ${isMenuOpen ? 'open' : ''}`} onClick={() => setIsMenuOpen(false)}>
          <div 
            className={`mobile-navigation ${isMenuExpanded ? 'expanded' : ''}`} 
            onClick={(e) => {
              e.stopPropagation();
              setIsMenuExpanded(!isMenuExpanded);
            }}
          >
            <ul>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <li key={item.href} className={`list ${isActive ? 'active' : ''}`}>
                    <a href={item.href} onClick={(e) => {
                      e.stopPropagation();
                      setActiveSection(item.id);
                      setIsMenuOpen(false);
                    }}>
                      <span className="icon">
                        <Icon className="w-6 h-6" />
                      </span>
                      <span className="title">{item.label}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
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
