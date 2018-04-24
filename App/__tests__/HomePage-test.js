import 'react-native';
import React from 'react';
import { shallow, mount, render } from 'enzyme';
import HomePage from '../Page/HomePage';
import renderer from 'react-test-renderer';
import { StackNavigator } from 'react-navigation';

test('works', () => {
  expect(1).toBe(1);
});

test('renderers correctly', () => {
	const wrapper = shallow(
      <HomePage />
    );

    expect(wrapper).toMatchSnapshot();
});