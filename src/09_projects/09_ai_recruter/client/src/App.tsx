import { ThemeProvider } from "./hooks/useTheme.js";
import Routes from "./routes/index.js";

export default function App() {
  return (
    <ThemeProvider>
        <Routes />
    </ThemeProvider>
  );
}