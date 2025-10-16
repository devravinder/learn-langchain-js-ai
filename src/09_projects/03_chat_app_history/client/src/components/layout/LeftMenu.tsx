import { Fragment } from "react/jsx-runtime";
import { Button } from "../ui/button.js";
import { Menu } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

export default function LeftMenu() {
  const { theme, setTheme } = useTheme();

  return (
    <Fragment>
      <div className="hidden md:flex h-[100dvh] border border-r min-w-xs"></div>
      <div className="absolute md:hidden left-0 flex flex-col p-2 z-50">
        <Button
          variant={"ghost"}
          size={"icon"}
          onClick={() => setTheme(theme == "light" ? "dark" : "light")}
          className="h-9 w-9"
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>
    </Fragment>
  );
}
