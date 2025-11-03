# GitHub Actions CI Design

**Date:** 2025-11-03
**Status:** Approved

## Overview

This design establishes a continuous integration workflow for the shubox.js project using GitHub Actions. The CI system will run linting, unit tests, and build verification across multiple Node.js LTS versions.

## Requirements

### What CI Should Run
- **Linting & Formatting:** ESLint and Prettier checks
- **Unit Tests:** Vitest tests in `tests/` directory
- **Build Verification:** TypeScript compilation and Vite build

### When CI Should Run
- On pushes to any branch
- Manual workflow dispatch from GitHub Actions UI

### Node.js Version Support
- Node 20.x (current LTS)
- Node 22.x (previous LTS)

## Architecture

### Workflow Structure: Hybrid Lint Gate + Parallel Matrix

The workflow uses a three-job architecture that balances speed and efficiency:

```
[Lint Job (Node 20)] → Pass → [Test Matrix (20, 22)] (parallel)
                              → [Build Matrix (20, 22)] (parallel)
```

**Rationale:**
- Lint runs once on Node 20 only (linting doesn't require multi-version testing)
- Lint acts as fast-fail gate (~30-45 seconds)
- Test and build jobs only start if lint passes
- Test and build run in parallel across both Node versions
- Total CI time: ~2-3 minutes (vs ~6-8 minutes if fully sequential)

### Job Definitions

#### 1. Lint Job
```yaml
lint:
  runs-on: ubuntu-latest
  steps:
    - actions/checkout@v4
    - actions/setup-node@v4 (node 20.x, cache npm)
    - npm ci
    - npm run lint
    - npm run format -- --check
```

**Purpose:** Fast-fail gate for code quality
**Exit codes:** Non-zero if linting fails or files need formatting

#### 2. Test Job
```yaml
test:
  needs: lint
  strategy:
    matrix:
      node-version: [20.x, 22.x]
  runs-on: ubuntu-latest
  steps:
    - actions/checkout@v4
    - actions/setup-node@v4 (matrix version, cache npm)
    - npm ci
    - npm test
```

**Purpose:** Ensure unit tests pass on both Node LTS versions
**Dependencies:** Requires lint job to pass first

#### 3. Build Job
```yaml
build:
  needs: lint
  strategy:
    matrix:
      node-version: [20.x, 22.x]
  runs-on: ubuntu-latest
  steps:
    - actions/checkout@v4
    - actions/setup-node@v4 (matrix version, cache npm)
    - npm ci
    - npm run build
```

**Purpose:** Verify TypeScript compilation and Vite build succeed
**Dependencies:** Requires lint job to pass first

## Dependency Management

### Caching Strategy
- Use `actions/setup-node@v4` with `cache: 'npm'`
- Automatically caches `~/.npm` based on `package-lock.json` hash
- Reduces install time from ~2-3 minutes to ~10-20 seconds on cache hits

### Install Strategy
- Use `npm ci` instead of `npm install`
- Provides deterministic, reproducible installs
- Fails fast if `package-lock.json` is out of sync

## Error Handling

### Job Failures
- Each step returns non-zero exit code on failure
- Failed step stops subsequent steps in same job
- Matrix jobs are independent (Node 20 failure doesn't stop Node 22)

### Status Reporting
GitHub reports 5 separate status checks per commit/PR:
1. `lint` - Single check
2. `test (20.x)` - Node 20 test run
3. `test (22.x)` - Node 22 test run
4. `build (20.x)` - Node 20 build
5. `build (22.x)` - Node 22 build

### Branch Protection Integration
Optional branch protection rules on `master` can require:
- Minimum: `lint` only (fastest feedback)
- Balanced: `lint` + one test/build combo
- Comprehensive: All 5 checks must pass

## Workflow Configuration

**File Location:** `.github/workflows/ci.yml`

**Workflow Name:** `CI`

**Triggers:**
```yaml
on:
  push:
    branches: ['**']
  workflow_dispatch:
```

**Manual Trigger:** Available from GitHub Actions UI → Select branch → "Run workflow"

## What's Not Included (YAGNI)

The following features are intentionally excluded from initial implementation:
- Status badges
- Artifact uploads
- Build caching beyond npm dependencies
- E2E tests (Playwright)
- npm publishing
- Code coverage reporting
- Notification integrations

These can be added later if needed.

## Performance Characteristics

### Expected Timings
- Lint job: 30-45 seconds
- Test job (per version): 45-90 seconds
- Build job (per version): 60-90 seconds
- **Total CI time:** 2-3 minutes (lint + max(test, build))

### CI Minutes Usage
- Per push: ~6-8 minutes total across all jobs
- With caching: ~4-6 minutes total

## Implementation Checklist

- [ ] Create `.github/workflows/ci.yml`
- [ ] Configure lint job
- [ ] Configure test job with matrix strategy
- [ ] Configure build job with matrix strategy
- [ ] Test workflow on feature branch
- [ ] Verify all 5 status checks appear
- [ ] Confirm caching works (check subsequent runs)
- [ ] Test manual workflow dispatch
- [ ] Document any branch protection setup (if desired)
