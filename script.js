document.addEventListener("DOMContentLoaded", () => {
  const stateSelect = document.getElementById("stateSelect");
  const gradeSelect = document.getElementById("gradeSelect");
  const courseSelect = document.getElementById("courseSelect");
  let alignmentData = [];

  // Populate state dropdown
  const stateNames = [
    "Alabama",
    "Alaska",
    "Arizona",
    "Arkansas",
    "California",
    "Colorado",
    "Connecticut",
    "Delaware",
    "Florida",
    "Georgia",
    "Hawaii",
    "Idaho",
    "Illinois",
    "Indiana",
    "Iowa",
    "Kansas",
    "Kentucky",
    "Louisiana",
    "Maine",
    "Maryland",
    "Massachusetts",
    "Michigan",
    "Minnesota",
    "Mississippi",
    "Missouri",
    "Montana",
    "Nebraska",
    "Nevada",
    "New Hampshire",
    "New Jersey",
    "New Mexico",
    "New York",
    "North Carolina",
    "North Dakota",
    "Ohio",
    "Oklahoma",
    "Oregon",
    "Pennsylvania",
    "Rhode Island",
    "South Carolina",
    "South Dakota",
    "Tennessee",
    "Texas",
    "Utah",
    "Vermont",
    "Virginia",
    "Washington",
    "West Virginia",
    "Wisconsin",
    "Wyoming",
  ];
  stateNames.forEach((name) => {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    stateSelect.appendChild(option);
  });
  stateSelect.appendChild(new Option("CSTA", "CSTA"));

  // Event listeners
  stateSelect.addEventListener("change", () =>
    loadAlignmentData(stateSelect.value)
  );
  gradeSelect.addEventListener("change", populateTable);
  courseSelect.addEventListener("change", populateTable);

  function loadAlignmentData(state) {
    // TODO: fetch and parse CSV from `state_alignment/${state}.csv`
    console.log(`Loading data for state: ${state}`);
  }

  function populateGrades() {
    // TODO: extract unique grades and populate gradeSelect
    console.log("Populating grades dropdown");
  }

  function populateTable() {
    // TODO: filter alignmentData by selected grade and course and render rows
    console.log("Populating table with filtered data");
  }
});
