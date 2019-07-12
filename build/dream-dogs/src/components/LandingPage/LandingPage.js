import React from 'react';
import { Link } from 'react-router-dom';
import Spotlight from '../Spotlight/Spotlight';
import './LandingPage.css';

function LandingPage(props) {
        return (
            <>
            <main role="main" className='landing-main'>
                <header role="banner" className='landing-header'>
                    <h1 id="landing-title">Dream Dogs</h1>
                    <h2 id="phrase">Find Your Dream Dog.</h2>
                    <Link to='/signup'><button className='btn'>Sign Up Today!</button></Link>
                </header>
                <section className='desc-section'>
                    <header>
                        <h3>What is Dream Dogs?</h3>
                    </header>
                    <p className='desc'>Dream Dogs helps owners struggling to provide for their dogs to find a safe new home. Owners can create posts and also include a description of the dog, and the lifestyle needs of the dog.</p>
                </section>
                <section>
                    <h3>Dream Dogs Credentials</h3>
                    <p>Email: armanibhimani@gmail.com</p>
                    <p>Password: password</p>
                </section>

                {props.posts.length > 0 &&
                    <Spotlight />
                }
            </main>
            </>
    )
}

export default LandingPage;