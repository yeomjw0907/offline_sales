# DB Docs Guide

## Documents

- `tables.md`
  - Core tables and column drafts
- `erd-overview.md`
  - Table relationships and extension points
- `indexes-and-constraints.md`
  - Uniqueness, indexing, and integrity rules
- `state-and-settlement-rules.md`
  - Status transitions and settlement logic

## Design Principles

- The initial MVP is optimized for manual admin entry.
- The schema should remain extensible for future Ready Talk API integration.
- Attribution is designed around `store-level` tracking and confirmation at `pilot start`.
