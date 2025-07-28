document.addEventListener("DOMContentLoaded", () => {
  const stateSelect = document.getElementById("stateSelect");
  const gradeSelect = document.getElementById("gradeSelect");
  const courseSelect = document.getElementById("courseSelect");
  let alignmentData = [];
  const stateDataCache = {};

  // Add placeholder to State dropdown
  stateSelect.innerHTML = "";
  const placeholderState = document.createElement("option");
  placeholderState.value = "";
  placeholderState.textContent = "Select a state";
  placeholderState.disabled = true;
  placeholderState.selected = true;
  stateSelect.appendChild(placeholderState);

  // Add placeholder to Grade dropdown
  gradeSelect.innerHTML = "";
  const placeholderGrade = document.createElement("option");
  placeholderGrade.value = "";
  placeholderGrade.textContent = "Select a grade";
  placeholderGrade.disabled = true;
  placeholderGrade.selected = true;
  gradeSelect.appendChild(placeholderGrade);

  // Now populate State dropdown with real options
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
    if (!state) return;
    const jsonPath = `./state_alignment/${state}.json`;
    console.log(`Fetching JSON from path: ${jsonPath}`);
    if (stateDataCache[state]) {
      alignmentData = stateDataCache[state];
      populateGrades();
      return;
    }
    fetch(jsonPath)
      .then((response) => {
        if (!response.ok) throw new Error(response.statusText);
        return response.json();
      })
      .then((data) => {
        alignmentData = data;
        stateDataCache[state] = data;
        populateGrades();
      })
      .catch((err) => {
        console.error(`Error loading JSON for state ${state}:`, err);
        alert(`Could not load data for ${state}. Check console.`);
      });
  }

  function populateGrades() {
    gradeSelect.innerHTML = "";
    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "Select a grade";
    placeholder.disabled = true;
    placeholder.selected = true;
    gradeSelect.appendChild(placeholder);

    const grades = Object.keys(alignmentData);
    grades.sort((a, b) => {
      const na = parseFloat(a),
        nb = parseFloat(b);
      if (!isNaN(na) && !isNaN(nb)) return na - nb;
      return a.localeCompare(b);
    });
    grades.forEach((g) => {
      const opt = document.createElement("option");
      opt.value = g;
      opt.textContent = g;
      gradeSelect.appendChild(opt);
    });
  }

  function populateTable() {
    const selectedGrade = gradeSelect.value;
    const selectedCourse = courseSelect.value;
    const tbody = document.querySelector("#alignmentTable tbody");
    tbody.innerHTML = "";
    if (!selectedGrade || !selectedCourse || !alignmentData[selectedGrade])
      return;

    alignmentData[selectedGrade].forEach((stdObj) => {
      const tr = document.createElement("tr");

      const tdStd = document.createElement("td");
      tdStd.textContent = `${stdObj.id} ${stdObj.text}`;

      const tdChk = document.createElement("td");
      const cb = document.createElement("input");
      cb.type = "checkbox";
      const matching = stdObj.projects
        .filter((p) => !selectedCourse || p.course === selectedCourse)
        .map((p) => p.name);
      cb.checked = matching.length > 0;
      cb.disabled = true;
      tdChk.appendChild(cb);

      const tdProj = document.createElement("td");
      tdProj.innerHTML = matching.map((name) => `<div>${name}</div>`).join("");

      tr.appendChild(tdStd);
      tr.appendChild(tdChk);
      tr.appendChild(tdProj);
      tbody.appendChild(tr);
    });
  }
});
