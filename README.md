# Dyad QA Automation Assessment

## Automated Scenarios

### Scenario 6 - ParaBank Fund Transfer
Implemented with Playwright + TypeScript using Page Object Model.

Covered:
- User registration
- Two account creation
- Balance capture before transfer
- Valid fund transfer
- Balance validation after transfer
- Transaction validation
- Invalid over-balance transfer
- Bug documentation

Known defect:
- ParaBank accepts transfers greater than the available balance.
- Documented in `docs/BUG-REPORT.md` as `BUG-PB-001`.

### Scenario 7 - OrangeHRM Employee Leave Approval
Implemented with Playwright + TypeScript using Page Object Model.

Covered:
- Employee login
- Dynamic future working-day selection
- Duplicate leave-date avoidance
- Same From/To date leave request
- Duration selection
- Dynamic request identification
- Employee logout
- Admin login
- Employee search using autocomplete
- Leave approval
- Employee re-login
- Final leave status verification

## Framework

- Playwright
- TypeScript
- Page Object Model
- Playwright assertions
- Dynamic test data
- Environment-based credentials
- HTML reporting
- Screenshot on failure
- Video on failure
- Trace on failure
- `slowMo: 300`

## Test Execution

```bash

npx tsc --noEmit
npx playwright test
npx playwright show-report

project structure

src/
├── fixtures/
│   └── testFixtures.ts
├── hooks/
│   └── testHooks.ts
├── pages/
│   ├── orangehrm/
│   │   ├── LeavePage.ts
│   │   ├── LeaveRequestsPage.ts
│   │   ├── LoginPage.ts
│   │   └── MyLeavePage.ts
│   └── parabank/
│       ├── AccountOverviewPage.ts
│       ├── OpenAccountPage.ts
│       ├── RegisterPage.ts
│       ├── TransactionPage.ts
│       └── TransferFundsPage.ts
└── utils/

test-data/
├── dateUtils.ts
├── orangeHrmDateUtils.ts
└── parabankData.ts

tests/
├── scenario-6/
│   └── fund-transfer.spec.ts
└── scenario-7/
    └── employee-leave.spec.ts

test-results/
.env
.gitignore
package.json
package-lock.json
playwright.config.ts
README.md
tsconfig.json

