import 'react-native';
import React from 'react';
import HomePage from '../Page/HomePage';
import renderer from 'react-test-renderer';
import { StackNavigator } from 'react-navigation';


test('works', () => {
  expect(1).toBe(1);
});

test('renderers correctly', () => {
	const hello = renderer.create(
		<HomePage/>
	);
	expect(hello).toMatchSnapshot();
});