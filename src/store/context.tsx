import React, { Dispatch, SetStateAction, useState } from 'react';

import { ARAM, NORMAL } from '../components/LeagueRandomized';
import useGetChampion from '../hooks/useGetChampion';

export interface Role {
  roleName: string;
  roleImg: string;
}
export interface Champion {
  championName: string;
  championImage_url: string;
}

export interface PlayerChampion {
  champion: Champion;
  role: Role;
}
interface Player {
  playerName: string | string[];
  playerChampion: PlayerChampion;
}

interface Props {
  children: JSX.Element;
}

interface BtnContext {
  chosenGameMode: string | undefined;
  setChosenGameMode: Dispatch<SetStateAction<string | undefined>>;
  playerInputs: string[];
  setPlayerInputs: Dispatch<SetStateAction<string[]>>;
  setPlayersNumber: Dispatch<SetStateAction<number>>;
  playersNumber: number;
  players: Array<Player>;
  setPlayers: Dispatch<SetStateAction<Array<Player>>>;
  currentPlayerIndex: number;
  setCurrentPlayerIndex: Dispatch<SetStateAction<number>>;
  setIsFormVisible: Dispatch<SetStateAction<boolean>>;
  isFormVisible: boolean;
  setIsInputFocused: Dispatch<SetStateAction<boolean>>;
  isInputFocused: boolean;
  submitHandler: () => void;
  setButtonClickCounter: Dispatch<SetStateAction<number>>;
  buttonClickCounter: number;
  setCheckedGameModes: Dispatch<SetStateAction<string[]>>;
  checkedGameModes: string[];
  currentPlayersName: string | string[] | undefined;
  setCurrentPlayersName: Dispatch<SetStateAction<string | string[] | undefined>>;
}

export const BtnContext = React.createContext<BtnContext>({
  chosenGameMode: undefined,
  setChosenGameMode: () => undefined,
  submitHandler: () => undefined,
  playerInputs: [],
  setPlayerInputs: () => ['Summoner 1'],
  setPlayersNumber: () => 1,
  playersNumber: 1,
  players: [],
  setPlayers: () => undefined,
  setButtonClickCounter: () => 0,
  buttonClickCounter: 0,
  setCurrentPlayerIndex: () => 1,
  currentPlayerIndex: 1,
  setIsFormVisible: () => false,
  isFormVisible: false,
  isInputFocused: true,
  setIsInputFocused: () => true,
  setCheckedGameModes: () => [],
  checkedGameModes: [],
  currentPlayersName: '',
  setCurrentPlayersName: () => '',
});

const BtnContextProvider = ({ children }: Props) => {
  const [chosenGameMode, setChosenGameMode] = useState<string | undefined>();
  const [buttonClickCounter, setButtonClickCounter] = useState(0);
  const [checkedGameModes, setCheckedGameModes] = useState<string[]>([NORMAL, ARAM]);

  const [players, setPlayers] = useState<Array<Player>>([]);
  const [playerInputs, setPlayerInputs] = useState<string[]>(['Summoner 1']);
  const [playersNumber, setPlayersNumber] = useState(1);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(1);
  const [currentPlayersName, setCurrentPlayersName] = useState<string | string[]>();

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(true);

  const randomModeHandler = () => {
    let gameMode: string[] = [''];
    gameMode = [...checkedGameModes];
    const randomGameMode = gameMode[Math.floor(Math.random() * gameMode.length)];
    setChosenGameMode(randomGameMode);
  };

  const aramRandomModeHandler = () => {
    if (checkedGameModes.length === 1 && checkedGameModes.includes(ARAM)) {
      setChosenGameMode(undefined);
      setButtonClickCounter((prevCounter) => prevCounter - 1);
    } else {
      console.log(chosenGameMode);
      randomModeHandler();
    }
  };

  const getPlayersHandler = () => {
    const playerList = [];
    let lane = ['TOP', 'JUNGLE', 'MIDDLE', 'BOTTOM', 'SUPPORT'];

    for (let i = 0; i < playersNumber; i++) {
      const playerRole: string = lane[Math.floor(Math.random() * lane.length)];
      const playerChampion = useGetChampion(playerRole);
      lane = lane.filter((usedRole) => usedRole !== playerRole);
      playerList.push({
        playerName: playerInputs[i],
        playerChampion,
      });
    }

    setPlayers(playerList);
    setPlayerInputs(['Summoner 1']);
  };

  const submitHandler = () => {
    switch (buttonClickCounter) {
      case 0:
        randomModeHandler();
        setButtonClickCounter((prevCounter) => prevCounter + 1);
        break;
      case 1:
        //gameMode is rendered
        if (chosenGameMode === ARAM) {
          aramRandomModeHandler();
        } else {
          setButtonClickCounter((prevCounter) => prevCounter + 1);
          getPlayersHandler();
        }
        break;
      case 2:
        //Players are rendered
        setButtonClickCounter((prevCounter) => prevCounter + 1);
        break;
      case 3:
        // Role is rendered
        setButtonClickCounter((prevCounter) => prevCounter + 1);
        break;
      case 4:
        // champion is rendered
        if (currentPlayerIndex < 6) {
          setCurrentPlayerIndex((prevIndex) => prevIndex + 1);
          setButtonClickCounter((prevCounter) => prevCounter - 2);
          console.log(buttonClickCounter);
        } else {
          setButtonClickCounter(2);
        }
        break;
    }
  };

  return (
    <BtnContext.Provider
      value={{
        chosenGameMode,
        setChosenGameMode,
        submitHandler,
        playerInputs,
        setPlayerInputs,
        setPlayersNumber,
        playersNumber,
        players,
        setPlayers,
        setCurrentPlayerIndex,
        currentPlayerIndex,
        buttonClickCounter,
        isFormVisible,
        setIsFormVisible,
        isInputFocused,
        setIsInputFocused,
        setButtonClickCounter,
        setCheckedGameModes,
        checkedGameModes,
        currentPlayersName,
        setCurrentPlayersName,
      }}
    >
      {children}
    </BtnContext.Provider>
  );
};

export default BtnContextProvider;
