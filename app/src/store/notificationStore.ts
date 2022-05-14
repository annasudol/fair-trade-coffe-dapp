// import produce from "immer";
import create, { State } from "zustand";

interface NotificationStore extends State {
  notifications: Array<{
    type: string;
    message: string;
    description?: string;
    txid?: string;
  }>;
  set: (x: unknown) => void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const useNotificationStore = create<NotificationStore>((set, _get) => ({
  notifications: [],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  set: (fn: any) => set(fn),
}));

export default useNotificationStore;
