import MainLayout from "./components/layout/MainLayout";
import { ThemeProvider } from "./hooks/useTheme";

export default function App() {
  return (
    <ThemeProvider>
      <div className="h-[100dvh] bg-background">
        <MainLayout />
      </div>
    </ThemeProvider>
  );
}
