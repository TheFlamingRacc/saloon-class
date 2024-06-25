let autoSaloonList = JSON.parse(localStorage.getItem("autoSaloon")) || [];
renderAutoSaloons();

class Building {
  constructor(amountOfSpace, name, address) {
    this.amountOfSpace = amountOfSpace;
    this.name = name;
    this.address = address;
    this.id = Date.now();
  }

  getInfo() {
    return `'${this.name}', max space amount: ${this.amountOfSpace}, address: ${this.address}`;
  }
}

class AutoSaloon extends Building {
  constructor(amountOfSpace, name, address) {
    super(amountOfSpace, name, address);
    this.garage = [];
    this.color = this.getRandomColor();
    this.isInfoShown = false;
  }

  static addCar(car, saloonId) {
    autoSaloonList = autoSaloonList.map((saloon) => {
      if (saloon.id === saloonId) {
        return { ...saloon, garage: [...saloon.garage, car] };
      }
      return saloon;
    });
  }

  getInfo() {
    return `'${this.name}', max cars amount: ${
      this.amountOfSpace
    }, available space: ${this.amountOfSpace - this.garage.length}, address: ${
      this.address
    }`;
  }

  getRandomColor() {
    let r = Math.floor(Math.random() * 256);
    let g = Math.floor(Math.random() * 256);
    let b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
  }
}

class Car {
  constructor(mark, carNumber, price) {
    this.mark = mark;
    this.carNumber = carNumber;
    this.nameOfSaloon = "";
    this.price = price;
    this.isCarInfoShown = false;
  }

  addToSaloon(name) {
    if (this.nameOfSaloon) {
      console.log("This car is already in a saloon");
      return false;
    } else {
      this.nameOfSaloon = name;
      return true;
    }
  }
}

const addSaloonBtn = document.getElementById("addSaloonButton");

addSaloonBtn.addEventListener("click", () => {
  const amountOfSpace = +prompt("Set amount of space in saloon");
  console.log(amountOfSpace);

  if (!isValidAmountOfSpace(amountOfSpace)) {
    return;
  }

  const name = prompt("Set name for saloon");
  if (
    !isValidString(name, "Auto saloon's name must contain at least 1 character")
  ) {
    return;
  }

  const address = prompt("Set address for your saloon");

  if (
    !isValidString(
      address,
      "Auto saloon's address must contain at least 1 character"
    )
  ) {
    return;
  }

  const autoSaloon = new AutoSaloon(amountOfSpace, name, address);
  console.log(autoSaloon.addCar);
  autoSaloonList.push(autoSaloon);
  renderJSON();
  renderAutoSaloons();
});

//Delete auto saloon
function deleteAutoSaloon(id) {
  autoSaloonList = autoSaloonList.filter((x) => x.id !== id);
  renderAutoSaloons();
}

//Edit saloon name
function editSaloonsName(id) {
  const newName = prompt("Enter new saloon's name");
  if (!isValidString(newName)) {
    return;
  }

  autoSaloonList = autoSaloonList.map((autoSaloon) =>
    autoSaloon.id === id ? { ...autoSaloon, name: newName } : autoSaloon
  );

  renderAutoSaloons();
}

// Edit amount of space
function editAmountOfSpace(id) {
  const newAmountOfSpace = +prompt("Enter new amount of space");

  if (!isValidAmountOfSpace(newAmountOfSpace)) {
    return;
  }

  autoSaloonList = autoSaloonList.map((autoSaloon) => {
    if (autoSaloon.id === id) {
      if (autoSaloon.garage.length <= newAmountOfSpace) {
        return { ...autoSaloon, amountOfSpace: newAmountOfSpace };
      } else {
        alert("You can't have a smaller saloon than your garage");
        return autoSaloon;
      }
    } else {
      return autoSaloon;
    }
  });

  renderAutoSaloons();
}

//Show saloon info
function saloonInfo(id) {
  autoSaloonList = autoSaloonList.map((autoSaloon) =>
    autoSaloon.id === id
      ? { ...autoSaloon, isInfoShown: !autoSaloon.isInfoShown }
      : autoSaloon
  );
  renderAutoSaloons();
}

