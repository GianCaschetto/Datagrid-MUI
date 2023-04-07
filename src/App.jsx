import React from "react";
import { Container, Typography } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import DataGrid from "./Components/DataGridTable";

function App() {
  //Dark mode default
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? "dark" : "light",
        },
      }),
    [prefersDarkMode]
  );
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Typography
        variant="h3"
        sx={{ textAlign: "center", fontFamily: "Roboto" }}
      >
        FBI Wanted
      </Typography>
      <DataGrid />
    </ThemeProvider>
  );
}
export default App;
