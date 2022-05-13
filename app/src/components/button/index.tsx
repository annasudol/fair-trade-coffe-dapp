import clsx from "clsx";
import { ButtonHTMLAttributes, FC, ReactElement } from "react";
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  disabled?: boolean;
  loading?: boolean;
  leftIcon?: ReactElement;
  classes?: string;
}

export const Button: FC<ButtonProps> = ({ children, loading = false, disabled, classes, ...props }) => {
  disabled = disabled || loading;
  const classNames =
    "inline-flex items-center justify-center px-6 py-2 border text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-blue-500 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 h-10";
  return (
    <button
      className={clsx(classes, classNames, { disabled: "opacity-60 cursor-not-allowed" })}
      disabled={disabled}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-5 w-5 text-white mr-1" viewBox="0 0 24 24">
          <path d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z" fill="currentColor" />
        </svg>
      )}
      {children}
    </button>
  );
};
