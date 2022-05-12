import { Button, TextField } from "@components";
import { useState } from "react";

type Props = {
  onSubmit: (inputValue: string) => Promise<void>;
  placeholder?: string;
  btnTitle?: string;
  id?: string;
};

export const Form: React.FunctionComponent<Props> = ({ onSubmit, placeholder = "Post Title", btnTitle = "Send" }) => {
  const [input, setInput] = useState<string>("");
  const [error, setError] = useState<string>("");
  const handleValidate = (value: string) => (!value.length ? setError("Input required") : setError(""));

  const handleChange = (value: string) => {
    handleValidate(value);
    setInput(value);
  };
  return (
    <form className="w-full flex mt-8 h-14" onSubmit={() => onSubmit(input)}>
      <TextField
        fieldAttributesProps={{ error, className: "mr-2" }}
        placeholder={placeholder}
        value={input}
        onChange={(e) => handleChange(e.target.value)}
      />

      <Button disabled={!!error.length || !input.length}>{btnTitle}</Button>
    </form>
  );
};
