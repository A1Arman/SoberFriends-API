import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import MyPost from './MyPost';

describe(`MyPost component`, () => {
    it('renders without crashing', () => {
        const wrapper = shallow(<MyPost />);
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});