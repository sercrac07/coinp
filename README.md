# Coinp

[![npm version](https://badge.fury.io/js/coinp.svg)](https://badge.fury.io/js/coinp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

`coinp` is a lightweight package that provides easy-to-use methods for collecting user input from the command line interface.

## Features

- **Text Input:** Collect text input from the user.
- **Number Input:** Collect numeric input from the user.
- **Select Input:** Present a list of choices for the user to select from.
- **Checkbox Input:** Allow the user to select multiple options from a list of choices.
- **Password Input:** Collect hidden text input (e.g., passwords).
- **Loader:** Show a loader animation to indicate ongoing processes.

## Installation

You can install the package via **npm**:

```bash
npm install coinp
```

## Usage

```javascript
import coinp from "coinp"

const wait = ms => new Promise(res => setTimeout(res, ms))

const username = await coinp.text({
  message: "Whats your username?",
  placeholder: "sercrac07",
  validate(value) {
    if (!value) return "You must provide a username"
  }
})

const age = await coinp.number({
  message: `Hello ${username}, how old are you?`,
  placeholder: 18,
  validate(value) {
    if (value > 100 || value < 1) return "You must provide a valid age"
  }
})

const password = await coinp.password({
  message: "What's your account password?",
  validate(value) {
    if (!value) return "You must provide a password"
  }
})

const difficulty = await coinp.select({
  message: "What level difficulty do you want to play?",
  choices: [
    { label: "Easy", value: "easy" },
    { label: "Medium", value: "medium" },
    { label: "Hard", value: "hard" }
  ]
})

const tools = await coinp.checkbox({
  message: "Do you want to start with some tools?",
  choices: [
    { label: "Sword", value: "sword" },
    { label: "Axe", value: "axe" },
    { label: "shovel", value: "shovel" }
  ]
})

const loader = coinp.loader()
loader.start("Starting world generation")
await wait(4000)
loader.end("World generated succesfully")
```

## API Reference

### `coinp.text(options)`

Displays a text input prompt to the user.

**Options:**

- `message` (string): The message to display to the user.
- `placeholder` (string | undefined): The placeholder text to display in the input field.
- `defaultValue` (string | undefined): The default value to use if no value is entered.
- `initialValue` (string | undefined): The initial value to use in the input field.
- `validate` (function | undefined): A function that validates the user's input.

**Example:**

```javascript
const name = await coinp.text({ message: "What's your name?" })
```

### `coinp.number(options)`

Displays a number input prompt to the user.

**Options:**

- `message` (string): The message to display to the user.
- `placeholder` (number | undefined): The placeholder text to display in the input field.
- `defaultValue` (number | undefined): The default value to use if no value is entered.
- `initialValue` (number | undefined): The initial value to use in the input field.
- `validate` (function | undefined): A function that validates the user's input.
- `negative` (boolean | undefined): Whether to allow negative numbers.
- `decimals` (boolean | undefined): Whether to allow decimal numbers.

**Example:**

```javascript
const age = await coinp.number({ message: "How old are you?" })
```

### `coinp.select(options)`

Displays a select input prompt to the user.

**Options:**

- `message` (string): The message to display to the user.
- `choices` (object[]): An array of objects containing the label and value of each choice.
- `cursorAt` (string | undefined): The initial cursor position.

**Example:**

```javascript
const difficulty = await coinp.select({
  message: "What level difficulty do you want to play?",
  choices: [
    { label: "Easy", value: "easy" },
    { label: "Medium", value: "medium" },
    { label: "Hard", value: "hard" }
  ]
})
```

### `coinp.checkbox(options)`

Displays a checkbox input prompt to the user.

**Options:**

- `message` (string): The message to display to the user.
- `choices` (object[]): An array of objects containing the label and value of each choice.
- `cursorAt` (string | undefined): The initial cursor position.
- `initialValues` (string[] | undefined): The initial values to select.

**Example:**

```javascript
const tools = await coinp.checkbox({
  message: "Do you want to start with some tools?",
  choices: [
    { label: "Sword", value: "sword" },
    { label: "Axe", value: "axe" },
    { label: "shovel", value: "shovel" }
  ]
})
```

### `coinp.password(options)`

Displays a password input prompt to the user.

**Options:**

- `message` (string): The message to display to the user.
- `placeholder` (string | undefined): The placeholder text to display in the input field.
- `defaultValue` (string | undefined): The default value to use if no value is entered.
- `initialValue` (string | undefined): The initial value to use in the input field.
- `validate` (function | undefined): A function that validates the user's input.

**Example:**

```javascript
const password = await coinp.password({ message: "What's your password?" })
```

### `coinp.loader()`

Displays a loader animation to indicate ongoing processes.

**Returns:**

- `start(message: string)`: Starts the loader with a message.
- `end(message: string)`: Ends the loader with a message.

**Example:**

```javascript
const loader = coinp.loader()
loader.start("Starting world generation")
await wait(4000)
loader.end("World generated succesfully")
```

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvement, please open an issue or submit a pull request. Here are some ways you can contribute:

- **Bug Reports:** If you find any bugs or unexpected behavior, please open an issue describing the problem.
- **Feature Requests:** If you have ideas for new features or improvements, feel free to suggest them by opening an issue.
- **Code Contributions:** Contributions to the codebase via pull requests are highly appreciated. Before submitting a pull request, please make sure to follow the contribution guidelines below.

### Contribution Guidelines

1. Fork the repository and clone it to your local machine.
2. Create a new branch for your feature/fix: `git checkout -b feature-name`.
3. Make changes and test them thoroughly.
4. Ensure that your code follows the existing code style and conventions.
5. Update the README and documentation if necessary.
6. Commit your changes with descriptive commit messages.
7. Push your branch to your fork: `git push origin feature-name`.
8. Open a pull request to the `main` branch of the original repository.

Thank you for contributing to `coinp`!

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
