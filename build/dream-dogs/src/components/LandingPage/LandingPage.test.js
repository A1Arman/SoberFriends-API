import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import LandingPage from './LandingPage';

describe(`LandingPage component`, () => {
    it('renders without crashing', () => {
        const post = [
            {
                dog_name: 'Jax',
                email: 'armanbhimani99@gmail.com',
                breed: 'Maltipoo',
                birthdate: '2018-06-18',
                lifestyle: 'Small dog that loves to run around. Will fit well in smaller homes as well as larger homes. Will need atleast an hour of exercise to keep out of trouble.',
                owner_id: 1
            },
            {
                dog_name: 'Nova',
                email: 'armanbhimani99@gmail.com',
                breed: 'Maltipoo',
                birthdate: '2018-06-18',
                lifestyle: 'Small dog that loves to run around. Will fit well in smaller homes as well as larger homes. Will need atleast an hour of exercise to keep out of trouble.',
                owner_id: 2
            },
            {
                dog_name: 'Rex',
                email: 'armanbhimani99@gmail.com',
                breed: 'Golden Retriever',
                birthdate: '2018-06-18',
                lifestyle: 'Small dog that loves to run around. Will fit well in smaller homes as well as larger homes. Will need atleast an hour of exercise to keep out of trouble.',
                owner_id: 1
            },
        ]
        const wrapper = shallow(<LandingPage posts={post}/>);
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});