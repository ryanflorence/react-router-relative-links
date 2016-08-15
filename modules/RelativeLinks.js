import React from 'react'
import Link from 'react-router/lib/Link'
import { formatPattern } from 'react-router/lib/PatternUtils'
import resolve from 'resolve-pathname'

export const useRelativeLinks = () => ({
  renderRouteComponent: (child, routeProps) => (
    <RelativeLinksContainer routeProps={routeProps}>{child}</RelativeLinksContainer>
  )
})

const { oneOfType, shape, object, string, func, array, node } = React.PropTypes

const relativeLinksContextType = {
  relativeLinks: shape({
    params: object.isRequired,
    route: object.isRequired,
    routes: array.isRequired
  }).isRequired
}

const RelativeLinksContainer = React.createClass({

  propTypes: {
    Component: func.isRequired,
    children: node.isRequired,
    routeProps: shape({
      route: object.isRequired,
      params: object.isRequired
    }).isRequired
  },

  childContextTypes: relativeLinksContextType,

  getChildContext() {
    const { params, routes, route } = this.props.routeProps
    return { relativeLinks: { params, route, routes } }
  },

  render() {
    return this.props.children
  }

})

const isAbsolute = to => to.match(/^\//)

const constructRoutePattern = (currentRoute, routes) => {
  let fullPath = ''

  for (const route of routes) {
    const { path } = route

    if (path) {
      if (path[0] === '/') {
        fullPath = path
      } else {
        // If the first path-ed route has no leading slash, then this will add it.
        if (fullPath[fullPath.length - 1] !== '/') {
          fullPath += '/'
        }

        fullPath += path
      }
    }

    if (route === currentRoute) {
      break
    }
  }

  return fullPath
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

export const RelativeLink = React.createClass({

  propTypes: {
    to: oneOfType([ string, object ]).isRequired
  },

  contextTypes: relativeLinksContextType,

  getInitialState() {
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
    const isLocationDescriptor = typeof to === 'object'
    const relativePath = isLocationDescriptor ? to.pathname || '' : to
    const resolved = isAbsolute(relativePath) ? relativePath :
      resolvePathname({ relativePath, route, routes, params })
    return isLocationDescriptor ? { ...to, pathname: resolved } : resolved
  },

  render() {
    return <Link {...this.props} to={this.state.to} />
  }

})

