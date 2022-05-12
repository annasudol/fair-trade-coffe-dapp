import clsx from "clsx";
import uniqueId from "lodash/uniqueId";
import { cloneElement, isValidElement, useEffect, useState } from "react";

export interface FieldAttributesProps {
  label?: string;
  error?: string | false | string[];
  className?: string;
  defaultClassName?: string;
  onLabelClick?: () => void;
}

export const FieldAttributes: React.FC<FieldAttributesProps> = ({
  label,
  error,
  className,
  defaultClassName = "w-full mb-5",
  children,
  onLabelClick,
}) => {
  const [id, setId] = useState<string | undefined>(undefined);

  useEffect(() => {
    setId(uniqueId("id-"));
  }, []);

  return (
    <div className={clsx("flex flex-col relative", defaultClassName, className)}>
      {label && (
        <label
          aria-hidden="true"
          className="mb-2 text-sm font-medium text-gray-900 dark:text-gray-300 select-none"
          htmlFor={id}
          onClick={() => onLabelClick?.()}
        >
          {label}
        </label>
      )}

      {label ? isValidElement(children) && cloneElement(children, { id }) : children}

      {error && (
        <span className="text-red-400 ml-4 mt-1 absolute top-full text-xs">
          {Array.isArray(error) ? error[0] : error}
        </span>
      )}
    </div>
  );
};
