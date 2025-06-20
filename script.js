// Update the scaling factor based on window size
function updateScaling() {
  const root = document.documentElement;
  const baseWidth = 1920;
  const baseHeight = 1080;
  const scaleFactor = Math.min(window.innerWidth / baseWidth, window.innerHeight / baseHeight);
  root.style.setProperty('--scale-factor', scaleFactor);
}

// Edit the cube name
function editName(nameElement) {
  const newName = prompt("Enter a new name (max 15 characters):", nameElement.textContent);
  if (newName !== null) {
    nameElement.textContent = newName.trim().substring(0, 15);
  }
}

// Toggle the background selection menu
function performAction() {
  const menu = document.getElementById('backgroundMenu');
  menu.classList.toggle('active');
}

// Change the displayed number with validation and animation
function changeNumbers(event) {
  event.stopPropagation();
  const newNumber = prompt("Enter a number between -999 and 999:");
  if (newNumber !== null) {
    const parsedNumber = parseInt(newNumber);
    if (!isNaN(parsedNumber) && parsedNumber >= -999 && parsedNumber <= 999) {
      const topNumberEl = document.getElementById('topNumber');
      topNumberEl.textContent = parsedNumber;
      document.getElementById('bottomNumber1').textContent = parsedNumber;
      document.getElementById('bottomNumber2').textContent = parsedNumber;
      // Add animation class and remove it after animation ends
      topNumberEl.classList.add('animate');
      topNumberEl.addEventListener('animationend', () => {
        topNumberEl.classList.remove('animate');
      }, { once: true });
    } else {
      alert("Please enter a valid number between -999 and 999.");
    }
  }
}

// Initialize scaling on load and on window resize
window.addEventListener('resize', updateScaling);
updateScaling();

// Set up background menu button click animation and background change
document.querySelectorAll('.bg-button').forEach(button => {
  button.addEventListener('click', function() {
    button.classList.add('clicked');
    button.addEventListener('animationend', () => {
      button.classList.remove('clicked');
    }, { once: true });
    const newBgUrl = this.getAttribute('data-bg');
    const rectangle = document.querySelector('.rectangle');
    rectangle.style.transition = "background-image 0.5s ease-in-out";
    rectangle.style.backgroundImage = "url('" + newBgUrl + "')";
  });
});

// ---------- Cube Modal Functionality ----------
let activeCube = null;    // The cube being customized
let uploadedImage = null; // Holds uploaded image data
let selectedName = null;  // Holds the selected person object

