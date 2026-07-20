interface SuccessMessageProps {
  message: string;
}

export function SuccessMessage({ message }: SuccessMessageProps) {
  return (
    <div className="rounded-lg bg-success/10 p-4 text-success">
      {message}
    </div>
  );
}
