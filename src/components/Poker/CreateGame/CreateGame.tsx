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
import { addNewGame, addNewTicket } from '../../../service/games';
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
  const [role, setRole] = useState('');

	const [values, setValues] = useState<string[]>([]);

	const handleKeyUp = (e:any) => {
		if (e.target.value !== "" && ((e.keyCode === 32 || e.keyCode === 13)  || e.type === 'blur')) {
      e.preventDefault();

      const url = e.target.value;
      const regex = /(CMS|PW)-\d+/; // regular expression to match "CMS-xxxx" or "PW-xxxx"
      const match = url.match(regex); // find the first match of either "CMS-xxxx" or "PW-xxxx" in the url
      const val =  match ? match[0] : null; // return the matched string if found, or null if not
      if (val) {
        setValues((oldState) => {
          if (oldState.includes(val)) {
            return oldState
          }
          return [...oldState, val]
        });
        setTickets("");
      }
		}
	};

	const handleChange = (e: React.ChangeEvent<any>) => {
		setTickets(e.target.value);
  };

	const handleClick = ( item: string) => {
    const url = `https://vu-pmo.atlassian.net/browse/${item}`; // create URL by combining fixed string and item variable
    window.open(url, "_blank"); // open URL in a new browser tab
  };

  const handleDelete = ( item: string, index: number) =>{
    let arr = [...values]
    arr.splice(index,1)
    setValues(arr)
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    let tickets = [...values];
    const game: NewGame = {
      name: gameName,
      createdBy: createdBy,
      tickets: tickets,
      gameType: gameType,
      createdAt: new Date(),
      role: role,
    };
    const newGameId = await addNewGame(game);

    tickets.forEach(async (ticket) => {
      await addNewTicket(newGameId, ticket);
    })

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
              className='role-radio-group'
            >
              <RadioGroup
                defaultValue=""
                name="radio-buttons-group"
                onChange={(event: ChangeEvent<HTMLInputElement>) => setRole(event.target.value)}
              >
                <FormControlLabel value="DP" control={<Radio color="default"/>} label="DP" />
                <FormControlLabel value="Developer" control={<Radio color="default"/>} label="Developer" />
                <FormControlLabel value="QA" control={<Radio color="default"/>} label="QA" />
                <FormControlLabel value="Other" control={<Radio color="default"/>} label="Other" />
              </RadioGroup>
            </FormControl>

            <FormControl
              variant='outlined'
              classes={{root: "CreateGameChipField"}}
            >
              <div className={"container"}>
                {values.map((item,index) => (
                  <Chip
                    key={index}
                    size="medium"
                    onDelete={()=>handleDelete(item,index)}
                    onClick={()=>handleClick(item)}
                    label={item}
                  />
                ))}
              </div>
              <Input
                placeholder='https://vu-pmo.atlassian.net/browse/CMS-xxxx'
                className='CreateGameTextField'
                value={tickets}
                onBlur={handleKeyUp}
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
