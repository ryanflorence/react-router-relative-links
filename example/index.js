import React from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, browserHistory, Link } from 'react-router'
import { useRelativeLinks, RelativeLink } from 'react-router-relative-links'
import applyRouterMiddleware from 'react-router-apply-middleware'

const App = React.createClass({
  render() {
    return (
      <div style={{ fontFamily: 'sans-serif', fontWeight: '200' }}>
        <h1>Relative Links!</h1>
        <div style={{ display: 'flex' }}>
          <div>
            <h2>Index</h2>
            <ul>
              <li> <Link to="/ch/1">Chapter 1</Link> </li>
              <li> <Link to="/ch/2">Chapter 2</Link> </li>
            </ul>
          </div>
          <div style={{ flex: '1', paddingLeft: '60px' }}>
            {this.props.children}
          </div>
        </div>
      </div>
    )
  }
})

const Home = React.createClass({
  render() {
    return (
      <div>
        <h2>Home</h2>
      </div>
    )
  }
})

const Chapter = React.createClass({
  render() {
    const { chapter } = this.props.params
    return (
      <div style={{ display: 'flex' }}>
        <div>
          <h2>Chapter {chapter}</h2>
          <ul>
            <li><RelativeLink to="../..">Up to Home</RelativeLink></li>
            <li><RelativeLink to="./1">Chapter {chapter}, Page 1</RelativeLink></li>
            <li><RelativeLink to="./2">Chapter {chapter}, Page 2</RelativeLink></li>
          </ul>
        </div>
        <div style={{ flex: '1', paddingLeft: '60px' }}>
          {this.props.children}
        </div>
      </div>
    )
  }
})

const Page = React.createClass({
  render() {
    const { chapter, page } = this.props.params
    const { query } = this.props.location
    return (
      <div>
        <h2>Chapter {chapter}, Page {page}</h2>
        <h3>Query: {query.time}</h3>
        <ul>
          <li><RelativeLink to={`../../..`}>Up to Home</RelativeLink></li>
          <li><RelativeLink to={`..`}>Up to Chapter {chapter}</RelativeLink></li>
          <li>
            <RelativeLink to={{ query: { time: Date.now() } }}>Change the query, plz</RelativeLink><br/>
            You can click that a bunch, it’ll change each time. This is probably the biggest reason people want relative links :)
          </li>
        </ul>
      </div>
    )
  }
})

render((
  <Router
    history={browserHistory}
    render={applyRouterMiddleware(useRelativeLinks())}
  >
    <Route path="/" component={App}>
      <IndexRoute component={Home}/>
      <Route path="ch/:chapter" component={Chapter}>
        <Route path=":page" component={Page}/>
      </Route>
    </Route>
  </Router>
), document.getElementById('app'))

