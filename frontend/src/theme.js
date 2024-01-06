import { createTheme, responsiveFontSizes } from "@mui/material";

// Custom colors
const primary = "#f23005";
const secondary = "#f27405";
const white = "#f9eef2";
const black = "#232b2b";
const darkBlack = "#0e1111";
const background = "#f5f5f5";
const warningLight = "rgba(253, 200, 69, .3)";
const warningMain = "rgba(253, 200, 69, .5)";
const warningDark = "rgba(253, 200, 69, .7)";
const borderColor = "rgba(0, 0, 0, 0.13)";

// Custom breakpoints
const xl = 1920;
const lg = 1280;
const md = 960;
const sm = 600;
const xs = 0;

// Spacing
const spacing = 8;

// Function to return design tokens based on mode
const getDesignTokens = (mode) => ({
  palette: {
    mode,
    primary: { main: primary },
    secondary: { main: secondary },
    common: {
      white,
      black,
      darkBlack
    },
    warning: {
      light: warningLight,
      main: warningMain,
      dark: warningDark
    },
    background: {
      default: mode === 'light' ? background : darkBlack,
    },
    text: {
      primary: mode === 'light' ? black : white,
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
    tonalOffset: 0.2,
  },
  breakpoints: {
    values: {
      xl,
      lg,
      md,
      sm,
      xs
    }
  },
  border: {
    borderColor: borderColor,
    borderWidth: 2
  },
  overrides: {
    MuiExpansionPanel: {
      root: {
        position: "static"
      }
    },
    MuiTableCell: {
      root: {
        paddingLeft: spacing * 2,
        paddingRight: spacing * 2,
        borderBottom: `2px solid ${borderColor}`,
        [`@media (max-width:  ${sm}px)`]: {
          paddingLeft: spacing,
          paddingRight: spacing
        }
      }
    },
    MuiDivider: {
      root: {
        backgroundColor: borderColor,
        height: 2
      }
    },
    MuiPrivateNotchedOutline: {
      root: {
        borderWidth: 2
      }
    },
    MuiListItem: {
      divider: {
        borderBottom: `2px solid ${borderColor}`
      }
    },
    MuiDialog: {
      paper: {
        width: "100%",
        maxWidth: 430,
        marginLeft: spacing,
        marginRight: spacing,
        backgroundColor: black,
      }
    },
    MuiTooltip: {
      tooltip: {
        backgroundColor: darkBlack
      }
    },
    MuiExpansionPanelDetails: {
      root: {
        [`@media (max-width:  ${sm}px)`]: {
          paddingLeft: spacing,
          paddingRight: spacing
        }
      }
    },
    MuiSnackbar: {
        backgroundColor: black,
    }
  },
  spacing: 8
});

// Create a theme instance with the dark mode
const theme = responsiveFontSizes(createTheme(getDesignTokens('dark')));

export default theme;
