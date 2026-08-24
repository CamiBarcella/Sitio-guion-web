const CATEGORY_META = {
  programacion: { label: "Programación", short: "Programación" },
  ia: { label: "Inteligencia Artificial", short: "IA" },
  diseno: { label: "Diseño", short: "Diseño" },
  software: { label: "Software", short: "Software" },
  hardware: { label: "Hardware", short: "Hardware" }
};

const FILTERS = [
  { id: "todos", label: "Todos" },
  { id: "programacion", label: "Programación" },
  { id: "ia", label: "IA" },
  { id: "diseno", label: "Diseño" },
  { id: "software", label: "Software" },
  { id: "hardware", label: "Hardware" }
];

const ICONS = {
  programacion:
    '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="m16 18 6-6-6-6"/><path d="m8 6-6 6 6 6"/></svg>',
  ia:
    '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/></svg>',
  diseno:
    '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".8"/><circle cx="17.5" cy="10.5" r=".8"/><circle cx="8.5" cy="7.5" r=".8"/><circle cx="6.5" cy="12.5" r=".8"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>',
  software:
    '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/></svg>',
  hardware:
    '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><line x1="22" x2="2" y1="12" y2="12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/><line x1="6" x2="6.01" y1="16" y2="16"/><line x1="10" x2="10.01" y1="16" y2="16"/></svg>'
};

const COURSES = [
  {
    id: 1,
    title: "Python desde Cero",
    desc: "Domina la sintaxis, la lógica de programación y proyectos reales con el lenguaje más versátil.",
    category: "programacion",
    price: 24.99,
    oldPrice: 49.99,
    rating: 4.9,
    students: "12.4k",
    hours: 32,
    level: "Principiante"
  },
  {
    id: 2,
    title: "JavaScript Moderno (ES2024+)",
    desc: "Async, módulos, DOM, APIs y todo lo necesario para escribir JS profesional.",
    category: "programacion",
    price: 27.99,
    oldPrice: 54.99,
    rating: 4.8,
    students: "9.8k",
    hours: 40,
    level: "Intermedio"
  },
  {
    id: 3,
    title: "Bootcamp Full Stack Web",
    desc: "HTML, CSS, React, Node.js y bases de datos. Conviértete en developer completo.",
    category: "programacion",
    price: 59.99,
    oldPrice: 129.99,
    rating: 4.9,
    students: "21.3k",
    hours: 120,
    level: "Todos los niveles"
  },
  {
    id: 4,
    title: "IA Generativa y LLMs",
    desc: "Prompt engineering, APIs de IA e integración de modelos en aplicaciones reales.",
    category: "ia",
    price: 34.99,
    oldPrice: 69.99,
    rating: 4.9,
    students: "7.2k",
    hours: 28,
    level: "Intermedio"
  },
  {
    id: 5,
    title: "Machine Learning con Python",
    desc: "Modelos predictivos, scikit-learn, redes neuronales y despliegue en producción.",
    category: "ia",
    price: 39.99,
    oldPrice: 79.99,
    rating: 4.8,
    students: "11.5k",
    hours: 45,
    level: "Avanzado"
  },
  {
    id: 6,
    title: "Fundamentos de Data Science",
    desc: "Análisis de datos, visualización y estadística aplicada con pandas y matplotlib.",
    category: "ia",
    price: 29.99,
    oldPrice: null,
    rating: 4.7,
    students: "8.1k",
    hours: 36,
    level: "Principiante"
  },
  {
    id: 7,
    title: "UI/UX desde Cero con Figma",
    desc: "Design systems, prototipos interactivos e investigación de usuarios paso a paso.",
    category: "diseno",
    price: 22.99,
    oldPrice: 44.99,
    rating: 4.8,
    students: "14.2k",
    hours: 30,
    level: "Principiante"
  },
  {
    id: 8,
    title: "Diseño Web Moderno",
    desc: "Layouts responsivos, tipografía, color y micro-interacciones que convierten.",
    category: "diseno",
    price: 26.99,
    oldPrice: null,
    rating: 4.7,
    students: "6.3k",
    hours: 24,
    level: "Intermedio"
  },
  {
    id: 9,
    title: "Windows, Office y Cloud",
    desc: "Herramientas esenciales de productividad y trabajo colaborativo en la nube.",
    category: "software",
    price: 19.99,
    oldPrice: 39.99,
    rating: 4.6,
    students: "18.9k",
    hours: 20,
    level: "Principiante"
  },
  {
    id: 10,
    title: "Excel Avanzado y Automatización",
    desc: "Tablas dinámicas, macros, Power Query y dashboards profesionales.",
    category: "software",
    price: 24.99,
    oldPrice: null,
    rating: 4.8,
    students: "22.4k",
    hours: 26,
    level: "Intermedio"
  },
  {
    id: 11,
    title: "Ensamblaje y Mantenimiento de PC",
    desc: "Arma tu propia computadora, diagnostica fallas y optimiza el rendimiento.",
    category: "hardware",
    price: 21.99,
    oldPrice: 42.99,
    rating: 4.7,
    students: "5.7k",
    hours: 18,
    level: "Principiante"
  },
  {
    id: 12,
    title: "Redes y Seguridad Informática",
    desc: "Protocolos, configuración de redes y fundamentos de ciberseguridad práctica.",
    category: "hardware",
    price: 31.99,
    oldPrice: null,
    rating: 4.8,
    students: "6.9k",
    hours: 34,
    level: "Intermedio"
  }
];
