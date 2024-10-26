/ Firebase Configuration (same as before)

let appointments = [];

// Theme toggle functionality
document.getElementById("themeToggle").onclick = function() {
    document.body.classList.toggle("dark");
    this.textContent = document.body.classList.contains("dark") ? "Switch to Light Mode" : "Switch to Dark Mode";
};

// Function to load appointments for the teacher
function loadAppointments() {
    const user = firebase.auth().currentUser;
    if (user) {
        db.collection("appointments").where("teacherId", "==", user.uid)
            .get()
            .then(querySnapshot => {
                appointments = [];
                querySnapshot.forEach(doc => {
                    appointments.push({ id: doc.id, ...doc.data() });
                });
                displayAppointments();
            });
    }
}

// Function to display appointments
function displayAppointments() {
    const appointmentList = document.getElementById("appointmentList");
    appointmentList.innerHTML = "";

    appointments.forEach(appointment => {
        const li = document.createElement("li");
        li.textContent = `${appointment.name} - ${new Date(appointment.time).toLocaleString()} for: ${appointment.purpose}`;
        
        const status = document.createElement("span");
        status.textContent = appointment.approved ? "Approved" : "Pending";
        status.className = appointment.approved ? "approved" : "pending";
        
        const approveButton = document.createElement("button");
        approveButton.textContent = "Approve";
        approveButton.onclick = () => updateAppointment(appointment.id, true);

        const rejectButton = document.createElement("button");
        rejectButton.textContent = "Reject";
        rejectButton.onclick = () => updateAppointment(appointment.id, false);

        li.appendChild(status);
        li.appendChild(approveButton);
        li.appendChild(rejectButton);
        appointmentList.appendChild(li);
    });
}

// Function to update appointment status
function updateAppointment(id, isApproved) {
    db.collection("appointments").doc(id).update({
        approved: isApproved
    })
    .then(() => {
        alert(`Appointment ${isApproved ? 'approved' : 'rejected'}`);
        loadAppointments(); // Reload appointments
    })
    .catch(error => {
        console.error("Error updating appointment: ", error);
    });
}

// Modify handleAuth to load appointments if the user is a teacher
function handleAuth() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const authMessage = document.getElementById("authMessage");

    if (document.getElementById('modalTitle').textContent === 'Login') {
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then(userCredential => {
                const user = userCredential.user;
                authMessage.textContent = "Login successful!";
                closeModal();

                // Load appointments for the teacher
                loadAppointments();
                document.getElementById("manage-appointments").style.display = 'block';
            })
            .catch(error => {
                authMessage.textContent = "Error: " + error.message;
            });
    } else {
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(() => {
                authMessage.textContent = "Registration successful!";
                closeModal();
            })
            .catch(error => {
                authMessage.textContent = "Error: " + error.message;
            });
    }
}

// Other functions remain unchanged...
// Initialize Firebase (as before)

function handleLogin(event) {
  event.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const authMessage = document.getElementById("authMessage");

  firebase.auth().signInWithEmailAndPassword(email, password)
      .then(() => {
          window.location.href = "manage-appointments.html"; // Redirect on successful login
      })
      .catch(error => {
          authMessage.textContent = "Error: " + error.message;
      });
}

function handleRegister(event) {
  event.preventDefault();
  const email = document.getElementById("registerEmail").value;
  const password = document.getElementById("registerPassword").value;
  const registerMessage = document.getElementById("registerMessage");

  firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(() => {
          registerMessage.textContent = "Registration successful! You can now log in.";
      })
      .catch(error => {
          registerMessage.textContent = "Error: " + error.message;
      });
}

// Other functions (searchTeacher, bookAppointment, loadAppointments, etc.) remain the same
let currentTestimonial = 0;

function showTestimonial(index) {
    const testimonials = document.querySelectorAll('.testimonial-item');
    testimonials.forEach((testimonial, i) => {
        testimonial.classList.toggle('active', i === index);
    });
}

function changeTestimonial(direction) {
    const testimonials = document.querySelectorAll('.testimonial-item');
    currentTestimonial = (currentTestimonial + direction + testimonials.length) % testimonials.length;
    showTestimonial(currentTestimonial);
}

// Initialize the first testimonial
showTestimonial(currentTestimonial);
// Password visibility toggle
const togglePassword = document.getElementById('togglePassword');
const passwordInput = document.getElementById('password');

togglePassword.addEventListener('click', () => {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    togglePassword.textContent = type === 'password' ? '👁️' : '👁️‍🗨️'; // Change icon based on state
});

// Feedback on form submission
const loginForm = document.getElementById('loginForm');
const feedbackMessage = document.getElementById('feedbackMessage');

loginForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent default form submission

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Here you can add logic to validate the credentials
    // For now, we'll simulate a successful login
    if (email === "test@example.com" && password === "password") {
        feedbackMessage.textContent = "Login successful!";
        feedbackMessage.style.color = "green";
        // Redirect or perform other actions here
    } else {
        feedbackMessage.textContent = "Invalid email or password.";
        feedbackMessage.style.color = "red";
    }
});
// Password visibility toggle
const toggleNewPassword = document.getElementById('toggleNewPassword');
const newPasswordInput = document.getElementById('newPassword');
const passwordStrengthIndicator = document.getElementById('passwordStrength');

toggleNewPassword.addEventListener('click', () => {
    const type = newPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    newPasswordInput.setAttribute('type', type);
    toggleNewPassword.textContent = type === 'password' ? '👁️' : '👁️‍🗨️'; // Change icon based on state
});
// Search functionality
document.getElementById('searchButton').addEventListener('click', () => {
  const searchInput = document.getElementById('searchInput').value.toLowerCase();
  const sortOption = document.getElementById('sortOptions').value;

  const teachers = Array.from(document.querySelectorAll('.teacher-card'));
  
  // Filter teachers
  teachers.forEach(teacher => {
      const name = teacher.querySelector('h3').textContent.toLowerCase();
      const subject = teacher.querySelector('p').textContent.toLowerCase();
      if (name.includes(searchInput) || subject.includes(searchInput)) {
          teacher.style.display = 'block';
      } else {
          teacher.style.display = 'none';
      }
  });

  // (Optional) Sort logic can be added here based on the selected sort option
});

// Booking appointment functionality
document.querySelectorAll('.book-appointment').forEach(button => {
  button.addEventListener('click', (event) => {
      const teacherName = event.target.parentElement.querySelector('h3').textContent;
      document.getElementById('feedbackMessage').textContent = `Appointment request sent to ${teacherName}!`;
  });
});
// Search functionality
document.getElementById('searchButton').addEventListener('click', () => {
  const searchInput = document.getElementById('searchInput').value.toLowerCase();
  const sortOption = document.getElementById('sortOptions').value;

  const teachers = Array.from(document.querySelectorAll('.teacher-card'));
  
  // Filter teachers
  teachers.forEach(teacher => {
      const name = teacher.querySelector('h3').textContent.toLowerCase();
      const subject = teacher.querySelector('p').textContent.toLowerCase();
      if (name.includes(searchInput) || subject.includes(searchInput)) {
          teacher.style.display = 'block';
      } else {
          teacher.style.display = 'none';
      }
  });

  // (Optional) Sort logic can be added here based on the selected sort option
});

// Booking appointment functionality
document.querySelectorAll('.book-appointment').forEach(button => {
  button.addEventListener('click', (event) => {
      const teacherName = event.target.parentElement.querySelector('h3').textContent;
      document.getElementById('feedbackMessage').textContent = `Appointment request sent to ${teacherName}!`;
  });
});
document.querySelectorAll('.book-appointment').forEach(button => {
  button.addEventListener('click', function() {
      const teacherName = this.closest('.teacher-card').querySelector('h3').innerText;
      document.getElementById('teacherName').innerText = teacherName;
      document.getElementById('appointmentModal').style.display = 'block';
  });
});

document.querySelector('.close-button').addEventListener('click', function() {
  document.getElementById('appointmentModal').style.display = 'none';
});

document.getElementById('appointmentForm').addEventListener('submit', function(event) {
  event.preventDefault();
  
  const date = document.getElementById('date').value;
  const time = document.getElementById('time').value;
  const message = document.getElementById('message').value;

  // Display feedback message
  document.getElementById('feedbackMessage').innerText = `Appointment requested with ${document.getElementById('teacherName').innerText} on ${date} at ${time}.`;
  
  // Close the modal
  document.getElementById('appointmentModal').style.display = 'none';
  this.reset(); // Reset the form
});
document.querySelectorAll('.book-appointment').forEach(button => {
  button.addEventListener('click', function() {
      const teacherName = this.closest('.teacher-card').querySelector('h3').innerText;
      // Redirect to the new booking page with teacher's name in the URL
      window.location.href = `request-booking.html?teacher=${encodeURIComponent(teacherName)}`;
  });
});
let currentTestimonialIndex = 0;
const testimonials = document.querySelectorAll('.testimonial-item');
testimonials[currentTestimonialIndex].classList.add('active');

function changeTestimonial(direction) {
    testimonials[currentTestimonialIndex].classList.remove('active');
    currentTestimonialIndex = (currentTestimonialIndex + direction + testimonials.length) % testimonials.length;
    testimonials[currentTestimonialIndex].classList.add('active');
}
