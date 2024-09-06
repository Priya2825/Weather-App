import React from "react";
import HomeScreen from "../src/screens/HomeScreen"; // Adjust the path as needed
import AsyncStorage from "@react-native-async-storage/async-storage";
import renderer from "react-test-renderer";
import {
  render,
  waitFor,
  fireEvent,
  screen,
} from "@testing-library/react-native";
import api from "../Utils/API";
// import api from "../Utils/API";

// Mock AsyncStorage and axios
jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

jest.mock("../Utils/API");

describe("HomeScreen", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks between tests
  });

  it("renders correctly snapshot", async () => {
    const tree = renderer.create(<HomeScreen />).toJSON();
    await waitFor(() => {
      expect(tree).toMatchSnapshot();
    });
  });

  it("should render correctly", async () => {
    // Mock AsyncStorage to return no saved coordinates
    AsyncStorage.getItem.mockResolvedValue(null);

    const { getByPlaceholderText, getByText } = render(<HomeScreen />);

    // Wait for state updates and effects to complete
    await waitFor(() => {
      // Check if the search bar is rendered
      expect(getByPlaceholderText("Search and Add Cities")).toBeTruthy();

      // Check if some placeholder text or a default element is rendered, like a message or empty list
      expect(getByText("No Cities Added! Please Add City!")).toBeTruthy(); // Assuming you have this text when there's no data
    });
  });

  it("should render saved cities from AsyncStorage", async () => {
    // Mock saved city data
    const savedCities = JSON.stringify([
      { lat: 10, lon: 10, name: "City1" },
      { lat: 20, lon: 20, name: "City2" },
    ]);

    // Mock AsyncStorage to return saved cities
    AsyncStorage.getItem.mockResolvedValue(savedCities);

    // Mock API responses
    api.get.mockImplementation((url, { params }) => {
      if (url === "/weather") {
        if (params.lat === 10 && params.lon === 10) {
          return Promise.resolve({
            data: {
              coord: { lat: 10, lon: 10 },
              name: "City1",
              main: { temp: 25 },
              weather: [{ main: "Sunny", description: "clear sky" }],
            },
          });
        } else if (params.lat === 20 && params.lon === 20) {
          return Promise.resolve({
            data: {
              coord: { lat: 20, lon: 20 },
              name: "City2",
              main: { temp: 30 },
              weather: [{ main: "Cloudy", description: "overcast clouds" }],
            },
          });
        }
        return Promise.reject(new Error("Unknown coordinates"));
      }
      return Promise.reject(new Error("Invalid URL"));
    });

    const { getByText } = render(<HomeScreen />);

    await waitFor(() => {
      // Verify that weather data is rendered
      expect(getByText("City1")).toBeTruthy();
      expect(getByText("25°C")).toBeTruthy();
      expect(getByText("Sunny")).toBeTruthy();

      expect(getByText("City2")).toBeTruthy();
      expect(getByText("30°C")).toBeTruthy();
      expect(getByText("Cloudy")).toBeTruthy();
    });
  });

  //   // 2. Test adding a city by mocking an API call and rendering the city
  //   it("should add a city and render it", async () => {
  //     // Mock an empty AsyncStorage
  //     AsyncStorage.getItem.mockResolvedValue(null);

  //     // Mock axios response for the API call
  //     api.get.mockResolvedValue({
  //       data: {
  //         coord: { lat: 1.4002, lon: 103.8147 },
  //         name: "London",
  //         main: { temp: 25 },
  //         weather: [{ main: "Cloudy", description: "overcast clouds" }],
  //       },
  //     });

  //     const { getByPlaceholderText, getByText } = render(<HomeScreen />);

  //     // Simulate entering a city name and adding it
  //     const input = getByPlaceholderText("Search and Add Cities");
  //     fireEvent.changeText(input, "London");

  //     // Simulate API call to add city (e.g., on button press)
  //     fireEvent.press(getByText("Add")); // Assuming there's a button with this label

  //     // Wait for the city to be added and rendered
  //     await waitFor(() => {
  //       expect(getByText("London")).toBeTruthy();
  //       expect(getByText("25°C")).toBeTruthy(); // Assuming temperature is displayed
  //       expect(getByText("Cloudy")).toBeTruthy();
  //     });
  //   });

  it("should add a city and render it", async () => {
    // Mock AsyncStorage with no saved cities initially
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify([]));

    // Mock API call for London
    api.get.mockResolvedValue({
      data: {
        coord: { lat: 20, lon: 20 },
        name: "London",
        main: { temp: 30 },
        weather: [{ main: "Cloudy", description: "overcast clouds" }],
      },
    });

    // Render the HomeScreen
    const { getByPlaceholderText, getByText, queryByText, debug } = render(
      <HomeScreen />
    );

    // Simulate search input
    const searchInput = getByPlaceholderText("Search and Add Cities");
    fireEvent.changeText(searchInput, "London");

    // Wait for any error messages to ensure no errors
    await waitFor(() => {
      expect(queryByText("Country not found")).toBeNull();
    });

    // Simulate pressing the "Add" button to add the city
    const addButton = getByText("Add"); // Assuming the "Add" button exists after search
    fireEvent.press(addButton);

    // Mock AsyncStorage to return the added city after the button press
    AsyncStorage.getItem.mockResolvedValueOnce(
      JSON.stringify([{ lat: 20, lon: 20, name: "London" }])
    );

    // Wait for the city to be rendered in the list
    await waitFor(() => {
      expect(getByText("London")).toBeTruthy(); // City name
      expect(getByText("30°C")).toBeTruthy(); // Assuming temperature display
      expect(getByText("Cloudy")).toBeTruthy(); // Assuming weather description
    });
  });
});
