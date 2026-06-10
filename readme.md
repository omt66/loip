# System and Local IP Info (with some extras)

`sysloip` shows system, local IPv4, IPv6 and remote IP info.

## Install globally

```bash
npm i -g sysloip
```

Run it from anywhere:

```bash
sysloip
```

## Publish to npm

```bash
npm login
npm run build
npm publish
```

Notes:

- `prepublishOnly` also runs the build automatically when publishing.
- If `sysloip` is already taken on npm, publish under a scope (for example `@yourname/sysloip`) by changing the `name` in `package.json`.
