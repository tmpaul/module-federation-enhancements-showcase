# Excluding shared packages at various levels in the tree

`app1` consumes a `LineChart` component exposed by `app2`.

- `app1` is the host application.
- `app2` standalone application which exposes `LineChart` component.

# Cases

The following table shows the bundle size for not sharing vs sharing all versions of a package vs sharing only
a specific major version of a package

| Sharing Type | JS size |  Versions |
---------------|-----------|---------|
| Not shared |   92 kb |  N/A |
| Not excluded |  101 kb     | 3.2.4,1.2.4 |
| Excluded  |    98.5 kb   | 3.2.4 |

## Different major versions of a shared dependency `d3-array`.

In this example, `app2` uses `d3-array` component imported directly from `d3-array@3.2.4`. Additionally it relies
on `tmpaul-react-launch-line` (a fork of [`react-launch-line`](https://github.com/michaellyons/react-launch-line)) which in turn brings in `d3-array@1.2.4`. The webpack share configuration is as follows

```javascript
shared: { react: { singleton: true }, 'react-dom': { singleton: true }, 'd3-array': {} }
```

With this default configuration, there are two registered copies in the remote entry:

```javascript
register("d3-array", "3.2.4", 
/******/
register("d3-array", "1.2.4", 
```

In the standard webpack implementation, sharing a dependency is the same as sharing the dependency at all levels in the dependency tree. However, developers may not want to share the `1.x` version for various reasons. For example, they might not want to share older versions, or they might simply prefer tree-shaken builds for `1.x`.

When webpack shares the package by default **everywhere** it finds an import, it is automatically rewiring the imports to point to a shared chunk. This can be inefficient because it adds an additional asynchronous dynamic load (for non-eager shared dependencies) even when it is not desired.

To fix this, we exclude the nested dependency:

```javascript
{
    shared: { react: { singleton: true }, 'react-dom': { singleton: true }, 'd3-array': {
            exclude: function(context) {
                // When invoked by d3-scale or react-launch-line exclude from sharing
                if (context.indexOf('react-launch-line') > -1 || context.indexOf('node_modules') > -1) {
                return true;
                }
                return false;
            }
        } 
    }
}
```

The import can come from `node_modules` because of lerna's dependency hoisting.

# Running Demo

Ensure you're on node 16 or above. Run `yarn` to install dependencies.

Run `yarn start`. This will build and serve both `app1` and `app2` on ports 3001 and 3002 respectively.
To check production builds (for sizes), run `yarn serve`.

- [localhost:3001](http://localhost:3001/) (HOST)
- [localhost:3002](http://localhost:3002/) (STANDALONE REMOTE)
