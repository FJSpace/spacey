import React from 'react';
import { shallow, mount, render } from 'enzyme';
import App from '../App';
import renderer from 'react-test-renderer';
import AddEquationPage from '../Page/AddEquationPage';

describe('Parsing tests', () => {

  test('test if input string gets returned as object with that string as equation attribute', () => {
    const data = require('../Model/Test.json');
    const parsedObject = data["Parsing"];
    const component = new AddEquationPage();

    // const addEquationPage = renderer.create(<AddEquationPage />);
    // console.log(addEquationPage.toJSON());
    const parsed = component.parseJSON("K=mv+mp*c-e/f");

    expect(parsed["equation"]).toEqual(parsedObject["equation"]);
  });

  test('test if input string operands gets set to expression attribute of equation object', () => {
    const data = require('../Model/Test.json');
    const parsedObject = data["Parsing"];
    const component = new AddEquationPage();
    const parsed = component.parseJSON("K=mv+mp*c-e/f");

    expect(parsed["expressions"]).toEqual(parsedObject["expressions"]);
  });

  test('test if input string parameters gets stored in parameters attribute of equation object', () => {
    const data = require('../Model/Test.json');
    const parsedObject = data["Parsing"];
    const component = new AddEquationPage();
    const parsed = component.parseJSON("K=mv+mp*c-e/f");

    expect(parsed["parameters"]).toEqual(parsedObject["parameters"]);
  })
});
