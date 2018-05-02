import React from 'react';
import { shallow, mount, render } from 'enzyme';
import App from '../App';
import renderer from 'react-test-renderer';
import CE from '../components/DetailPage/CalculateEquation'

describe('Testing "CalculateEquation"', () => {
  test('Testing so that "CalculateEquation" gives the correct value', () => {
    const data = require('../Model/Test.json');
    const correct = data["Correct"];
    const parameterArray = correct.parameters.map(a => a.value);
    const ce = new CE();
    expect(ce.Calculate(parameterArray,correct)).toBe(25);
  });

  test('Testing so that "CalculateEquation" throws a error when text is inputed', () => {
    const data = require('../Model/Test.json');
    const correct = data["Text"];
    const parameterArray = correct.parameters.map(a => a.value);
    const ce = new CE();
    expect( function(){ce.Calculate(parameterArray,correct)}).toThrowError(SyntaxError);
  });
  
  test('Testing so that "CalculateEquation" throws a error when input(s) is empty', () => {
    const data = require('../Model/Test.json');
    const correct = data["Empty"];
    const parameterArray = correct.parameters.map(a => a.value);
    const ce = new CE();
    expect( function(){ce.Calculate(parameterArray,correct)}).toThrowError(SyntaxError);
  });
});