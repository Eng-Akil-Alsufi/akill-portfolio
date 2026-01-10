import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { GraduationCap, Languages, Award, User, Calendar, MapPin } from "lucide-react";

interface MultiLangString {
  en: string;
  ar: string;
}

interface Education {
  degree: MultiLangString;
  university: MultiLangString;
  college: MultiLangString;
  graduationDate: string;
}

interface Language {
  name: MultiLangString;
  level: number;
  note: MultiLangString;
}

interface Certificate {
  title: MultiLangString;
  issuer: string;
  date: string;
  link: string;
}

interface PersonalData {
  personal: {
    aboutMe: MultiLangString;
  };
  education: Education[];
  languages: Language[];
  certificates: Certificate[];
}

export default function AboutSection() {
  const { t, i18n } = useTranslation();
  const [data, setData] = useState<PersonalData | null>(null);
  const currentLang = (i18n.language.startsWith('ar') ? 'ar' : 'en') as 'en' | 'ar';
  const isRtl = currentLang === 'ar';

  useEffect(() => {
    fetch(import.meta.env.BASE_URL + "personal-data.json")
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.error("Error loading about data:", err));
  }, []);

  if (!data) return null;

  return (
    <section id="about" className="py-20 bg-background relative overflow-hidden scroll-reveal focus-section">
      <div className="container relative z-10">
        <div className={`text-center mb-16 animate-fade-in-up ${isRtl ? 'rtl' : 'ltr'}`}>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 pb-3 gradient-text animate-neon-glow leading-tight">
            {t('about.title')}
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 auto-rows-max">
          {/* Introduction & Education */}
          <div className="space-y-8">
            {/* Introduction */}
            <div className="glass-effect p-8 rounded-3xl border border-primary/10 hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-3 animate-card-slide-left hover-lift-card card-tilt group relative overflow-hidden" style={{ animationDelay: '0ms' }}>
              <div className="absolute inset-0 shimmer-effect opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className={`flex items-center gap-3 mb-6 relative z-10 ${isRtl ? 'flex-row-reverse' : ''}`}>
                <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-12 shadow-lg shadow-primary/5">
                  <User className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">{t('about.intro')}</h3>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {data.personal.aboutMe?.[currentLang] || ""}
              </p>
            </div>

            {/* Education */}
            <div className="glass-effect p-8 rounded-3xl border border-primary/10 hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-3 animate-card-slide-right hover-lift-card card-tilt group relative overflow-hidden" style={{ animationDelay: '100ms' }}>
              <div className="absolute inset-0 shimmer-effect opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className={`flex items-center gap-3 mb-6 relative z-10 ${isRtl ? 'flex-row-reverse' : ''}`}>
                <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-12 shadow-lg shadow-primary/5">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">{t('about.education')}</h3>
              </div>
              <div className="space-y-6">
                {data.education.map((edu, index) => (
                  <div key={index} className={`border-l-2 border-primary/30 pl-6 relative ${isRtl ? 'border-l-0 border-r-2 pl-0 pr-6' : ''}`}>
                    <div className={`absolute top-0 -left-[9px] w-4 h-4 rounded-full bg-primary ${isRtl ? '-left-auto -right-[9px]' : ''}`}></div>
                    <h4 className="text-xl font-bold text-foreground">{edu.degree?.[currentLang] || ""}</h4>
                    <p className="text-primary font-medium mt-1">{edu.university?.[currentLang] || ""}</p>
                    <p className="text-muted-foreground text-sm">{edu.college?.[currentLang] || ""}</p>
                    <div className="flex items-center gap-2 mt-2 text-muted-foreground text-sm">
                      <Calendar className="w-4 h-4" />
                      <span>{t('about.graduation')}: {edu.graduationDate}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Languages & Certificates */}
          <div className="space-y-8">
            {/* Languages */}
            <div className="glass-effect p-8 rounded-3xl border border-primary/10 hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-3 animate-card-slide-left hover-lift-card card-tilt group relative overflow-hidden" style={{ animationDelay: '200ms' }}>
              <div className="absolute inset-0 shimmer-effect opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className={`flex items-center gap-3 mb-6 relative z-10 ${isRtl ? 'flex-row-reverse' : ''}`}>
                <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-12 shadow-lg shadow-primary/5">
                  <Languages className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">{t('about.languages')}</h3>
              </div>
              <div className="space-y-6">
                {data.languages.map((lang, index) => (
                  <div key={index} className="space-y-2">
                    <div className={`flex justify-between text-sm font-medium ${isRtl ? 'flex-row-reverse' : ''}`}>
                      <span className="text-foreground">{lang.name?.[currentLang] || ""}</span>
                      <span className="text-muted-foreground">{lang.note?.[currentLang] || ""}</span>
                    </div>
                    <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-1000"
                        style={{ width: `${lang.level}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Certificates - Dynamic Section */}
            <div className="glass-effect p-8 rounded-3xl border border-primary/10 hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-3 animate-card-slide-right hover-lift-card card-tilt group relative overflow-hidden" style={{ animationDelay: '300ms' }}>
              <div className="absolute inset-0 shimmer-effect opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className={`flex items-center gap-3 mb-6 relative z-10 ${isRtl ? 'flex-row-reverse' : ''}`}>
                <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-12 shadow-lg shadow-primary/5">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">{t('about.certificates')}</h3>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {data.certificates.map((cert, index) => (
                  <a 
                    key={index} 
                    href={cert.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group p-4 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 flex items-center justify-between"
                  >
                    <div className={`flex items-center gap-4 ${isRtl ? 'flex-row-reverse' : ''}`}>
                      <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                        <Award className="w-5 h-5 text-primary" />
                      </div>
                      <div className={isRtl ? 'text-right' : 'text-left'}>
                        <h4 className="font-bold text-foreground group-hover:text-primary transition-colors">{cert.title?.[currentLang] || ""}</h4>
                        <p className="text-xs text-muted-foreground">{cert.issuer} • {cert.date}</p>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
