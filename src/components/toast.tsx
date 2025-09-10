import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const TOAST_TYPE = {
  SUCCESS: "success",
  ERROR: "error",
  INFO: "info",
  WARNING: "warning",
  LOADING: "loading",
} as const;

type ToastType = (typeof TOAST_TYPE)[keyof typeof TOAST_TYPE];

interface IToastProps {
  type: ToastType;
  title: string | null;
  message: string | null;
}

interface IRenderToastProps {
  titleColorClassName: string;
  messageColorClassName: string;
}

const setToast = (props: IToastProps) => {
  const renderToast = ({
    titleColorClassName,
    messageColorClassName,
  }: IRenderToastProps) => {
    return (
      <div className="relative space-y-1 group flex flex-col w-[350px] rounded-lg border shadow-sm p-2">
        <p className={cn("font-bold", titleColorClassName)}>{props.title}</p>
        <p className={cn("text-sm", messageColorClassName)}>{props.message}</p>
      </div>
    );
  };

  switch (props.type) {
    case TOAST_TYPE.SUCCESS:
      return toast.custom(() =>
        renderToast({
          titleColorClassName: "text-green-600",
          messageColorClassName: "text-green-800",
        })
      );
    case TOAST_TYPE.ERROR:
      return toast.custom(() =>
        renderToast({
          titleColorClassName: "text-red-600",
          messageColorClassName: "text-red-800",
        })
      );
    case TOAST_TYPE.INFO:
      return toast.custom(() =>
        renderToast({
          titleColorClassName: "text-blue-600",
          messageColorClassName: "text-blue-800",
        })
      );
    case TOAST_TYPE.WARNING:
      return toast.custom(() =>
        renderToast({
          titleColorClassName: "text-yellow-600",
          messageColorClassName: "text-yellow-800",
        })
      );
    case TOAST_TYPE.LOADING:
      return toast.custom(() =>
        renderToast({
          titleColorClassName: "text-gray-600",
          messageColorClassName: "text-gray-800",
        })
      );
  }
};

export default setToast;
