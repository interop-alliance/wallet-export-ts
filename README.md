# Universal Wallet Backup Container Export _(@interop/wallet-export-ts)_

[![Build status](https://img.shields.io/github/actions/workflow/status/interop-alliance/wallet-export-ts/main.yml?branch=main)](https://github.com/interop-alliance/wallet-export-ts/actions?query=workflow%3A%22Node.js+CI%22)
[![NPM Version](https://img.shields.io/npm/v/@interop/wallet-export-ts.svg)](https://npm.im/@interop/wallet-export-ts)

> A Javascript/Typescript library for exporting Universal Wallet Backup Containers.

## Table of Contents

- [Background](#background)
- [Security](#security)
- [Install](#install)
- [Usage](#usage)
- [Contribute](#contribute)
- [License](#license)

## Background

TBD

## Security

TBD

## Install

- Node.js 14+ is recommended.

### NPM

To install via NPM:

```
npm install @interop/wallet-export-ts
```

### Development

To install locally (for development):

```
git clone https://github.com/interop-alliance/wallet-export-ts.git
cd wallet-export-ts
npm install
```

## Usage

Export an empty wallet.

```ts
export() // no wallet passed in, generates an empty Universal Wallet Backup TAR file
```

...

```
$ tar -vtf wallet-export-2024-01-01.tar

drwxrwxr-x 0 0 4.0K Jun 11 15:38 app/
drwxrwxr-x 0 0 4.0K Jun 11 15:38 keys/
-rw-rw-r-- 0 0   1K Jun 11 15:38 manifest.yaml

$ cat manifest.yaml
---
ubc-version: 0.1
meta:
  created: 2024-01-01
  createdBy:
    client:
      url: https://github.com/interop-alliance/wallet-export-ts
```

## Contribute

PRs accepted.

If editing the Readme, please conform to the
[standard-readme](https://github.com/RichardLitt/standard-readme) specification.

## License

[MIT License](LICENSE.md) © 2024 Interop Alliance and Dmitri Zagidulin.
