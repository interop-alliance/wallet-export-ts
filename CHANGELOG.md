# wallet-export-ts Changelog

## 0.1.6 - 2025-01-15

### Added
- Add validation for exported ActivityPub tarballs

### Changed
- Refactor `validateExportStream` to accept `ReadableStream` and improve file validation logic.

## 0.1.5 - 2024-12-12

### Added
- Add the ability to `addMediaFile` to the account export stream.

## 0.1.4 - 2024-12-02

### Changed
- Use json instead csv in importActorProfile, add type definitions.

## 0.1.3 - 2024-11-19

### Changed
- Refactor: improve error handling in `importActorProfile`, 
  convert following csv to json format and change ActorProfileOptions from type to interface

## 0.1.2 - 2024-11-12

### Added
- Add `importActorProfile()` function for ActivityPub Actor profiles (the reverse of `exportActorProfile`).

## 0.1.1 - 2024-10-17

### Changed
- Fix `build-dist.sh` script to actually export `exportActorProfile`.

## 0.1.0 - 2024-10-10

### Added

- Initial commit, implement `exportActorProfile()`.
