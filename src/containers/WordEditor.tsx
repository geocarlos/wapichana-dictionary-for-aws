import React, { useEffect } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import IStore from '../store/IStore';
import Entry from '../model/Entry';
import { getInitialLetter } from './WordList';
import { Button, IconButton, makeStyles } from '@material-ui/core';
import { Edit, Check, Cancel } from '@material-ui/icons';
import { MEDIA_URL } from '../api/constants';
import FileUpload from '../components/FileUpload';
import { createEntry } from '../actions/EntryActions';
import { toast } from 'react-toastify';
import { handleFetchEntry } from '../api/entries';

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
        height: '100%',
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

const WordEditor = () => {
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();

    const { entry_id }: any = useParams();
    const wordViewRef = React.useRef<any>();

    const wordList = useSelector<IStore, Entry[]>(state => state.entries);

    const [word, setWord] = React.useState<any>({
        entry_id: '',
        entry: { value: '', tip: 'Palavra em wapichana', styleClass: classes.propBlock },
        definition: { value: '', tip: 'Definição em português', styleClass: classes.propBlock },
        gramm: { value: '', tip: 'Classe gramatical', styleClass: classes.propBlock },
        examples: [],
        audios: [],
        images: []
    });

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
            const _word = wordList.filter(word => entry_id === word.entry_id)[0];
            if (_word) {
                setWord((prev: any) => ({
                    ..._word,
                    entry: { ...prev.entry, value: _word.entry },
                    definition: { ...prev.definition, value: _word.definition},
                    gramm: { ...prev.gramm, value: _word.gramm },
                    examples: _word.examples.map((e: any) => ({
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
                }));
            }
        }
    }, [wordList, entry_id, setWord]);

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
            examples: word.examples.filter((e: any) => e !== null || e.example.value !== '')
                .map((e: any) => ({ example: e.example.value, exampleTranslation: e.exampleTranslation.value })),
            audios: word.audios.filter((audio: string) => audio !== null),
            images: word.images.filter((image: string) => image !== null),
            initialLetter: getInitialLetter(word.entry.value)
        };

        dispatch<any>(createEntry(wordToSave))
            .then((result: any) => {
                console.log('RESULT:', result);
                toast.success('Palavra salva com sucesso!')
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
            </div>
            <div className={classes.item}>
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
                                    <source src={`${MEDIA_URL}/${audio}`} />
                                </audio>
                                <IconButton size="small" style={{ padding: 0 }} onClick={() => removeMedia('audios', i)}><Cancel /></IconButton>
                            </div>
                        ) : null)}
                    </div>
                    <div className={`${classes.media} ${classes.image}`}>
                        {word.images?.map((img: any, i: number) => img ? (
                            <div style={{ display: 'flex', alignItems: 'center' }} key={img}>
                                <img src={`${MEDIA_URL}/${img}`} alt={img} />
                                <IconButton size="small" style={{ padding: 0 }} onClick={() => removeMedia('images', i)}><Cancel /></IconButton>
                            </div>
                        ) : null)}
                    </div>
                </div>
            </div>
        </div>
    ) : null;
}

export default WordEditor;