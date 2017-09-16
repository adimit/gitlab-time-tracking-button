# Gitlab Time Tracking Button

[Homepage](https://gitlab.com/adimit/gitlab-time-tracking-button/)

Addon for Chrome and Firefox that inserts a time tracking button on the issue page.

See [gitlab-ce#27824](https://gitlab.com/gitlab-org/gitlab-ce/issues/27824),
which is as of yet (september 2017) still open.

First, you need a [personal access
token](https://docs.gitlab.com/ce/user/profile/personal_access_tokens.html) from
any instance you want to be connected to. Add the instance and your access token
on the addon's settings page. You need to grant the addon permission for that site.

On any issue page, press 'start' to start the timer. You can pause it
afterwards, or use 'save' to submit the time to the given issue. Use 'trash' to
discard any accrued time. You can have multiple timers (running in parallel.)
Timers persist across browser sessions.

## Bugs & Features

Please see the [issue tracker](https://gitlab.com/adimit/gitlab-time-tracking-button/issues/).

## Developing

To build the addon:

```
npm install
npm run build
npm run start # launches firefox with an empty profile and the addon installed
```

The addon's files and source maps are generated in the `./addon` folder. If you
want to point your browser to the unpacked extension, please use that folder
(not the root folder.)

To run the test suite:

```
npm run test
```

To create a `.zip` file with the extension, created in as
`./dist/gitlab-time-tracking-button-${version}.zip`, where `${version}` is in
the `manifest.json`:

```
npm run bundle
```
