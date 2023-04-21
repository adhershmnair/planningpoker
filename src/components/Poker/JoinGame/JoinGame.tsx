import { Button, Card, CardActions, CardContent, CardHeader, Grow, TextField, Snackbar, FormControl, RadioGroup, FormControlLabel, Radio } from '@material-ui/core';
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { getGame } from '../../../service/games';
import { addPlayerToGame, isCurrentPlayerInGame } from '../../../service/players';
import Alert from '@material-ui/lab/Alert';
import './JoinGame.css';

export const JoinGame = () => {
  const history = useHistory();
  let { id } = useParams<{ id: string }>();

  const [joinGameId, setJoinGameId] = useState(id);
  const [playerName, setPlayerName] = useState('');
  const [gameFound, setIsGameFound] = useState(true);
  const [showNotExistMessage, setShowNotExistMessage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState('');

  useEffect(() => {
    async function fetchData() {
      if (joinGameId) {
        if (await getGame(joinGameId)) {
          setIsGameFound(true);
          if (await isCurrentPlayerInGame(joinGameId)) {
            history.push(`/game/${joinGameId}`);
          }
        }else {
          setShowNotExistMessage(true);
          setTimeout(() => {
            history.push('/');
          }, 5000)
        }
      }
    }
    fetchData();
  }, [joinGameId, history]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    if (joinGameId) {
      const res = await addPlayerToGame(joinGameId, playerName, role);

      setIsGameFound(res);
      if (res) {
        history.push(`/game/${joinGameId}`);
      }
      setLoading(false);
    }
  };

  return (
    <Grow in={true} timeout={500}>
      <div>
        <form onSubmit={handleSubmit}>
          <Card variant='outlined' className='JoinGameCard'>
            <CardHeader
              className='JoinGameCardHeader'
              title='Join a Planning Session.'
              titleTypographyProps={{ variant: 'h4' }}
            />
            <CardContent className='JoinGameCardContent'>
              <TextField
                error={!gameFound}
                helperText={!gameFound && 'Session not found, check the ID'}
                className='JoinGameTextField'
                required
                id='filled-required'
                label='Session ID'
                placeholder='xyz...'
                defaultValue={joinGameId}
                variant='outlined'
                onChange={(event: ChangeEvent<HTMLInputElement>) => setJoinGameId(event.target.value)}
              />
              <TextField
                className='JoinGameTextField'
                required
                id='filled-required'
                label='Your Name'
                placeholder='Enter your name'
                defaultValue={playerName}
                variant='outlined'
                onChange={(event: ChangeEvent<HTMLInputElement>) => setPlayerName(event.target.value)}
              />

              <FormControl
                className='JoinGameTextField role-radio-group'
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

            </CardContent>
            <CardActions className='JoinGameCardAction'>
              <Button type='submit' variant='contained' color='primary' className='JoinGameButton' disabled={loading}>
                Join
              </Button>
            </CardActions>
          </Card>
        </form>
        <Snackbar
          anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
          open={showNotExistMessage}
          autoHideDuration={5000}
          onClose={() => setShowNotExistMessage(false)}
        >
          <Alert severity='error'>Session was deleted and doesn't exist anymore!</Alert>
        </Snackbar>
      </div>
    </Grow>
  );
};
