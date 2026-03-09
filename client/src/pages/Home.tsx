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
  return window.innerWidth < 768;
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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(isMobileDevice());
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Intersection Observer for Scroll Focus (Mobile Only) and Navigation Sync
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -20% 0px",
      threshold: [0, 0.2, 0.5],
    };

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.4) {
          setActiveSection(entry.target.id);
          
          // Scroll focus effect only on mobile
          if (isMobileDevice()) {
            entry.target.classList.add("active");
          } else {
            entry.target.classList.remove("active");
          }
        } else {
          entry.target.classList.remove("active");
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);
    const sections = document.querySelectorAll(".focus-section");
    sections.forEach(section => observer.observe(section));

    return () => observer.disconnect();
  }, [isMobile]);

  const navItems = [
    { id: "hero", href: "#hero", label: isRtl ? "الرئيسية" : "Home", icon: HomeIcon },
    { id: "about", href: "#about", label: t('nav.about'), icon: User },
    { id: "projects", href: "#projects", label: t('nav.projects'), icon: Code },
    { id: "skills", href: "#skills", label: t('nav.skills'), icon: GraduationCap },
    { id: "experience", href: "#experience", label: t('nav.experience'), icon: Briefcase },
    { id: "contact", href: "#contact", label: t('nav.contact'), icon: Mail },
  ];

  const activeIndex = navItems.findIndex(item => item.id === activeSection);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={`min-h-screen bg-background text-foreground blur-fix ${isRtl ? 'rtl' : 'ltr'}`}>
      
      {/* LANGUAGE SWITCHER - Fixed, clear and smaller on mobile */}
      <div className="lang-btn-container">
        <button 
          onClick={toggleLanguage}
          className="lang-btn"
          aria-label="Toggle Language"
        >
          <div className="icon-box">
            <Languages className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <span className="px-2 font-bold text-sm md:text-base text-gray-800">
            {currentLang === 'en' ? 'العربية' : 'English'}
          </span>
        </button>
      </div>

      {/* DESKTOP NAVIGATION - Magic Curve Style (Top) */}
      {!isMobile && (
        <div className="magic-nav-container">
          <nav className="magic-nav">
            <ul>
              {navItems.map((item, index) => (
                <li key={item.id} className={activeSection === item.id ? 'active' : ''}>
                  <a href={item.href} onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(item.id);
                  }}>
                    <span className="text">{item.label}</span>
                    <span className="icon"><item.icon className="w-6 h-6" /></span>
                  </a>
                </li>
              ))}
              <div 
                className="indicator" 
                style={{ 
                  transform: `translateX(${activeIndex * 90}px)`,
                  left: '0'
                }}
              ></div>
            </ul>
          </nav>
        </div>
      )}

      {/* MOBILE NAVIGATION - Curve Sidebar Style (Right) */}
      {isMobile && (
        <nav className="mobile-nav-sidebar">
          <ul>
            {navItems.map((item) => (
              <li key={item.id} className={activeSection === item.id ? 'active' : ''}>
                <a href={item.href} onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(item.id);
                }}>
                  <span className="icon"><item.icon className="w-6 h-6" /></span>
                  <span className="title">{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {/* MAIN CONTENT */}
      <main className="relative pt-24 md:pt-32">
        <div id="hero" className="focus-section">
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

      <footer className="bg-card border-t border-border py-12">
        <div className="container text-center">
          <p className="text-muted-foreground">
            © {new Date().getFullYear()} {currentLang === 'ar' ? 'أكيل طلال محيوب عبده' : 'Akill Talal Mahyoub Abdo'}. {t('footer.rights')}
          </p>
        </div>
      </footer>
    </div>
  );
}
