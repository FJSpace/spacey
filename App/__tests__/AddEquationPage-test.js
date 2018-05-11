import React from 'react';
import { shallow, mount, render } from 'enzyme';
import App from '../App';
import renderer from 'react-test-renderer';
import AddEquationPage from '../Page/AddEquationPage';
import data from '../Model/Test.json';

describe('Parsing tests', () => {
  const parsedObject = data["Parsing"];
  const component = new AddEquationPage();
  const errorObject = data["Error"];
  const noEqual = data["NoEqual"];
  const parentheses = data["Parentheses"];
  const number = data["Number"];
  const numAndParentheses = data["NumAndParentheses"];
  
  test('test if input string gets returned as object with that string as equation attribute', () => {
    const parsed = component.parseJSON("K=mv+mp*c-e/f");

    expect(parsed["equation"]).toEqual(parsedObject["equation"]);
  });

  test('test if input string parameters gets stored in parameters attribute of equation object', () => {
    const parsed = component.parseJSON("K=mv+mp*c-e/f");

    expect(parsed["parameters"]).toEqual(parsedObject["parameters"]);
  })

  test('test if the parser can handle spaces', () => {
    const parsed = component.parseJSON("K= mv +mp*c-e/f");

    expect(parsed["parameters"]).toEqual(parsedObject["parameters"]);
  })
  
  test('test if we get the correct error message when having multiple "="', () => {
    const parsed = component.parseJSON("K=mv+mp*c-e/f=a");

    expect(parsed).toEqual(errorObject[0]);
  })
  
  test('test if we get the correct error message when having operands on both sides', () => {
    const parsed = component.parseJSON("K+a=mv+mp*c-e/f");

    expect(parsed).toEqual(errorObject[1]);
  })
  
  test('test if we get the correct error message when having multiple operands between variables', () => {
    const parsed = component.parseJSON("K=mv++mp*c-e/f");
    
    expect(parsed).toEqual(errorObject[2]);
  })
  
  test('test if the parser can handle no equal sign', () => {
    const parsed = component.parseJSON("m*v");

    expect(parsed["parameters"]).toEqual(noEqual["parameters"]);
    expect(parsed["equation"]).toEqual(noEqual["equation"]);
  })
  
  test('test if the parser can handle to have the equation on left hand side', () => {
    const parsed = component.parseJSON("mv+mp*c-e/f=K");

    expect(parsed["parameters"]).toEqual(parsedObject["parameters"]);
    expect(parsed["equation"]).toEqual(parsedObject["equation"]);
  })
  
  test('test if the parser can handle parentheses', () => {
    const parsed = component.parseJSON("p=m*(r-k)");

    expect(parsed["parameters"]).toEqual(parentheses["parameters"]);
    expect(parsed["equation"]).toEqual(parentheses["equation"]);
  })
  
  test('test if the parser can handle numbers', () => {
    const parsed = component.parseJSON("p=m*5");

    expect(parsed["parameters"]).toEqual(number["parameters"]);
    expect(parsed["equation"]).toEqual(number["equation"]);
  })
  
  test('test if the parser can handle numbers and parentheses', () => {
    const parsed = component.parseJSON("p=m*(r-1)");

    expect(parsed["parameters"]).toEqual(numAndParentheses["parameters"]);
    expect(parsed["equation"]).toEqual(numAndParentheses["equation"]);
  })
});
