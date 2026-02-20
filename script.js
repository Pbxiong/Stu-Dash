let students = [];
let filteredStudents = [];

const tableBody = document.querySelector("#studentTable tbody");
const searchInput = document.getElementById("searchInput");
const form = document.getElementById("studentForm");
const noResults = document.getElementById("noResults");
const countBadge = document.getElementById("countBadge");

/*  JSON */
fetch("students.json")
  .then(res => res.json())
  .then(data => {
    students = data;
    filteredStudents = [...students];
    displayStudents(filteredStudents);
  });

function displayStudents(data){
  tableBody.innerHTML = "";
  countBadge.textContent = `${data.length} record${data.length!==1?"s":""}`;

  if(data.length===0){
    noResults.classList.remove("hidden");
    return;
  } else {
    noResults.classList.add("hidden");
  }

  data.forEach(student=>{
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${student.id}</td>
      <td>${student.name}</td>
      <td>${student.age}</td>
      <td>${student.course}</td>
    `;
    tableBody.appendChild(row);
  });
}

/* SEARCH */
searchInput.addEventListener("input",()=>{
  const value = searchInput.value.toLowerCase();
  filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(value)
  );
  displayStudents(filteredStudents);
});

/* ADD STUDENT */
form.addEventListener("submit",(e)=>{
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const age = document.getElementById("age").value.trim();
  const course = document.getElementById("course").value.trim();

  if(!name||!age||!course){
    alert("All fields required!");
    return;
  }

  if(/\d/.test(name)){
    alert("Name cannot contain numbers!");
    return;
  }

  const newStudent = {
    id: students.length+1,
    name:name,
    age:parseInt(age),
    course:course
  };

  students.push(newStudent);
  filteredStudents=[...students];
  displayStudents(filteredStudents);

  const lastRow = tableBody.lastChild;
  lastRow.classList.add("highlight");

  form.reset();
});

/*   DROPDOWN */
const customSelect = document.getElementById("sortSelect");
const selected = customSelect.querySelector(".select-selected");
const options = customSelect.querySelector(".select-items");

selected.addEventListener("click",()=>{
  options.classList.toggle("hidden");
});

options.querySelectorAll("div").forEach(option=>{
  option.addEventListener("click",()=>{
    const value = option.dataset.value;
    selected.textContent = option.textContent;
    options.classList.add("hidden");

    if(value==="name"){
      filteredStudents.sort((a,b)=>a.name.localeCompare(b.name));
    }

    if(value==="age"){
      filteredStudents.sort((a,b)=>a.age-b.age);
    }

    displayStudents(filteredStudents);
  });
});

document.addEventListener("click",(e)=>{
  if(!customSelect.contains(e.target)){
    options.classList.add("hidden");
  }
});