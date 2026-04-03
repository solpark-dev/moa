"use client";
import { useThemeStore } from "@/store/themeStore";
import { Toaster as Sonner } from "sonner";

const Toaster = ({
  ...props
}) => {
  const { theme } = useThemeStore();

  return (
    <Sonner
      theme={theme === 'dark' ? 'dark' : 'light'}
      className="toaster group"
      position="bottom-center"
      toastOptions={{
        classNames: {
          toast:
            "group toast font-sans group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-2xl rounded-2xl flex items-center gap-3 backdrop-blur-xl px-5 py-4",
          description: "group-[.toast]:text-muted-foreground text-xs",
          title: "font-semibold text-[15px]",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground font-semibold px-4 py-2 rounded-xl transition-transform active:scale-95",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground font-semibold px-4 py-2 rounded-xl",
          success: "group-[.toaster]:bg-emerald-500/10 group-[.toaster]:border-emerald-500/20 group-[.toaster]:text-emerald-700 dark:group-[.toaster]:text-emerald-400",
          error: "group-[.toaster]:bg-red-500/10 group-[.toaster]:border-red-500/20 group-[.toaster]:text-red-700 dark:group-[.toaster]:text-red-400",
          warning: "group-[.toaster]:bg-amber-500/10 group-[.toaster]:border-amber-500/20 group-[.toaster]:text-amber-700 dark:group-[.toaster]:text-amber-400",
          info: "group-[.toaster]:bg-blue-500/10 group-[.toaster]:border-blue-500/20 group-[.toaster]:text-blue-700 dark:group-[.toaster]:text-blue-400",
        },
      }}
      {...props}
    />
  );
}

export { Toaster }
