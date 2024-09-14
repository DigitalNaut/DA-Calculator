import { cn } from "src/utils";

type Props = {
  children: string;
  dimmed?: boolean;
};

export default function Output({ children, dimmed }: Props) {
  return (
    <p
      className={cn(
        "rounded-2xl p-4 text-center text-white hover:bg-slate-700",
        {
          "italic text-gray-500": dimmed,
        },
      )}
    >
      {children}
    </p>
  );
}
