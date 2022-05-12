import clsx from "clsx";
import { InputHTMLAttributes } from "react";

import { FieldAttributes, FieldAttributesProps } from "./FieldAttributes";

interface BaseProps {
  fieldAttributesProps?: Omit<FieldAttributesProps, "onLabelClick">;
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement>, BaseProps {
  multiline?: false;
}

export type TextFieldProps = InputProps;

export const TextField: React.FC<TextFieldProps> = ({ className, fieldAttributesProps, ...props }) => {
  const hasError = !!fieldAttributesProps?.error;
  const classes = clsx(
    `w-64 px-4 py-2 focus:ring-blue-500 block sm:text-sm border-gray-300 rounded-md shadow-md mr-4`,
    {
      "cursor-not-allowed": props.disabled,
      "border-black-200 dark:border-black-400 focus:border-yellow-700": !hasError,
      "border-red-400 focus:border-red-400 text-red-400 dark:text-red-400": hasError,
    },
    className
  );

  return (
    <FieldAttributes {...fieldAttributesProps}>
      <input className={classes} {...(props as InputProps)} />
    </FieldAttributes>
  );
};
