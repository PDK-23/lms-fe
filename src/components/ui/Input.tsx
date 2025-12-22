import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        'w-full px-4 py-2 border border-neutral-300 rounded-lg',
        'bg-white text-neutral-900 placeholder-neutral-500',
        'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
        'transition-colors duration-200',
        'disabled:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    />
  );
}
