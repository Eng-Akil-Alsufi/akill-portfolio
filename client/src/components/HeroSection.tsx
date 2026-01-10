import { Button } from "@/components/ui/button";
import { Github, Linkedin, Mail, Phone, MapPin, ArrowRight, Download, ChevronDown, Languages, Sparkles, Instagram } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface MultiLangString {
  en: string;
  ar: string;
}

interface PersonalData {
  personal: {
    name: MultiLangString;
    title: MultiLangString;
    location: MultiLangString;
    email: string;
    phone: string;
    whatsapp: string;
    bio: MultiLangString;
    profileImage: string;
  };
  social: {
    github: { url: string; username: string };
    instagram: { url: string; username: string };
    facebook: { url: string; username: string };
    linkedin: { url: string; username: string };
  };
}

export default function HeroSection() {
  const { t, i18n } = useTranslation();
  const [data, setData] = useState<PersonalData | null>(null);
  const [loading, setLoading] = useState(true);

  const currentLang = (i18n.language.startsWith('ar') ? 'ar' : 'en') as 'en' | 'ar';
  const isRtl = currentLang === 'ar';

  useEffect(() => {
    fetch(import.meta.env.BASE_URL + "personal-data.json")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading personal data:", err);
        setLoading(false);
      });
  }, []);

  const toggleLanguage = () => {
    const newLang = currentLang === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  if (loading || !data) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading portfolio...</p>
        </div>
      </section>
    );
  }

  const { personal, social } = data;

  const socialLinks = [
    { icon: Github, href: social.github.url, label: "GitHub", brand: "social-github" },
    { icon: Linkedin, href: social.linkedin.url, label: "LinkedIn", brand: "social-linkedin" },
    { icon: Instagram, href: social.instagram.url, label: "Instagram", brand: "social-instagram" },
    { icon: Mail, href: `mailto:${personal.email}`, label: "Email", brand: "social-email", color: "#EA4335" },
    { icon: Phone, href: `https://wa.me/${personal.whatsapp.replace(/\D/g, '')}`, label: "WhatsApp", brand: "social-whatsapp" },
  ];

  return (
    <section id="hero" className="relative min-h-[calc(100vh-64px)] flex items-center pt-8 md:pt-20 overflow-hidden bg-background scroll-reveal active">


      {/* Background decorative elements */}
      <div className="absolute top-1/4 -left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

      <div className="container relative z-10">
        <div className={`flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-20 ${isRtl ? 'lg:flex-row-reverse' : ''}`}>
          
          {/* Text Content */}
          <div className={`flex-1 text-center lg:text-left ${isRtl ? 'lg:text-right' : ''}`}>
            <div className={`inline-flex items-center gap-2 px-4 py-2 mt-8 md:mt-0 rounded-full bg-primary/20 border border-primary/40 text-white text-sm font-bold mb-6 animate-fade-in-up shadow-[0_0_20px_rgba(0,214,255,0.3)] animate-pulse-glow hover:shadow-[0_0_30px_rgba(0,214,255,0.5)] hover:border-primary/60 transition-all duration-300 cursor-pointer backdrop-blur-sm`}>
              <Sparkles className="w-4 h-4 animate-pulse" />
              {t('hero.available')}
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 pb-2 tracking-tight animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              <span className="gradient-text animate-neon-glow leading-[1.2]">{personal.name?.[currentLang] || "Akill Talal Mahyoub Abdo"}</span>
            </h1>

            <h2 className="text-xl md:text-2xl font-semibold text-primary mb-6 pb-1 animate-fade-in-up" style={{ animationDelay: '150ms' }}>
              {personal.title?.[currentLang] || "Software Engineer | Full-Stack Developer"}
            </h2>

            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl animate-fade-in-up leading-relaxed" style={{ animationDelay: '200ms' }}>
              {personal.bio?.[currentLang] || ""}
            </p>

            {/* Location with Tooltip */}
            <div className={`flex items-center gap-2 mb-8 animate-fade-in-up justify-center lg:justify-start ${isRtl ? 'lg:flex-row-reverse' : ''}`} style={{ animationDelay: '250ms' }}>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-2 cursor-help group">
                      <MapPin className="w-5 h-5 text-primary group-hover:text-primary group-hover:drop-shadow-[0_0_10px_rgba(0,214,255,0.8)] transition-all duration-300" />
                      <span className="text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all duration-300">
                        {personal.location?.[currentLang] || ""}
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="bg-card border-primary/20 text-foreground animate-fade-in">
                    <p>{isRtl ? 'متاح للعمل عن بعد' : 'Available for remote work'}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            {/* Social Icons with Brand Colors and Glow */}
            <div className={`flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-10 animate-fade-in-up ${isRtl ? 'lg:flex-row-reverse' : ''}`} style={{ animationDelay: '300ms' }}>
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group relative z-10 hover:z-50 p-3 rounded-xl bg-card border border-border transition-all duration-300 hover:scale-125 hover:rotate-6 ${social.brand} hover:border-current ${social.brand === 'social-email' ? 'social-email' : ''}`}
                  aria-label={social.label}
                >
                  <social.icon className="w-6 h-6 transition-transform duration-300" />
                  <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                    {social.label}
                  </span>
                </a>
              ))}
            </div>

            {/* Action Buttons */}
            <div className={`flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 animate-fade-in-up ${isRtl ? 'sm:flex-row-reverse' : ''}`} style={{ animationDelay: '400ms' }}>
              <Button 
                size="lg" 
                className="w-full sm:w-auto gap-2 rounded-xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 ripple-effect hover:scale-105 transition-transform"
                onClick={() => scrollToSection('contact')}
              >
                <Mail className="w-5 h-5" />
                {t('hero.cta_contact')}
                <ArrowRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
              </Button>
                <a href="Akil-CV.pdf" 
                  download="Akil-CV.pdf"
                  className="w-full sm:w-auto">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="w-full gap-2 rounded-xl border-primary/20 hover:border-primary/50 hover:bg-primary/5 ripple-effect hover:scale-105 transition-transform group/cv">
                    <Download className="w-5 h-5 group-hover/cv:animate-bounce" />
                    {t('hero.cta_cv')}
                  </Button>
                </a>
            </div>
          </div>

          {/* Hero Image */}
          <div className={`flex-1 flex justify-center ${isRtl ? 'lg:justify-start' : 'lg:justify-end'} animate-fade-in-up`} style={{ animationDelay: '200ms' }}>
            <div className="relative group profile-image">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary to-accent rounded-full opacity-20 blur-2xl group-hover:opacity-40 transition-opacity duration-500 animate-pulse"></div>
              <div className={`relative w-72 h-72 md:w-96 md:h-96 rounded-3xl border-4 border-primary/30 p-2 animate-float shadow-[0_0_30px_rgba(0,214,255,0.2)] group-hover:shadow-[0_0_50px_rgba(0,214,255,0.4)] group-hover:border-primary transition-all duration-500 overflow-hidden ${isRtl ? 'ml-auto' : 'mr-auto'}`}>
                <img
                  src={(personal.profileImage || "").startsWith('http') ? personal.profileImage : import.meta.env.BASE_URL + (personal.profileImage || "")}
                  alt={personal.name?.[currentLang] || ""}
                  className="w-full h-full object-cover rounded-2xl grayscale-[20%] group-hover:grayscale-0 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-primary/10 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 backdrop-blur-md transform translate-y-full group-hover:translate-y-0">
                  <div className="text-center p-6">
                    <h3 className="gradient-text font-bold text-3xl mb-2 drop-shadow-lg">{personal.name?.[currentLang] || ""}</h3>
                    <div className="w-12 h-1 bg-white/50 mx-auto mb-3 rounded-full"></div>
                    <p className="text-white/90 text-xl font-medium">{personal.title?.[currentLang] || ""}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div 
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce opacity-50 hover:opacity-100 transition-opacity cursor-pointer"
          onClick={() => scrollToSection('about')}
        >
          <span className="text-xs font-medium tracking-widest uppercase">{t('hero.scroll')}</span>
          <ChevronDown className="w-5 h-5" />
        </div>
      </div>
    </section>
  );
}
