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

## List

Utilize the `list` function to enable users to select an option from a predefined list of choices.

```javascript
const lang = await list({
  message: "What's your favorite language?",
  choices: [
    { label: 'HTML', value: 'html' },
    { label: 'CSS', value: 'css' },
    { label: 'JavaScript', value: 'js' },
  ],
})
```
