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
        let grouped = {};
        if (Array.isArray(data)) {
          // Group rows by grade, then by standard, collecting projects
          data.forEach((row) => {
            const grade = row.Grade;
            if (!grouped[grade]) grouped[grade] = {};
            const key = row["Standard ID"] + "||" + row["Standard Text"];
            if (!grouped[grade][key]) {
              grouped[grade][key] = {
                id: row["Standard ID"],
                text: row["Standard Text"],
                projects: [],
              };
            }
            if (row["Project Name"]) {
              grouped[grade][key].projects.push({
                name: row["Project Name"],
                course: row["Course Name"],
              });
            }
          });
          // Convert nested maps to arrays
          Object.keys(grouped).forEach((gr) => {
            grouped[gr] = Object.values(grouped[gr]);
          });
        } else {
          // Already in grouped format
          grouped = data;
        }
        alignmentData = grouped;
        console.log("Grade keys in loaded data:", Object.keys(grouped));
        stateDataCache[state] = grouped;
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
    console.log("Selected grade:", selectedGrade);
    console.log("Selected course:", selectedCourse);
    const tbody = document.querySelector("#alignmentTable tbody");
    tbody.innerHTML = "";
    if (!selectedGrade || !alignmentData[selectedGrade]) return;
    if (!selectedCourse) return;

    const sortedStandards = alignmentData[selectedGrade]
      .slice()
      .sort((a, b) => {
        return a.id.localeCompare(b.id);
      });

    sortedStandards.forEach((stdObj) => {
      const tr = document.createElement("tr");

      const tdStd = document.createElement("td");
      tdStd.textContent = `${stdObj.id} ${stdObj.text}`;

      const tdChk = document.createElement("td");
      const cb = document.createElement("input");
      cb.type = "checkbox";
      // Only include non-empty project names for the selected course
      const matchingProjects = stdObj.projects.filter((p) => {
        const courseMatch =
          selectedCourse &&
          p.course &&
          p.course.trim().toLowerCase() === selectedCourse.trim().toLowerCase();
        const name = p.name;
        const hasName =
          (typeof name === "string" && name.trim() !== "") ||
          (Array.isArray(name) && name.length > 0);
        return courseMatch && hasName;
      });
      // Checkbox reflects whether there is at least one non-empty project
      cb.checked = matchingProjects.length > 0;
      cb.disabled = true;
      tdChk.appendChild(cb);
      // Build a flat list of non-empty project names (handle strings or arrays)
      const projectNames = matchingProjects.flatMap((p) => {
        if (typeof p.name === "string" && p.name.trim() !== "") {
          return [p.name.trim()];
        }
        if (Array.isArray(p.name)) {
          return p.name
            .filter((n) => typeof n === "string" && n.trim() !== "")
            .map((n) => n.trim());
        }
        return [];
      });

      const tdProj = document.createElement("td");
      tdProj.innerHTML = projectNames
        .join(", ")
        .split(",")
        .map((name) => `<div>${name.trim()}</div>`)
        .join("");
      tr.appendChild(tdStd);
      tr.appendChild(tdChk);
      tr.appendChild(tdProj);
      tbody.appendChild(tr);
    });
    // Calculate summary using the same non-empty matchingProjects logic
    const totalStandards = sortedStandards.length;
    const alignedStandards = sortedStandards.filter((stdObj) => {
      const matchingProjects = stdObj.projects.filter((p) => {
        const courseMatch =
          selectedCourse &&
          p.course &&
          p.course.trim().toLowerCase() === selectedCourse.trim().toLowerCase();
        const name = p.name;
        const hasName =
          (typeof name === "string" && name.trim() !== "") ||
          (Array.isArray(name) && name.length > 0);
        return courseMatch && hasName;
      });
      return matchingProjects.length > 0;
    }).length;
    const percent = ((alignedStandards / totalStandards) * 100).toFixed(1);

    const summaryTr = document.createElement("tr");
    summaryTr.classList.add("summary-row");
    const tdSummary = document.createElement("td");
    tdSummary.textContent = "Alignment Summary";
    tdSummary.style.fontWeight = "bold";
    summaryTr.appendChild(tdSummary);

    const tdCount = document.createElement("td");
    tdCount.textContent = `${alignedStandards} / ${totalStandards}`;
    summaryTr.appendChild(tdCount);

    const tdPercent = document.createElement("td");
    tdPercent.textContent = `${percent}%`;
    summaryTr.appendChild(tdPercent);

    tbody.appendChild(summaryTr);
  }
});
