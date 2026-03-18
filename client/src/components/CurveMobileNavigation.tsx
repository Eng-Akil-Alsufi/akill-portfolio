import { useEffect, useState } from "react";
import { Home, User, Briefcase, Code, Mail } from "lucide-react";
import { useTranslation } from "react-i18next";
import styles from "./CurveMobileNavigation.module.css";

interface NavItem {
  id: number;
  href: string;
  label: string;
  icon: React.ReactNode;
}

export default function CurveMobileNavigation() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language.startsWith('ar');
  const [activeIndex, setActiveIndex] = useState(0);

  const navItems: NavItem[] = [
    { id: 0, href: "#", label: t('nav.home') || "Home", icon: <Home size={24} /> },
    { id: 1, href: "#about", label: t('nav.about') || "About", icon: <User size={24} /> },
    { id: 2, href: "#projects", label: t('nav.projects') || "Projects", icon: <Briefcase size={24} /> },
    { id: 3, href: "#skills", label: t('nav.skills') || "Skills", icon: <Code size={24} /> },
    { id: 4, href: "#contact", label: t('nav.contact') || "Contact", icon: <Mail size={24} /> },
  ];

  const handleNavClick = (index: number, href: string) => {
    setActiveIndex(index);
    
    if (href === "#") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        { id: "home", href: "#" },
        { id: "about", href: "#about" },
        { id: "projects", href: "#projects" },
        { id: "skills", href: "#skills" },
        { id: "contact", href: "#contact" },
      ];

      let currentIndex = 0;
      for (let i = sections.length - 1; i >= 0; i--) {
        if (sections[i].href === "#") {
          if (window.scrollY < 300) {
            currentIndex = 0;
            break;
          }
          continue;
        }
        const element = document.querySelector(sections[i].href);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= window.innerHeight / 3) {
            currentIndex = i;
            break;
          }
        }
      }
      setActiveIndex(currentIndex);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={`${styles.navigation} ${isRtl ? styles.rtl : ''}`}>
      <ul>
        {navItems.map((item, index) => (
          <li
            key={item.id}
            className={`${styles.list} ${activeIndex === index ? styles.active : ''}`}
            onClick={() => handleNavClick(index, item.href)}
          >
            <a href={item.href} onClick={(e) => e.preventDefault()}>
              <span className={styles.icon}>{item.icon}</span>
              <span className={styles.title}>{item.label}</span>
            </a>
          </li>
        ))}
        <div 
          className={styles.indicator} 
          style={{ 
            transform: `translateX(${activeIndex * 70}px)` 
          }}
        ></div>
      </ul>
    </div>
  );
}
