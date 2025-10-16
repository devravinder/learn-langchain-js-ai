import ThemeToggle from "../ThemeToggle.js";

export default function RightMenu() {
  return (
    <div className="absolute right-0 flex flex-col p-2 z-50">
        <ThemeToggle />
    </div>
  );
}
