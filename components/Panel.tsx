import { pageAccentClass, pageBodyClass } from "@/components/pageStyle";

type PanelProps = {
  title: string;
  description: string;
  open?: boolean;
};

export function Panel({ title, description, open = false }: PanelProps) {
  return (
    <div
      data-open={open}
      className="w-full rounded-2xl border border-white bg-white px-5 py-4 shadow-[0_0_0_1px_rgba(0,0,0,0.08),0_1px_2px_-1px_rgba(0,0,0,0.08),0_2px_4px_0_rgba(0,0,0,0.04)] transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] translate-y-[calc(100%+1.5rem)] data-[open=true]:translate-y-0 motion-reduce:transition-none"
    >
      <h3 className={pageAccentClass}>{title}</h3>
      <p className={`mt-1.5 ${pageBodyClass}`}>{description}</p>
    </div>
  );
}
