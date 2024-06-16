# Project: Cloud Take Home Assignment

## Objective

building a cloud-native system to support bookings. When a booking is made, it is published to an event stream. There is an external system that needs to be notified about new bookings and exposes a RESTful endpoint to receive booking events.

Your assignment is to implement a function that is subscribed to these events and publishes `booking_completed` events to the external system.

## Submitting

- Clone the repo into the platform of your choice - you will only have read permissions on this repo
- Create a pull request for your changes against your own repo

## Brief

You will implement the function that is subscribed to the event stream. The event stream contains events of different types, your function should publish `booking_completed` events to the external system.

The external system accepts these events in a format defined in the enclosed [JSON Schema](./external-service/schema.json). Your function will need to transform events from the stream into this format before publishing.

Infrastructure and build tools have been provided, so you can concentrate on the code for the function.

You are welcome to install any additional packages from NPM to help you complete the assignment.

## Tasks

- Implement the assignment using JavaScript or TypeScript. Under [src](./src) there are two entry points, `index.js` and `index.ts` - you must delete the one you don't plan to use for your code to build correctly.
- Your function should pick out `booking_completed` events and ignore other event types
- Your function should transform events into the format defined in the [JSON Schema](./external-service/schema.json)
- Your function should publish events to the [Mock Server](#mock-server)
- Your function should have 100% test coverage, by adding tests under [test](./test).
- File names for tests should end with `.test.ts` or `.test.js` to be picked up by the test runner.
- Anything under the `external-service` should be treated as such, no changes should be made in this folder

## Mock Server

A mock server is provided for you to publish events to. This can be started by running:

```
npm run start:server
```

The URL to publish to is available in your function via the environment variable `PUBLISH_URL`. Requests will receive a 200 response code when the request body passes validation. If the request body does not pass validation, the server will respond with a 400 response code and an explanation.

## Install

To install dependencies, run the command `npm install` from the project root.

## Build

To build your code, run this command:

```
npm run build
```

To build your code and watch for changes, run this command:

```
npm run watch
```

## Invoke / Debug

Running invoke or debug commands will invoke your function with a sample event, containing a number of records. This command won't work if your function hasn't been built by the relevant [build](#Build) command.

To invoke your function run:

```
npm run invoke
```

Alternatively you can debug your function in Visual Studio Code by setting breakpoints and using `Run > Start Debugging`.

## Test

To run all tests, run the command `npm run test` from the project root.

Test configuration is inside the [package.json](./package.json).

If you are using TypeScript, [TS Auto Mock](https://typescript-tdd.github.io/ts-auto-mock/) is included which allows you to create mock data from TypeScript interfaces. You don't have to use it, but it might be useful.