//Render function
function renderAutoSaloons() {
  const saloonsList = document.getElementById("saloonsList");
  saloonsList.innerHTML = "";

  autoSaloonList.forEach((autoSaloon) => {
    const divBox = document.createElement("div");
    divBox.id = autoSaloon.id;
    divBox.classList.add("saloonContainer");
    divBox.style.backgroundColor = autoSaloon.color;

    const nameHolder = document.createElement("div");
    nameHolder.classList.add("autoSaloonName");
    nameHolder.innerHTML = `${autoSaloon.name}`;

    const buttonDivBox = document.createElement("div");
    buttonDivBox.classList.add("buttonDivBox");

    //Get saloon info button
    const infoButton = document.createElement("button");
    infoButton.classList.add("infoButton", "btn");
    infoButton.addEventListener("click", () => {
      saloonInfo(autoSaloon.id);
    });

    //Delete button
    const deleteButton = document.createElement("button");
    deleteButton.classList.add("deleteButton", "btn");
    deleteButton.innerHTML = "DELETE";
    deleteButton.addEventListener("click", () => {
      deleteAutoSaloon(autoSaloon.id);
    });

    //Edit button
    const editButton = document.createElement("button");
    editButton.classList.add("editButton", "btn");
    editButton.innerHTML = "EDIT NAME";
    editButton.addEventListener("click", () => {
      editSaloonsName(autoSaloon.id);
    });

    //Edit amount of space
    const editAmountOfSpaceButton = document.createElement("button");
    editAmountOfSpaceButton.classList.add("editAmountOfSpaceButton", "btn");
    editAmountOfSpaceButton.innerHTML = "EDIT SPACE AMOUNT";
    editAmountOfSpaceButton.addEventListener("click", () => {
      editAmountOfSpace(autoSaloon.id);
    });

    const infoDivBox = document.createElement("div");
    infoDivBox.classList.add("infoDivBox");

    divBox.appendChild(nameHolder);
    buttonDivBox.appendChild(deleteButton);
    buttonDivBox.appendChild(editButton);
    buttonDivBox.appendChild(editAmountOfSpaceButton);
    buttonDivBox.appendChild(infoButton);

    divBox.appendChild(buttonDivBox);
    divBox.appendChild(infoDivBox);
    saloonsList.appendChild(divBox);

    if (autoSaloon.isInfoShown) {
      infoButton.innerHTML = "HIDE INFO";

      const totalPriceValue = autoSaloon.garage.reduce((acc, car) => {
        return acc + car.price;
      }, 0);

      infoDivBox.textContent = `Size: ${autoSaloon.amountOfSpace}, ${
        autoSaloon.amountOfSpace - autoSaloon.garage.length
      } space left, address: "${
        autoSaloon.address
      }", total price: ${totalPriceValue}`;

      const garageDivBox = document.createElement("div");
      garageDivBox.classList.add("garageDivBox");
      const carBoxUl = document.createElement("ul");
      const carBox = document.createElement("div");

      autoSaloon.garage.forEach((car) => {
        const carBoxLi = document.createElement("li");
        carBoxLi.innerHTML = `${car.mark} `;
        carBox.classList.add("carBox");

        const deleteCarBtn = document.createElement("button");
        deleteCarBtn.innerHTML = "SELL";
        deleteCarBtn.classList.add("carBtn");

        const showCarInfoBtn = document.createElement("button");
        showCarInfoBtn.innerHTML = "SHOW INFO";
        showCarInfoBtn.classList.add("carBtn");

        const changeCarSaloon = document.createElement("button");
        changeCarSaloon.innerHTML = "CHANGE SALOON";
        changeCarSaloon.classList.add("carBtn");

        carBoxLi.appendChild(deleteCarBtn);
        carBoxLi.appendChild(showCarInfoBtn);
        carBoxLi.appendChild(changeCarSaloon);

        carBox.appendChild(carBoxUl);
        carBoxUl.appendChild(carBoxLi);
        divBox.appendChild(carBox);
      });

      const createCarSpace = document.createElement("button");
      createCarSpace.classList.add("addCar", "btn");
      createCarSpace.textContent = "ADD CAR";
      createCarSpace.addEventListener("click", () => {
        addCarToSaloon(autoSaloon.id);
      });
      garageDivBox.appendChild(createCarSpace);
      divBox.appendChild(garageDivBox);
    } else {
      infoButton.innerHTML = "SHOW INFO";
    }
  });
  renderJSON();
}

function renderJSON() {
  const autoSaloonListJSON = JSON.stringify(autoSaloonList);
  localStorage.setItem("autoSaloon", autoSaloonListJSON);
}

function isValidAmountOfSpace(number) {
  if (Number.isNaN(number)) {
    alert("Auto saloon's space must contain a number");
    return false;
  } else if (number < 1) {
    alert("Auto saloon's space must be higher than 1");
    return false;
  } else if (number % 1 !== 0) {
    alert("The amount of space must be an integer");
    return false;
  }
  return true;
}

function isValidNumber(number) {
  if (Number.isNaN(number)) {
    alert("Price must contain a number");
    return false;
  } else if (number < 1) {
    alert("Price must be higher than 1");
    return false;
  } else if (number % 1 !== 0) {
    alert("Price must be an integer");
    return false;
  }
  return true;
}

function isValidString(str, errorMessage) {
  if (str === null || str.trim() === "") {
    if (errorMessage !== undefined) {
      alert(errorMessage);
    }
    return false;
  }
  return true;
}

function addCarToSaloon(idOfSaloon) {
  console.log(autoSaloonList);
  autoSaloonList.forEach((autoSaloon) => {
    if (autoSaloon.id === idOfSaloon) {
      if (autoSaloon.garage.length >= autoSaloon.amountOfSpace) {
        return alert("This garage is full");
      } else {
        const mark = prompt("Enter your car mark");
        if (
          !isValidString(mark, "Car's mark must contain at least 1 character")
        ) {
          return;
        }
        const carNumber = prompt("Enter your car number");
        if (
          !isValidString(
            carNumber,
            "Car number must contain at least 1 character"
          )
        ) {
          return;
        }
        const price = +prompt("Enter your car price");
        if (!isValidNumber(price)) {
          return;
        }

        const car = new Car(mark, carNumber, price);
        console.log(car);
        console.log(autoSaloon.addCar);
        AutoSaloon.addCar(car, idOfSaloon);
      }
    }
  });

  renderAutoSaloons();
}
