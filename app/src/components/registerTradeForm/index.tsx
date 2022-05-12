import { Button } from "@components";

type Props = {
  onSubmit: () => Promise<void>;
};

export const RegisterTradeForm: React.FunctionComponent<Props> = ({ onSubmit }) => {
  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form className="w-full flex mt-8 h-14 justify-center" onSubmit={handleSubmit}>
      <Button>Register Trade</Button>
    </form>
  );
};
