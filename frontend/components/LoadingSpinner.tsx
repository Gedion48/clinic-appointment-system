interface Props {
  text?: string;
}

export default function LoadingSpinner({ text }: Props) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16">
      <div className="w-8 h-8 border-2 border-teal-200 border-t-teal-600 rounded-full animate-spin" />
      {text && <p className="text-sm text-slate-500 font-medium">{text}</p>}
    </div>
  );
}
