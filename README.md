# Project Description

The KC Tenants Dashboard is a website owned by KC Tenants, maintained by the technology team, for the purpose of displaying data that reflects the state of housing in the Kansas City area. It contains a variety of tools, leveraging public databases maintained by the city government.

This repository contains the backend for the Dashboard web application. The backend uses NodeJS. This repository is hosted on Render.

# How to contribute

To request a set of changes to the backend, push your changes up to a new git branch ([how to use git](https://www.freecodecamp.org/news/learn-the-basics-of-git-in-under-10-minutes-da548267cc91/)) and [open a pull request](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request?tool=webui). Your pull request will need to be reviewed by maintainers before it can merged into the `main` branch and deployed.

Code standards for this repository are currently evolving, but please be courteous and try to match the existing standards that are present around where you're working (i.e., adding tests, using TypeScript, including code comments, etc.).

On merging to the `main` branch, changes are automatically deployed to production, so please be diligent in testing your changes before proposing them to be merged!

# How to run locally

## Backend

To run the backend locally, follow these steps:

Make sure you have [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) and [node](https://nodejs.org/en/download/package-manager/) installed on your machine. Currently, this project does not require a specific version of node, but you can use the node version manager [nvm](https://github.com/nvm-sh/nvm) to switch between versions if necessary.

Run the following commands in your terminal, in whatever directory you'd like this project to be on your machine:

`$ git clone https://github.com/KCT-HotlineData/kct_dashboard.git`

`$ cd kct_dashboard/frontend`

Create a `.env` file with the following properties:

- `connectionString`

and get their appropriate values from a maintainer. See `.env.example`.

Make sure you [have Node installed](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) and run the following command in your terminal:

`$ node app.js`

Then your terminal should log out "listening on port: 3000"!

## Frontend

[Here](https://github.com/KCT-HotlineData/kct_dashboard) is the backend repository. See its README for details and how to contribute.

# Deployments

Merging a pull request to the `main` branch automatically deploys to production.

## Rolling back changes

This TBD section is for providing easy to read instructions for how to quickly rollback a deployment that broke the site.

> We don't have to engage in grand, heroic actions to participate in the process of change. Small acts, when multiplied by millions of people, can transform the world.

- Howard Zinn