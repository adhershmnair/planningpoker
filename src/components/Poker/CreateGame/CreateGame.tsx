import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  FormControlLabel,
  Grow,
  Radio,
  RadioGroup,
  TextField,
  Chip,
  FormControl,
	Input,
} from '@material-ui/core';
import React, { ChangeEvent, FormEvent, useState } from 'react';
import { uniqueNamesGenerator, Config, colors, animals } from 'unique-names-generator';
import { useHistory } from 'react-router-dom';
import { addNewGame } from '../../../service/games';
import { GameType, NewGame } from '../../../types/game';
import './CreateGame.css';

const gameNameConfig: Config = {
  dictionaries: [colors, animals],
  separator: ' ',
  style: 'capital',
}

export const CreateGame = () => {
  const history = useHistory();
  const [gameName, setGameName] = useState(uniqueNamesGenerator(gameNameConfig));
  const [createdBy, setCreatedBy] = useState('');
  const [gameType, setGameType] = useState(GameType.Normal);
  const [tickets, setTickets] = useState('');
  const [hasDefaults, setHasDefaults] = useState({ game: true, name: true });
  const [loading, setLoading] = useState(false);

	const [values, setValues] = useState<string[]>([]);

	const handleKeyUp = (e:any) => {
		if (e.target.value !== "" && (e.keyCode === 32 || e.keyCode === 13)) {
      e.preventDefault();
			setValues((oldState) => [...oldState, e.target.value]);
			setTickets("");
		}
	};

	const handleChange = (e: React.ChangeEvent<any>) => {
		setTickets(e.target.value);
  };

  const handleDelete = ( item: string, index: number) =>{
    let arr = [...values]
    arr.splice(index,1)
    console.log(item)
    setValues(arr)
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    const game: NewGame = {
      name: gameName,
      createdBy: createdBy,
      tickets: tickets,
      gameType: gameType,
      createdAt: new Date(),
    };
    const newGameId = await addNewGame(game);
    if(newGameId){
      setLoading(false);
    }
    history.push(`/game/${newGameId}`);
  };

  const emptyGameName = () => {
    if (hasDefaults.game) {
      setGameName('');
      hasDefaults.game = false;
      setHasDefaults(hasDefaults);
    }
  };
  const emptyCreatorName = () => {
    if (hasDefaults.name) {
      setCreatedBy('');
      hasDefaults.name = false;
      setHasDefaults(hasDefaults);
    }
  };

  return (
    <Grow in={true} timeout={1000}>
      <form onSubmit={handleSubmit}>
        <Card variant='outlined' className='CreateGameCard'>
          <CardHeader
            className='CreateGameCardHeader'
            title='Create New Planning Session'
            titleTypographyProps={{ variant: 'h4' }}
          />
          <CardContent className='CreateGameCardContent'>
            <TextField
              className='CreateGameTextField'
              required
              id='filled-required'
              label='Session Name'
              placeholder='Enter a session name'
              value={gameName || ''}
              onClick={() => emptyGameName()}
              variant='outlined'
              onChange={(event: ChangeEvent<HTMLInputElement>) => setGameName(event.target.value)}
            />
            <TextField
              className='CreateGameTextField'
              required
              id='filled-required'
              label='Your Name'
              placeholder='Enter your name'
              value={createdBy || ''}
              onClick={() => emptyCreatorName()}
              variant='outlined'
              onChange={(event: ChangeEvent<HTMLInputElement>) => setCreatedBy(event.target.value)}
            />

            <FormControl
              variant='outlined'
              classes={{root: "CreateGameChipField"}}
            >
              <div className={"container"}>
                {values.map((item,index) => (
                  <Chip key={index} size="small" onDelete={()=>handleDelete(item,index)} label={item}/>
                ))}
              </div>
              <Input
                placeholder='https://vu-pmo.atlassian.net/browse/CMS-xxxx'
                className='CreateGameTextField'
                value={tickets}
                onChange={handleChange}
                onKeyDown={handleKeyUp}
              />
            </FormControl>
            <RadioGroup
              className='HiddenRadio'
              aria-label='gender'
              name='gender1'
              value={gameType}
              onChange={(
                event: ChangeEvent<{
                  name?: string | undefined;
                  value: any;
                }>
              ) => setGameType(event.target.value)}
            >
              <FormControlLabel
                value={GameType.Normal}
                control={<Radio color='primary' size='small' />}
                label='Normal (1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15)'
              />
              <FormControlLabel
                value={GameType.Fibonacci}
                control={<Radio color='primary' size='small' />}
                label='Fibonacci (0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89)'
              />
              <FormControlLabel
                value={GameType.ShortFibonacci}
                control={<Radio color='primary' size='small' />}
                label='Short Fibonacci (0, ½, 1, 2, 3, 5, 8, 13, 20, 40, 100)'
              />
              <FormControlLabel
                value={GameType.TShirt}
                control={<Radio color='primary' size='small' />}
                label='T-Shirt (XXS, XS, S, M, L, XL, XXL)'
              />
            </RadioGroup>
          </CardContent>
          <CardActions className='CreateGameCardAction'>
            <Button type='submit' variant='contained' color='primary' className='CreateGameButton' data-testid="loading" disabled={loading}>
              Create
            </Button>
          </CardActions>
        </Card>
      </form>
    </Grow>
  );
};
