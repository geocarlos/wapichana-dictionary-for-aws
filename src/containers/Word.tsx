import React, { useEffect } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import IStore from '../store/IStore';
import Entry from '../model/Entry';
import { isNotNh } from './WordList';
import { Button, makeStyles } from '@material-ui/core';
import { MEDIA_URL } from '../api/constants';

const useStyles = makeStyles({
	root: {
		display: 'grid',
		height: '58.5vh',
		alignItems: 'flex-start',
		width: '100%',
		margin: '0',
		gridTemplateColumns: '20% auto',
		columnGap: '2rem',
		padding: '1rem'
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
		gridTemplateColumns: '50% 50%',
		width: '100%',
		height: '100%',
		overflow: 'auto'
	},
	returnButton: {
		position: 'sticky',
		top: 0,
		zIndex: 100
	},
	media: {
		'& img': {
			width: '15rem'
		}
	}
});

type IProps = {
	setLetter: React.Dispatch<React.SetStateAction<string>>
}

const Word = ({ setLetter }: IProps) => {
	const classes = useStyles();
	const history = useHistory();

	const { entry_id }: any = useParams();

	const wordList = useSelector<IStore, Entry[]>(state => state.entries);
	const [word, setWord] = React.useState<Entry | null>(null)

	useEffect(() => {
		if (wordList && wordList.length) {
			const _word = wordList.filter(word => entry_id === word.entry_id);
			if (_word[0]) {
				setWord(_word[0]);
			}
		}
		setLetter(prev => {
			return entry_id ? isNotNh(entry_id) ? entry_id[0] : entry_id.toUpperCase().substring(0, 2) : prev;
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
						<h1>{word.entry}</h1>
						<p>{word.definition}</p>
						{word.examples.map((e: any) => (
							<React.Fragment key={e.example}>
								<p><b>{e.example}</b></p>
								<p>{e.exampleTranslation}</p>
							</React.Fragment>
						))}
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