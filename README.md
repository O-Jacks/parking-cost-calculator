# Parking Cost Calculator

## Introduction

This project contains Cypress End-to-End tests for testing the https://www.shino.de/parkcalc application. These tests cover the golden/happy paths for this application and where possible try to interact with the page like a user would.

Test Scenarios:

- A user can calculate parking costs for ->
  - Less than one day of 'Valet Parking'.
  - More than 7 days of 'Long-Term Surface Parking'

## Running the Cypress end-to-end tests

To run the Cypress tests, first make sure you have node installed.

1. Navigate to the project directory and run:
   `npm install`
2. Run the tests:
   - `npm run cy:open` - uses Cypress UI
   - `npm run cy:run` - uses Cypress headless mode

## Assumptions/Observations

- Cross-browser and Mobile testing not too important as don't know intended demographic of users.
- Since UI E2E tests should cover the golden/happy path, the verifying of calculation logic for if correct parking costs were calculated should be done at a lower-level e.g. unit, component or integration tests.
- It's intended that the user can select past dates and times to calculate costs (although, this could cause problems if historical prices are different to current prices displayed on page).
- Have considered that UI E2E tests by nature can become flaky and hard to maintain. It would be important in reality to get business requirements from Product/BAs to determine critical paths and therefore what scenarios we should expect to cover if any gaps in this test suite.
- Parking costs will always be in "$". No localisation testing needed.
