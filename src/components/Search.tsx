import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import { MenuItem, Select } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { API_BASE_URL } from '../api/constants';
import { toast } from 'react-toastify';

const useStyles = makeStyles(theme => ({
    root: {
        gridColumn: '1 / 3',
        padding: '.25rem .5rem',
        gridTemplateColumns: '10% 86% 4%',
        display: 'grid',
        alignItems: 'center',
        width: '100%',
        [theme.breakpoints.down(700)]: {
            gridTemplateColumns: '94% 6%',
        }
    },
    input: {
        marginLeft: theme.spacing(1),
    },
    iconButton: {
        padding: 10,
    },
    divider: {
        height: 28,
        margin: 4,
    },
    languageSelector: {
        [theme.breakpoints.down(700)]: {
            gridColumn: '1 / 5'
        }
    }
}));

const Search = ({setLetter}: any) => {
    const classes = useStyles();
    const [search, setSearch] = useState('');
    const [lang, setLang] = useState('wp');
    
    const dispatch = useDispatch();

    const performSearch = (e: any) => {
        e.preventDefault();
        if (!search) {
            return;
        }
        dispatch<any>({
            type: 'FETCH_ENTRIES',
            payload: axios.get(`${API_BASE_URL}/entries?search=${search}&searchLang=${lang}`)
        })
        .then(() => setLetter(''))
        .catch(() => toast.error('Erro ao realizar busca!'))
    }

    return (
        <Paper component="form" className={classes.root} onSubmit={performSearch}>
            <Select className={classes.languageSelector} value={lang} onChange={(e: any) => setLang(e.target.value)}>
                <MenuItem value="wp">Wapichana</MenuItem>
                <MenuItem value="pt">Português</MenuItem>
            </Select>
            <InputBase
                className={classes.input}
                placeholder={`Pesquisar palavra em ${lang === 'wp' ? 'wapichana' : 'português'}`}
                value={search}
                onChange={(e: any) => setSearch(e.target.value)}
            />
            <IconButton type="submit" className={classes.iconButton}>
                <SearchIcon />
            </IconButton>
        </Paper>
    );
}

export default Search;
