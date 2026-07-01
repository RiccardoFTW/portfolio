type PanelProps = {
  title: string;
  description: string;
};

export function Panel({ title, description }: PanelProps) {
  return (
    <div className="relative w-full translate-y-[calc(100%+6px)] rounded-2xl border border-white bg-white py-3 pl-3.5 pr-9 text-[13px] shadow-[0_0_0_1px_rgba(0,0,0,0.08),0_1px_2px_-1px_rgba(0,0,0,0.08),0_2px_4px_0_rgba(0,0,0,0.04)] transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:translate-y-0 group-focus-visible:translate-y-0 motion-reduce:transition-none">
      <h3 className="font-medium text-(--accent)">{title}</h3>
      <p className="mt-1 leading-none text-zinc-500">{description}</p>
    </div>
  );
}
