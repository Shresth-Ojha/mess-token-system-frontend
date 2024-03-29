import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useStore } from '../store/storeWrapper';
import { Navigate, useNavigate } from 'react-router-dom';
import {
    Avatar,
    Box,
    Button,
    Checkbox,
    Container,
    CssBaseline,
    FormControlLabel,
    Grid,
    Link,
    TextField,
    Typography,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

export const Login = () => {
    const { setUser } = useStore();

    const navigate = useNavigate();

    const handleLogin = async (fullName, gID) => {
        const userDetails = {
            fullName,
            gID,
        };
        const requestOptions = {
            method: 'POST',
            body: JSON.stringify(userDetails),
            redirect: 'follow',
            credentials: 'include',
        };

        const res = await fetch(
            import.meta.env.VITE_BACKEND + '/auth',
            requestOptions
        );
        const resBody = await res.json();
        console.log('handleLogin', resBody);
    };

    return (
        <Container
            component="main"
            maxWidth="xs"
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
            }}
            >
            <Box
                sx={
                    {
                        transform: 'scale(1.5)',
                    }
                }
            >
                <GoogleOAuthProvider
                    clientId={import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID}
                >
                    <GoogleLogin
                        onSuccess={async (credentialResponse) => {
                            console.log(
                                'credentialResp = ',
                                credentialResponse
                            );
                            const userDecoded = jwtDecode(
                                credentialResponse.credential
                            );
                            localStorage.setItem(
                                'token',
                                credentialResponse.credential
                            );
                            setUser(userDecoded);

                            //send to a backend endpoint to create a user in the DB
                            await handleLogin(
                                userDecoded.name,
                                userDecoded.sub
                            );

                            navigate('/');
                        }}
                        onError={() => {
                            console.log('Login Failed');
                        }}
                    />
                </GoogleOAuthProvider>
            </Box>
        </Container>
    );
};
