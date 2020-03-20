# gatsby-source-plugin-unsplash

A Gatsby plugin for fetching photos from an [Unsplash](http://unsplash.com/) collection.

## Demo :confetti_ball:

**URL**: https://gatsby-source-unsplash.netlify.com/

**Repo**: https://github.com/mattrothenberg/gatsby-unsplash-demo

Photos are sourced from [this collection](https://unsplash.com/collections/9717149/coronavirus-covid-19-pandemic).

## Installation

First, install the plugin with the package manager of your choice (NPM or Yarn).

```bash
yarn add gatsby-source-plugin-unsplash
```

Before you start configuring the plugin, you need to register for an [Unsplash API Developer account](https://unsplash.com/developers). Once you have an account, you'll be able to grab an access key that you'll use to make authenticated API requests.

<img width="587" alt="Screen Shot 2020-03-20 at 7 04 19 AM" src="https://user-images.githubusercontent.com/5148596/77162049-138fce00-6a79-11ea-809d-b5f3eaabc039.png">

I know it's a little weird, but Unsplash's API endpoints call for passing along a `clientId`, but in the Unsplash Developer UI, this is called an **Access Key**.

Next, add the following to your `gatsby.config.js`. Only `clientId` and `collectionId` are **required**. I'd recommend following Gatsby's instructions for sourcing these values from an environment file, so you're not hard-coding sensitive keys in your codebase.

```js
// Not necessary, but recommended!
require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})

module.exports = {
  {
    resolve: `gatsby-source-plugin-unsplash`,
    options: {
      collectionId: process.env.COLLECTION_ID,
      clientId: process.env.CLIENT_ID,
      perPage: 100
    },
  }
}
```

Now, you should have two new queries at your disposal when you run your Gatsby site, `allUnsplashPhoto` and `unsplashPhoto`. As you might guess, the former is used to pull _all_ photos from the specified collection, whereas the latter is used to pluck individual images from that collection, given some filtering criteria.

You have available to you all of the fields from this API response, https://unsplash.com/documentation#get-a-collections-photos.

Additionally, this plugin adds a `localImage` field to each node so that you can use these images with `gatsby-image` and transform them with Sharp.

For example, the following query would yield –

```graphql
{
  allUnsplashPhoto {
    edges {
      node {
        id
        urls {
          full
        }
      }
    }
  }
}
```

<img width="568" alt="Screen Shot 2020-03-20 at 7 08 28 AM" src="https://user-images.githubusercontent.com/5148596/77162315-afb9d500-6a79-11ea-9f22-1a8538dd5084.png">

And this query,

```graphql
{
  unsplashPhoto(id: { eq: "Ikf439frOLg" }) {
    id
    urls {
      full
    }
  }
}
```

...would yield:

<img width="564" alt="Screen Shot 2020-03-20 at 7 10 28 AM" src="https://user-images.githubusercontent.com/5148596/77162415-e8f24500-6a79-11ea-8156-5e13b88db886.png">.

## Features

To be totally fair, this isn't the only Unsplash plugin for Gatsby. In fact, this plugin is largely inspired by https://www.gatsbyjs.org/packages/gatsby-source-unsplash/.

One improvement made by _this_ plugin, however, is that it adds a `localImage` field to each node for greater flexibility around presenting the images.

```graphql
{
  allUnsplashPhoto(limit: 10) {
    edges {
      node {
        id
        user {
          username
        }
        localImage {
          childImageSharp {
            fluid(maxWidth: 400, maxHeight: 250) {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
    }
  }
}
```

### Todo

- [ ] Support multiple collections
- [ ] Support different endpoints
