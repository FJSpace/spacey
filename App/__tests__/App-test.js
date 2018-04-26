import React from 'react';
import { shallow, mount, render } from 'enzyme';
import App from '../App';
import renderer from 'react-test-renderer';


it('renders without crashing', () => {
  const wrapper = shallow(
      <App />
    );

    expect(wrapper).toMatchSnapshot();
});
