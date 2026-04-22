# Akill Portfolio

A modern, high-performance portfolio website designed to showcase professional projects, technical expertise, and career milestones. This application is built using a cutting-edge tech stack, ensuring a seamless user experience across all devices.

## 🚀 Live Deployment
The live version of this portfolio is accessible at:
**[https://eng-akil-alsufi.github.io/akill-portfolio/](https://eng-akil-alsufi.github.io/akill-portfolio/)**

---

## 🛠 Technical Stack

| Category | Technologies |
| :--- | :--- |
| **Frontend Core** | React 19, TypeScript, Vite |
| **Styling** | Tailwind CSS, Lucide Icons |
| **UI Components** | Radix UI, Shadcn UI |
| **Animations** | Framer Motion |
| **Routing** | Wouter |
| **Internationalization** | i18next |

---

## ✨ Key Features

*   **Responsive Architecture**: Fully optimized for mobile, tablet, and desktop environments.
*   **Dynamic Content Management**: Project details and personal data are decoupled into structured JSON for easy updates.
*   **Modern UI/UX**: Implements a clean, minimalist aesthetic with smooth transitions and interactive elements.
*   **Multi-language Support**: Built-in localization framework for global accessibility.
*   **Optimized Performance**: Leveraging Vite's fast build toolchain for near-instant load times.

---

## 📂 Project Structure

```text
├── client/
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Main page views
│   │   ├── hooks/        # Custom React hooks
│   │   └── lib/          # Utility functions and configurations
│   └── public/           # Static assets (PDFs, Images)
├── shared/               # Shared types and schemas
└── server/               # Backend integration logic
```

---

## 💻 Local Development

### Prerequisites
*   **Node.js**: v18.0.0 or higher
*   **Package Manager**: pnpm (recommended) or npm

### Setup Instructions
1.  **Clone the Repository**
    ```bash
    git clone https://github.com/Eng-Akil-Alsufi/akill-portfolio.git
    cd akill-portfolio
    ```

2.  **Install Dependencies**
    ```bash
    pnpm install
    ```

3.  **Launch Development Server**
    ```bash
    pnpm run dev
    ```

---

## 📦 Build & Deployment

To generate a production-ready build, execute:
```bash
pnpm run build
```
The optimized output will be generated in the `dist/public` directory, ready for deployment to GitHub Pages.

---

