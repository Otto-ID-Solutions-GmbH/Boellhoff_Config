const deviceType = document.getElementById("Device-Type");
const salesUnit = document.getElementById("Sales-Unit");
const customerNumber = document.getElementById("customerNumber");
const stationNumber = document.getElementById("stationNumber");
const address = document.getElementById("address");
const teamviewerAlies = document.getElementById("teamviewer_alies");
const final_cost_center = document.getElementById("final_cost_center");
const dbm = document.getElementById("dbm");
const antenna = document.getElementById("antenna");
const seconds = document.getElementById("seconds");
const floorScan1200 = document.getElementById("floorScan1200x800");
const floorScan800 = document.getElementById("floorScan800x600");
const powerChargerWrapper = document.getElementById("powerChargerWrapper");
const tAdapterWrapper = document.getElementById("tAdapterWrapper");
const extensionCable1Wrapper = document.getElementById(
  "extensionCable15mWrapper"
);
const extensionCable3Wrapper = document.getElementById(
  "extensionCable3mWrapper"
);
const daysWrapper = document.getElementById("daysWrapper");
const timeWrapper = document.getElementById("timeWrapper");
const secondsWrapper = document.getElementById("secondsWrapper");
const sendingMethod = document.getElementById("sendingMethod");

const costCenter = {
  D10: "01059",
  D15: "01559",
  D30: "03059",
  D70: "07059",
  D73: "07359",
  DW1: "ENGEL",
  A72: "BOA",
  A73: "BOA",
  A74: "BOA",
  A75: "BOA",
  CZ1: "CZ1",
  BOH: "BOH",
};
const antennaDict = {
  True: "10",
  False: "22",
};

function valueUpdater(tobeUpdated, value) {
  tobeUpdated.value = value;
}

let timer;
//incorrect input handler
function inputHandler(pattern, value, ANlength, numlength, errorID, example) {
  clearTimeout(timer);
  if (value.length !== ANlength + numlength || !pattern.test(value)) {
    timer = setTimeout(function() {
      errorID.textContent = `Please enter a valid value with ${ANlength}${
        ANlength === 1 ? " letter" : " letters"
      } followed by ${numlength} numbers (e.g.${example})`;
      errorID.style.display = "block";
    }, 1000);
  } else {
    errorID.style.display = "none";
    errorID.textContent = "";
  }

  if (value.trim() === "") {
    errorID.style.display = "none";
  }
}

//dependent inputs
function displayer() {
  if (deviceType.value === "Eco-Flexible") {
    console.log("je")
    const hasAll =
      seconds.value > 0 || antenna.value > 0 || floorScan1200.value > 0 || floorScan800.value > 0;
    const hasTAdapter =
      seconds.value > 0 || antenna.value > 1 || floorScan1200.value > 1 || floorScan800.value > 1;
    console.log(hasAll,hasTAdapter)

    powerChargerWrapper.style.display = extensionCable1Wrapper.style.display = extensionCable3Wrapper.style.display = hasAll
      ? "block"
      : "none";

    tAdapterWrapper.style.display = hasTAdapter ? "block" : "none";
  } else {
    console.log("hekk")
    powerChargerWrapper.style.display = extensionCable1Wrapper.style.display = extensionCable3Wrapper.style.display = tAdapterWrapper.style.display =
      "none";
  }
}

function sendingMethodReactor() {
  const sendingMethodValue = sendingMethod.value;
  daysWrapper.style.display = timeWrapper.style.display = secondsWrapper.style.display =
    "none";
  if (sendingMethodValue === "Trigger") {
    timeWrapper.style.display = daysWrapper.style.display = "block";
  } else if (sendingMethodValue === "Periodic") {
    secondsWrapper.style.display = "block";
  }
}

//final cost center
function updateFinalCostCenter() {
  const defaultValue = costCenter[salesUnit.value];
  if (defaultValue) {
    valueUpdater(final_cost_center, defaultValue);
  }
}

//team viewer alies
function updateTeamViewerAlies() {
  const defaultAlies = `${deviceType.value}_${
    salesUnit.value
  }_${customerNumber.value.substring(3)}_${stationNumber.value}_${
    address.value
  }`;
  valueUpdater(teamviewerAlies, defaultAlies);
}

//dbm
function updatedbm() {
  const antennaValue = antenna.value;
  const dbmValue = antennaDict[antennaValue];
  valueUpdater(dbm, dbmValue);
}

