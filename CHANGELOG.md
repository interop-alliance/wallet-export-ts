# wallet-export-ts Changelog

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
