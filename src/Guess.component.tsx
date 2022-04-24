import {
  Autocomplete,
  autocompleteClasses,
  Box,
  TextField,
  Popper,
  styled,
} from "@mui/material";
import React from "react";
import { Pokedex, PokedexEntry } from "./pokedex";
import GuessResponse, {
  OtherStates,
  TypeStates,
} from "./GuessResponse.component";
import { ListChildComponentProps, VariableSizeList } from "react-window";

export interface GuessType {
  pokemon: string | null;
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

const LISTBOX_PADDING = 8; // px

function renderRow(props: ListChildComponentProps): React.ReactElement {
  const { data, index, style } = props;
  const dataSet = data[index];
  const inlineStyle = {
    ...style,
    top: (style.top as number) + LISTBOX_PADDING,
  };

  return (
    <Box
      style={inlineStyle}
      {...dataSet[0]}
      component={"li"}
      display="flex"
      flexDirection="column"
    >
      <Box sx={{ fontWeight: 600 }}>{dataSet[1][0]}</Box>
      <Box sx={{ fontSize: "14px" }}>{`Gen ${dataSet[1][1][0]}, ${
        dataSet[1][1][1]
      }/${dataSet[1][1][2] || "None"}, ${dataSet[1][1][3]}m, ${
        dataSet[1][1][4]
      }kg`}</Box>
    </Box>
  );
}

const OuterElementContext = React.createContext({});

const OuterElementType = React.forwardRef<HTMLDivElement>((props, ref) => {
  const outerProps = React.useContext(OuterElementContext);
  return <div ref={ref} {...props} {...outerProps} />;
});
OuterElementType.displayName = "OuterElementType";

function useResetCache(
  data: number
): React.RefObject<VariableSizeList<unknown>> {
  const ref = React.useRef<VariableSizeList>(null);
  React.useEffect(() => {
    if (ref.current != null) {
      ref.current.resetAfterIndex(0, true);
    }
  }, [data]);
  return ref;
}

// Adapter for react-window
const ListboxComponent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLElement>
>(function ListboxComponent(props, ref) {
  const { children, ...other } = props;
  const itemData: React.ReactChild[] = [];
  (children as React.ReactChild[]).forEach((item) => {
    itemData.push(item);
  });

  const itemCount = itemData.length;
  const itemSize = 54;

  const getHeight = (): number => {
    if (itemCount > 8) {
      return 8 * itemSize;
    }
    return itemCount * itemSize;
  };

  const gridRef = useResetCache(itemCount);

  return (
    <div ref={ref}>
      <OuterElementContext.Provider value={other}>
        <VariableSizeList
          itemData={itemData}
          height={getHeight() + 2 * LISTBOX_PADDING}
          width="100%"
          ref={gridRef}
          outerElementType={OuterElementType}
          innerElementType="ul"
          itemSize={() => itemSize}
          overscanCount={5}
          itemCount={itemCount}
        >
          {renderRow}
        </VariableSizeList>
      </OuterElementContext.Provider>
    </div>
  );
});

const StyledPopper = styled(Popper)({
  [`& .${autocompleteClasses.listbox}`]: {
    boxSizing: "border-box",
    "& ul": {
      padding: 0,
      margin: 0,
    },
  },
});

const Guess: React.FC<GuessProps> = (props) => {
  const { pokedex, guess, onGuessChange } = props;
  const options = React.useMemo(() => Object.entries(pokedex), [pokedex]);

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
        value={pokemon ? [pokemon, pokedex[pokemon]] : null}
        onChange={(event, newValue) => {
          setGuessPartial({
            pokemon: newValue?.[0] ?? "",
          });
        }}
        isOptionEqualToValue={(option, value) => option?.[0] === value?.[0]}
        sx={{ width: 300, padding: "10px" }}
        disableListWrap
        PopperComponent={StyledPopper}
        ListboxComponent={ListboxComponent}
        options={options}
        getOptionLabel={(option: [string, PokedexEntry]) => option[0]}
        renderInput={(params) => <TextField {...params} label="Pokémon" />}
        // this is taken directly from MUI docs yet TS complains...
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        renderOption={(props, option) => [props, option]}
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
