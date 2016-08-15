# Relative Links for React Router

This is a WIP with only a couple hours put into the code, but I think it
works, give it a shot, send some pull requests if you run into issues.

## Installation

```
npm install react-router-relative-links
```

## Usage

```js
import { applyRouterMiddleware } from 'react-router'
import { useRelativeLinks, RelativeLink } from 'react-router-relative-links'

// use it like other router middleware
<Router render={applyRouterMiddleware(useRelativeLinks())}/>

// now you can use `RelativeLink` anywhere \o/
<RelativeLink to="../">Up</RelativeLink>
<RelativeLink to="./down">Down</RelativeLink>
<RelativeLink to="../sideways">Sideways</RelativeLink>
<RelativeLink to={{ pathname: 'foo', query: { bar: 'baz' } }}>location descriptors</RelativeLink>
<RelativeLink to={{ query: { bar: 'baz' } }}>just the query</RelativeLink>
```

