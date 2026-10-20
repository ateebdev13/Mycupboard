export type ServiceItem = { title: string; description: string; href: string };
export type ServiceGroup = { label: string; items: ServiceItem[] };

// Hrefs are placeholders until routes are defined.
export const serviceGroups: ServiceGroup[] = [
  {
    label: "Design",
    items: [
      {
        title: "Product Strategy",
        description: "Research, scoping & road mapping before code",
        href: "#product-strategy",
      },
      {
        title: "Product Design",
        description: "UI/UX, SaaS design, mobile, web & brand identity",
        href: "#product-design",
      },
    ],
  },
  {
    label: "Development",
    items: [
      {
        title: "SaaS Development",
        description: "Scalable multi-tenant platforms, end to end",
        href: "#saas-development",
      },
      {
        title: "MVP Design & Development",
        description: "Idea to launched product in weeks",
        href: "#mvp",
      },
      {
        title: "Web & App Development",
        description: "Websites, mobile apps & web applications",
        href: "#web-app-development",
      },
    ],
  },
  {
    label: "Growth",
    items: [
      {
        title: "UX Audit",
        description: "Find what's broken before users leave",
        href: "#ux-audit",
      },
      {
        title: "AI MVP Cleanup",
        description: "Turn AI-generated code into production-ready product",
        href: "#ai-mvp-cleanup",
      },
      {
        title: "CRO Optimization",
        description: "More sales from the traffic you already have",
        href: "#cro",
      },
    ],
  },
];

export const navLinks = [
  { label: "Process", href: "#process" },
  { label: "Case Studies", href: "#case-studies" },
  { label: "Company", href: "#company" },
  { label: "Insights", href: "#insights" },
  { label: "Contact", href: "#contact" },
];

export const servicesTagline =
  "One team for your entire product from first strategy call to the final launch";
