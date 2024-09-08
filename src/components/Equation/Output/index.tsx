import { cn } from "src/utils";

type Props = {
  children: string;
  dimmed?: boolean;
};

export default function Output({ children, dimmed }: Props) {
  return (
    <p
      className={cn(
        "m-1.5 rounded-2xl bg-gray-800 p-4 text-center text-white",
        {
          "italic text-gray-400": dimmed,
        },
      )}
    >
      {children}
    </p>
  );
}
