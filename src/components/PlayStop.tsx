import React from 'react';

const PlayStop = ({ isPlaying = false }) => {
	return (
		<>
			{!isPlaying ? (
			<svg style={{width: '24px', height: '24px'}} viewBox="0 0 24 24">
				<path fill="currentColor" d="M10,16.5V7.5L16,12M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
			</svg>  
			) : (
			<svg style={{width: '24px', height: '24px'}} viewBox="0 0 24 24">
				<path fill="red" d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M9,9H15V15H9" />
			</svg>
			)}
		</>
	)
}

export default PlayStop;