// Array of available names (example roster)
const allNames = [
  { id: "empty", name: "Empty"},
  { id: "986617223240097862", name: "Fe4thers"},
  { id: "717411790795046999", name: "Unbik" },
  { id: "819122483340640286", name: "Gassie" },
  { id: "617761633237991425", name: "Beanix" },
  { id: "389095849634037771", name: "Xanyu" },
  { id: "494928762480099328", name: "Alien" },
  { id: "698475014667763712", name: "TheCat" },
  { id: "1156957155623186452", name: "Liam" },
  { id: "964879705427824720", name: "GeorgeGuy" },
  { id: "887464438196756531", name: "Toast" },
  { id: "428215531301240833", name: "MiniPika" },
  { id: "818501449985294347", name: "Sconny" },
  { id: "843060185626574868", name: "polyphones" },
  { id: "761885046977200148", name: "Bebb" },
  { id: "998636010424508526", name: "Nea" },
  { id: "1176285409261666305", name: "Crungie" },
  { id: "1024272333063602266", name: "Foxy" },
  { id: "1068284664332169328", name: "Natsu" },
  { id: "579291275807948812", name: "Turtle" },
  { id: "460806291741474827", name: "Maxy" },
  { id: "1014590334665240656", name: "Talci" },
  { id: "692414780878618697", name: "Pizza" },
  { id: "864157627180515349", name: "Pxngwin" },
  { id: "1274064424638091356", name: "Gilga" },
  { id: "834732485274501171", name: "Dr01d" },
  { id: "603295410227773452", name: "Whip" },
  { id: "755123494148374718", name: "Harold" },
  { id: "384365352068579330", name: "Jori" },
  { id: "908031494096822282", name: "Frog" },
  { id: "756893324350062682", name: "Kreesh" },
  { id: "589984879744122905", name: "Pleb" },
  { id: "1165685927834824806", name: "Deg" },
  { id: "586979412436582418", name: "Glitch" },
  { id: "788112660980957245", name: "Skullad" },
  { id: "1289067028191379499", name: "Picks" },
  { id: "867558322722308137", name: "Misted" },
  { id: "380456640526286859", name: "zMatz" },
  { id: "897453024392413244", name: "Mr.J" },
  { id: "670985652908589075", name: "Lav" },
  { id: "593121102322991113", name: "Sunsr" },
  { id: "482131172638326784", name: "Kebabuz" },
  { id: "1012838826458222644", name: "EGCGlow" },
  { id: "1326036615742619701", name: "iiWawa" },
  { id: "539143060035076116", name: "Teapo" },
  { id: "911757342188650586", name: "Xotic" },
  { id: "703474641880088587", name: "Buddy" },
  { id: "811924023340564521", name: "Bati" },
  { id: "1009763333467017237", name: "Hannah" },
  { id: "855161162055417896", name: "Thunder" },
  { id: "802469531708293121", name: "Carlos" },
  { id: "798954421069021205", name: "Skoma" },
  { id: "713348457234038796", name: "Grudge" },
  { id: "790292327431143424", name: "Lizard" },
  { id: "1050185682162815016", name: "GreenRC" },
  { id: "1122073781670785065", name: "Batley" },
  { id: "582430638062174209", name: "Taco" },
  { id: "1263367328536723538", name: "Protat" },
  { id: "995389226164166779", name: "Snowie" },
  { id: "1008443455363624971", name: "Theo" },
  { id: "546670147599859712", name: "Szabi" },
  { id: "353288215454547977", name: "Caleb" },
  { id: "945881174516064288", name: "Rn" },
  { id: "801706397221257257", name: "Turxe" },
  { id: "447395769201459220", name: "Caiiz" },
  { id: "883710962732003329", name: "Zoomer" },
  { id: "766662595452338186", name: "Krys" },
  { id: "822491253219786762", name: "Pokefan" },
  { id: "452551597105610753", name: "AlexBelgium" },
  { id: "925235021139296349", name: "Trilu" },
  { id: "564155229575184416", name: "Yeetus" },
  { id: "994439313876070412", name: "FireBeastMode " },
  { id: "796900695214522389", name: "Photon" },
  { id: "1203185360243400725", name: "qhris" },
  { id: "741395481342771271", name: "Splashy" },
  { id: "655865092084072468", name: "Axo" },
  { id: "1310995285924642897", name: "Kelly" },
  { id: "903216337042694154", name: "Phosphorus" },
  { id: "1172726883775955024", name: "Scaly" },
  { id: "959503891886641162", name: "Scoli" },
  { id: "738756615431520268", name: "Lewiso" },
  { id: "770623180003475486", name: "Brazenidli" },
  { id: "1325960112338243680", name: "Yoyoslime" },
  { id: "1216973640063782914", name: "SaveSoil" },
  { id: "437288905264332816", name: "EeveesXM" },
  { id: "559711865014321152", name: "Kizmo" },
  { id: "1258103486524952747", name: "Apoppink" },
  { id: "766016042031775784", name: "Izsokok" },
  { id: "1240929555175309383", name: "Personiff" },
  { id: "830194123981324338", name: "Sportsguy" },
  { id: "907752714212089938", name: "Aaron" },
  { id: "901604507174174731", name: "Pauxilian" },
  { id: "468714012562161677", name: "Seth" },
  { id: "717053122136113192", name: "Pinki" },
  { id: "779629046194503691", name: "GeneralSheep" },
  { id: "606112879082471444", name: "sydowen" },
  { id: "1283906112101289995", name: "Pinkulet" },
  { id: "795380178838093824", name: "Pengon" },
  { id: "782982670840758272", name: "AJ" },
  { id: "644439767035019274", name: "Birb" },
  { id: "617829809380392971", name: "Terror33" },
  { id: "605382652609953802", name: "Teapot" },
  { id: "898923229077454869", name: "UmerMc" },
  { id: "695717561643565136", name: "Rxyalz" },
  { id: "871290070596984833", name: "gihc" },
  { id: "699049334049603615", name: "Mateo" },
  { id: "771619089097555980", name: "justdylan" },
  { id: "788413374047191052", name: "Soty" }
   
];

