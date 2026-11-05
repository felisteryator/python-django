const records = {
  "2021/CS/014": {
    name: "Maya Okafor",
    programme: "BSc Computer Science",
    faculty: "Computing & Engineering",
    entryYear: "2021 / 2022",
    year: "Final year",
    credits: 142,
    requiredCredits: 144,
    gpa: 3.68,
    coreModules: true,
    capstone: true,
    nextSemester: "Semester 2",
  },
  "2021/IT/008": {
    name: "Daniel Mensah",
    programme: "BSc Information Technology",
    faculty: "Computing & Engineering",
    entryYear: "2021 / 2022",
    year: "Final year",
    credits: 144,
    requiredCredits: 144,
    gpa: 3.91,
    coreModules: true,
    capstone: true,
    nextSemester: "Graduation review",
  },
  "2021/BA/027": {
    name: "Amina Yusuf",
    programme: "BA Business Administration",
    faculty: "Business & Public Policy",
    entryYear: "2021 / 2022",
    year: "Final year",
    credits: 128,
    requiredCredits: 144,
    gpa: 1.84,
    coreModules: false,
    capstone: false,
    nextSemester: "Academic advising required",
  },
};

const form = document.querySelector("#assessment-form");
const studentInput = document.querySelector("#student-id");
const results = document.querySelector("#assessment-results");
const submitButton = form.querySelector('button[type="submit"]');
const toast = document.querySelector("#toast");
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(
    () => toast.classList.remove("is-visible"),
    2800,
  );
}

function setText(selector, value) {
  document.querySelector(selector).textContent = value;
}

function renderRequirements(record, graduationQualified) {
  const checks = [
    { label: "Minimum GPA of 2.00", complete: record.gpa >= 2 },
    { label: "Core modules passed", complete: record.coreModules },
    { label: "Capstone project", complete: record.capstone },
    {
      label: "Minimum credit requirement",
      complete: record.credits >= record.requiredCredits,
    },
  ];
  const completed = checks.filter((check) => check.complete).length;
  const list = document.querySelector("#requirement-list");

  list.replaceChildren(
    ...checks.map((check) => {
      const row = document.createElement("div");
      row.className = `requirement-row ${check.complete ? "is-complete" : record.gpa < 2 && check.label.startsWith("Minimum GPA") ? "is-missing" : "is-pending"}`;

      const mark = document.createElement("span");
      mark.className = "requirement-mark";
      mark.setAttribute("aria-hidden", "true");
      mark.textContent = check.complete
        ? "✓"
        : row.classList.contains("is-missing")
          ? "×"
          : "!";

      const label = document.createElement("span");
      label.textContent = check.label;

      const status = document.createElement("strong");
      status.textContent = check.complete
        ? "Met"
        : row.classList.contains("is-missing")
          ? "Not met"
          : "In progress";

      row.append(mark, label, status);
      return row;
    }),
  );

  setText("#check-count", `${completed} / ${checks.length} met`);
  setText(
    "#requirements-note",
    graduationQualified
      ? "All listed degree requirements have been met."
      : "Outstanding requirements must be resolved before graduation.",
  );
}

function renderRecord(record, studentId) {
  const graduationQualified =
    record.credits >= record.requiredCredits &&
    record.gpa >= 2 &&
    record.coreModules &&
    record.capstone;
  const canProceed = record.gpa >= 2 && record.coreModules;
  const decisionCard = document.querySelector("#decision-card");
  const remaining = Math.max(0, record.requiredCredits - record.credits);
  const percentage = Math.min(
    100,
    Math.round((record.credits / record.requiredCredits) * 100),
  );
  const initials = record.name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  setText("#student-avatar", initials);
  setText("#student-name", record.name);
  setText("#student-number", studentId);
  setText("#student-programme", record.programme);
  setText("#student-faculty", record.faculty);
  setText("#student-entry", record.entryYear);
  setText("#student-year", record.year.toUpperCase());
  setText("#credits-earned", record.credits);
  setText("#credits-required", record.requiredCredits);
  setText(
    "#credits-caption",
    remaining
      ? `${remaining} credits remaining`
      : "Credit requirement complete",
  );
  setText("#credits-percent", `${percentage}%`);
  setText("#student-gpa", `${record.gpa.toFixed(2)} / 4.00`);

  const progress = document.querySelector("#credit-progress");
  progress.setAttribute("aria-valuemax", record.requiredCredits);
  progress.setAttribute("aria-valuenow", record.credits);
  document.querySelector("#credit-progress-fill").style.width =
    `${percentage}%`;

  if (graduationQualified) {
    decisionCard.dataset.status = "graduate";
    setText("#decision-symbol", "✓");
    setText("#decision-kicker", "FINAL YEAR OUTCOME");
    setText("#decision-title", "Qualified to graduate");
    setText(
      "#decision-description",
      `${record.name.split(" ")[0]} has met the listed degree requirements and is ready for graduation review.`,
    );
    setText("#decision-detail", "Submit for graduation clearance");
    setText("#decision-state-label", "REQUIREMENTS MET");
  } else if (canProceed) {
    decisionCard.dataset.status = "progress";
    setText("#decision-symbol", "→");
    setText("#decision-kicker", "NEXT STEP");
    setText("#decision-title", "Eligible to proceed");
    setText(
      "#decision-description",
      `${record.name.split(" ")[0]} has met the requirements to continue to the next semester.`,
    );
    setText("#decision-detail", `Proceed to ${record.nextSemester}`);
    setText("#decision-state-label", "ASSESSMENT COMPLETE");
  } else {
    decisionCard.dataset.status = "hold";
    setText("#decision-symbol", "!");
    setText("#decision-kicker", "ACTION REQUIRED");
    setText("#decision-title", "Progression on hold");
    setText(
      "#decision-description",
      `${record.name.split(" ")[0]} should meet with an academic adviser to review outstanding requirements.`,
    );
    setText("#decision-detail", record.nextSemester);
    setText("#decision-state-label", "REVIEW REQUIRED");
  }

  renderRequirements(record, graduationQualified);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const studentId = studentInput.value.trim().toUpperCase();
  const record = records[studentId];

  if (!record) {
    studentInput.setAttribute("aria-invalid", "true");
    studentInput.focus();
    showToast("No demo record found. Try one of the sample student IDs below.");
    return;
  }

  studentInput.removeAttribute("aria-invalid");
  submitButton.classList.add("is-loading");
  submitButton.disabled = true;
  results.setAttribute("aria-busy", "true");

  window.setTimeout(() => {
    renderRecord(record, studentId);
    results.setAttribute("aria-busy", "false");
    submitButton.classList.remove("is-loading");
    submitButton.disabled = false;
    showToast("Assessment complete. Results use sample data.");
  }, 350);
});

document.querySelector(".clear-input").addEventListener("click", () => {
  studentInput.value = "";
  studentInput.removeAttribute("aria-invalid");
  studentInput.focus();
});

document.querySelectorAll(".demo-record").forEach((button) => {
  button.addEventListener("click", () => {
    studentInput.value = button.dataset.studentId;
    form.requestSubmit();
  });
});

document
  .querySelector("#print-report")
  .addEventListener("click", () => window.print());

renderRecord(records["2021/CS/014"], "2021/CS/014");
