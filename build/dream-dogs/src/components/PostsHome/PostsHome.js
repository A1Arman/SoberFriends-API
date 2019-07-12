import React from 'react';
import moment from 'moment';
import './PostsHome.css';

function PostsHome(props) {
    return (
        <main>
            <header role="banner">
                <h1 className='main-title-post'>Dogs Available</h1>
            </header>
            <section className='post-main'>
            {props.posts.map(post => {
                return (
                    <section key={post.id} className='card' >
                        <h4 className='dog_name'>{post.dog_name}</h4>
                        <section className='container'>
                            <p>Owner Email: <a href={`mailto:${post.email}?subject=Interested in ${post.dog_name}!`} className='email'>{post.email}</a></p>
                            <p>Birthdate: {moment(post.birthdate).format("MM-DD-YYYY")}</p>
                            <p>Breed: {post.breed}</p>
                            <p>Lifestyle: {post.lifestyle}</p>
                        </section>
                    </section>
                )
            })}
            </section>
        </main>
    )
}   

export default PostsHome;