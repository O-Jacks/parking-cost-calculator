const { format, addDays, subDays } = require("date-fns");

const currentDate = format(new Date(), "MM/dd/yyyy");
const tomorrowDate = format(addDays(currentDate, 1), "MM/dd/yyyy");
const currentDateMinus7Days = format(subDays(currentDate, 8), "MM/dd/yyyy");

const selectParkingLot = (parkingLot) => {
  cy.get("select[name='ParkingLot']").select(parkingLot);
  cy.get('select[name="ParkingLot"] option:selected').should(
    "have.text",
    parkingLot
  );
};

const enterDateTime = (
  startingDate,
  startingTime,
  leavingDate,
  leavingTime
) => {
  cy.get("input[name='StartingDate']").clear().type(startingDate);
  cy.get("input[name='StartingTime']").clear().type(startingTime);
  cy.get("input[name='LeavingDate']").clear().type(leavingDate);
  cy.get("input[name='LeavingTime']").clear().type(leavingTime);
};

const chooseAMorPM = (inputName, period) => {
  cy.get(`input[name='${inputName}'][value='${period}']`).check();
};

const clickCalculate = () => {
  cy.get('input[value="Calculate"]').click();
};

const assertLeavingTime = (expectedTime) => {
  cy.get("input[name='LeavingTime']").should("have.value", expectedTime);
};

const assertEstimatedCostAboveZero = () => {
  cy.get("td.BodyCopy > .SubHead")
    .contains("estimated Parking costs")
    .parent("td") // Get the parent cell containing the heading
    .next("td") // Get the next cell in the same table row
    .then(($nextCell) => {
      const amountText = $nextCell.find("b").text(); // Get the text content of the <b> element
      const amount = parseFloat(amountText.replace("$", "").trim()); // Parse the amount, removing the "$" symbol
      expect(amount, "Estimated parking cost should be above 0").to.be.above(0);
    });
};

describe("A user can calculate parking costs", () => {
  beforeEach(() => {
    cy.visit("parkcalc");
  });

  it("should calculate cost for less than one day of 'Valet Parking'", () => {
    selectParkingLot("Valet Parking");
    enterDateTime(tomorrowDate, "12:00", tomorrowDate, "11:59");
    chooseAMorPM("StartingTimeAMPM", "AM");
    chooseAMorPM("LeavingTimeAMPM", "PM");
    clickCalculate();
    assertLeavingTime("23:59");
    assertEstimatedCostAboveZero();
  });

  it("should calculate cost for more than 7 days of 'Long-Term Surface Parking'", () => {
    selectParkingLot("Long-Term Surface Parking");
    enterDateTime(currentDateMinus7Days, "12:00", currentDate, "5:00");
    chooseAMorPM("StartingTimeAMPM", "PM");
    chooseAMorPM("LeavingTimeAMPM", "AM");
    clickCalculate();
    assertLeavingTime("5:00");
    assertEstimatedCostAboveZero();
  });
});
