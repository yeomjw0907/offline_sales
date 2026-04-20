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
- `migrations/`
  - SQL drafts for schema changes that should be applied to Supabase/Postgres

## Design Principles

- The initial MVP is optimized for manual admin entry.
- The schema should remain extensible for external partner integrations.
- Attribution is designed around store-level tracking and confirmation at pilot start.
- External webhooks should have event-level idempotency separate from business record deduplication.
