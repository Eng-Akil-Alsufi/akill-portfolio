import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ProjectsSection from "@/components/ProjectsSection";
import SkillsSection from "@/components/SkillsSection";
import ExperienceSection from "@/components/ExperienceSection";
import ContactSection from "@/components/ContactSection";
import CurveNavigation from "@/components/CurveNavigation";
import CurveMobileNavigation from "@/components/CurveMobileNavigation";
import { useTranslation } from "react-i18next";
import { Menu, X, Languages } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useRef } from "react";

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
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-10% 0px -10% 0px",
      threshold: [0, 0.1, 0.5],
    };

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          if (entry.target.classList.contains("focus-section") && entry.intersectionRatio > 0.4) {
            setActiveSection(entry.target.id);
          }
        } else {
          if (entry.target.classList.contains("focus-section")) {
            entry.target.classList.remove("active");
          }
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);
    
    const observeElements = () => {
      const elements = document.querySelectorAll(".scroll-reveal, .focus-section");
      elements.forEach((el) => observer.observe(el));
    };

    observeElements();

    const mutationObserver = new MutationObserver(() => {
      observeElements();
    });

    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  const navItems = [
    { href: "#about", label: t('nav.about') },
    { href: "#projects", label: t('nav.projects') },
    { href: "#skills", label: t('nav.skills') },
    { href: "#experience", label: t('nav.experience') },
    { href: "#contact", label: t('nav.contact') },
  ];

  return (
    <div className={`min-h-screen bg-background text-foreground ${isRtl ? 'rtl' : 'ltr'}`}>
      {/* Curve Navigation - Desktop Only */}
      <CurveNavigation />

      {/* Curve Mobile Navigation - Mobile Only */}
      <CurveMobileNavigation />

      {/* Language Switcher Floating Button - Interactive & Professional */}
      <div className={`fixed bottom-8 ${isRtl ? 'left-8' : 'right-8'} z-[100]`}>
        <div 
          className={`flex items-center bg-background/90 backdrop-blur-md border border-primary/30 rounded-full shadow-xl lang-switcher-expand overflow-hidden group hover:border-primary hover:shadow-[0_0_20px_rgba(0,214,255,0.4)] ${isLangExpanded ? 'max-w-[220px] px-4' : 'max-w-[60px] px-0'}`}
          style={{ height: '60px' }}
        >
          <button
            onClick={() => setIsLangExpanded(!isLangExpanded)}
            className="flex items-center justify-center min-w-[60px] h-full transition-transform duration-500 group-hover:scale-110"
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
              className="whitespace-nowrap font-bold text-base text-foreground hover:text-primary transition-colors py-2"
            >
              {currentLang === 'en' ? 'العربية' : 'English'}
            </button>
          </div>
        </div>
      </div>

      {/* Top Navbar for Logo - Visible on Mobile only */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50 md:hidden">
        <div className={`container flex items-center justify-between h-16 ${isRtl ? 'flex-row-reverse' : ''}`}>
          <a href="#" className="font-bold text-xl gradient-text hover:scale-110 transition-transform duration-300">
            AT
          </a>
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
