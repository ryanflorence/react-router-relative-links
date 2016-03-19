import React from 'react'
import Link from 'react-router/lib/Link'
import { formatPattern } from 'react-router/lib/PatternUtils'
import resolve from 'resolve-pathname'

// 1. Use this in `<Router createElement={RelativeLinks.createElement}/>`
export const createElement = (Component, props) => (
  <RelativeLinksContainer Component={Component} routerProps={props}/>
)

const { shape, object, string, func, array } = React.PropTypes

const relativeLinksContextType = {
  relativeLinks: shape({
    params: object.isRequired,
    route: object.isRequired,
    routes: array.isRequired
  }).isRequired
}


// 2. the library renders route components with some extra context
//    particularly, the route the component that it's assigned to
//    and params
export const RelativeLinksContainer = React.createClass({

  propTypes: {
    Component: func.isRequired,
    routerProps: shape({
      route: object.isRequired,
      params: object.isRequired
    }).isRequired
  },

  getDefaultProps() {
    /* Normal usage is:
    ```js
    <Router createElement={relativeLinksCreateElement}/>
    ```

    This goofy prop lets "createElement" abstractions compose like:

    ```js
    <Router createElement={(Component, props) => (
      <AsyncPropsContainer
        Component={Component}
        routerProps={props}
        createElement={(Component, props) => (
          <RelativeLinksContainer Component={Component} routerProps={props}/>
        )}
      />
    )}/>
    ```
    */
    return {
      createElement: (Component, props) => <Component {...props}/>
    }
  },

  childContextTypes: relativeLinksContextType,

  getChildContext() {
    const { params, routes, route } = this.props.routerProps
    return { relativeLinks: { params, route, routes } }
  },

  render() {
    return this.props.createElement(this.props.Component, this.props.routerProps)
  }

})

const isAbsolute = to => to.match(/^\//)

const constructRoutePattern = (route, routes) => {
  const paths = []

  // we need to return a path that starts with `/`, at least one route
  // in the matched routes will start with `/`, once we find it, we can
  // just `join` the rest, when approaching other ways I kept running into
  // issues where it returned //some/path instead of /some/path ... 
  let rootPath = null

  for (let i = 0, l = routes.length; i < l; i++) {
    if (routes[i] === route) {
      // we're done, we made it to our route, the rest are irrelevant
      break
    }
    else if (isAbsolute(routes[i].path)) {
      if (rootPath) {
        // this will throw even though they may have a valid route config like:
        //
        // <Route path="/">
        //   <Route path="/foo"/>
        // </Route>
        //
        // but I'm just punting for now
        throw new Error('You can\'t use relative links in route configs with nested absolute route paths')
      } else {
        rootPath = routes[i].path
      }
    }
    else if (routes[i].path) {
      paths.push(routes[i].path)
    }
  }


  if (route.path)
    paths.push(route.path)

  const childPath = paths.join('/')
  return rootPath === '/' ? `/${childPath}` : `${rootPath}/${childPath}`
}

const resolvePathname = ({ relativePath, route, routes, params }) => {
  const patternUpToRoute = constructRoutePattern(route, routes)
  // TODO: remove trailing slash hack
  // we add a slash cause it's SUPER WEIRD if we don't, should add an option
  // to history to always use trailing slashes to not do this and cause
  // confusion for people who actually know how browsers resolve urls :P
  const specialCase = relativePath.trim() === ''
  const slash = specialCase ? '' : '/'
  const resolvedPattern = resolve(`${relativePath}${slash}`, `${patternUpToRoute}/`)
  const withoutSlash = resolvedPattern.substring(0, resolvedPattern.length - 1)
  return formatPattern(withoutSlash, params)
}


// 3. Use a `<RelativeLink to="somewhere/relative"/>`
export const RelativeLink = React.createClass({

  propTypes: {
    to: string.isRequired
  },

  contextTypes: relativeLinksContextType,

  getInitialState() {
    // gonna cache this for the perfs
    return { to: this.calculateTo(this.props) }
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.to !== this.props.to) {
      this.setState({ to: this.calculateTo(nextProps) })
    }
  },

  calculateTo(props) {
    const { to } = props
    const { route, routes, params } = this.context.relativeLinks
    return isAbsolute(to) ? to : resolvePathname({ relativePath: to, route, routes, params })
  },

  render() {
    return <Link {...this.props} to={this.state.to} />
  }

})

