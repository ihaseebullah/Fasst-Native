import { Colors } from "../../../constants/Colors"; // Assuming Colors is correctly imported
import React from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Text,
} from "react-native";
import { BarChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

const CaloriesChart = ({ data, goal,loadingChartData }) => {
  const reversedData = data ? [...data].reverse() : []; 

  const chartData =
    reversedData.length > 0
      ? {
          labels: reversedData.map((item) => {
            // Create a Date object from the item.day string
            const date = new Date(item.day);
            // Get the short day name (Sun, Mon, etc.)
            return date.toLocaleDateString("en-US", { weekday: "short" });
          }),
          datasets: [
            {
              data: reversedData.map((item) => item.calories),
            },
          ],
        }
      : null;

  return (
    <View style={styles.chartContainer}>
      {!chartData && loadingChartData !=true ? (
        <View style={styles.loaderContainer}>
          <Text style={{color:Colors.Secondary}}>No Data yet</Text>
        </View>
      ) : (
        <View style={{ marginRight: 10 }}>
          <BarChart
            data={chartData}
            width={screenWidth - 80} // Adjusted Chart width for better fit
            height={200} // Chart height
            yAxisLabel=""
            fromZero={true} // Ensure bars start from zero
            withVerticalLabels={true} // Keep x-axis labels visible
            withHorizontalLabels={true} // Show horizontal labels
            chartConfig={{
              backgroundColor: Colors.Primary, // Background color for dark mode
              backgroundGradientFrom: Colors.Primary, // Gradient from primary color
              backgroundGradientTo: Colors.Primary, // Gradient to primary color
              decimalPlaces: 1, // No decimal places
              color: (opacity = 1) => `rgba(235,0,0,1)`, // Bar color matching dark theme
              labelColor: (opacity = 1) => Colors.TextPrimary, // X-axis label color for dark mode
              style: {
                borderRadius: 30,
              },
              propsForBackgroundLines: {
                stroke: Colors.CardBorder,
                strokeDasharray: "15",
              },
              barPercentage: 0.7, // Width of the bars
              barRadius: 10, // Rounded corners for bars
            }}
            verticalLabelRotation={0}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  chartContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    margin: 10,
    borderRadius: 15,
    backgroundColor: Colors.Primary, // Dark background color
    elevation: 18,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 220, // Same height as the chart to maintain layout consistency
  },
  caloriesSummaryText: {
    color: Colors.TextSecondary,
    fontSize: 16,
    marginTop: 10,
    textAlign: "center",
  },
  caloriesValueText: {
    color: Colors.Blue,
    fontWeight: "bold",
    marginLeft: 5,
  },
});

export default CaloriesChart;
