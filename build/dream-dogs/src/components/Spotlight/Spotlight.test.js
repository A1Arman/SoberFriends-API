import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import Spotlight from './Spotlight';

describe(`Spotlight component`, () => {
    it('renders without crashing', () => {
        const wrapper = shallow(<Spotlight />);
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});