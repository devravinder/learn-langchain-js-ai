import MainLayout from "./components/layout/MainLayout.js";
import { ThemeProvider } from "./hooks/useTheme.js";

export default function App() {
  return (
    <ThemeProvider>
      <div className="h-[100dvh] bg-background">
        <MainLayout />
      </div>
    </ThemeProvider>
  );
}