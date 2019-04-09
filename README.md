# Base Bot

## Introduction

This bot serves as a _walking skeleton_ a bot using Microsoft's Bot Framework and Node.js. A walking skeleton is a starter codebase that attempts to implement the very simplest case, provide starter code for a number of common scenarios, and be a template for the generation of new projects.

If you find this project valuable, please consider contributing your own best practices as pull requests. Fair warning: I am pretty finicky about my syntax, so I reserve the right to suggest _refinements_ to your submission to fit my own definition of "best practice". :)

## Getting Started

1. Create a file called `.env` in the root directory and add the following text...

    ```
    LuisAppId=
    LuisAPIHostName=
    LuisAPIKey=
    WEBSITE_HOSTNAME=
    AUTH_PROVIDER_NAME=
    AUTH_PROVIDER_APP_ID=
    AUTH_PROVIDER_APP_SECRET=
    BOTAUTH_SECRET=12345678
    DIRECT_LINE_SECRET=
    QNA_ID=
    QNA_KEY=
    MONGODB_URL=mongodb://localhost:27017/basebot
    ```
    You don't have to have values for all of those keys right away.

1. Install dependencies using...

    ```
    npm install
    ```

## Features

Again, this walking skeleton of a bot is what I use not only as a quick starter template, but also provides a number of features. I'll discuss each of those, talk about where you'll find it in the codebase, and you can decide for each if it's something your bot needs. Or you can just use these as points of learning.

### Dynamic Loading
The various plugins of a bot (i.e. dialogs, recognizers, events) are dynamically loaded in basebot.

That means if you drop a new file `foo.js` in the `dialogs` folder in the project, it will automatically be configured as one of the bot's dialogs.

You can see how all of this dynamic loading is done at the end of the  `index.js` file.

### Environment Variables
The `.env` file you created provides the environment variables used throughout the codebase. It is ignored in the `.gitignore` file.

This file is loaded via a Node.js package called `dotenv`. That happens via this line in `index.js`...

``` js
require('dotenv').config();
```

### Multiple Recognizers
basebot loads all of the recognizers from the `recognizers` folder. Each time a message is received from the user, basebot analyzes _all_ recognizers (the default behavior is for this to happen in parallel) and returns the intent with the best match.

There are sample recognizers in the folder already for custom recognizers (`commands.js`, `greeting.js`), LUIS recognizers (`luisModel1.js`, `polite.js`), and a QnA Maker recognizer (`qna.js`). These should get you started.

### Recognizer Filters
{discuss recognizer filters (not implemented yet)}

### Polite Recognizer
The `/recognizers/polite.js` recognizer uses an `onEnabled` function to detect if the user is currently in a dialog stack and leaves them alone.

### Middleware
Middleware in bots works just like middleware in web applications. It intercepts all traffic, and gives us a chance to inject some functionality.

In basebot, you'll find a simple middleware module for doing logging in the `/middleware` folder that should give you the general idea about how to use middleware for your own bot.

### Library
The `localeTools` library is included.

It encapsulates two pieces of functionality related to localization

1. a dialog for prompting the user to choose their preferred locale
1. a middleware function for detecting their locale automatically based on which language they're typing messags in

The former is used in the `firstRunUser` dialog to prompt the user right away for their locale and store it for all future sessions. The latter is not used so far in this sample.

### Authentication
The basebot project has authentication implemented.

We chose Twitter as the default provider. It's an easy configuration change to change to another OAuth provider, but do know that it's currently designed for only a single authentication provider. I'm working on an update for allowing multiple providers based on user preference.

To require authentication for any dialog, you simply require the `authenticationService` and then wrap your waterfall function array with the `requireAuthentication()` method.

Look at `dialogs/sampleAuthDialog.js` for a getting started example.

### First Run
Sometimes you want to make sure every user sees an initial dialog one time, but then not again (unless you change the dialog).

This is called "first run".

In basebot, there are two first run dialogs - `firstRunUser` and `firstRunConversation`. The former runs once for each user and then never again (unless you update the version which I'll discuss). The latter runs once for each conversation.

These dialogs use `onFindAction` in their `triggerAction` handlers which effectively runs every time botbuilder attempts to match this dialog with the best intent. This is great because it means you have a place to drop imperative code that runs every time. It then just uses a "hasRunVersion" variable in `session.userData` to record that the user has run this dialog (and at what version).

If you add some logic to your firstRunUser method though, and most of your bot users have already run the old version, then they'll miss all your new changes. That's when you roll the version. That effectively resets the hasRun for everyone and they all run the dialog the next time they do anything.

firstRunConversation works the same way except it doesn't require a version because it runs every conversation anyway.

These two dialogs have a little trick too. They remember whatever the user said that they interrupted and then the use `bot.receive` to simulate the bot receiving that exact message again. That way the user doesn't have to type it again.

To test the firstRunUser, you can type the `delete` command to basebot and it will erase `session.userData`.

### Events
There are few events that can be raised by a chat client, and you handle these by dropping a file with the name of the event as the filename (adding `.js`).

Most of the supported events are already in there including `contactRelationUpdate.js`, `conversationUpdate.js`, `deleteUserData.js`, and `event.js`.

The last is used in the support for listening to the backchannel if your bot uses a webchat client.

### Backchannel
Backchannel is a means by which a bot (server-side) and a webchat control (client-side) can communicate with each other without it having to go through the message window.

You can send whatever events you want over the backchannel, but some common reasons to use it are...

* sending an authentication token from the website (where the user is already logged in) to the bot
* controlling the page layout, style, etc. of the website where a bot is embedded

### Data Service
Most bots need to persist data, so we've created `mongoDataService` and `mongoDataDialog` as a sample. Use the `mongo` command to invoke the dialog and follow the menu to CRUD some widgets. Then check out the `mongoDataService` to see how to use Mongo in a bot.