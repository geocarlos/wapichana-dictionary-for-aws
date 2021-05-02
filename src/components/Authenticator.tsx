import React, { ChangeEvent } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Auth } from 'aws-amplify';
import { signIn } from '../actions/UserActions';
import { useDispatch } from 'react-redux';

type AuthState = 'SignIn' | 'ForceChangePassword' | 'ForgotPassword';

const Authenticator = () => {
    const dispatch = useDispatch();
    const [open, setOpen] = React.useState(false);
    const [state, setState] = React.useState({
        username: '',
        password: '',
        confirmPassword: ''
    });

    const [currentUser, setCurrentUser] = React.useState<any>(null);
    const [authState, setAuthState] = React.useState<AuthState>('SignIn')

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (authState === 'SignIn') {
            handleClose();
            dispatch<any>(signIn(state.username, state.password))
                .then((user: any) => {
                    if (user.challengeName && user.challengeName === 'NEW_PASSWORD_REQUIRED') {
                        setCurrentUser(user);
                        setAuthState('ForceChangePassword');
                        setState(prev => ({ ...prev, password: '', confirmPassword: '' }));
                        handleClickOpen();
                        return;
                    }
                    setState({ username: '', password: '', confirmPassword: '' });
                })
                .catch((error: Error) => {
                    alert(error.message);
                });
        } else if (authState === 'ForceChangePassword' && state.password === state.confirmPassword) {
            handleClose();
            Auth.completeNewPassword(currentUser, state.confirmPassword)
                .then(() => {
                    dispatch<any>(signIn(state.username, state.password))
                    .then(() => setState({ username: '', password: '', confirmPassword: '' }))
                    .catch((error: Error) => alert(error.message));
                })
        }
    }

    const handleChange = ({ target }: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setState(prev => ({ ...prev, [target.name]: target.value }))
    }

    return (
        <>
            <Button color="primary" variant="outlined" onClick={handleClickOpen}>
                Login
            </Button>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Login</DialogTitle>
                <form onSubmit={handleSubmit}>
                    <DialogContent>
                        <DialogContentText>
                            Faça login com seu e-mail e senha cadastrados.
                    </DialogContentText>
                        {authState === 'SignIn' &&
                            <TextField
                                margin="dense"
                                name="username"
                                value={state.username}
                                onChange={handleChange}
                                label="E-mail"
                                type="email"
                                fullWidth
                                required
                            />}
                        <TextField
                            margin="dense"
                            name="password"
                            value={state.password}
                            onChange={handleChange}
                            label="Senha"
                            type="password"
                            fullWidth
                            required
                        />
                        {authState === 'ForceChangePassword' &&
                            <TextField
                                margin="dense"
                                name="confirmPassword"
                                value={state.confirmPassword}
                                onChange={handleChange}
                                label="Confirmar Senha"
                                type="password"
                                fullWidth
                                helperText={
                                    state.password === state.confirmPassword ?
                                        ' ' : 'A senha e a confirmação não conferem.'}
                                required
                            />}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            Cancelar
                    </Button>
                        <Button type="submit" color="primary">
                            Fazer login
                    </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </>
    );
}

export default Authenticator;