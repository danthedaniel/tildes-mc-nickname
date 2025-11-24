interface StatusDotProps {
  online: boolean;
}

export function StatusDot({ online }: StatusDotProps) {
  return (
    <span
      className={`inline-block w-2.5 h-2.5 rounded-full ${online ? "bg-green-500" : "bg-red-500"}`}
    />
  );
}
