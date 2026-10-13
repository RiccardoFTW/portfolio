export type ContactLink = {
  label: string;
  href: string | null;
};

export const contactLinks: readonly ContactLink[] = [
  { label: "Email", href: "mailto:r.ventura.dev@gmail.com" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/riccardo-ventura/" },
  { label: "GitHub", href: "https://github.com/RiccardoFTW" },
  { label: "X / Twitter", href: "https://x.com/RickyyDev" },
];
