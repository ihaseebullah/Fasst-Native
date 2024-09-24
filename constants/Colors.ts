  // Define tint colors for light and dark themes
  const tintColorLight = "#0a7ea4";
  const tintColorDark = "#fff";

  // Define Colors object to support both themes
  export const Colors = {
    // Base colors
    Secondary: "#FFFFFF", // Light color for text/icons on dark backgrounds
    Primary: "#151311", // Dark background color
    Blue: "#EC2426", // Blue accent color

    // Lighter shades for cards, sections, etc.
    CardBackground: "#2b2b2b", // Darker gray for card backgrounds
    CardBorder: "#383838", // Slightly lighter border color for cards

    // Text colors
    TextPrimary: "#E5E5E5", // Light gray for primary text
    TextSecondary: "#A5A5A5", // Gray for secondary text

    // Accent colors
    Success: "#4CAF50", // Green for success messages
    Error: "#FF4C4C", // Red for error messages

    // Additional colors
    PT: "#2b2b2b", // Darker gray for primary theme background
    ST: "#000000", // Pure black for certain elements, if needed

    // Tint colors for various UI elements
    TintColorLight: tintColorLight,
    TintColorDark: tintColorDark,
  };
