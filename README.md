# Coinp

## Description

`coinp` is a lightweight package that provides easy-to-use methods for collecting user input from the command line interface. It offers various input methods such as text, number, select, checkbox, and password, along with additional functionalities like intro, outro, info messages, loader, and downloader.

## Installation

You can install `coinp` via npm:

```bash
npm install coinp
```

## Usage

### Text

Allows the user to input text.

```javascript
const name = await text({ message: "What's your name?" })
```

### Number

Allows the user to input a number.

```javascript
const age = await number({ message: "What's your age?" })
```

### Select

Presents the user with a list of choices, allowing them to select one.

```javascript
const lang = await select({
  message: "What's your favorite language?",
  choices: [
    { label: 'HTML', value: 'html' },
    { label: 'CSS', value: 'css' },
    { label: 'JavaScript', value: 'js' },
  ],
})
```

### Checkbox

Presents the user with a list of choices, allowing them to select multiple options.

```javascript
const food = await checkbox({
  message: "What's your favorite food?",
  choices: [
    { label: 'Pizza', value: 'pizza' },
    { label: 'Burger', value: 'burger' },
    { label: 'Rice', value: 'rice' },
  ],
})
```

### Password

Allows the user to input a password without displaying it on the screen.

```javascript
const pass = await text({ message: "What's your password?" })
```

### Additional Methods

Allows the user to display embedded messages.

```javascript
intro({ title: 'Hello world' })
info({ title: 'This is an info message' })
outro({ title: 'Bye world' })
```

### Loader

Shows a loader animation to indicate a process is ongoing.

```javascript
const downloadLoader = loader()
downloadLoader.start('Downloading data')
// Some stuff...
downloadLoader.end('Download finished')
```

### Downloader

Shows a progress bar to indicate the progress of a download.

```javascript
const downloadTrack = downloader()
downloadTrack.start('Downloading data')
// Some download...
downloadTrack.update(50) // Update download percentage
// Some download...
downloadTrack.end('Download finished')
```

## How to Contribute

If you want to contribute to `coinp`, feel free to fork the repository and submit a pull request with your changes.
