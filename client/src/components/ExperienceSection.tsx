import { useEffect, useState } from "react";
import { Briefcase, BookOpen, Award, CheckCircle2, Calendar, Sparkles , Zap } from "lucide-react";
import { useTranslation } from "react-i18next";

interface MultiLangString {
  en: string;
  ar: string;
}

interface PersonalData {
  education: {
    degree: MultiLangString;
    university: MultiLangString;
    expectedGraduation: string;
    relevantCoursework: MultiLangString[];
  };
  experience: Array<{
    id: number;
    title: MultiLangString;
    company: MultiLangString;
    duration: MultiLangString | string;
    description: MultiLangString;
    highlights: MultiLangString[];
  }>;
}

export default function ExperienceSection() {
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
        console.error("Error loading experience data:", err);
        setLoading(false);
      });
  }, []);

  if (loading || !data) {
    return (
      <section className="py-20 bg-background">
        <div className="container">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">{isRtl ? "جاري تحميل الخبرات..." : "Loading experience..."}</p>
          </div>
        </div>
      </section>
    );
  }

  const { education, experience } = data;

  return (
    <section id="experience" className="py-20 bg-gradient-to-b from-background to-card/20 overflow-hidden scroll-reveal focus-section">
      <div className="container">
        <div className={`text-center mb-20 animate-fade-in-up ${isRtl ? 'rtl' : 'ltr'}`}>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 pb-3 gradient-text animate-neon-glow leading-tight">{t('sections.experience')}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            {isRtl ? "مسيرتي المهنية وخلفيتي الأكاديمية" : "My professional journey and academic background"}
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className={`absolute ${isRtl ? 'right-1/2 transform translate-x-1/2' : 'left-1/2 transform -translate-x-1/2'} h-full w-0.5 bg-gradient-to-b from-primary via-accent to-primary/20 hidden md:block animate-drawline`}></div>

          <div className="space-y-12">
            {experience.map((exp, index) => (
              <div
                key={exp.id}
                className={`relative flex items-center justify-between md:justify-normal gap-8 group ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                } animate-fade-in-up`}
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className={`absolute ${isRtl ? 'right-1/2 transform translate-x-1/2' : 'left-1/2 transform -translate-x-1/2'} w-4 h-4 rounded-full bg-primary border-4 border-background z-10 hidden md:block group-hover:scale-150 group-hover:shadow-[0_0_15px_rgba(0,214,255,0.8)] transition-all duration-300`}></div>

                <div className={`w-full md:w-[45%] bg-card border border-border rounded-2xl p-6 transition-all duration-500 hover:border-primary/50 hover:bg-background/50 hover:shadow-xl hover:shadow-primary/5 group-hover:-translate-y-2 ${
                  index % 2 === 0 ? 'animate-card-slide-left' : 'animate-card-slide-right'
                } ${isRtl ? 'text-right' : 'text-left'} hover-lift-card card-tilt group/card relative overflow-hidden`}>
                  <div className="absolute inset-0 shimmer-effect opacity-0 group-hover/card:opacity-100 transition-opacity duration-700"></div>
                  <div className="relative z-10">
                    <div className={`flex items-center gap-2 mb-2 text-primary font-bold ${isRtl ? 'flex-row-reverse' : ''}`}>
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm group-hover:text-accent transition-colors">
                        {typeof exp.duration === 'string' ? exp.duration : exp.duration?.[currentLang] || ""}
                      </span>
                    </div>
                    <h4 className="text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                      {exp.title?.[currentLang] || ""}
                    </h4>
                    <p className="text-accent font-semibold mb-4">{exp.company?.[currentLang] || ""}</p>
                    <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                      {exp.description?.[currentLang] || ""}
                    </p>
                    <div className="space-y-2">
                      {exp.highlights.map((highlight, hIndex) => (
                        <div
                          key={hIndex}
                          className={`flex gap-2 items-start text-xs text-muted-foreground ${isRtl ? 'flex-row-reverse' : ''}`}
                        >
                          <CheckCircle2 className="w-3 h-3 text-primary flex-shrink-0 mt-0.5" />
                          <span>{highlight?.[currentLang] || ""}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div
              className={`relative flex items-center justify-between md:justify-normal gap-8 group md:flex-row-reverse animate-fade-in-up`}
              style={{ animationDelay: `${experience.length * 200}ms` }}
            >
              <div className={`absolute ${isRtl ? 'right-1/2 transform translate-x-1/2' : 'left-1/2 transform -translate-x-1/2'} w-4 h-4 rounded-full bg-accent border-4 border-background z-10 hidden md:block group-hover:scale-150 group-hover:shadow-[0_0_15px_rgba(0,214,255,0.8)] transition-all duration-300`}></div>

              <div className={`w-full md:w-[45%] bg-card border border-border rounded-2xl p-6 transition-all duration-500 hover:border-accent/50 hover:bg-background/50 hover:shadow-xl hover:shadow-accent/5 group-hover:-translate-y-2 animate-card-slide-right ${isRtl ? 'text-right' : 'text-left'} hover-lift-card card-tilt group/card relative overflow-hidden`}>
                <div className="absolute inset-0 shimmer-effect opacity-0 group-hover/card:opacity-100 transition-opacity duration-700"></div>
                <div className="relative z-10">
                  <div className={`flex items-center gap-2 mb-2 text-accent font-bold ${isRtl ? 'flex-row-reverse' : ''}`}>
                    <BookOpen className="w-4 h-4" />
                    <span className="text-sm">{education.expectedGraduation}</span>
                  </div>
                  <h4 className="text-xl font-bold text-foreground mb-1 group-hover:text-accent transition-colors">
                    {education.degree?.[currentLang] || ""}
                  </h4>
                  <p className="text-primary font-semibold mb-4">{education.university?.[currentLang] || ""}</p>
                  <div className={`flex flex-wrap gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
                    {education.relevantCoursework?.map((course, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-accent/10 text-accent rounded-full text-xs font-medium hover:bg-accent/20 transition-all"
                      >
                        {course?.[currentLang] || ""}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 max-w-4xl mx-auto animate-fade-in-up" style={{ animationDelay: '1s' }}>
          <div className="bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5 border border-primary/20 rounded-3xl p-8 relative overflow-hidden group hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-3 hover-lift-card card-tilt">
            <div className="absolute inset-0 shimmer-effect opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
            <div className="relative z-10">
              <h4 className={`text-2xl font-bold text-foreground mb-6 flex items-center gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
                <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-12">
                  <Zap className="w-6 h-6 animate-pulse"/>
                </div>
                {isRtl ? "أبرز الإنجازات" : "Key Achievements"}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { en: "Led a team of 6 developers in building an intelligent traffic management system", ar: "قيادة فريق من 6 مطورين لبناء نظام ذكي لإدارة المرور" },
                  { en: "Designed and implemented 16+ diverse projects using multiple technologies", ar: "تصميم وتنفيذ أكثر من 16 مشروعاً متنوعاً باستخدام تقنيات متعددة" },
                  { en: "Proficient in Agile/Scrum methodologies and project management tools", ar: "إتقان منهجيات Agile/Scrum وأدوات إدارة المشاريع" },
                  { en: "Consistently delivering high-quality code with modern best practices", ar: "تقديم كود عالي الجودة باستمرار مع أفضل الممارسات الحديثة" }
                ].map((achievement, i) => (
                  <div key={i} className={`flex gap-3 items-start group/item ${isRtl ? 'flex-row-reverse' : ''}`}>
                    <div className="p-1 rounded-full bg-primary/20 text-primary group-hover/item:bg-primary group-hover/item:text-white transition-all transform group-hover/item:scale-110 group-hover/item:rotate-12">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <span className="text-muted-foreground group-hover/item:text-foreground transition-colors leading-relaxed">
                      {achievement?.[currentLang as keyof typeof achievement] || ""}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
