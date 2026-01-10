import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Copy, Check, MessageCircle, Send, Github, Linkedin, Sparkles, Zap, MessageSquare, Instagram } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

interface MultiLangString {
  en: string;
  ar: string;
}

interface PersonalData {
  personal: {
    email: string;
    phone: string;
    whatsapp: string;
    location: MultiLangString;
  };
  social: {
    github: { url: string; username: string };
    instagram: { url: string; username: string };
    facebook: { url: string; username: string };
    linkedin: { url: string; username: string };
  };
}

export default function ContactSection() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error(isRtl ? "يرجى ملء جميع الحقول المطلوبة" : "Please fill in all required fields");
      return;
    }
    
    const mailtoLink = `mailto:${personal.email}?subject=${encodeURIComponent(formData.subject || 'Contact from Portfolio')}&body=${encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`)}`;
    window.location.href = mailtoLink;
    toast.success(isRtl ? "جاري فتح تطبيق البريد..." : "Opening mail client...");
  };

  const { t, i18n } = useTranslation();
  const [data, setData] = useState<PersonalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);

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
        console.error("Error loading contact data:", err);
        setLoading(false);
      });
  }, []);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    toast.success(isRtl ? "تم النسخ بنجاح!" : "Copied to clipboard!");
    setTimeout(() => setCopied(null), 2000);
  };

  if (loading || !data) return null;

  const { personal, social } = data;

  const contactInfo = [
    {
      icon: Mail,
      label: t('contact.email'),
      value: personal.email,
      action: `mailto:${personal.email}`,
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    },
    {
      icon: Phone,
      label: t('contact.phone'),
      value: personal.phone,
      action: `tel:${personal.phone.replace(/\s/g, '')}`,
      color: "text-green-500",
      bg: "bg-green-500/10"
    },
    {
      icon: MessageCircle,
      label: "WhatsApp",
      value: personal.whatsapp,
      action: `https://wa.me/${personal.whatsapp.replace(/\D/g, '')}`,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10"
    },
    {
      icon: MapPin,
      label: t('contact.location'),
      value: personal.location[currentLang],
      color: "text-red-500",
      bg: "bg-red-500/10"
    }
  ];

  return (
    <section id="contact" className="py-24 bg-background relative overflow-hidden scroll-reveal focus-section">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="container relative z-10">
        <div className={`text-center mb-16 animate-fade-in-up ${isRtl ? 'rtl' : 'ltr'}`}>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 pb-3 gradient-text animate-neon-glow leading-tight">{t('contact.title')}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            {t('contact.description')}
          </p>
        </div>

        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-start ${isRtl ? 'lg:flex-row-reverse' : ''}`}>
          {/* Contact Info Cards */}
          <div className="space-y-6 animate-slide-up" style={{ animationDelay: '300ms' }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {contactInfo.map((info, index) => (
                <div
                  key={index}
                  className={`group p-6 bg-card border border-border rounded-2xl transition-all duration-500 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 hover-lift-card card-tilt relative overflow-hidden ${isRtl ? 'text-right' : 'text-left'}`}
                >
                  <div className="absolute inset-0 shimmer-effect opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  <div className={`flex flex-col items-center text-center gap-4 relative z-10`}>
                    <div className={`p-4 rounded-2xl ${info.bg} ${info.color} group-hover:scale-110 transition-transform duration-500 shadow-lg shadow-current/10`}>
                      <info.icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">{info.label}</p>
                      <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors break-all">{info.value}</p>
                    </div>
                    {info.action ? (
                      <div className="flex gap-2 w-full">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1 rounded-xl border-primary/20 hover:border-primary/50"
                          onClick={() => info.action?.startsWith('http') ? window.open(info.action, '_blank') : window.location.href = info.action || '#'}
                        >
                          <Send className="w-4 h-4 mr-2" />
                          {isRtl ? 'فتح' : 'Open'}
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="rounded-xl"
                          onClick={() => handleCopy(info.value, info.label)}
                        >
                          {copied === info.label ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </div>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>

            {/* Social Links Card */}
            <div className="p-8 bg-gradient-to-br from-card to-background border border-border rounded-3xl relative overflow-hidden group hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-3 hover-lift-card card-tilt">
              <div className="absolute inset-0 shimmer-effect opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Zap className="w-20 h-20 text-primary" />
              </div>
              <h3 className={`text-xl font-bold mb-6 flex items-center gap-2 relative z-10 ${isRtl ? 'flex-row-reverse' : ''}`}>
                <MessageSquare className="w-5 h-5 text-primary" />
                {t('contact.socials')}
              </h3>
              <div className={`flex flex-wrap gap-4 relative z-10 ${isRtl ? 'flex-row-reverse' : ''}`}>
                {[
                  { icon: Github, href: social.github.url, color: "hover:bg-white hover:text-black", label: "GitHub" },
                  { icon: Linkedin, href: social.linkedin.url, color: "hover:bg-[#0077b5] hover:text-white", label: "LinkedIn" },
                  { icon: Instagram, href: social.instagram.url, color: "hover:bg-gradient-to-tr hover:from-[#f9ce34] hover:via-[#ee2a7b] hover:to-[#6228d7] hover:text-white", label: "Instagram" },
                  { icon: Mail, href: `mailto:${personal.email}`, color: "hover:bg-[#ea4335] hover:text-white", label: "Email" }
                ].map((social, i) => (
                  <a
                    key={i}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-4 bg-background border border-border rounded-2xl transition-all duration-500 hover:scale-125 hover:rotate-12 ${social.color} group/social shadow-sm hover:shadow-2xl hover:shadow-primary/20`}
                  >
                    <social.icon className="w-6 h-6 transition-transform duration-500 group-hover/social:scale-110" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-card border border-border rounded-3xl p-8 shadow-2xl shadow-primary/5 animate-slide-up hover:border-primary/30 transition-all duration-500 group relative overflow-hidden" style={{ animationDelay: '400ms' }}>
            <div className="absolute inset-0 shimmer-effect opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
            <div className="relative z-10">
            <form className="space-y-6" onSubmit={handleSendMessage}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2 group">
                  <label className={`text-sm font-medium text-muted-foreground group-focus-within:text-primary transition-colors ${isRtl ? 'block text-right' : ''}`}>
                    {t('contact.form.name')}
                  </label>
                  <input
                    type="text"
                    className={`w-full bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all duration-300 ${isRtl ? 'text-right' : ''}`}
                    placeholder={t('contact.form.name_placeholder')}
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2 group">
                  <label className={`text-sm font-medium text-muted-foreground group-focus-within:text-primary transition-colors ${isRtl ? 'block text-right' : ''}`}>
                    {t('contact.form.email')}
                  </label>
                  <input
                    type="email"
                    className={`w-full bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all duration-300 ${isRtl ? 'text-right' : ''}`}
                    placeholder={t('contact.form.email_placeholder')}
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2 group">
                <label className={`text-sm font-medium text-muted-foreground group-focus-within:text-primary transition-colors ${isRtl ? 'block text-right' : ''}`}>
                  {t('contact.form.subject')}
                </label>
                <input
                  type="text"
                  className={`w-full bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all duration-300 ${isRtl ? 'text-right' : ''}`}
                  placeholder={t('contact.form.subject_placeholder')}
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2 group">
                <label className={`text-sm font-medium text-muted-foreground group-focus-within:text-primary transition-colors ${isRtl ? 'block text-right' : ''}`}>
                  {t('contact.form.message')}
                </label>
                <textarea
                  rows={5}
                  className={`w-full bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all duration-300 resize-none ${isRtl ? 'text-right' : ''}`}
                  placeholder={t('contact.form.message_placeholder')}
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <Button 
                type="submit"
                className="w-full py-6 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-lg shadow-lg shadow-primary/20 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                {t('contact.form.send')}
              </Button>
            </form>
            </div>
          </div>
        </div>

        {/* Footer Text */}
        <div className="mt-20 pt-12 border-t border-border/50 text-center animate-fade-in">
          <div className={`flex flex-col md:flex-row justify-between items-center gap-6 mb-8 ${isRtl ? 'md:flex-row-reverse' : ''}`}>
            <div className={`${isRtl ? 'text-right' : 'text-left'}`}>
              <h3 className="text-2xl font-bold gradient-text mb-2">Akill Talal</h3>
              <p className="text-muted-foreground">{t('contact.footer')}</p>
            </div>
            <div className="flex gap-4">
              <Button 
                variant="outline" 
                className="rounded-xl border-primary/20 hover:border-primary/50"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                {isRtl ? 'العودة للأعلى' : 'Back to Top'}
              </Button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Akill Talal. {isRtl ? 'جميع الحقوق محفوظة' : 'All rights reserved.'}
          </p>
        </div>
      </div>
    </section>
  );
}
