# 📝  Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

## 1.3.0 - 05/03/2025
### Fixed
- Corrected API endpoint and updated GraphQL query.

### Added
- Full test coverage using `AVA` and `esmock`.
- More robust error handling when fetching posts.

### Changed
- Completely refactored `index.js` for modularity and testability.
- Updated `action.yml` to remove unused `USERNAME` and `REPOSITORY`.
- Improved logging for debugging failed API requests.

## 1.2 - 10/05/2023
### Changed
- Updated Action Runner NodeJS Version.

## 1.1.1 - 12/11/2020
### Fixed
- System-generated URL was not generating when `BLOG_URL` was empty.

## 1.1 - 11/11/2020
### Added
- New `BLOG_URL` input.
> This input fixes an issue where some users' blog post URLs were not generated properly.

## 1.0 - 05/11/2020
### First Release
