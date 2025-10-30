let employees = [
      { 
        name: "Ronald Mendel", 
        address: "C/ Araquil, 67, Madrid", 
        salary: 5000 
      },
      { 
        name: "Victoria Ashworth", 
        address: "35 King George, London", 
        salary: 6500 
      },
      { 
        name: "Martin Blank", 
        address: "25, Rue Lauriston, Paris", 
        salary: 8000 
      }
    ];

    let editIndex = null;

    function renderTable() {
      const tableBody = document.getElementById('tableBody');
      tableBody.innerHTML = '';
      employees.forEach((emp, index) => {
        const row = `
          <tr>
            <td>${index + 1}</td>
            <td>${emp.name}</td>
            <td>${emp.address}</td>
            <td>${emp.salary}</td>
            <td>
              <button class="action-btn edit" onclick="editEmployee(${index})">
                <i class="fa-solid fa-pencil"></i></i>
              </button>
              <button class="action-btn delete" onclick="deleteEmployee(${index})">
                <i class="fa-solid fa-trash"></i>
              </button>
            </td>
          </tr>`;
        tableBody.innerHTML += row;
      });
    }

    function openModal(isEdit = false) {
      document.getElementById('employeeModal').style.display = 'flex';
      if (!isEdit) {
        document.getElementById('modalTitle').textContent = "Add New Employee";
        document.getElementById('nameInput').value = '';
        document.getElementById('addressInput').value = '';
        document.getElementById('salaryInput').value = '';
        editIndex = null;
      }
    }

    function closeModal() {
      document.getElementById('employeeModal').style.display = 'none';
    }

    function saveEmployee() {
      const name = document.getElementById('nameInput').value;
      const address = document.getElementById('addressInput').value;
      const salary = document.getElementById('salaryInput').value;

      if (!name || !address || !salary) {
        alert("Please fill all fields!");
        return;
      }
      if (name.length < 2 || address.length < 2 || name.length > 60 || address.length > 300) {
        alert("Name should be 2–60 chars & address 2–300 chars only");
        return;
      }
        if (salary < 0) {
        alert("Salary must be positive");
        return;
    }

    if (salary > 999999999999) {
        alert("Salary exceeds the maximum limit!");
        return;
    }


  if (editIndex !== null) {
    employees[editIndex] = { name, address, salary };
    console.log(`Employee Updated [Index: ${editIndex}]`);
    console.table(employees[editIndex]);
  } else {
    employees.push({ name, address, salary });
    console.log("New Employee Added:");
    console.table(employees[employees.length - 1]);
  }

  closeModal();
  renderTable();

  console.log("Employee List:");
  console.table(employees);
}
    function validateName(input) {
        input.value = input.value.replace(/[^A-Za-z\s]/g, '');
    }

    function editEmployee(index) {
      editIndex = index;
      const emp = employees[index];
      document.getElementById('nameInput').value = emp.name;
      document.getElementById('addressInput').value = emp.address;
      document.getElementById('salaryInput').value = emp.salary;
      document.getElementById('modalTitle').textContent = "Edit Employee";
      openModal(true);
    }

    function deleteEmployee(index) {
      if (confirm('Are you sure you want to delete this employee?')) {
        employees.splice(index, 1);
        renderTable();
      }
    }

    window.onclick = function(event) {
      const modal = document.getElementById('employeeModal');
      if (event.target === modal) {
        closeModal();
      }
    }
    renderTable();