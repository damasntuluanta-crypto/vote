interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="rounded-lg bg-danger/10 p-4 text-danger">
      {message}
    </div>
  );
}
