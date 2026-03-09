import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ProjectsSection from "@/components/ProjectsSection";
import SkillsSection from "@/components/SkillsSection";
import ExperienceSection from "@/components/ExperienceSection";
import ContactSection from "@/components/ContactSection";
import { useTranslation } from "react-i18next";
import { Menu, X, Languages, User, Award, GraduationCap, Sparkles, Mail, Home as HomeIcon } from "lucide-react";
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const elementListenersRef = useRef<Map<Element, { enter: () => void; leave: () => void }>>(new Map());

  // --- Scroll Focus Effect (Mobile Only) ---
  useEffect(() => {
    const isMobile = isMobileDevice();
    
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -20% 0px",
      threshold: 0.5,
    };

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Remove active from all first
          document.querySelectorAll(".focus-section").forEach(el => el.classList.remove("active"));
          
          // Add active only on mobile
          if (isMobile) {
            entry.target.classList.add("active");
          }
          setActiveSection(entry.target.id);
        } else {
          entry.target.classList.remove("active");
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);
    const sections = document.querySelectorAll(".focus-section");
    sections.forEach(section => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const navItems = [
    { href: "#hero", label: isRtl ? "الرئيسية" : "Home", icon: <HomeIcon className="w-6 h-6" /> },
    { href: "#about", label: t('nav.about'), icon: <User className="w-6 h-6" /> },
    { href: "#projects", label: t('nav.projects'), icon: <Sparkles className="w-6 h-6" /> },
    { href: "#skills", label: t('nav.skills'), icon: <Award className="w-6 h-6" /> },
    { href: "#experience", label: t('nav.experience'), icon: <GraduationCap className="w-6 h-6" /> },
    { href: "#contact", label: t('nav.contact'), icon: <Mail className="w-6 h-6" /> },
  ];

  const getIndicatorPosition = () => {
    const index = navItems.findIndex(item => item.href.substring(1) === activeSection);
    return index !== -1 ? index * 80 : 0;
  };

  return (
    <div className={`min-h-screen bg-background text-foreground ${isRtl ? 'rtl' : 'ltr'}`}>
      
      {/* --- Desktop Magic Navigation (Curve Outside Style) --- */}
      <div className="magic-nav-container">
        <div className="magic-navigation">
          <ul>
            {navItems.map((item, index) => (
              <li 
                key={item.href} 
                className={`list ${activeSection === item.href.substring(1) ? 'active' : ''}`}
              >
                <a href={item.href}>
                  <span className="text">{item.label}</span>
                  <span className="icon">{item.icon}</span>
                </a>
              </li>
            ))}
            <div 
              className="magic-indicator" 
              style={{ transform: `translateX(${getIndicatorPosition()}px)` }}
            ></div>
          </ul>
        </div>
      </div>

      {/* --- Language Switcher Floating Button --- */}
      <div className={`fixed bottom-8 ${isRtl ? 'left-8' : 'right-8'} z-[100] pointer-events-auto`}>
        <div 
          className={`flex items-center bg-background/95 backdrop-blur-xl border-primary/40 rounded-full shadow-2xl lang-switcher-expand overflow-hidden group lang-switcher-btn ${isLangExpanded ? 'max-w-[240px] px-5' : 'max-w-[70px] px-0'}`}
          style={{ height: '70px' }}
        >
          <button
            onClick={() => setIsLangExpanded(!isLangExpanded)}
            className="flex items-center justify-center min-w-[70px] h-full transition-all duration-500 group-hover:scale-110 pointer-events-auto"
            aria-label="Toggle Language Menu"
          >
            <Languages className={`w-7 h-7 text-primary transition-all duration-500 ${isLangExpanded ? 'rotate-180' : 'rotate-0'}`} />
          </button>
          
          <div className={`flex items-center lang-text-fade ${isLangExpanded ? 'opacity-100 translate-x-0 w-auto ml-3 mr-1' : 'opacity-0 translate-x-8 w-0 pointer-events-none'}`}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleLanguage();
                setIsLangExpanded(false);
              }}
              className="whitespace-nowrap font-bold text-lg text-foreground hover:text-primary transition-all duration-300 py-2 pointer-events-auto"
            >
              {currentLang === 'en' ? 'العربية' : 'English'}
            </button>
          </div>
        </div>
      </div>

      {/* --- Mobile Header & Menu --- */}
      <nav className="md:hidden fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50 h-16">
        <div className={`container flex items-center justify-between h-full ${isRtl ? 'flex-row-reverse' : ''}`}>
          <a href="#" className="font-bold text-xl gradient-text">AT</a>
          
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="w-10 h-10">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent 
              side={isRtl ? "left" : "right"} 
              className="curve-menu-content w-[280px] sm:w-[300px] border-none" 
              showCloseButton={false}
            >
              <div className="curve-navigation">
                <div className="px-6 mb-8">
                  <SheetTitle className="text-2xl font-bold text-white">
                    {isRtl ? 'القائمة' : 'Menu'}
                  </SheetTitle>
                </div>
                <ul>
                  {navItems.map((item, index) => (
                    <li 
                      key={item.href} 
                      className={`list ${activeSection === item.href.substring(1) ? 'active' : ''}`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <a href={item.href} onClick={() => setIsMenuOpen(false)}>
                        <span className="icon">{item.icon}</span>
                        <span className="title">{item.label}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>

      {/* --- Main Content --- */}
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
