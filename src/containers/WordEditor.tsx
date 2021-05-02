import React, { useEffect, useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import IStore from '../store/IStore';
import Entry from '../model/Entry';
import { getInitialLetter } from './WordList';
import { Button, IconButton, makeStyles } from '@material-ui/core';
import { Edit, Check, Cancel, DeleteForever } from '@material-ui/icons';
import { MEDIA_URL } from '../api/constants';
import FileUpload from '../components/FileUpload';
import { createEntry, deleteEntry, fetchEntries } from '../actions/EntryActions';
import { toast } from 'react-toastify';
import { handleFetchEntry } from '../api/entries';
import ConfirmDialog from '../components/ConfirmDialog';

const propBlockStyle = {
    display: 'flex',
    minHeight: '2rem',
    alignItems: 'center',
    background: '#efefef',
    width: '90%',
    padding: '1rem',
    margin: '1rem 0',
    '& #entry': {
        fontWeight: 700,
        fontSize: '2rem'
    },
    '& #gramm': {
        fontStyle: 'italic'
    }
}

const useStyles = makeStyles({
    root: {
        display: 'grid',
        height: '73vh',
        alignItems: 'flex-start',
        width: '100%',
        margin: '0',
        gridTemplateColumns: '10% auto',
        gridTemplateRows: 'auto auto',
        columnGap: '2rem',
        padding: '1rem',
        '& .sticky-button': {
            position: 'sticky',
            top: 0,
            zIndex: 100
        }
    },
    item: {
        height: '100%',
        overflow: 'auto',
    },
    navList: {
        position: 'relative',
        width: '100%',
        padding: '1rem',
        height: '100%',
        '& a': {
            color: 'var(--primary-color)'
        },
        '& .nav-list-item': {
            padding: '.5rem 0'
        }
    },
    wordView: {
        display: 'grid',
        gridTemplateColumns: '50% 20% 20% 10%',
        width: '100%',
        height: '92%',
        overflow: 'auto',
        alignItems: 'flex-start'
    },
    example: {
        border: 'solid thin grey',
        borderRadius: '.5rem',
        padding: '.5rem',
        margin: '.5rem'
    },
    media: {
        position: 'relative',
        '& img': {
            width: '15rem'
        },
        '& .entry-handler': {
            margin: '1rem 0'
        }
    },
    audio: {
        gridColumnStart: 2
    },
    image: {
        columns: 3 / 5
    },
    boldText: {
        fontWeight: 700
    },
    propBlock: propBlockStyle,
    propBlockEditing: {
        ...propBlockStyle,
        position: 'relative',
        border: 'solid thin grey',
        borderRadius: '.5rem',
        background: '#eee',
        '& .icon': {
            position: 'absolute',
            right: 0
        }
    },
    textContent: {
        gridColumnStart: 1
    },
    textInput: {
        width: '100%',
        height: '100%',
        '&:focus': {
            outline: 'none'
        }
    }
});

type IProps = {
	setLetter: React.Dispatch<React.SetStateAction<string>>
}

const WordEditor = ({ setLetter }: IProps) => {
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();

    const { entry }: any = useParams();
    const wordViewRef = React.useRef<any>();

    const wordList = useSelector<IStore, Array<Entry[]>>(state => state.entries);
    const [definitions, setDefinitions] = useState<Entry[] | null>(null);
    const [index, setIndex] = useState(0); 

    const initialWord = {
        entry_id: '',
        entry: { value: '', tip: 'Palavra em wapichana', styleClass: classes.propBlock },
        definition: { value: '', tip: 'Definição em português', styleClass: classes.propBlock },
        gramm: { value: '', tip: 'Classe gramatical', styleClass: classes.propBlock },
        examples: [],
        audios: [],
        images: []
    }

    const [word, setWord] = React.useState<any>(initialWord);

    const [openConfirm, setOpenConfirm] = React.useState(false);

    const handleWordChange = (prev: any, definitions: Entry[], index: number) => ({
        ...definitions[index],
        entry: { ...prev.entry, value: definitions[index].entry },
        definition: { ...prev.definition, value: definitions[index].definition},
        gramm: { ...prev.gramm, value: definitions[index].gramm },
        examples: definitions[index].examples.map((e: any) => ({
            example: {
                value: e.example,
                tip: 'Exemplo em wapichana',
                styleClass: classes.propBlock
            },
            exampleTranslation: {
                value: e.exampleTranslation,
                tip: 'Tradução em português',
                styleClass: classes.propBlock
            }
        })),
    });

    const handleCloseConfirm = (response: boolean) => {
        if (response) {
            dispatch<any>(deleteEntry(word.entry_id))
            .then(() => {
                toast.success('A palavra foi excluída!');
                const defs = definitions;
                defs?.splice(index, 1);
                if (defs && defs.length > 0) {
                    history.push(`/editor/${word.entry.value}`);
                    setDefinitions(defs);
                    setIndex(0)
                } else {
                    history.push('/editor');
                    setDefinitions(null);
                    setIndex(0);
                    setWord(initialWord);
                }
                dispatch(fetchEntries(getInitialLetter(word.entry.value)))
            })
            .catch(() => toast.error('Não foi possível excluir a palavra'));
        }
        setOpenConfirm(false);
    }

    const handleInput = ({ target }: any) => {
        if (target.id.includes('example')) {
            const examples = [...word.examples];
            const keys = target.id.split('_');
            examples[parseInt(keys[0])][keys[1]].value = target.textContent;
            setWord({ ...word, examples });
            return;
        }
        setWord((prev: any) => ({
            ...prev, [target.id]: { ...prev[target.id], value: target.textContent }
        }))
    }

    const toggleEdit = (prop: string) => {
        if (prop.includes('example')) {
            const examples = [...word.examples];
            const keys = prop.split('_');
            examples[parseInt(keys[0])][keys[1]].editing = !examples[parseInt(keys[0])][keys[1]].editing;
            examples[parseInt(keys[0])][keys[1]].styleClass = examples[parseInt(keys[0])][keys[1]].editing ?
                classes.propBlockEditing : classes.propBlock
            setWord({ ...word, examples });
            return;
        }
        setWord({
            ...word, [prop]: {
                ...word[prop],
                'editing': !word[prop].editing,
                styleClass: word[prop].editing ? classes.propBlock : classes.propBlockEditing
            }
        })
    }

    useEffect(() => {
        if (wordList && wordList.length) {
            const _word = wordList.filter(word => word.some(w => w.entry === entry))[0];
            setDefinitions(prev => prev === null ? _word : prev);

            if (_word && _word[0]) {
                setWord((prev: any) => handleWordChange(prev, _word, 0));
            }
        }
        setLetter(prev => {
			return entry ? getInitialLetter(entry) : prev;
		})
    }, [wordList, entry, setWord]);

    useEffect(() => {
        if (definitions) {
            setWord((prev: any) => handleWordChange(prev, definitions, index));
        }
    }, [index, definitions]);

    const addExample = () => {
        setWord({
            ...word,
            examples: [
                ...word.examples,
                {
                    example: {
                        value: '',
                        tip: 'Exemplo em wapichana',
                        styleClass: classes.propBlock
                    },
                    exampleTranslation: {
                        value: '',
                        tip: 'Tradução em português',
                        styleClass: classes.propBlock
                    }
                }
            ],
            lastExampleId: `${word.examples.length}_example`
        });
    }

    useEffect(() => {
        window.document.getElementById(word.lastExampleId)?.scrollIntoView();
    }, [word.lastExampleId])

    const removeExample = (index: number) => {
        const examples = [...word.examples];
        examples[index] = null;
        setWord({ ...word, examples })
    }

    const addMedia = (type: 'audio' | 'image', media: string) => {
        setWord({
            ...word,
            [`${type}s`]: word[`${type}s`].concat(media)
        });
    }

    const removeMedia = (type: 'audios' | 'images', index: number) => {
        const temp = [...word[type]];
        temp[index] = null;
        setWord({
            ...word, [type]: temp
        });
    }

    const saveEntry = async () => {
        if (!(word.entry.value && word.gramm.value && word.definition.value)) {
            toast.warn('Há campos que precisam ser preenchidos!')
            return;
        }

        if (!word.entry_id) {
            const result = await handleFetchEntry(word.entry.value);
            if (result.data.length) {
                word.entry_id = `${word.entry.value}_${result.data.length + 1}`
            } else {
                word.entry_id = word.entry.value;
            }
        }

        const wordToSave: Entry = {
            entry_id: word.entry_id,
            entry: word.entry.value,
            gramm: word.gramm.value,
            definition: word.definition.value,
            examples: word.examples.filter((e: any) => e !== null || (e && e.example.value !== ''))
                .map((e: any) => ({ example: e.example.value, exampleTranslation: e.exampleTranslation.value })),
            audios: word.audios.filter((audio: string) => audio !== null),
            images: word.images.filter((image: string) => image !== null),
            initialLetter: getInitialLetter(word.entry.value)
        };

        dispatch<any>(createEntry(wordToSave))
            .then((result: any) => {
                console.log('RESULT:', result);
                setLetter(getInitialLetter(wordToSave.entry));
                dispatch(fetchEntries(getInitialLetter(wordToSave.entry)));
                history.push(`/${wordToSave.entry}`)
                toast.success('Palavra salva com sucesso!');
            })
            .catch((error: Error) => {
                console.log(error);
                toast.error('Erro ao salvar palavra!');
            });
    }

    return word ? (
        <div className={classes.root}>
            <div className={classes.item}>
                <Button className="sticky-button" variant="contained" color="secondary"
                    onClick={() => history.push('/')}>
                    Voltar
                </Button>
                {definitions && definitions.length > 0 && 
                <div>
                    <h5>Definições:</h5>
                    {definitions?.map((e, i) => (
                        <div key={e.entry_id + i} style={{padding: '.5rem 0'}}>
                            <Link 
                                style={{color: 'var(--primary-color)', textDecoration: i === index ? 'underline' : 'none'}} 
                                to={`/editor/${e.entry}`}
                                onClick={() => setIndex(i)}>{i + 1}ª definição</Link>
                        </div>
                    ))}
                    <Button onClick={() => {
                        const newEntry = {
                            entry_id: null,
                            entry: word.entry.value,
                            gramm: '',
                            definition: '',
                            examples: [],
                            audios: [],
                            images: []
                        }
                        setIndex(definitions.length);
                        setDefinitions((prev: any) => [...prev, newEntry]);
                    }} variant="outlined" style={{fontSize: '.5rem'}} size="small" color="primary">Adicionar definição</Button>
                </div>}
            </div>
            <div className={classes.item}>
                {word.entry_id && <div style={{ width: '30%', display: 'flex'}}>
                    <Button onClick={() => setOpenConfirm(true)} startIcon={<DeleteForever/>} size="small" variant="outlined" color="primary">Excluir Palavra</Button>
                </div>}
                <div id="word-view" ref={wordViewRef} className={classes.wordView}>
                    <div className={`entry-handler sticky-button ${classes.audio}`}>
                        <FileUpload type="audio/*" handleAdd={addMedia}>Adicionar Áudio</FileUpload>
                    </div>
                    <div className={`entry-handler sticky-button ${classes.image}`}>
                        <FileUpload handleAdd={addMedia}>Adicionar Imagem</FileUpload>
                    </div>
                    <Button className="sticky-button"
                        variant="contained"
                        color="primary" onClick={saveEntry}>
                        Salvar
                    </Button>
                    <div className={classes.textContent}>
                        <div className={word.entry.styleClass}>
                            <text-input id="entry" contentEditable={word.entry.editing}
                                className={classes.textInput}
                                onInput={handleInput}
                                value={word.entry.value}
                            >{!(word.entry.editing || word.entry.value) ? word.entry.tip : null}</text-input>
                            <IconButton className="icon" onClick={() => toggleEdit('entry')}>{word.entry.editing ? <Check /> : <Edit />}</IconButton>
                        </div>

                        <div className={word.gramm.styleClass}>
                            <text-input id="gramm" contentEditable={word.gramm.editing}
                                className={classes.textInput}
                                onInput={handleInput}
                                value={word.gramm.value}
                            >{!(word.gramm.editing || word.gramm.value) ? word.gramm.tip : null}</text-input>
                            <IconButton className="icon" onClick={() => toggleEdit('gramm')}>{word.gramm.editing ? <Check /> : <Edit />}</IconButton>
                        </div>

                        <div className={word.definition.styleClass}>
                            <text-input id="definition" contentEditable={word.definition.editing}
                                className={classes.textInput}
                                onInput={handleInput}
                                value={word.definition.value}
                            >{!(word.definition.editing || word.definition.value) ? word.definition.tip : null}</text-input>
                            <IconButton className="icon" onClick={() => toggleEdit('definition')}>{word.definition.editing ? <Check /> : <Edit />}</IconButton>
                        </div>

                        <div className="entry-handler sticky-button">
                            <Button style={{ background: 'white' }} variant="outlined" onClick={addExample}>Adicionar Exemplo</Button>
                        </div>
                        {word.examples.map((e: any, i: number) => e ? (
                            <div key={`${i}_example`} className={classes.example}>
                                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <IconButton size="small" style={{ padding: 0 }} onClick={() => removeExample(i)}><Cancel /></IconButton>
                                </div>
                                <div className={e.example.styleClass}>
                                    <text-input id={`${i}_example`} contentEditable={e.example.editing} onInput={handleInput}
                                        className={`${classes.boldText} ${classes.textInput}`}
                                        value={e.example.value}
                                    >
                                        {!(e.example.editing || e.example.value) ? e.example.tip : null}
                                    </text-input>
                                    <IconButton onClick={() => toggleEdit(`${i}_example`)}>{e.example.editing ? <Check /> : <Edit />}</IconButton>
                                </div>

                                <div className={e.exampleTranslation.styleClass}>
                                    <text-input id={`${i}_exampleTranslation`} contentEditable={e.exampleTranslation.editing} onInput={handleInput}
                                        className={classes.textInput}
                                        value={e.exampleTranslation.value}
                                    >
                                        {!(e.exampleTranslation.editing || e.exampleTranslation.value) ? e.exampleTranslation.tip : null}
                                    </text-input>
                                    <IconButton onClick={() => toggleEdit(`${i}_exampleTranslation`)}>{e.exampleTranslation.editing ? <Check /> : <Edit />}</IconButton>
                                </div>
                            </div>
                        ) : null)}
                    </div>
                    <div className={`${classes.media} ${classes.audio}`}>
                        {word.audios.map((audio: string, i: number) => audio ? (
                            <div style={{ display: 'flex', alignItems: 'center' }} key={audio}>
                                <audio style={{ width: 180, height: 35 }} controls>
                                    <source src={`${MEDIA_URL}/audio/${audio}`} />
                                </audio>
                                <IconButton size="small" style={{ padding: 0 }} onClick={() => removeMedia('audios', i)}><Cancel /></IconButton>
                            </div>
                        ) : null)}
                    </div>
                    <div className={`${classes.media} ${classes.image}`}>
                        {word.images?.map((img: any, i: number) => img ? (
                            <div style={{ display: 'flex', alignItems: 'center' }} key={img}>
                                <img src={`${MEDIA_URL}/image/${img}`} alt={img} />
                                <IconButton size="small" style={{ padding: 0 }} onClick={() => removeMedia('images', i)}><Cancel /></IconButton>
                            </div>
                        ) : null)}
                    </div>
                </div>
            </div>
            <ConfirmDialog open={openConfirm} word={word.entry.value} handleClose={handleCloseConfirm} />
        </div>
    ) : null;
}

export default WordEditor;