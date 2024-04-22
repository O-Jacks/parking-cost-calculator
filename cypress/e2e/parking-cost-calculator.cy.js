const { format, addDays, subDays } = require("date-fns");

const currentDate = format(new Date(), "MM/dd/yyyy");
const tomorrowDate = format(addDays(currentDate, 1), "MM/dd/yyyy");
const currentDateMinus7Days = format(subDays(currentDate, 8), "MM/dd/yyyy");

describe("A user can calculate parking costs", () => {
  beforeEach(() => {
    cy.visit("parkcalc");
  });
  it("should calculate cost for less than one day of 'Valet Parking'", () => {
    cy.get("select[name='ParkingLot']").select("Valet Parking");
    cy.get("input[name='StartingDate']").clear().type(tomorrowDate);
    cy.get("input[name='StartingTime']").clear().type("12:00");
    cy.get("input[name='StartingTimeAMPM'][value='AM']").check();
    cy.get("input[name='LeavingDate']").clear().type(tomorrowDate);
    cy.get("input[name='LeavingTime']").clear().type("11:59");
    cy.get("input[name='LeavingTimeAMPM'][value='PM']").check();
    cy.contains("Calculate").click();
    cy.get("input[name='LeavingTime']").should("have.value", "23:59");
    cy.get("td.BodyCopy > .SubHead")
      .contains("estimated Parking costs")
      .parent("td") // Get the parent cell containing the heading
      .next("td") // Get the next cell in the same table row
      .then(($nextCell) => {
        const amountText = $nextCell.find("b").text(); // Get the text content of the <b> element
        const amount = parseFloat(amountText.replace("$", "").trim()); // Parse the amount, removing the "$" symbol
        expect(amount).to.be.above(0); // Assert that the amount is greater than 0
      });
  });

  it("should calculate cost for more than 7 days of 'Long-Term Surface Parking'", () => {
    cy.get("select[name='ParkingLot']").select("Long-Term Surface Parking");
    cy.get("input[name='StartingDate']").clear().type(currentDateMinus7Days);
    cy.get("input[name='StartingTime']").clear().type("12:00");
    cy.get("input[name='StartingTimeAMPM'][value='PM']").check();

    cy.get("input[name='LeavingDate']").clear().type(currentDate);
    cy.get("input[name='LeavingTime']").clear().type("5:00");
    cy.get("input[name='LeavingTimeAMPM'][value='AM']").check();
    cy.contains("Calculate").click();
    cy.get("input[name='LeavingTime']").should("have.value", "5:00");
    cy.get("td.BodyCopy > .SubHead")
      .contains("estimated Parking costs")
      .parent("td") // Get the parent cell containing the heading
      .next("td") // Get the next cell in the same table row
      .then(($nextCell) => {
        const amountText = $nextCell.find("b").text(); // Get the text content of the <b> element
        const amount = parseFloat(amountText.replace("$", "").trim()); // Parse the amount, removing the "$" symbol
        expect(amount).to.be.above(0); // Assert that the amount is greater than 0
      });
  });
});