// Open the modal for a cube and position it using the current scale factor
function openCubeModal(cube) {
  activeCube = cube;
  const modal = document.getElementById('cubeModal');
  modal.style.display = "block";

  document.getElementById('nameSearch').value = "";
  selectedName = null;

  const cubeRect = cube.getBoundingClientRect();
  const modalContent = modal.querySelector('.modal-content');
  const scaleFactor = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--scale-factor'));
  const modalWidth = 300 * scaleFactor;
  const modalHeight = 400 * scaleFactor; // Approximate height, adjust as needed

  let left = cubeRect.right + (10 * scaleFactor);
  let top = cubeRect.top;

  // Ensure the modal stays within the viewport
  if (left + modalWidth > window.innerWidth) {
    left = Math.max(0, cubeRect.left - (modalWidth + 10 * scaleFactor));
  }
  if (top + modalHeight > window.innerHeight) {
    top = Math.max(0, window.innerHeight - modalHeight);
  }

  modalContent.style.left = left + "px";
  modalContent.style.top = top + "px";

  populateNames();
}

// Close the cube modal and reset fields
function closeCubeModal() {
  const modal = document.getElementById('cubeModal');
  const modalContent = document.querySelector('.modal-content');

  // Trigger fade-out animation
  modalContent.style.animation = 'modalFadeOut 0.2s ease-out';

  // After the animation, hide the modal
  modalContent.addEventListener('animationend', () => {
    modal.style.display = "none";
    modalContent.style.animation = 'modalSlideIn 0.3s ease-out'; // Reset to fade-in for next open
    document.getElementById('imagePreview').style.display = 'none';
    document.getElementById('imagePreview').src = '#';
    document.getElementById('imageUpload').value = '';
    uploadedImage = null;
    selectedName = null;
  }, { once: true }); // Ensures the event listener only runs once
}

// Preview an uploaded image
function previewImage(input) {
  const preview = document.getElementById('imagePreview');
  const file = input.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      preview.src = e.target.result;
      preview.style.display = 'block';
      uploadedImage = e.target.result;
    }
    reader.readAsDataURL(file);
  }
}

// Populate the name list in the modal (sorted alphabetically)
function populateNames() {
  const nameList = document.getElementById('nameList');
  nameList.innerHTML = "";
  const sortedNames = allNames.slice().sort((a, b) => a.name.localeCompare(b.name));
  sortedNames.forEach(person => {
    const nameDiv = document.createElement('div');
    nameDiv.textContent = person.name;
    nameDiv.dataset.id = person.id;
    if (selectedName && selectedName.id === person.id) {
      nameDiv.classList.add("selected");
    }
    nameDiv.onclick = function () {
      selectName(person, this);
    };
    nameList.appendChild(nameDiv);
  });
}

// Filter names based on search input
function filterNames() {
  const searchInput = document.getElementById('nameSearch').value.toLowerCase();
  const nameList = document.getElementById('nameList');
  nameList.innerHTML = "";
  const filteredNames = allNames.filter(person => person.name.toLowerCase().includes(searchInput));
  const sortedNames = filteredNames.slice().sort((a, b) => a.name.localeCompare(b.name));
  sortedNames.forEach(person => {
    const nameDiv = document.createElement('div');
    nameDiv.textContent = person.name;
    nameDiv.dataset.id = person.id;
    if (selectedName && selectedName.id === person.id) {
      nameDiv.classList.add("selected");
    }
    nameDiv.onclick = function () {
      selectName(person, this);
    };
    nameList.appendChild(nameDiv);
  });
}

// Mark a name as selected
function selectName(person, element) {
  selectedName = person;
  document.getElementById('nameSearch').value = "";
  populateNames();
  console.log("Selected name:", person);
}

