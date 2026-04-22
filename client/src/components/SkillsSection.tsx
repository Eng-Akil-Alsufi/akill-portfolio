import { useEffect, useState } from "react";
import { Code2, Layout, Database, Terminal, Globe, Sparkles, Award, Zap, BrainCircuit, Library } from "lucide-react";
import { useTranslation } from "react-i18next";

interface Skill {
  name: string;
  level: {
    en: string;
    ar: string;
  };
  color: string;
}

interface PersonalData {
  skills: {
    ai_ml: Skill[];
    webDevelopment: Skill[];
    programmingLanguages: Skill[];
    databases: Skill[];
    libraries: Skill[];
    tools?: Skill[];
    frameworks?: Skill[];
  };
}

const categoryIcons: Record<string, any> = {
  "ai_ml": BrainCircuit,
  "webDevelopment": Globe,
  "programmingLanguages": Code2,
  "databases": Database,
  "libraries": Library,
  "tools": Terminal,
  "frameworks": Zap,
};

const categoryColors: Record<string, string> = {
  "ai_ml": "bg-cyan-500",
  "webDevelopment": "bg-green-500",
  "programmingLanguages": "bg-blue-500",
  "databases": "bg-orange-500",
  "libraries": "bg-purple-500",
  "tools": "bg-red-500",
  "frameworks": "bg-yellow-500",
};

const getLevelProgress = (level: string) => {
  const levels: Record<string, number> = {
    Advanced: 90,
    Intermediate: 70,
    Beginner: 45,
    "متقدم": 90,
    "متوسط": 70,
    "مبتدئ": 45,
    "Expert": 95,
    "خبير": 95
  };
  return levels[level] || 0;
};

export default function SkillsSection() {
  const { t, i18n } = useTranslation();
  const [data, setData] = useState<PersonalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [animated, setAnimated] = useState(false);

  const currentLang = (i18n.language.startsWith('ar') ? 'ar' : 'en') as 'en' | 'ar';
  const isRtl = currentLang === 'ar';

  useEffect(() => {
    fetch(import.meta.env.BASE_URL + "personal-data.json")
      .then((res) => res.json())
      .then((data: PersonalData) => {
        setData(data);
        setLoading(false);
        setTimeout(() => setAnimated(true), 500);
      })
      .catch((err) => {
        console.error("Error loading skills:", err);
        setLoading(false);
      });
  }, []);

  if (loading || !data) return null;

  const skillCategories = [
    { key: "ai_ml", title: isRtl ? "الذكاء الاصطناعي" : "AI & Machine Learning", skills: data.skills.ai_ml },
    { key: "webDevelopment", title: isRtl ? "تطوير الويب" : "Web Development", skills: data.skills.webDevelopment },
    { key: "programmingLanguages", title: isRtl ? "لغات البرمجة" : "Programming Languages", skills: data.skills.programmingLanguages },
    { key: "databases", title: isRtl ? "قواعد البيانات" : "Databases", skills: data.skills.databases },
    { key: "libraries", title: isRtl ? "المكتبات التقنية" : "Technical Libraries", skills: data.skills.libraries },
    ...(data.skills.tools ? [{ key: "tools", title: isRtl ? "أدوات التطوير" : "Development Tools", skills: data.skills.tools }] : []),
    ...(data.skills.frameworks ? [{ key: "frameworks", title: isRtl ? "الأطر والمكتبات" : "Frameworks & Libraries", skills: data.skills.frameworks }] : []),
  ];

  return (
    <section id="skills" className="py-20 bg-gradient-to-b from-card/20 to-background scroll-reveal focus-section">
      <div className="container">
        <div className={`text-center mb-16 animate-fade-in-up ${isRtl ? 'rtl' : 'ltr'}`}>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 pb-3 gradient-text animate-neon-glow leading-tight">{t('sections.skills')}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-max">
          {skillCategories.map((category, catIndex) => {
            const Icon = categoryIcons[category.key] || Code2;
            const colorClass = categoryColors[category.key] || "bg-primary";

            return (
              <div
                key={category.key}
                className="group animate-fade-in-up hover-lift-card"
                style={{ animationDelay: `${catIndex * 100}ms` }}
              >
                <div className={`h-full bg-card border border-border rounded-2xl p-6 transition-all duration-500 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-3 ${isRtl ? 'text-right' : 'text-left'} card-tilt group/card relative overflow-hidden`}>
                  <div className="absolute inset-0 shimmer-effect opacity-0 group-hover/card:opacity-100 transition-opacity duration-700"></div>
                  <div className={`flex items-center gap-3 mb-8 relative z-10 ${isRtl ? 'flex-row-reverse' : ''}`}>
                    <div className={`p-3 rounded-xl bg-primary/10 text-primary group-hover/card:bg-primary group-hover/card:text-white transition-all duration-500 group-hover/card:rotate-12 shadow-lg shadow-primary/5`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground group-hover/card:text-primary transition-colors duration-300">
                      {category.title}
                    </h3>
                  </div>

                  <div className="space-y-6 relative z-10">
                    {category.skills.map((skill, skillIndex) => {
                      const progress = getLevelProgress(skill.level?.en || "");
                      return (
                        <div key={skill.name} className="space-y-2 group/skill">
                          <div className={`flex justify-between text-sm font-medium ${isRtl ? 'flex-row-reverse' : ''}`}>
                            <span className="text-foreground group-hover/skill:text-primary transition-colors">{skill.name}</span>
                            <span className="text-muted-foreground">{skill.level?.[currentLang] || ""}</span>
                          </div>
                          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                            <div
                              className={`h-full ${colorClass} rounded-full transition-all duration-1000`}
                              style={{ 
                                width: animated ? `${progress}%` : '0%',
                                backgroundColor: skill.color
                              }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
