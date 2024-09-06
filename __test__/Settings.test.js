import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Setting from "../src/screens/Settings";
import { NavigationContainer } from "@react-navigation/native";

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

describe("Setting Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly with given data", () => {
    const tree = render(
      <NavigationContainer>
        <Setting />
      </NavigationContainer>
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it("loads the notification setting from AsyncStorage", async () => {
    // Mock AsyncStorage value (notification is enabled)
    AsyncStorage.getItem.mockResolvedValue("true");

    const { getByTestId } = render(<Setting />);

    // Wait for async data to load and the state to be updated
    await waitFor(() => {
      const switchElement = getByTestId("switch");
      expect(switchElement.props.value).toBe(true);
    });
  });

  it("updates AsyncStorage when the switch is toggled on", async () => {
    AsyncStorage.getItem.mockResolvedValue("false");

    const { getByTestId } = render(<Setting />);
    const switchElement = getByTestId("switch");

    // Simulate toggling the switch to 'on'
    fireEvent(switchElement, "valueChange", true);

    // Check that the switch is enabled
    expect(switchElement.props.value).toBe(true);

    // Wait for AsyncStorage.setItem to be called with the correct value
    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        "notification-enabled",
        "true"
      );
    });
  });
});
