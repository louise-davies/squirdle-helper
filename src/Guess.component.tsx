import { Autocomplete, Box, TextField } from "@mui/material";
import React from "react";
import { Pokedex } from "./pokedex";
import GuessResponse from "./GuessResponse.component";

interface GuessProps {
  pokedex: Pokedex;
}

const Guess: React.FC<GuessProps> = (props) => {
  const { pokedex } = props;
  const options = Object.keys(pokedex);

  const [value, setValue] = React.useState("");

  return (
    <Box display="flex" alignItems="center">
      <Autocomplete
        disablePortal
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue ?? "");
        }}
        sx={{ width: 300 }}
        options={options}
        renderInput={(params) => <TextField {...params} label="Pokémon" />}
      />
      <Box>
        <GuessResponse type={false} />
        <GuessResponse type={true} />
        <GuessResponse type={true} />
        <GuessResponse type={false} />
        <GuessResponse type={false} />
      </Box>
    </Box>
  );
};

export default Guess;
