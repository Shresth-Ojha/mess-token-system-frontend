import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { red } from '@mui/material/colors';
import { useStore } from '../store/storeWrapper';
import { useEffect, useState } from 'react';

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme({
    palette: {
        primary: {
            main: '#556cd6',
        },
        secondary: {
            main: '#19857b',
        },
        error: {
            main: red.A400,
        },
    },
});

export const Home = () => {
    const { user, userTokenStatus, setUserTokenStatus } = useStore();

    const [date, setDate] = useState(new Date());
    // console.log('from home =', user);

    const getToken = async () => {
        const requestOptions = {
            method: 'POST',
            body: JSON.stringify({ gID: user.sub }),
            redirect: 'follow',
            credentials: 'include',
        };

        const res = await fetch(
            import.meta.env.VITE_BACKEND + '/token',
            requestOptions
        );

        const resBody = await res.json();
        if ('data' in resBody) {
            setUserTokenStatus(resBody.data);
        } else {
            console.log('wohoo error here');
        }
    };

    const useToken = async () => {
        const requestOptions = {
            method: 'POST',
            body: JSON.stringify({ gID: user.sub }),
            redirect: 'follow',
            credentials: 'include',
        };

        const res = await fetch(
            import.meta.env.VITE_BACKEND + '/token/use',
            requestOptions
        );
        const resBody = await res.json();

        if ('data' in resBody) {
            if (resBody.data === 'already used') {
                console.log('Already used before');
            } else {
                setUserTokenStatus(true);
            }
        } else {
            console.log("User doesn't exist, or some problem occurred.");
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        location.reload();
    };

    setInterval(() => {
        setDate(new Date());
    }, 1000);

    useEffect(() => {
        getToken();
    }, []);

    return userTokenStatus === null ? (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
            }}
        >
            <img src="/images/loading.gif" alt="Loading..." />
        </Box>
    ) : (
        <ThemeProvider theme={defaultTheme}>
            <Container
                component="main"
                maxWidth="md"
                sx={{
                    transition: 'background-color 2s ease',
                    bgcolor: userTokenStatus ? '#e31e1c70' : '#23ea15CC',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'space-evenly',
                        height: '100vh',
                        // transform: 'scale(1.5)',
                    }}
                >
                    <Button
                        variant="contained"
                        sx={{
                            color: 'white',
                            // bgcolor: 'grey',
                            borderRadius: '6px',
                        }}
                    >
                        <Typography variant="h2">
                            {date.getHours() < 10
                                ? '0' + date.getHours()
                                : date.getHours()}{' '}
                            :{' '}
                            {date.getMinutes() < 10
                                ? '0' + date.getMinutes()
                                : date.getMinutes()}{' '}
                            :{' '}
                            {date.getSeconds() < 10
                                ? '0' + date.getSeconds()
                                : date.getSeconds()}
                        </Typography>
                    </Button>
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h5">
                            <Typography variant="h6" sx={{ display: 'inline' }}>
                                Name: &nbsp;
                            </Typography>
                            {user.name} <br />
                            <Typography variant="h6" sx={{ display: 'inline' }}>
                                Token: &nbsp;
                            </Typography>
                            {userTokenStatus
                                ? 'Used'
                                : userTokenStatus === null
                                ? 'Does not exit'
                                : 'Not Used'}
                        </Typography>
                        {/* </Box>
                    <Box sx={{ mt: 5 }}> */}
                        <Button
                            variant="contained"
                            disabled={!(userTokenStatus === false)}
                            onClick={useToken}
                            sx={{ mt: 4, fontSize: 25 }}
                        >
                            Use Token
                        </Button>
                    </Box>

                    <Box
                        sx={{
                            mt: 1,
                        }}
                    >
                        <Button
                            variant="contained"
                            onClick={logout}
                            sx={{ fontSize: 18 }}
                        >
                            Logout
                        </Button>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
};
