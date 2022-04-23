import { Autocomplete, Box, TextField } from "@mui/material";
import React from "react";
import { Pokedex } from "./pokedex";
import GuessResponse, {
  OtherStates,
  TypeStates,
} from "./GuessResponse.component";

export interface GuessType {
  pokemon: string;
  gen: OtherStates;
  type1: TypeStates;
  type2: TypeStates;
  height: OtherStates;
  weight: OtherStates;
}

interface GuessProps {
  pokedex: Pokedex;
  guess: GuessType;
  onGuessChange: (guess: GuessType) => void;
}

const Guess: React.FC<GuessProps> = (props) => {
  const { pokedex, guess, onGuessChange } = props;
  const options = Object.keys(pokedex);

  const { pokemon, gen, type1, type2, height, weight } = guess;
  const setGuessPartial = React.useCallback(
    (partialGuess: Partial<GuessType>) => {
      onGuessChange({
        ...guess,
        ...partialGuess,
      });
    },
    [guess, onGuessChange]
  );

  return (
    <Box display="flex" alignItems="center">
      <Autocomplete
        disablePortal
        value={pokemon}
        onChange={(event, newValue) => {
          setGuessPartial({
            pokemon: newValue ?? "",
          });
        }}
        sx={{ width: 300, padding: "10px" }}
        options={options}
        renderInput={(params) => <TextField {...params} label="Pokémon" />}
      />
      <Box sx={{ whiteSpace: "nowrap" }}>
        <GuessResponse
          type={false}
          state={gen}
          onStateChange={(gen) => setGuessPartial({ gen })}
        />
        <GuessResponse
          type={true}
          state={type1}
          onStateChange={(type1) => setGuessPartial({ type1 })}
        />
        <GuessResponse
          type={true}
          state={type2}
          onStateChange={(type2) => setGuessPartial({ type2 })}
        />
        <GuessResponse
          type={false}
          state={height}
          onStateChange={(height) => setGuessPartial({ height })}
        />
        <GuessResponse
          type={false}
          state={weight}
          onStateChange={(weight) => setGuessPartial({ weight })}
        />
      </Box>
    </Box>
  );
};

export default Guess;
