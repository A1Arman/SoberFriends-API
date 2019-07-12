import React from 'react';
import { DreamDogsConsumer } from '../../DreamDogsContext';
import moment from 'moment';
import './Spotlight.css';

function Spotlight() {
    return (
        <DreamDogsConsumer>
        {context => (
            <section className='main-spotlight-section'>
                <header>
                    <h3 className='spotlight-title'>Dream Dog Spotlight</h3>
                </header>
                <section className='spotlight-card'>
                    <h4>{context.posts[0].dog_name}</h4>
                    <section className='container'>
                        <p>Owners Email: <a href={`mailto:${context.posts[0].email}?subject=Interested in ${context.posts[0].dog_name}!`} className='email'>{context.posts[0].email}</a></p>
                        <p>Birthdate: {moment(context.posts[0].birthdate).format("MM-DD-YYYY")}</p>
                        <p>Breed: {context.posts[0].breed}</p>
                        <p>Lifestlye: {context.posts[0].lifestyle}</p>
                    </section>
                </section>
            </section>
        )}
        </DreamDogsConsumer>
    )
}

export default Spotlight;