export default class Equation {

  constructor(id, name, description, equation, parameters, expressions) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.equation = equation;

    this.parameters = parameters
    this.expressions = expressions
  }

}
