import { StyleSheet } from "react-native";
import { Colors } from "../../../constants/Colors"; // Adjust import path as necessary

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.Primary,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerText: {
    fontSize: 24,
    color: Colors.TextPrimary,
  },
  categorySelector: {
    marginBottom: 16,
    paddingHorizontal: 5,
  },
  categoryButton: {
    paddingVertical: 8,
    minHeight: 40,
    maxHeight: 40,
    paddingHorizontal: 16,
    backgroundColor: Colors.CardBackground,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  activeCategoryButton: {
    backgroundColor: Colors.Error,
  },
  categoryText: {
    color: Colors.TextPrimary,
    fontSize: 16,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 20,
    color: Colors.TextPrimary,
    marginBottom: 8,
    marginTop: 16,
  },

  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: Colors.CardBackground,
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    color: Colors.TextPrimary,
    marginBottom: 16,
  },
  modalImage: {
    width: "100%",
    height: 250,
    marginBottom: 8,
    borderRadius: 10,
  },
  modalText: {
    color: Colors.TextPrimary,
    fontSize: 16,
    marginBottom: 8,
  },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    width: "100%",
  },
  optionButton: {
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
    backgroundColor: Colors.CardBackground,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 5,
    marginBottom: 20,
  },
  optionText: {
    color: Colors.TextPrimary,
    fontSize: 14,
    marginTop: 5,
  },
  dayButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: Colors.CardBackground,
    borderRadius: 5,
    marginBottom: 10,
    width: "100%",
    alignItems: "center",
  },
  dayText: {
    color: Colors.TextPrimary,
    fontSize: 16,
  },
  closeButton: {
    backgroundColor: Colors.Error,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  closeButtonText: {
    color: Colors.Secondary,
    fontSize: 16,
  }, modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  modalContainer: {
    width: "80%",
    backgroundColor: Colors.CardBackground,
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    elevation: 5, // Shadow for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.TextPrimary,
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 16,
    color: "#D3D3D3", // Whitish gray color for the challenge description
    marginBottom: 20,
    textAlign: "center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20, // Optional: Add space above the button row
  },
  actionButton: {
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: Colors.Secondary,
    fontSize: 12.5,
    fontWeight: "bold",
  },
});

export default styles;
