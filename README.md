# Relative Links for React Router

This is a WIP with only a couple hours put into the code, but I think it
works, give it a shot, send some pull requests if you run into issues.

## Usage

```js
import { createElement, RelativeLink } from 'react-router-relative-links'

// use it in `createElement` of your `Router`
<Router createElement={createElement}/>

// now you can use `RelativeLink` anywhere
<RelativeLink to="../">Up</RelativeLink>
<RelativeLink to="./down">Down</RelativeLink>
<RelativeLink to="../sideways">Sideways</RelativeLink>
<RelativeLink to={{ pathname: 'foo', query: { bar: 'baz' } }}>location descriptors</RelativeLink>
<RelativeLink to={{ query: { bar: 'baz' } }}>just the query</RelativeLink>
```

