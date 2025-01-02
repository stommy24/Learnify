interface Props {
  message: string;
  className?: string;
}

export const ErrorMessage: React.FC<Props> = ({ message, className = '' }) => (
  <div className={`text-red-600 p-4 rounded bg-red-50 ${className}`}>
    {message}
  </div>
); 