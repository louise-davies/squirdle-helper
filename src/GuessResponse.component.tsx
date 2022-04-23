import React from "react";
import {
  Circle,
  CheckCircle,
  Cancel,
  SwapHorizontalCircle,
  ArrowCircleUpTwoTone,
  ArrowCircleDownTwoTone,
} from "@mui/icons-material";

type CommonStates = "correct" | "unselected";
type TypeSpecificStates = "wrong" | "swap";
type OtherSpecificStates = "lower" | "higher";
export type TypeStates = CommonStates | TypeSpecificStates;
export type OtherStates = CommonStates | OtherSpecificStates;

interface TypeState {
  type: true;
  state: TypeStates;
  onStateChange: (state: TypeStates) => void;
}

interface OtherState {
  type: false;
  state: OtherStates;
  onStateChange: (state: OtherStates) => void;
}

type GuessResponseProps = TypeState | OtherState;

const GuessResponse: React.FC<GuessResponseProps> = (props) => {
  const onClick = React.useCallback(() => {
    if (props.type) {
      switch (props.state) {
        case "unselected":
          props.onStateChange("correct");
          break;
        case "correct":
          props.onStateChange("wrong");
          break;
        case "wrong":
          props.onStateChange("swap");
          break;
        case "swap":
          props.onStateChange("correct");
          break;
      }
    } else {
      switch (props.state) {
        case "unselected":
          props.onStateChange("correct");
          break;
        case "correct":
          props.onStateChange("higher");
          break;
        case "higher":
          props.onStateChange("lower");
          break;
        case "lower":
          props.onStateChange("correct");
          break;
      }
    }
  }, [props]);

  if (props.state === "unselected") {
    return <Circle onClick={onClick} sx={{ height: "30px", width: "30px" }} />;
  } else if (props.state === "correct") {
    return (
      <CheckCircle
        sx={{ color: "green", height: "30px", width: "30px" }}
        onClick={onClick}
      />
    );
  } else if (props.state === "wrong") {
    return (
      <Cancel
        sx={{ color: "red", height: "30px", width: "30px" }}
        onClick={onClick}
      />
    );
  } else if (props.state === "swap") {
    return (
      <SwapHorizontalCircle
        sx={{ color: "goldenrod", height: "30px", width: "30px" }}
        onClick={onClick}
      />
    );
  } else if (props.state === "higher") {
    return (
      <ArrowCircleUpTwoTone
        sx={{ color: "dodgerblue", height: "30px", width: "30px" }}
        onClick={onClick}
      />
    );
  } else if (props.state === "lower") {
    return (
      <ArrowCircleDownTwoTone
        sx={{ color: "dodgerblue", height: "30px", width: "30px" }}
        onClick={onClick}
      />
    );
  }
  return null;
};

export default GuessResponse;
