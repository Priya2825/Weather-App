import React from "react";
import { render, waitFor, screen } from "@testing-library/react-native";
import axios from "axios";
import WeatherInfoScreen from "../src/screens/WeatherInfoScreen"; // Adjust the import path as necessary

// Mock axios module
jest.mock("axios");

describe("WeatherInfoScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("displays a loader while fetching data", () => {
    // Mock axios to simulate the fetching process
    axios.get.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(<WeatherInfoScreen />);

    // Check that the loader is displayed
    expect(screen.getByTestId("loader-container")).toBeTruthy();
  });

  it("renders air pollution data after successful fetch", async () => {
    // Mock axios to return sample air pollution data
    axios.get.mockResolvedValue({
      data: {
        list: [
          {
            dt: 1638409200,
            main: { aqi: 3 },
            components: { pm2_5: 15, pm10: 20 },
          },
          {
            dt: 1638495600,
            main: { aqi: 2 },
            components: { pm2_5: 10, pm10: 18 },
          },
        ],
      },
    });

    render(<WeatherInfoScreen />);

    // Wait for the data to be loaded
    await waitFor(() => {
      expect(screen.getByText("Air Pollution Forecast")).toBeTruthy();
      expect(screen.getByText("AQI: 3")).toBeTruthy();
      expect(screen.getByText("PM2.5: 15 μg/m³")).toBeTruthy();
      expect(screen.getByText("PM10: 20 μg/m³")).toBeTruthy();
    });
  });

  it("handles error when fetching data", async () => {
    // Mock axios to simulate an error
    axios.get.mockRejectedValue(new Error("Error fetching air pollution data"));

    render(<WeatherInfoScreen />);

    // Wait for the data to be processed
    await waitFor(() => {
      // The loader should not be visible after fetching fails
      expect(screen.queryByTestId("loader-container")).toBeNull();
      // No air pollution data should be displayed
      expect(screen.queryByText("AQI:")).toBeNull();
    });
  });
});
