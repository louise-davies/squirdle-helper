import React from "react";
import {
  Circle,
  CheckCircle,
  Cancel,
  SwapHorizontalCircle,
  ArrowCircleUpTwoTone,
  ArrowCircleDownTwoTone,
} from "@mui/icons-material";

interface GuessResponseProps {
  type: boolean;
}

type CommonStates = "correct" | "unselected";
type TypeStates = "wrong" | "swap";
type OtherStates = "lower" | "higher";

interface TypeState {
  isType: true;
  state: CommonStates | TypeStates;
}

interface OtherState {
  isType: false;
  state: CommonStates | OtherStates;
}

type GuessResponseState = TypeState | OtherState;

const GuessResponse: React.FC<GuessResponseProps> = (props) => {
  const { type } = props;

  const [state, setState] = React.useState<GuessResponseState>({
    isType: type,
    state: "unselected",
  });

  const onClick = React.useCallback(() => {
    if (state.isType) {
      switch (state.state) {
        case "unselected":
          setState({
            isType: state.isType,
            state: "correct",
          });
          break;
        case "correct":
          setState({
            isType: state.isType,
            state: "wrong",
          });
          break;
        case "wrong":
          setState({
            isType: state.isType,
            state: "swap",
          });
          break;
        case "swap":
          setState({
            isType: state.isType,
            state: "correct",
          });
          break;
      }
    } else {
      switch (state.state) {
        case "unselected":
          setState({
            isType: state.isType,
            state: "correct",
          });
          break;
        case "correct":
          setState({
            isType: state.isType,
            state: "higher",
          });
          break;
        case "higher":
          setState({
            isType: state.isType,
            state: "lower",
          });
          break;
        case "lower":
          setState({
            isType: state.isType,
            state: "correct",
          });
          break;
      }
    }
  }, [state.isType, state.state]);

  if (state.state === "unselected") {
    return <Circle onClick={onClick} />;
  } else if (state.state === "correct") {
    return <CheckCircle sx={{ color: "green" }} onClick={onClick} />;
  } else if (state.state === "wrong") {
    return <Cancel sx={{ color: "red" }} onClick={onClick} />;
  } else if (state.state === "swap") {
    return (
      <SwapHorizontalCircle sx={{ color: "goldenrod" }} onClick={onClick} />
    );
  } else if (state.state === "higher") {
    return (
      <ArrowCircleUpTwoTone sx={{ color: "dodgerblue" }} onClick={onClick} />
    );
  } else if (state.state === "lower") {
    return (
      <ArrowCircleDownTwoTone sx={{ color: "dodgerblue" }} onClick={onClick} />
    );
  }
  return null;
};

export default GuessResponse;
