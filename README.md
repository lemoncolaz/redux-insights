# redux-insights
Redux middleware for analytics and tracking with an awesome API. Comes with
Google Analytics support, but it's very easy to write your own adoptions!

## Why?
We want an easy and flexible way to add analytics to our Redux apps without
having to rewrite our action creators or add a lot of boilerplate to every
action. With `redux-insights` you attach our middleware and use helper functions
to add rich analytics with minimal effort, and a tiny footprint.

## Installation
`yarn add -D redux-insights`

or

`npm install --save-dev redux-insights`

## Example

### setup-store.js

```javascript
import { applyMiddleware, createStore } from "redux";
import { createInsightsMiddleware, plugins, presets } from "redux-insights";

const insightsMiddleware = createInsightsMiddleware([
  plugins.googleAnalytics({ trackingID: "UA-XXXXXXXX-X" })
], [
  presets.reactRouter
]);

const store = createStore(
  reducer,
  initialState,
  applyMiddleware(insightsMiddleware)
);
```
Set up Redux store to use insights middleware with Google Analytics and
`react-router-redux` actions.

### action-creators.js

```javascript
import { track } from "redux-insights";

export const myAction = payload => ({
  type: "MY_ACTION",
  payload,
  insights: track("my action was triggered")
});
```
Add event tracking to your own action by adding the `insights` key to your
action creator.

## API

### `insights`
Insights is an array of insight objects, or just a single insight object.

```javascript
import { track, page } from "redux-insights";

const validInsights = track("single insight");

const alsoValidInsights = [
  track("first insight"),
  page("second insight")
];
```

An insight object consist of the following keys:
* `type` *(String)*: The type of the insight. See [types](#types).
* `event` *(String)*: A string describing the event. E.g. "change user name".
* `selector(action, getState)` *(Function)*: A selector function that receives
the action that triggered the insight, as well as a getState method (in case
you need to access some other state). The default selector is `identity`,
meaning it returns the `action` object.

### `createInsightsMiddleware(plugins, [globalInsights])`
Creates a Redux middleware that passes all actions with an insights key and
those defined in globalInsights through the plugins.

#### Arguments
* `plugins` *(Array)*: An array of plugins that parses the insights. The package
includes the following plugins, that can be imported via `import { plugins } from "redux-insights"`:
  * Google Analytics

* `globalInsights` *Optional: (Array/Object)*: An array of insight maps, or just an insight
map. An insight map is an object with keys being action types and values being
corresponding insights. This is used to add insights to actions that you don't
have control over - for example `react-router-redux` actions. We actually
provide a `preset` for `react-router-redux` that you access like this:

```javascript
import { createInsightsMiddleware, presets, track } from "redux-insights";

const plugins = [
  // example: Google Analytics
];

const globalInsights = [
  presets.reactRouter,
  // custom insights map
  {
    MY_ACTION: track("my custom action")
  }
];

const insightsMiddleware = createInsightsMiddleware([plugins], globalInsights);
```

### `createInsightFactory(type)`
Creates a factory for creating insights of the provided type. Is used internally
to create the `track`, `page` and `identify` helpers.

#### Arguments
* `type` *(String)*: A unique identifier for the insight type. See standard types.

### `track/page/identify(event, [selector])`
Creates an insight of the type `INSIGHT_TRACK`/`INSIGHT_PAGE`/`INSIGHT_IDENTIFY`.

#### Arguments
* `event` *(String)*: A string describing the event you want an insight of, e.g.
"created new support ticket" or "change" (for the page type).
* `selector(action, getState)` *Optional: (Function)*: The selector can be used
to pick some specific data from the action or anywhere in the state, to provide
to the plugin that is parsing your insight. For example in the
react-router-redux preset we use the selector to get our current path:

```javascript
export default {
  [LOCATION_CHANGE]: page("change", action => action.payload.pathname)
};
```

### `types`
An object containing the default insight types which are:
* `INSIGHT_TRACK`
* `INSIGHT_PAGE`
* `INSIGHT_IDENTIFY`

These are used when you want to create your own plugin.

### `withInsights(insights)(actionCreator)`
A higher-order function you can use to wrap action creators and add insights to
the actions generated by them. This makes migrating to `redux-insights` a bliss!

### `plugins`
Plugins are used to parse the insights and actually send the data to your
analytics provider.

The following plugins are included in `redux-insights` and can be used out-of-the-box:
* Google Analytics

We provide a very intuitive Plugin API (docs coming soon!), so don't be afraid
to write your own plugins!

### `presets`
Presets are suggested insight maps that makes it easy to use `redux-insights`
together with other libraries. Just add the preset to your `globalInsights` array
and you're good to go!

## Tests
`redux-insights` uses `jest` for testing.

Run `yarn test` or `npm test` to run tests.

## License
ISC

## Credits
* [@alfredringstad](https://github.com/alfredringstad) - Main development
* [@mrlundis](https://github.com/mrlundis) - Ideas and feedback

Hyperlab AB ([github](https://github.com/hyperlab), [homepage](https://hyperlab.se))
