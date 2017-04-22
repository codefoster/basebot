# Base Bot

## Introduction

This bot serves as a _walking skeleton_ a bot using Microsoft's Bot Framework and Node.js. A walking skeleton is a starter codebase that attempts to implement the very simplest case, provide starter code for a number of common scenarios, and be a template for the generation of new projects.

If you find this project valuable, please consider contributing your own best practices as pull requests. Fair warning: I am pretty finicky about my syntax, so I reserve the right to suggest _refinements_ to your submission to fit my own definition of "best practice". :)

## Getting Started

1. Create a file called `.env` in the root directory and add the following text...

    ```
    MICROSOFT_APP_ID=
    MICROSOFT_APP_PASSWORD=
    LUIS_ENDPOINT_1=
    LUIS_ENDPOINT_2=
    LUIS_ENDPOINT_3=
    WEBSITE_HOSTNAME=
    AUTH_PROVIDER_NAME=
    AUTH_PROVIDER_APP_ID=
    AUTH_PROVIDER_APP_SECRET=
    BOTAUTH_SECRET=12345678
    QNA_ID=
    QNA_KEY=
    ```
    You don't have to have values for all of those keys right away.

1. Install dependencies using...

    ```
    npm install
    ```


## Features

Again, this walking skeleton of a bot is what I use not only as a quick starter template, but also provides a number of features. I'll discuss each of those, talk about where you'll find it in the codebase, and you can decide for each if it's something your bot needs. Or you can just use these as points of learning.

### Dynamic Loading
Dialogs, recognizers, events, and middlware

### Environment Variables
The `.env` file you created provides the environment variables used throughout the codebase. It is ignored in the `.gitignore` file.

This file is loaded via a Node.js package called `dotenv`. That happens via this line in `index.js`...

``` js
dotenv.config()
```

### Multiple Recognizers


### Polite Recognizer
The `/recognizers/polite.js` recognizer uses an `onEnabled` function to detect if the user is currently in a dialog stack and leaves them alone.

### Middleware
Middleware in bots works just like middleware in web applications. It intercepts all traffic, and gives us a chance to inject some functionality.

In basebot, you'll find a simple logging function in the middleware folder that should give you the general idea about how to use middleware for your own bot.

### Library
The localeTools library is included.

It encapsulates two pieces of functionality related to localization

1. a dialog for prompting the user to choose their preferred locale
1. a middleware function for detecting their locale automatically based on which language they're typing messags in

The former is used in the firstRunUser dialog to prompt the user right away for their locale and store it for all future sessions. The latter is not used so far in this sample.

### Authentication
### First Run
### Events
### Backchannel
### Locale Prompt
### Sample Service