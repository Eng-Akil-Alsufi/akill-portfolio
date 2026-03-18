import { useState, useEffect, useMemo } from "react";
import { Github, ExternalLink, Code2, Star, GitFork, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

interface Project {
  id: number;
  name: string;
  description: {
    en: string;
    ar: string;
  };
  url: string;
  languages: string[];
  stars: number;
  forks: number;
  created_at: string;
  updated_at: string;
  topics: string[];
  homepage: string | null;
}

const languageColors: Record<string, string> = {
  Python: "bg-blue-500/20 text-blue-300",
  Java: "bg-orange-500/20 text-orange-300",
  JavaScript: "bg-yellow-500/20 text-yellow-300",
  PHP: "bg-purple-500/20 text-purple-300",
  HTML: "bg-red-500/20 text-red-300",
  CSS: "bg-pink-500/20 text-pink-300",
  Ruby: "bg-red-600/20 text-red-300",
  Prolog: "bg-indigo-500/20 text-indigo-300",
  C: "bg-slate-500/20 text-slate-300",
  "C++": "bg-slate-600/20 text-slate-300",
    "C#": "bg-green-500/20 text-green-300",
  "ASP.NET": "bg-purple-600/20 text-purple-300",
  ".NET Core": "bg-indigo-500/20 text-indigo-300",
  "SQL Server": "bg-red-500/20 text-red-300",
  MySQL: "bg-orange-500/20 text-orange-300",
  Firebase: "bg-amber-500/20 text-amber-300",
  Flutter: "bg-sky-500/20 text-sky-300",
  TypeScript: "bg-blue-600/20 text-blue-300",
    React: "bg-cyan-500/20 text-cyan-300",
  "Node.js": "bg-green-600/20 text-green-300",
  Tailwind: "bg-sky-400/20 text-sky-300",
  Go: "bg-[#00ADD8]/20 text-[#00ADD8]",
  None: "bg-gray-500/20 text-gray-300",
};

export default function ProjectsSection() {
  const { t, i18n } = useTranslation();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);

  const currentLang = (i18n.language.startsWith('ar') ? 'ar' : 'en') as 'en' | 'ar';
  const isRtl = currentLang === 'ar';

  useEffect(() => {
    fetch(import.meta.env.BASE_URL + "projects.json")
      .then((res) => res.json())
      .then((data) => {
        setProjects(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading projects:", err);
        setLoading(false);
      });
  }, []);

  const languages = useMemo(() => {
    const langs = new Set<string>();
    projects.forEach(p => {
      if (p.languages && Array.isArray(p.languages)) {
        p.languages.forEach(l => {
          if (l && l.trim() !== "") {
            langs.add(l.trim());
          }
        });
      }
    });
    // If no languages found in any project, we don't want to show "None" as a filter button
    // unless there are projects specifically marked with "None"
    return Array.from(langs).sort((a, b) => a.localeCompare(b));
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch =
        (project.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (project.description?.[currentLang] || "").toLowerCase().includes(searchTerm.toLowerCase());
      
      const projectLangs = Array.isArray(project.languages) ? project.languages : ["None"];
      const matchesLanguage = !selectedLanguage || projectLangs.includes(selectedLanguage);
      
      return matchesSearch && matchesLanguage;
    });
  }, [searchTerm, selectedLanguage, projects, currentLang]);

  if (loading) {
    return (
      <section id="projects" className="py-20 bg-background">
        <div className="container">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading projects...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="py-20 bg-gradient-to-b from-background to-card/20 scroll-reveal focus-section">
      <div className="container">
        {/* Section header */}
        <div className={`text-center mb-16 animate-fade-in-up ${isRtl ? 'rtl' : 'ltr'}`}>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 pb-3 gradient-text animate-neon-glow leading-tight">{t('sections.projects')}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            {isRtl 
              ? "استكشف مجموعة متنوعة من المشاريع التي قمت ببنائها باستخدام أحدث التقنيات وأفضل الممارسات"
              : "Explore my portfolio of diverse projects built with modern technologies and best practices"}
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-12 space-y-6 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
          <div className="relative max-w-2xl mx-auto group">
            <Search className={`absolute ${isRtl ? 'right-4' : 'left-4'} top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors`} />
            <input
              type="text"
              placeholder={t('hero.search')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full ${isRtl ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-3 rounded-xl bg-card border border-border focus:border-primary/50 focus:ring-1 focus:ring-primary/20 focus:outline-none transition-all text-foreground shadow-sm`}
            />
          </div>

          {/* Filter buttons */}
          <div className={`flex flex-wrap gap-2 justify-center ${isRtl ? 'flex-row-reverse' : ''}`}>
            <Button
              onClick={() => setSelectedLanguage(null)}
              variant={selectedLanguage === null ? "default" : "outline"}
              className="transition-smooth rounded-full hover:scale-105"
            >
              {isRtl ? `كل المشاريع (${projects.length})` : `All Projects (${projects.length})`}
            </Button>
            {languages.map((lang) => (
              <Button
                key={lang}
                onClick={() => setSelectedLanguage(lang)}
                variant={selectedLanguage === lang ? "default" : "outline"}
                className="transition-smooth rounded-full hover:scale-105">
                {lang} ({projects.filter((p) => 
                  p.languages && Array.isArray(p.languages) && p.languages.includes(lang)
                ).length})</Button>
            ))}
          </div>
        </div>

        {/* Projects grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <div
              key={project.id}
              className="group animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`h-full bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-3 flex flex-col ${isRtl ? 'text-right' : 'text-left'} relative hover-lift-card card-tilt group/card`}>
                <div className="absolute inset-0 shimmer-effect opacity-0 group-hover/card:opacity-100 transition-opacity duration-700"></div>
                {/* Neon border glow on hover */}
                <div className="absolute inset-0 rounded-2xl border-2 border-primary/0 group-hover/card:border-primary/30 transition-all duration-500 pointer-events-none"></div>
                
                {/* Header */}
                <div className="p-6 border-b border-border/50 bg-gradient-to-br from-card to-background group-hover/card:from-primary/5 transition-colors duration-500 relative z-10">
                  <div className={`flex items-start justify-between gap-4 mb-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                        {project.name}
                      </h3>
                    </div>
                    <Code2 className="w-6 h-6 text-primary flex-shrink-0 group-hover:scale-125 group-hover:drop-shadow-[0_0_8px_rgba(0,214,255,0.8)] transition-all duration-300" />
                  </div>

                  {/* Language badge */}
                  {project.languages && project.languages.length > 0 && (
                    <div className={`flex flex-wrap gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
                      {Array.isArray(project.languages) && project.languages.length > 0 ? (
                        project.languages.map((lang) => (
                          <span
                            key={lang}
                            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              languageColors[lang] || languageColors["None"]
                            } group-hover:shadow-[0_0_10px_rgba(0,214,255,0.2)] transition-all duration-300`}
                          >
                            {lang}
                          </span>
                        ))
                      ) : (
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${languageColors["None"]}`}>
                          None
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="p-6 flex-1 bg-card group-hover/card:bg-background/50 transition-colors duration-500 relative z-10">
                  <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed group-hover/card:text-foreground transition-colors duration-300">
                    {project.description?.[currentLang] || ""}
                  </p>
                </div>

                {/* Stats */}
                <div className={`px-6 py-4 border-t border-border/50 flex gap-4 text-xs text-muted-foreground ${isRtl ? 'flex-row-reverse' : ''} bg-card/50`}>
                  <div className="flex items-center gap-1 group/stat">
                    <Star className="w-4 h-4 text-yellow-500 group-hover/stat:scale-125 transition-transform" />
                    <span>{project.stars}</span>
                  </div>
                  <div className="flex items-center gap-1 group/stat">
                    <GitFork className="w-4 h-4 text-blue-500 group-hover/stat:scale-125 transition-transform" />
                    <span>{project.forks}</span>
                  </div>
                  <div className={`${isRtl ? 'mr-auto' : 'ml-auto'}`}>
                    {new Date(project.updated_at).toLocaleDateString(currentLang === 'ar' ? 'ar-EG' : 'en-US')}
                  </div>
                </div>

                {/* Actions */}
                <div className={`px-6 py-4 border-t border-border/50 flex gap-3 ${isRtl ? 'flex-row-reverse' : ''} bg-card`}>
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1"
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full gap-2 group/btn hover:border-primary hover:bg-primary/5 transition-all duration-300 rounded-xl ripple-effect"
                    >
                      <Github className="w-4 h-4" />
                      {isRtl ? 'الكود' : 'Code'}
                      <ExternalLink className="w-4 h-4 opacity-0 group-hover/btn:opacity-100 group-hover/btn:translate-x-1 transition-all" />
                    </Button>
                  </a>
                  {project.homepage && (
                    <a
                      href={project.homepage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1"
                    >
                      <Button
                        size="sm"
                        className="w-full gap-2 group/btn bg-primary hover:bg-primary/90 transition-all duration-300 rounded-xl shadow-lg shadow-primary/20 ripple-effect"
                      >
                        {isRtl ? 'مباشر' : 'Live'}
                        <ExternalLink className="w-4 h-4 opacity-0 group-hover/btn:opacity-100 group-hover/btn:translate-x-1 transition-all" />
                      </Button>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-20 animate-fade-in">
            <div className="inline-flex p-4 rounded-full bg-primary/10 mb-4">
              <Search className="w-8 h-8 text-primary" />
            </div>
            <p className="text-muted-foreground text-xl">
              {isRtl ? 'لم يتم العثور على مشاريع تطابق بحثك' : 'No projects found matching your search'}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}