// Apply the changes to the active cube (using either an uploaded image or the selected name)
function applyCubeChanges() {
  if (!activeCube) return;
  if (uploadedImage) {
    activeCube.style.backgroundImage = "url('" + uploadedImage + "')";
    activeCube.style.backgroundColor = 'transparent';
    activeCube.style.backgroundSize = 'cover';
    activeCube.style.backgroundPosition = 'center';
  } else if (selectedName) {
    // Use the selected person's id to form the image filename (e.g., "3.png")
    activeCube.style.backgroundImage = `url('pfp/${selectedName.id}.png')`;
    activeCube.style.backgroundColor = 'transparent';
    activeCube.style.backgroundSize = 'cover';
    activeCube.style.backgroundPosition = 'center';
  }
  if (selectedName) {
    // Update the corresponding name element based on the cube's data-cube-id
    const cubeId = activeCube.getAttribute('data-cube-id');
    const nameElement = document.querySelector(`.names-container div:nth-child(${cubeId})`);
    if (nameElement) {
      nameElement.textContent = selectedName.name;
    }
  }
  closeCubeModal();
}

// Close the modal if clicking outside the modal-content
window.onclick = function (event) {
  const modal = document.getElementById('cubeModal');
  if (event.target === modal) {
    closeCubeModal();
  }
};

function updateModalPosition() {
  const modal = document.getElementById('cubeModal');
  if (modal.style.display === "block" && activeCube) {
    openCubeModal(activeCube);
  }
}

window.addEventListener('resize', updateModalPosition);

// Close background menu on outside click
document.addEventListener('click', function (event) {
  const menu = document.getElementById('backgroundMenu');
  if (menu.classList.contains('active') && !menu.contains(event.target) && event.target !== document.querySelector('.action-button')) {
    menu.classList.remove('active');
  }
});

// Function to download the rectangle content as PNG
function downloadRectangleAsPNG() {
    const rectangle = document.querySelector('.rectangle');

    // Get the scale factor
    const scaleFactor = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--scale-factor'));

    // Get the actual width and height of the rectangle, including scaled size
    const actualWidth = rectangle.offsetWidth;
    const actualHeight = rectangle.offsetHeight;

    // Options for html2canvas, including a higher DPI
    const options = {
        scale: window.devicePixelRatio, // Use device pixel ratio for better quality
        useCORS: true,              // Enable CORS if needed
        scrollX: 0,                 // Ensure all content is captured, especially if scrolled
        scrollY: 0,
        width: actualWidth,         // Set width to the actual width
        height: actualHeight         // Set height to the actual height
    };

    html2canvas(rectangle, options).then(canvas => {
        // Create a new canvas with scaled dimensions
        const scaledCanvas = document.createElement('canvas');
        scaledCanvas.width = actualWidth * scaleFactor * window.devicePixelRatio;
        scaledCanvas.height = actualHeight * scaleFactor * window.devicePixelRatio;

        const ctx = scaledCanvas.getContext('2d');

        // Scale the context, accounting for device pixel ratio
        ctx.scale(scaleFactor * window.devicePixelRatio, scaleFactor * window.devicePixelRatio);

        // Draw the original canvas onto the scaled canvas
        ctx.drawImage(canvas, 0, 0);

        // Convert to data URL and download
        const dataURL = scaledCanvas.toDataURL('image/png', 1.0); // High quality
        const downloadLink = document.createElement('a');
        downloadLink.href = dataURL;
        downloadLink.download = 'TeamCard.png';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    });
}

const downloadButton = document.querySelector('.btn-circle-download');

downloadButton.addEventListener('click', function() {
    const btn = this;
    btn.classList.add("load");

    // Delay the "done" class and trigger the download
    setTimeout(function() {
        btn.classList.add("done");
        downloadRectangleAsPNG(); // Call your download function here
    }, 1000);

    // Reset the button after a delay
    setTimeout(function() {
        btn.classList.remove("load", "done");
    }, 5000);
});

// Call updateScaling initially and whenever the window resizes
updateScaling();
window.addEventListener('resize', updateScaling);
