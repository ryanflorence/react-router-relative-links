/*eslint-env mocha*/
import React from 'react'
import expect from 'expect'
import { Router, Route } from 'react-router'
import routePropsContext from 'react-router-route-props-context'
import { RelativeLink } from './RelativeLinks'
import { render } from 'react-dom'
import createHistory from 'react-router/lib/createMemoryHistory'
import applyRouterMiddleware from 'react-router-apply-middleware'

describe('RelativeLink', () => {

  describe('without params', () => {

    const run = (link, initialPath, assertion) => {
      const linkWithId = React.cloneElement(link, { className: '__subject__' })

      const Container = React.createClass({
        componentDidMount() {
          assertion(div.querySelector('a.__subject__'))
        },
        render() {
          return this.props.children
        }
      })

      const Parent = ({ children }) => <div>Parent {children}</div>
      const Reference = ({ children }) => <div>Reference {linkWithId} {children}</div>
      const Child = () => <div>Child</div>
      const Sibling = ({ children }) => <div>Sibling {children}</div>
      const Neice = () => <div>Neice</div>

      const routes = (
        <Route path="/" component={Container}>
          <Route path="parent" component={Parent}>
            <Route path="reference" component={Reference}>
              <Route path="child" component={Child} />
            </Route>
            <Route path="sibling" component={Sibling}>
              <Route path="neice" component={Neice}/>
            </Route>
          </Route>
        </Route>
      )

      const div = document.createElement('div')

      render((
        <Router
          render={applyRouterMiddleware(routePropsContext())}
          routes={routes}
          history={createHistory(initialPath)}
        />
      ), div)
    }

    const describeLinks = (startPath) => {
      return () => {
        it('links to parent', (done) => {
          run(<RelativeLink to=".."/>, startPath, (node) => {
            expect(node.getAttribute('href')).toEqual('/parent')
            done()
          })
        })

        it('links to self', (done) => {
          run(<RelativeLink to="."/>, startPath, (node) => {
            expect(node.getAttribute('href')).toEqual('/parent/reference')
            done()
          })
        })

        it('links to children', (done) => {
          run(<RelativeLink to="./child"/>, startPath, (node) => {
            expect(node.getAttribute('href')).toEqual('/parent/reference/child')
            done()
          })
        })

        it('links to siblings', (done) => {
          run(<RelativeLink to="../sibling"/>, startPath, (node) => {
            expect(node.getAttribute('href')).toEqual('/parent/sibling')
            done()
          })
        })

        it('links to neice', (done) => {
          run(<RelativeLink to="../sibling/neice"/>, startPath, (node) => {
            expect(node.getAttribute('href')).toEqual('/parent/sibling/neice')
            done()
          })
        })

        describe('with a location descriptor', () => {
          it('works', (done) => {
            const loc = { pathname: '.' }
            run(<RelativeLink to={loc}/>, startPath, (node) => {
              expect(node.getAttribute('href')).toEqual('/parent/reference')
              done()
            })
          })

          it('works with a query', (done) => {
            const loc = { pathname: '.', query: { foo: 'bar' } }
            run(<RelativeLink to={loc}/>, startPath, (node) => {
              expect(node.getAttribute('href')).toEqual('/parent/reference?foo=bar')
              done()
            })
          })

          it('works with only a query', (done) => {
            const loc = { query: { foo: 'bar' } }
            run(<RelativeLink to={loc}/>, startPath, (node) => {
              expect(node.getAttribute('href')).toEqual('/parent/reference?foo=bar')
              done()
            })
          })
        })
      }
    }

    describe('when rendered at a terminal route', describeLinks('/parent/reference'))
    describe('when rendered in a parent route', describeLinks('/parent/reference/child'))
  })

  describe('with params', () => {
    const run = (link, initialPath, assertion) => {
      const linkWithId = React.cloneElement(link, { className: '__subject__' })

      const Container = React.createClass({
        componentDidMount() {
          assertion(div.querySelector('a.__subject__'))
        },
        render() {
          return this.props.children
        }
      })

      const Parent = ({ children }) => <div>Parent {children}</div>
      const Reference = ({ children }) => <div>Reference {linkWithId} {children}</div>
      const Child = () => <div>Child</div>
      const Sibling = ({ children }) => <div>Sibling {children}</div>
      const Neice = () => <div>Neice</div>

      const routes = (
        <Route path="/" component={Container}>
          <Route path="parent/:p" component={Parent}>
            <Route path="reference/:r" component={Reference}>
              <Route path="child/:c" component={Child} />
            </Route>
            <Route path="sibling/:s" component={Sibling}>
              <Route path="neice/:n" component={Neice}/>
            </Route>
          </Route>
        </Route>
      )

      const div = document.createElement('div')

      render((
        <Router
          render={applyRouterMiddleware(routePropsContext())}
          routes={routes}
          history={createHistory(initialPath)}
        />
      ), div)
    }

    const describeLinks = (startPath) => {
      return () => {
        it('links to parent', (done) => {
          run(<RelativeLink to="../../../a"/>, startPath, (node) => {
            expect(node.getAttribute('href')).toEqual('/parent/a')
            done()
          })
        })

        it('links to self', (done) => {
          run(<RelativeLink to="."/>, startPath, (node) => {
            expect(node.getAttribute('href')).toEqual('/parent/1/reference/2')
            done()
          })
        })

        it('links to self with new params', (done) => {
          run(<RelativeLink to="../a"/>, startPath, (node) => {
            expect(node.getAttribute('href')).toEqual('/parent/1/reference/a')
            done()
          })
        })

        it('links to children', (done) => {
          run(<RelativeLink to="./child/a"/>, startPath, (node) => {
            expect(node.getAttribute('href')).toEqual('/parent/1/reference/2/child/a')
            done()
          })
        })

        it('links to siblings', (done) => {
          run(<RelativeLink to="../../sibling/a"/>, startPath, (node) => {
            expect(node.getAttribute('href')).toEqual('/parent/1/sibling/a')
            done()
          })
        })

        it('links to neice', (done) => {
          run(<RelativeLink to="../../sibling/a/neice/b"/>, startPath, (node) => {
            expect(node.getAttribute('href')).toEqual('/parent/1/sibling/a/neice/b')
            done()
          })
        })

      }
    }

    describe('when rendered at a terminal route', describeLinks('/parent/1/reference/2'))
    describe('when rendered in a parent route', describeLinks('/parent/1/reference/2/child/3'))
  })
})
