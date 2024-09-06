import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";
import renderer from "react-test-renderer";
import IntroductionScreen from "../src/screens/IntroductionScreen";

// Snapshot Test
describe("IntroductionScreen", () => {
  it("introduction screen renders correctly", () => {
    const tree = renderer
      .create(<IntroductionScreen onFinish={() => {}} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});

// Rendering and Component Verification
describe("IntroductionScreen Rendering", () => {
  it("renders all essential components", () => {
    render(<IntroductionScreen onFinish={() => {}} />);

    // Verify the gradient background
    expect(screen.getByTestId("background-gradient")).toBeTruthy();

    // Verify the image
    const image = screen.getByTestId("intro-image");
    expect(image).toBeTruthy();
    expect(image.props.source).toEqual(require("../images/introImage.png"));

    // Verify the carousel
    expect(screen.getByTestId("introduction-carousel")).toBeTruthy();

    // Verify the button
    const button = screen.getByTestId("continue-button");
    expect(button).toBeTruthy();
  });
});

// Interaction Test
describe("IntroductionScreen Interactions", () => {
  it("calls onFinish when the button is pressed", () => {
    const onFinishMock = jest.fn();
    render(<IntroductionScreen onFinish={onFinishMock} />);

    const button = screen.getByTestId("continue-button");
    fireEvent.press(button);

    expect(onFinishMock).toHaveBeenCalled();
  });
});
