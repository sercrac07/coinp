# Coinp

[![npm version](https://badge.fury.io/js/coinp.svg)](https://badge.fury.io/js/sdet)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

`coinp` is a lightweight package that provides easy-to-use methods for collecting user input from the command line interface. It offers various input methods such as text, number, select, checkbox, and password, along with additional functionalities like intro, outro, info messages, loader, and downloader.

## Features

- **Text Input:** Collect text input from the user.
- **Number Input:** Collect numeric input from the user.
- **Select Input:** Present a list of choices for the user to select from.
- **Checkbox Input:** Allow the user to select multiple options from a list of choices.
- **Password Input:** Collect hidden text input (e.g., passwords).
- **Intro and Outro Messages:** Display introductory and closing messages.
- **Info Messages:** Display informational messages.
- **Loader:** Show a loader animation to indicate ongoing processes.
- **Downloader:** Show a progress bar to track download progress.

## Installation

You can install the package via npm:

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
    if (!Boolean(value)) return "You must provide a username"
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
    if (!Boolean(value)) return "You must provide a password"
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
