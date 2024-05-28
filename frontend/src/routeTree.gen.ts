/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as HackathonsImport } from './routes/hackathons'
import { Route as AuthenticatedImport } from './routes/_authenticated'
import { Route as OrganizeHackathonImport } from './routes/OrganizeHackathon'
import { Route as HackathonIdImport } from './routes/$hackathonId'
import { Route as IndexImport } from './routes/index'

// Create/Update Routes

const HackathonsRoute = HackathonsImport.update({
  path: '/hackathons',
  getParentRoute: () => rootRoute,
} as any)

const AuthenticatedRoute = AuthenticatedImport.update({
  id: '/_authenticated',
  getParentRoute: () => rootRoute,
} as any)

const OrganizeHackathonRoute = OrganizeHackathonImport.update({
  path: '/OrganizeHackathon',
  getParentRoute: () => rootRoute,
} as any)

const HackathonIdRoute = HackathonIdImport.update({
  path: '/$hackathonId',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/$hackathonId': {
      id: '/$hackathonId'
      path: '/$hackathonId'
      fullPath: '/$hackathonId'
      preLoaderRoute: typeof HackathonIdImport
      parentRoute: typeof rootRoute
    }
    '/OrganizeHackathon': {
      id: '/OrganizeHackathon'
      path: '/OrganizeHackathon'
      fullPath: '/OrganizeHackathon'
      preLoaderRoute: typeof OrganizeHackathonImport
      parentRoute: typeof rootRoute
    }
    '/_authenticated': {
      id: '/_authenticated'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof AuthenticatedImport
      parentRoute: typeof rootRoute
    }
    '/hackathons': {
      id: '/hackathons'
      path: '/hackathons'
      fullPath: '/hackathons'
      preLoaderRoute: typeof HackathonsImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren({
  IndexRoute,
  HackathonIdRoute,
  OrganizeHackathonRoute,
  HackathonsRoute,
})

/* prettier-ignore-end */
