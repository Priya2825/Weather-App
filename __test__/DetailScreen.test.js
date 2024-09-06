import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react-native";
import renderer from "react-test-renderer";
import { NavigationContainer } from "@react-navigation/native";
import DetailScreen from "../src/screens/DetailScreen";
import axios from "axios";

// Mock the axios module
jest.mock("axios");
const mockedAxios = axios;

const mockNavigation = {
  navigate: jest.fn(),
};

const mockRoute = {
  params: {
    coord: { lat: 12.34, lon: 56.78 },
    name: "Test City",
    weatherIcon: "http://openweathermap.org/img/wn/01d.png",
    main: { temp: 25, humidity: 60 },
    weather: [{ main: "Clear", description: "clear sky", icon: "01d" }],
    wind: { speed: 10 },
    backgroundColor: "#FFFAF0",
  },
};

describe("DetailScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly", () => {
    const tree = renderer
      .create(
        <NavigationContainer>
          <DetailScreen route={mockRoute} navigation={mockNavigation} />
        </NavigationContainer>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it("should render the weather data and essential components", async () => {
    // Mock the API response
    mockedAxios.get.mockResolvedValue({
      data: {
        list: [
          {
            dt_txt: "2024-09-06 12:00:00",
            main: { temp: 25 },
            weather: [{ icon: "01d" }],
          },
        ],
      },
    });

    render(
      <NavigationContainer>
        <DetailScreen route={mockRoute} navigation={mockNavigation} />
      </NavigationContainer>
    );

    // Check if essential components are rendered
    expect(screen.getByText("Test City")).toBeTruthy();
    expect(screen.getByText("25°C")).toBeTruthy();
    expect(screen.getByText("Clear")).toBeTruthy();

    // Check if the weather icon is rendered
    const weatherIcon = screen.getByTestId("weather-icon");

    await waitFor(() => {
      expect(weatherIcon.props.source).toBe(
        "http://openweathermap.org/img/wn/01d.png"
      );
    });
  });

  it('should navigate to ReportScreen when "Show full report" button is pressed', async () => {
    // Mock the API response
    mockedAxios.get.mockResolvedValue({
      data: {
        list: [
          {
            dt_txt: "2024-09-06 12:00:00",
            main: { temp: 25 },
            weather: [{ icon: "01d" }],
          },
        ],
      },
    });

    render(
      <NavigationContainer>
        <DetailScreen route={mockRoute} navigation={mockNavigation} />
      </NavigationContainer>
    );

    // Press the button and check navigation
    fireEvent.press(screen.getByText("Show full report"));
    await waitFor(() => {
      expect(mockNavigation.navigate).toHaveBeenCalledWith("Report", {
        data: expect.any(Array),
        name: "Test City",
      });
    });
  });

  it("should fetch hourly forecast data and update state", async () => {
    // Mock the API response
    mockedAxios.get.mockResolvedValue({
      data: {
        list: [
          {
            dt_txt: "2024-09-06 12:00:00",
            main: { temp: 25 },
            weather: [{ icon: "01d" }],
          },
        ],
      },
    });

    render(
      <NavigationContainer>
        <DetailScreen route={mockRoute} navigation={mockNavigation} />
      </NavigationContainer>
    );

    await waitFor(() => {
      // Verify if the hourly forecast data is processed
      expect(screen.getByText("25°C")).toBeTruthy();
    });
  });
});
