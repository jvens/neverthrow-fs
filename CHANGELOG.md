# [1.1.0](https://github.com/jvens/neverthrow-fs/compare/v1.0.1...v1.1.0) (2025-08-05)


### Bug Fixes

* add "type": "module" to package.json and disable eslint for skipped tests in async.test.ts ([aa135a0](https://github.com/jvens/neverthrow-fs/commit/aa135a02cc44800f3195a3c77b8d0c5e4beaae38))
* include '*.config.ts' in ESLint configuration and remove tsup.config.ts from TypeScript compilation ([783737f](https://github.com/jvens/neverthrow-fs/commit/783737fc5efeb608ceb2865674622a7adb823902))
* include tsup.config.ts in TypeScript compilation ([04cea17](https://github.com/jvens/neverthrow-fs/commit/04cea17994358030f6ecd0a8a9d4e8a2246009cc))
* set removeComments to false in tsconfig for better debugging ([63a983d](https://github.com/jvens/neverthrow-fs/commit/63a983da0dfc837ecddaa0cdb9dddc092b39a987))


### Features

* add script to fix ESM imports and update tsconfig for module resolution ([c659711](https://github.com/jvens/neverthrow-fs/commit/c659711ee6f876c132cd00bf2c16d96ac74bc21f))

## [1.0.1](https://github.com/jvens/neverthrow-fs/compare/v1.0.0...v1.0.1) (2025-07-24)


### Bug Fixes

* rename error kind to error name for consistency across error handling ([9e6a03e](https://github.com/jvens/neverthrow-fs/commit/9e6a03efbbd76a292d4204c324a8354c69a626b8))

# 1.0.0 (2025-07-24)


### Bug Fixes

* configure ESLint v9 and resolve TypeScript overload signature errors ([4052baa](https://github.com/jvens/neverthrow-fs/commit/4052baa938d34ff97313f26fa35d1ffd35736a30))
* resolve Jest error serialization issue and correct test expectations ([9d93e0e](https://github.com/jvens/neverthrow-fs/commit/9d93e0ea97b78dce1110401ca86c69feb283b572))
* resolve Node.js 18 ESLint module loading issue ([46bf3a0](https://github.com/jvens/neverthrow-fs/commit/46bf3a065dcd56c34e3dda2e51b89249cd949a64))
* update configuration and resolve linting issues ([b5659f6](https://github.com/jvens/neverthrow-fs/commit/b5659f6f02fd42e5f20858c8871dcf2bf734f6a1))


### Features

* add CI/CD pipeline, semantic-release, and comprehensive documentation ([c9c0447](https://github.com/jvens/neverthrow-fs/commit/c9c04478250eb9cf026a2c96c8f56077534805c6))
* implement core library with comprehensive fs wrapper functions ([4053b92](https://github.com/jvens/neverthrow-fs/commit/4053b92aeffce03043f34ea74f4ab91b4f124f5a))
* improve type safety with narrower FsErrorKind type ([5b6911d](https://github.com/jvens/neverthrow-fs/commit/5b6911d6022d90f241e52acbd97d15d11b46b201))
* initial project setup ([a076847](https://github.com/jvens/neverthrow-fs/commit/a076847c4588cb0d44caca60b1b6c7763d7d9cb1))
