import React, { useEffect } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import IStore from '../store/IStore';
import Entry from '../model/Entry';
import { getInitialLetter } from './WordList';
import { Button, IconButton, makeStyles } from '@material-ui/core';
import { MEDIA_URL } from '../api/constants';
import { Edit } from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
	root: {
		display: 'grid',
		height: '73vh',
		alignItems: 'flex-start',
		width: '100%',
		margin: '0',
		gridTemplateColumns: '20% auto',
		columnGap: '2rem',
		padding: '1rem',
		[theme.breakpoints.down(700)]: {
			height: '90vh'
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
		height: '90%',
		'& a': {
			color: 'var(--primary-color)'
		},
		'& .nav-list-item': {
			padding: '.5rem 0'
		}
	},
	wordView: {
		display: 'grid',
		gridTemplateColumns: '50% 50%',
		width: '100%',
		height: '100%',
		overflow: 'auto',
		[theme.breakpoints.down(700)]: {
			gridTemplateColumns: 'auto'
		}
	},
	returnButton: {
		position: 'sticky',
		top: 0,
		zIndex: 100
	},
	definition: {
		fontSize: '1.5rem',
		padding: '.5rem 0',
		'& em': {
			marginRight: '.5rem',
			fontWeight: 600
		}
	},
	examples: {
		margin: '.5rem 0',
		padding: '1rem 0',
		'& .examples-header': {
			fontWeight: 600,
			fontSize: '1.5rem'
		},
		'& .example-block': {
			background: '#efefef',
			borderRadius: '.5rem',
			padding: '1rem',
			margin: '.5rem 0'
		}
	},
	media: {
		'& img': {
			width: '15rem'
		}
	}
}));

type IProps = {
	setLetter: React.Dispatch<React.SetStateAction<string>>
}

const Word = ({ setLetter }: IProps) => {
	const classes = useStyles();
	const history = useHistory();

	const { entry_id }: any = useParams();

	const wordList = useSelector<IStore, Entry[]>(state => state.entries);
	const isLoggedIn = useSelector<IStore, boolean | null>(state => state.user.isLoggedIn);
	const [word, setWord] = React.useState<Entry | null>(null)

	useEffect(() => {
		if (wordList && wordList.length) {
			const _word = wordList.filter(word => entry_id === word.entry_id);
			if (_word[0]) {
				setWord(_word[0]);
			}
		}
		setLetter(prev => {
			return entry_id ? getInitialLetter(entry_id) : prev;
		})
	}, [wordList, entry_id])

	return word ? (
		<div className={classes.root}>
			<div className={classes.item}>
				<Button className={classes.returnButton} variant="contained" color="secondary" 
				onClick={() => history.push('/')}>Voltar</Button>
				<div className={classes.navList}>
					{wordList.map(w => (
						<div className="nav-list-item">
							<Link to={`/${w.entry_id}`}>{w.entry}</Link>
						</div>
					))}
				</div>
			</div>
			<div className={classes.item}>
				<div className={classes.wordView}>
					<div>
						<h1>
							{word.entry}
								{isLoggedIn && 
								<IconButton style={{padding: 0}} onClick={() => history.push(`/editor/${word.entry_id}`)}><Edit /></IconButton>}
							</h1>
						<div className={classes.definition}>
							<em>{word.gramm}</em>
							{word.definition}
						</div>
						<div className={classes.examples}>
							<div className="examples-header">
								{`Exemplo${word.examples.length > 1 ? 's' : ''}`}
							</div>
							{word.examples.map((e: any) => (
								<div className="example-block" key={e.example}>
									<p><b>{e.example}</b></p>
									<p>{e.exampleTranslation}</p>
								</div>
							))}
						</div>
					</div>
					<div className={classes.media}>
						{word.audios.map(audio => (
							<audio key={audio} controls>
								<source src={`${MEDIA_URL}/${audio}`} />
							</audio>
						))}
						{word.images?.map((img: any) => (
							<img key={img} src={`${MEDIA_URL}/${img}`} alt={img} />
						))}
					</div>
				</div>
			</div>
		</div>
	) : null;
}

export default Word;