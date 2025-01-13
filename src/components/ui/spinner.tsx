
import { cn } from "@/lib/utils";
import { Loader2, LucideProps } from "lucide-react";

interface SpinnerProps extends LucideProps {

  size?: "default" | "sm" | "lg";

}



export function Spinner({ size = "default", className, ...props }: SpinnerProps) {

  return (

    <Loader2

      className={cn(

        "animate-spin",

        {

          "h-4 w-4": size === "sm",

          "h-6 w-6": size === "default",

          "h-8 w-8": size === "lg",

        },

        className

      )}

      {...props}

    />

  );

}
