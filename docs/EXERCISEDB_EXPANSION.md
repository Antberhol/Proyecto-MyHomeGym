# ExerciseDB Expansion Plan

## Objective

Scale the exercise catalog to support a much larger subset of ExerciseDB while keeping stable GIF matching for Spanish exercise names.

## Current Strategy

- `useExerciseGif` resolves GIFs with:
  - normalized exercise name
  - Spanish → English alias candidates
  - in-session cache to avoid repeated requests
- Fallback placeholder is used when no match is found.

## Massive Catalog Rollout

### Phase 1: Alias Coverage

- Add aliases for all current base exercises.
- Add aliases for all custom exercises created by users.
- Validate top-1 GIF match quality per exercise.

### Phase 2: Extended Exercise Library

- Create a curated import list with 300+ exercises from ExerciseDB.
- Add optional metadata fields:
  - `exerciseDbName`
  - `exerciseDbId`
  - `exerciseDbAliases`
- Seed those exercises in local catalog with translated labels.

### Phase 3: Quality + Governance

- Add a manual review flow for low-confidence matches.
- Track unresolved names and add aliases periodically.
- Add lightweight tests for alias resolver behavior.

## Backlog Template

Use this table to progressively map and validate more exercises:

| Spanish Name       | Preferred ExerciseDB Name | Status  | Notes           |
| ------------------ | ------------------------- | ------- | --------------- |
| Press de banca     | barbell bench press       | Done    | Base catalog    |
| Sentadilla trasera | barbell back squat        | Done    | Base catalog    |
| Jalón al pecho     | lat pulldown              | Done    | Base catalog    |
| _pending_          | _pending_                 | Pending | Add new mapping |
