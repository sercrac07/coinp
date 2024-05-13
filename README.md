# Coinp

Coinp is a lightweight npm package that facilitates user input collection through the console. It simplifies the process of gathering various types of input data such as text, numbers, lists, and more. With Coinp, developers can seamlessly integrate interactive console-based user experiences into their applications. Say goodbye to complex input handling logic and embrace the simplicity of Coinp for efficient console-based input management.

## Text

Collect user input using the `text` function, enabling you to display default values and verify user input in real-time.

```javascript
const name = await text({ message: "What's your name?" })
```

## Number

With the `number` function, gather user input in numerical format, supporting both decimals and whole numbers.

```javascript
const age = await number({ message: "What's your age?" })
```

## Select

Utilize the `select` function to enable users to select an option from a predefined list of choices.

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

## Checkbox

By using the `checkbox` function, users can select multiple options from a list of choices.

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

## Loader

Thanks to the `loader` function, you can create a loading icon, allowing for customization of the loading message. This ensures users are informed at all times about ongoing processes.

```javascript
const downloadLoader = loader('Fetching data', 'Downloading data', 'Executing data')
downloadLoader.start()
// Some stuff...
downloadLoader.next('Data obtained correctly')
// Some stuff...
downloadLoader.next('Data downloaded successfully')
// Some stuff...
downloadLoader.end('Ended working with data')
```

## Extra

Thanks to additional functions like intro, outro, and info, you can display enhanced messages with extra information, each used in different parts of the application.

```javascript
intro('Hello world')
info('This is an info message')
outro('Bye world')
```
