import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Brain, Network, GraduationCap, Languages, Award, CheckCircle2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface MultiLangString {
  en: string;
  ar: string;
}

interface PersonalData {
  education: {
    degree: MultiLangString;
    university: MultiLangString;
    college: MultiLangString;
    graduationDate: string;
  };
  languages: Array<{
    name: MultiLangString;
    level: number;
    note: MultiLangString;
  }>;
  aiExpertise: {
    title: MultiLangString;
    description: MultiLangString;
    libraries: string[];
  };
  networkExpertise: {
    title: MultiLangString;
    description: MultiLangString;
  };
  certifications: Array<{
    title: MultiLangString;
    issuer: MultiLangString;
    date: string;
  }>;
}

export default function ExpertiseSection() {
  const { i18n } = useTranslation();
  const [data, setData] = useState<PersonalData | null>(null);
  const currentLang = (i18n.language.startsWith('ar') ? 'ar' : 'en') as 'en' | 'ar';
  const isRtl = currentLang === 'ar';

  useEffect(() => {
    fetch(import.meta.env.BASE_URL + "personal-data.json")
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.error("Error loading expertise data:", err));
  }, []);

  if (!data) return null;

  return (
    <section className="py-20 bg-background relative overflow-hidden">
      <div className="container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* AI & Network Section */}
          <div className="space-y-8">
            <div className="bg-card border border-border p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
              <div className={`flex items-center gap-4 mb-6 ${isRtl ? 'flex-row-reverse' : ''}`}>
                <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                  <Brain className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold">{data.aiExpertise?.title?.[currentLang] || (isRtl ? 'الذكاء الاصطناعي' : 'AI Expertise')}</h3>
              </div>
              <p className="text-muted-foreground mb-6">{data.aiExpertise?.description?.[currentLang]}</p>
              <div className={`flex flex-wrap gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
                {data.aiExpertise?.libraries?.map((lib, i) => (
                  <span key={i} className="px-3 py-1 bg-background border border-border rounded-full text-xs font-medium text-primary">
                    {lib}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-card border border-border p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
              <div className={`flex items-center gap-4 mb-6 ${isRtl ? 'flex-row-reverse' : ''}`}>
                <div className="p-3 bg-accent/10 rounded-2xl text-accent">
                  <Network className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold">{data.networkExpertise?.title?.[currentLang] || (isRtl ? 'الشبكات' : 'Network Expertise')}</h3>
              </div>
              <p className="text-muted-foreground">{data.networkExpertise?.description?.[currentLang]}</p>
            </div>
          </div>

          {/* Education & Languages Section */}
          <div className="space-y-8">
            <div className="bg-card border border-border p-8 rounded-3xl shadow-sm">
              <div className={`flex items-center gap-4 mb-6 ${isRtl ? 'flex-row-reverse' : ''}`}>
                <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold">{isRtl ? 'التعليم' : 'Education'}</h3>
              </div>
              <div className={`${isRtl ? 'text-right' : 'text-left'}`}>
                <h4 className="text-lg font-bold text-foreground">{data.education.degree[currentLang]}</h4>
                <p className="text-primary font-medium">{data.education.university[currentLang]}</p>
                <p className="text-muted-foreground text-sm">{data.education.college[currentLang]}</p>
                <p className="text-muted-foreground text-sm mt-2">{isRtl ? 'تاريخ التخرج المتوقع:' : 'Expected Graduation:'} {data.education.graduationDate}</p>
              </div>
            </div>

            <div className="bg-card border border-border p-8 rounded-3xl shadow-sm">
              <div className={`flex items-center gap-4 mb-6 ${isRtl ? 'flex-row-reverse' : ''}`}>
                <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                  <Languages className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold">{isRtl ? 'اللغات' : 'Languages'}</h3>
              </div>
              <div className="space-y-6">
                {data.languages.map((lang, i) => (
                  <div key={i} className="space-y-2">
                    <div className={`flex justify-between text-sm font-medium ${isRtl ? 'flex-row-reverse' : ''}`}>
                      <span>{lang.name[currentLang]}</span>
                      <span className="text-muted-foreground">{lang.note[currentLang]}</span>
                    </div>
                    <Progress value={lang.level} className="h-2" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Certifications Section */}
        <div className="mt-12">
          <div className="bg-card border border-border p-8 rounded-3xl shadow-sm">
            <div className={`flex items-center gap-4 mb-8 ${isRtl ? 'flex-row-reverse' : ''}`}>
              <div className="p-3 bg-yellow-500/10 rounded-2xl text-yellow-500">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold">{isRtl ? 'الشهادات' : 'Certifications'}</h3>
            </div>
            
            {(data.certifications?.length || 0) > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.certifications?.map((cert, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 bg-background border border-border rounded-2xl">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <h4 className="font-bold text-foreground">{cert.title[currentLang]}</h4>
                      <p className="text-sm text-muted-foreground">{cert.issuer[currentLang]}</p>
                      <p className="text-xs text-muted-foreground mt-1">{cert.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 border-2 border-dashed border-border rounded-2xl">
                <p className="text-muted-foreground italic">
                  {isRtl ? 'سيتم إضافة الشهادات قريباً...' : 'Certifications will be added soon...'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
