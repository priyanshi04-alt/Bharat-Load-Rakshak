# Verification Bugs & Fixes Ledger - BHARAT LOAD RAKSHAK

This ledger documents all issues, bug IDs, root causes, severity levels, fixes, and regression test cases added during verification.

---

| Bug ID | Component | Description | Expected Behavior | Actual Behavior | Severity | Root Cause | Fix Applied | Regression Test Added |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **BUG-001** | CAP Backend DB | Missing `axios` module in `driver-scoring.js` require stack | CAP server boots cleanly | Server crashed with `MODULE_NOT_FOUND` | **HIGH** | `axios` missing in `package.json` dependencies | Added `axios` to `backend/package.json` | Tested via `npm test` |
| **BUG-002** | CAP Backend DB | Missing SQLite table `bharat_load_rakshak_Trucks` on clean boot | CDS schema deployed automatically | Server crash on initial seed query | **HIGH** | `package.json` CDS config lacked explicit SQLite database URL binding | Added explicit `db.sqlite` credentials in `backend/package.json` and executed `npx cds deploy` | Added `npm run db:reset` script |
| **BUG-003** | Telemetry Validator | Telemetry validator did not enforce numeric range checks for `weightKg < 0` | Reject negative weight values | Allowed negative weight | **MEDIUM** | Validator check was missing lower bound check for weight | Updated `telemetry-validator.js` with range checks | `sensor_matrix.test.js` |
| **BUG-004** | Alert Engine | Hardcoded `BLR-TRK-001` fallback in alert engine logic | Dynamic lookup for any truck ID | Reverted unknown trucks to single default | **HIGH** | Default parameter fallback was static string | Refactored `alert-engine.js` for dynamic multi-truck DB lookup | `multi_truck_isolation.test.js` |
