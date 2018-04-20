import 'react-native';
import React from 'react';
import HomePage from '../Page/HomePage';
import renderer from 'react-test-renderer';


it('works', () => {
  expect(1).toBe(1);
});

it('renderers correctly', () => {
	const hello = renderer.create(
		<HomePage/>
	);
});