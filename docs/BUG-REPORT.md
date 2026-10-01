# Bug Report

## BUG-PB-001

### Title

ParaBank allows fund transfer greater than the available account balance

### Module

Fund Transfer

### Severity

High

### Priority

High

### Preconditions

- User is registered and logged in.
- Source and destination accounts are available.
- Source account has a positive available balance.

### Steps to Reproduce

1. Login to ParaBank.
2. Navigate to Transfer Funds.
3. Select a source account with an available balance.
4. Select a destination account.
5. Calculate a transfer amount greater than the available balance.
6. Enter the calculated amount.
7. Click Transfer.

### Test Data

The invalid transfer amount is calculated dynamically:

`Invalid Transfer Amount = Available Balance + 1`

Example:

`Available Balance = $100.00`

`Invalid Transfer Amount = $101.00`

### Expected Result

The system should reject the transfer because the requested amount is greater than the available balance and should display an appropriate error message.

### Actual Result

The system accepts the transfer and displays a successful transfer confirmation.

The source account balance becomes negative.

Example:

`Available Balance = $100.00`

`Transfer Amount = $101.00`

`Resulting Balance = -$1.00`

### Impact

The application allows a customer to transfer more money than the available account balance, resulting in a negative account balance.

### Reproducibility

Reproducible through the automated negative-path test.

### Automation Evidence

The Playwright test dynamically calculates the invalid amount using:

`invalidTransferAmount = balanceABefore + 1`

The test verifies that the attempted amount is greater than the available balance and validates the resulting application behavior.

### Status

Open