import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    supportedLngs: ['en', 'ar'],
    load: 'languageOnly',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: {
        translation: {
          nav: {
            projects: "Projects",
            skills: "Skills",
            experience: "Experience",
            contact: "Contact",
            about: "About Me"
          },
          hero: {
            welcome: "Welcome to my portfolio",
            cta_contact: "Get in touch",
            cta_github: "View GitHub",
            scroll: "Scroll to explore",
            available: "Available for Work",
            cta_cv: "Download CV",
            search: "Search projects...",
            scroll_explore: "Scroll to explore"
          },
          about: {
            title: "About Me",
            intro: "Professional Overview",
            education: "Academic Background",
            languages: "Linguistic Proficiency",
            certificates: "Professional Certifications",
            graduation: "Graduation"
          },
          contact: {
            title: "Get In Touch",
            description: "I'm always interested in hearing about new projects and opportunities. Feel free to reach out!",
            email: "Email",
            phone: "Phone",
            location: "Location",
            socials: "Social Media",
            footer: "Ready to collaborate? Let's discuss your project and how I can help bring your ideas to life.",
            send_email: "Send Me an Email",
            copy: "Copy",
            copied: "Copied!",
            open_chat: "Open Chat",
            form: {
              name: "Full Name",
              name_placeholder: "Your name",
              email: "Email Address",
              email_placeholder: "name@example.com",
              subject: "Subject",
              subject_placeholder: "How can I help?",
              message: "Message",
              message_placeholder: "Write your message here...",
              send: "Send Message"
            }
          },
          sections: {
            projects: "Featured Projects",
            skills: "Technical Expertise",
            experience: "Professional Journey",
            contact: "Get In Touch",
            about: "About Me"
          },
          skills: {
            tools: "Development Tools",
            frameworks: "Frameworks & Libraries"
          }
        }
      },
      ar: {
        translation: {
          nav: {
            projects: "المشاريع",
            skills: "المهارات",
            experience: "الخبرة",
            contact: "اتصل بي",
            about: "نبذة عني"
          },
          hero: {
            welcome: "مرحباً بكم في معرض أعمالي",
            cta_contact: "تواصل معي",
            cta_github: "عرض GitHub",
            scroll: "مرر للأسفل للاستكشاف",
            available: "متاح للعمل",
            cta_cv: "تحميل السيرة الذاتية",
            search: "البحث في المشاريع...",
            scroll_explore: "مرر للاستكشاف"
          },
          about: {
            title: "نبذة عني",
            intro: "نظرة عامة",
            education: "الخلفية الأكاديمية",
            languages: "الكفاءة اللغوية",
            certificates: "الشهادات المهنية",
            graduation: "التخرج"
          },
          contact: {
            title: "تواصل معي",
            description: "أنا مهتم دائماً بسماع أخبار المشاريع والفرص الجديدة. لا تتردد في التواصل معي!",
            email: "البريد الإلكتروني",
            phone: "الهاتف",
            location: "الموقع",
            socials: "وسائل التواصل الاجتماعي",
            footer: "جاهز للتعاون؟ دعنا نناقش مشروعك وكيف يمكنني المساعدة في تحويل أفكارك إلى واقع.",
            send_email: "أرسل لي بريداً إلكترونياً",
            copy: "نسخ",
            copied: "تم النسخ!",
            open_chat: "فتح المحادثة",
            form: {
              name: "الاسم الكامل",
              name_placeholder: "أدخل اسمك",
              email: "البريد الإلكتروني",
              email_placeholder: "name@example.com",
              subject: "الموضوع",
              subject_placeholder: "كيف يمكنني مساعدتك؟",
              message: "الرسالة",
              message_placeholder: "اكتب رسالتك هنا...",
              send: "إرسال الرسالة"
            }
          },
          sections: {
            projects: "المشاريع المميزة",
            skills: "الخبرات التقنية",
            experience: "المسيرة المهنية",
            contact: "تواصل معي",
            about: "نبذة عني"
          },
          skills: {
            tools: "أدوات التطوير",
            frameworks: "الأطر والمكتبات"
          }
        }
      }
    }
  });

export default i18n;
