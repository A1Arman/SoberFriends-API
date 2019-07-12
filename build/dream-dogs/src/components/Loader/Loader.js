import React from 'react';
import './Loader.css';

function Loader() {
    return (
        <section className='gif-section'>
            <h3 className='gif-title'>Loading</h3>
            <div className='gif'><iframe title='dog-gif-loader' alt='loader gif with dog' src="https://giphy.com/embed/kudIERso2pFiE" frameBorder="0" className="giphy-embed" href="https://giphy.com/gifs/animal-cute-animals-dog-kudIERso2pFiE" allowFullScreen></iframe></div>
        </section>
    )
}

export default Loader;