import { ThemeProvider } from "./hooks/useTheme.js";
import Routes from "./routes/index.js";

export default function App() {
  return (
    <ThemeProvider>
      <div className="h-[100dvh] bg-background">
        <Routes />
      </div>
    </ThemeProvider>
  );
}