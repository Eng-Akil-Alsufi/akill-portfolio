import { useEffect, useState, useRef } from "react";
import { Home, User, Briefcase, Code, Mail } from "lucide-react";
import { useTranslation } from "react-i18next";
import styles from "./CurveNavigation.module.css";

interface NavItem {
  id: number;
  href: string;
  label: string;
  icon: React.ReactNode;
}

export default function CurveNavigation() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language.startsWith('ar');
  const [activeIndex, setActiveIndex] = useState(0);
  const [indicatorX, setIndicatorX] = useState(0);
  const listRef = useRef<HTMLUListElement>(null);

  const navItems: NavItem[] = [
    { id: 1, href: "#", label: t('nav.home') || "Home", icon: <Home size={24} /> },
    { id: 2, href: "#about", label: t('nav.about') || "About", icon: <User size={24} /> },
    { id: 3, href: "#projects", label: t('nav.projects') || "Projects", icon: <Briefcase size={24} /> },
    { id: 4, href: "#skills", label: t('nav.skills') || "Skills", icon: <Code size={24} /> },
    { id: 5, href: "#contact", label: t('nav.contact') || "Contact", icon: <Mail size={24} /> },
  ];

  const handleNavClick = (index: number, href: string) => {
    setActiveIndex(index);
    setIndicatorX(isRtl ? -index * 72 : index * 72);
    
    if (href !== "#") {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        { id: "about", href: "#about" },
        { id: "projects", href: "#projects" },
        { id: "skills", href: "#skills" },
        { id: "contact", href: "#contact" },
      ];

      let currentIndex = 0;
      for (let i = sections.length - 1; i >= 0; i--) {
        const element = document.querySelector(sections[i].href);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= window.innerHeight / 2) {
            currentIndex = i + 1;
            break;
          }
        }
      }

      setActiveIndex(currentIndex);
      setIndicatorX(isRtl ? -currentIndex * 72 : currentIndex * 72);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isRtl]);

  return (
    <div className={styles.navigationContainer}>
      <div className={styles.navigationWrapper}>
        <div className={styles.navigationBox}>
          <ul 
            ref={listRef}
            className={`${styles.navigationList} ${isRtl ? styles.rtl : ''}`}
          >
            {navItems.map((item, index) => (
              <li
                key={item.id}
                className={styles.navigationItem}
              >
                <a
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(index, item.href);
                  }}
                  className={`${styles.navigationLink} ${activeIndex === index ? styles.active : ''}`}
                >
                  {/* Icon Container */}
                  <div className={styles.iconContainer}>
                    <div className={styles.iconWrapper}>
                      {item.icon}
                    </div>
                  </div>

                  {/* Text Label */}
                  <span className={styles.textLabel}>
                    {item.label}
                  </span>
                </a>
              </li>
            ))}

            {/* Indicator Circle - Curved Background */}
            <div
              className={styles.indicator}
              style={{
                transform: `translateX(${indicatorX}px)`,
              }}
            />
          </ul>
        </div>
      </div>
    </div>
  );
}
