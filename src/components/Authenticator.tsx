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

type AuthState = 'SignIn' | 'ForceChangePassword' | 'ForgotPassword' | 'SendCode';

const Authenticator = () => {
    const dispatch = useDispatch();
    const [open, setOpen] = React.useState(false);
    const [state, setState] = React.useState({
        username: '',
        password: '',
        confirmPassword: '',
        resetCode: ''
    });

    const [currentUser, setCurrentUser] = React.useState<any>(null);
    const [authState, setAuthState] = React.useState<AuthState>('SignIn');
    const [formHelpText, setformHelpText] = React.useState('Faça login com seu e-mail e senha cadastrados.');

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setAuthState('SignIn');
        setformHelpText('Faça login com seu e-mail e senha cadastrados.');
        setState(prev => ({ ...prev, password: '', confirmPassword: '', resetCode: '' }));
        setOpen(false);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (authState === 'SignIn') {
            handleClose();
            dispatch<any>(signIn(state.username, state.password))
                .then((user: any) => {
                    console.log(user.challengeName);
                    if (user.challengeName && user.challengeName === 'NEW_PASSWORD_REQUIRED') {
                        setCurrentUser(user);
                        setAuthState('ForceChangePassword');
                        setformHelpText('Redefina sua senha.');
                        setState(prev => ({ ...prev, password: '', confirmPassword: '' }));
                        handleClickOpen();
                        return;
                    }
                    setState({ username: '', password: '', confirmPassword: '', resetCode: '' });
                })
                .catch((error: Error) => {
                    if (error.message.includes('Password reset required')) {
                        setAuthState('ForgotPassword');
                        setformHelpText('Redefina sua senha.');
                        setState(prev => ({ ...prev, password: '' }));
                        handleClickOpen();
                    } else if (error.message.includes('Incorrect username or password')) {
                        alert('Email ou senha incorretos.');
                    } else {
                        alert(error.message);
                    }
                });
        } else if (authState === 'ForceChangePassword' && state.password === state.confirmPassword) {
            handleClose();
            Auth.completeNewPassword(currentUser, state.confirmPassword)
                .then(() => {
                    dispatch<any>(signIn(state.username, state.password))
                        .then(() => setState({ username: '', password: '', confirmPassword: '', resetCode: '' }))
                        .catch((error: Error) => alert(error.message));
                })
                .catch(error => {
                    if (error.message.includes('Password does not conform to policy')) {
                        alert("A senha precisa ter:\npelo menos 8 caracteres;\npelo menos um número;\npelo menos uma letra maiúscula;\npelo menos uma letra minúscula;\npelo menos um caracter especial.")
                    } else {
                        alert('Ocorreu um erro. Tente novamnte. Se o erro continuar, contate o desenvolvedor.');
                    }
                });
        } else if (authState === 'ForgotPassword') {
            Auth.forgotPasswordSubmit(state.username, state.resetCode, state.password)
                .then(() => {
                    dispatch<any>(signIn(state.username, state.password))
                        .then(() => setState({ username: '', password: '', confirmPassword: '', resetCode: '' }))
                        .catch((error: Error) => alert(error.message));
                })
                .catch(error => {
                    if (error.message.includes('Password does not conform to policy')) {
                        alert("A senha precisa ter:\npelo menos 8 caracteres;\npelo menos um número;\npelo menos uma letra maiúscula;\npelo menos uma letra minúscula;\npelo menos um caracter especial.")
                    } else {
                        alert('Ocorreu um erro. Verifique seu código e tente novamnte. Se o erro continuar, contate o desenvolvedor.');
                    }
                });
        }
    }

    const handleChange = ({ target }: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setState(prev => ({ ...prev, [target.name]: target.value }))
    }

    const handleSendResetCode = () => {
        Auth.forgotPassword(state.username)
            .then(() => {
                setAuthState('ForgotPassword');
                setformHelpText('Redefina sua senha')
            })
            .catch((err) => console.log(err));
    }

    const handleRequestCodeForm = () => {
        setAuthState('SendCode');
        setformHelpText('Insira seu email para receber o código.')
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
                            {formHelpText}
                        </DialogContentText>
                        {(authState === 'SignIn' || authState === 'SendCode') &&
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
                        {authState === 'ForgotPassword' ? <TextField
                            margin="dense"
                            name="resetCode"
                            value={state.resetCode}
                            onChange={handleChange}
                            label="Insira o código que você recebeu por email"
                            type="text"
                            fullWidth
                            required
                        /> : null}
                        {authState !== 'SendCode' && <TextField
                            margin="dense"
                            name="password"
                            value={state.password}
                            onChange={handleChange}
                            label={authState === 'ForgotPassword' ? "Nova senha" : "Senha"}
                            type="password"
                            fullWidth
                            required
                        />}
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
                        {(authState === 'SignIn' || authState === 'ForgotPassword' || authState === 'ForceChangePassword') ? <Button type="submit" color="primary">
                            {authState === 'SignIn' ? 'Fazer login' : 'Redefinir e entrar'}
                        </Button> : authState === 'SendCode' ? <Button onClick={handleSendResetCode} color="primary">
                            Receber código por email
                        </Button> : null}
                    </DialogActions>
                    {authState === 'SignIn' ? <div style={{ padding: "1rem" }}>Esqueceu a senha? Clica <Button onClick={handleRequestCodeForm} size='small'>aqui</Button> para redefinir.</div> :
                        authState === 'ForgotPassword' ? <div style={{ padding: "1rem" }}>Não recebeu o código? <Button onClick={handleSendResetCode} size='small'>Renviar código</Button></div> : null}
                </form>
            </Dialog>
        </>
    );
}

export default Authenticator;