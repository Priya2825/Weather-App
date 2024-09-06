import React from "react";
import { render, screen } from "@testing-library/react-native";
import ReportScreen from "../src/screens/ReportScreen";
import { NavigationContainer } from "@react-navigation/native";

// Mock Data
const mockData = [
  {
    dt: 1636339200,
    main: { temp: 22 },
    weather: [{ main: "Clear" }],
  },
  {
    dt: 1636425600,
    main: { temp: 24 },
    weather: [{ main: "Cloudy" }],
  },
  // Add more mock items if needed
];

const mockRoute = {
  params: {
    data: mockData,
    name: "Test City",
  },
};

const mockNavigation = {
  navigate: jest.fn(),
};

describe("ReportScreen", () => {
  it("renders correctly with given data", () => {
    const tree = render(
      <NavigationContainer>
        <ReportScreen route={mockRoute} navigation={mockNavigation} />
      </NavigationContainer>
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it("displays the header text", () => {
    render(
      <NavigationContainer>
        <ReportScreen route={mockRoute} navigation={mockNavigation} />
      </NavigationContainer>
    );

    expect(screen.getByText("Forecast report")).toBeTruthy();
  });

  it("displays the today section with hourly forecast", () => {
    render(
      <NavigationContainer>
        <ReportScreen route={mockRoute} navigation={mockNavigation} />
      </NavigationContainer>
    );

    expect(screen.getByText("Today")).toBeTruthy();
    // Assuming HorizontalFlatlist renders correctly
  });

  it("displays the next forecast section with data", () => {
    render(
      <NavigationContainer>
        <ReportScreen route={mockRoute} navigation={mockNavigation} />
      </NavigationContainer>
    );

    expect(screen.getByText("Next forecast: Test City")).toBeTruthy();
    expect(screen.getByText("2021-11-08")).toBeTruthy(); // Replace with date based on mockData
    expect(screen.getByText("22°C")).toBeTruthy(); // Replace with temperature based on mockData
    expect(screen.getByText("Clear")).toBeTruthy(); // Replace with weather based on mockData
  });

  it("renders the flat list correctly", () => {
    render(
      <NavigationContainer>
        <ReportScreen route={mockRoute} navigation={mockNavigation} />
      </NavigationContainer>
    );

    expect(screen.getAllByTestId("listitem").length).toBe(mockData.length);
  });
});