//events
deviceType.addEventListener("change", updateTeamViewerAlies);
salesUnit.addEventListener("change", updateTeamViewerAlies);
customerNumber.addEventListener("input", updateTeamViewerAlies);
stationNumber.addEventListener("input", updateTeamViewerAlies);
address.addEventListener("input", updateTeamViewerAlies);
salesUnit.addEventListener("change", updateFinalCostCenter);
antenna.addEventListener("change", updatedbm);
seconds.addEventListener("change", displayer);
antenna.addEventListener("change", displayer);
floorScan1200.addEventListener("change", displayer);
floorScan800.addEventListener("change", displayer);
deviceType.addEventListener("change", displayer);
sendingMethod.addEventListener("change", sendingMethodReactor);

//customer number
function customerNumberValidation(input) {
  const pattern = /^[A-Za-z]{3}[0-9]{7}$/;
  const errorMessage = document.getElementById("error-message_customer");
  const example = "ABC1234567";

  inputHandler(pattern, input.value, 3, 7, errorMessage, example);
}

//Final Investment number
function investmentNumberValidation(input) {
  const pattern = /^[A-Za-z]{1}[0-9]{6}$/;
  const errorMessage = document.getElementById("error-message_investment");
  const example = "A123456";

  inputHandler(pattern, input.value, 1, 6, errorMessage, example);
}

document.addEventListener("DOMContentLoaded", function() {
  const form = document.getElementById("configForm");
  form.addEventListener("submit", function(event) {
    event.preventDefault();

    // Collect form data
    let address;
    const formData = new FormData(form);
    const config = {};
    formData.forEach((value, key) => {
      if (key == "selectEmail") {
        address = getAddressForEmail(value);
        return;
      }
      if (value == "TRUE" || value == "FALSE") {
        value = value === "TRUE";
      }
      config[key] = value;
    });

    const configJSON = JSON.stringify(config, null, 2);


    const params = {
      message: configJSON + "\n\n Address :" + address,
    };
    console.log(configJSON);
  });
});

function getAddressForEmail(email) {
  const addressEntry = Addresses.find((entry) => entry.email === email);
  return addressEntry ? addressEntry.address : "";
}

const Addresses = [
  {
    email: "hrehm@boellhoff.com",
    address:
      "Böllhoff GmbH, Heiko Rehm, Königstrasse 25, 32584 Löhne, Deutschland",
  },
  {
    email: "mbischiff@boellhoff.com",
    address:
      "Böllhoff GmbH, Matthias Bischoff, Gewerbestrasse 10, 04420 Markranstädt/OT Frankenheim, Deutschland",
  },
  {
    email: "shutzler@boellhoff.com",
    address:
      "Böllhoff GmbH, Stefan Hutzler, Bühlstraße 16, 90610 Winkelhaid, Deutschland",
  },
  {
    email: "mimbach@boellhoff.com",
    address:
      "Böllhoff GmbH, Mathias Imbach, St Anna Weg 11, 89349 Burtenbach, Deutschland",
  },
  {
    email: "funtersmeier@boellhoff.com",
    address:
      "Böllhoff GmbH, Fritz Untersmeier, Johann-Roithner-Straße 131, 4050 Traun, Österreich",
  },
  {
    email: "sgrünwald@boellhoff.com",
    address:
      "Böllhoff GmbH, Stefanie Grünwald, Johann-Roithner-Straße 131, 4050 Traun, Österreich",
  },
  {
    email: "apeter@boellhoff.com",
    address:
      "Böllhoff KFT, Àlmos Peter, Alba Ipari Zona, Zsúrió utca 8, 8000 Székesfehérvár, Ungarn",
  },
  {
    email: "hboer@boellhoff.com",
    address:
      "Böllhoff s.r.o., Henri Boer, Palouky C.P. 1365, 25301 Hostivice, Tschechien",
  },
  {
    email: "mfabian@boellhoff.com",
    address:
      "Böllhoff s.r.o., Martin Fabian, Dialnicná Cesta 10 a, 90301 Senec, Slovakei",
  },
  {
    email: "a.goeppel@schrauben-engel.de",
    address:
      "Verbindungselemente Engel GmbH	Andreas Göppel	Weltestraße 2+4	88250	Weingarten	Deutschland	",
  },
  {
    email: "mgrassy@boellhoff.com",
    address:
      "Böllhoff GmbH	Mario Graßy	Archimedesstraße 1-4	33649	Bielefeld	Deutschland",
  },
];
// const selectEmail = document.getElementById("selectEmail");
// const addressInput = document.getElementById("address");
// const ecoPortalEmailAddressInput = document.getElementById("ecoportalEmail");

// selectEmail.addEventListener("change", function() {
//   const selectedEmail = selectEmail.value;

//   // Find the corresponding address based on the selected email
//   const selectedAddress = emailAddresses.find(
//     (item) => item.email === selectedEmail
//   );

//   // Update the address input field with the selected address
//   if (selectedAddress) {
//     addressInput.value = selectedAddress.address;
//     ecoPortalEmailAddressInput.value = selectedAddress.email;
//   }
// });
