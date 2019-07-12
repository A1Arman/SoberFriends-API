import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import PostsHome from './PostsHome';

describe(`PostsHome component`, () => {
    it.skip('renders without crashing', () => {
        const wrapper = shallow(<PostsHome />);
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});