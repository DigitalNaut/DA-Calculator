import { cn } from "src/utils";

type Props = {
  children: string;
  dimmed?: boolean;
};

export default function Output({ children, dimmed }: Props) {
  return (
    <p
      className={cn(
        "p-4 m-1.5 text-center text-white bg-gray-800 rounded-2xl",
        {
          "text-gray-400 italic": dimmed,
        }
      )}
    >
      {children}
    </p>
  );
}
