// ******************************
// Filename: index.html
// Description: html that displays the main signup page
// Author: Luis Souza
// Contact: https://appdevcanada.github.io
// Description: Raisely Sign Up App
// Date: Oct 08, 2020
// *********************************

'use strict';

let app = {
  invalidEmail: false,

  init: function () {
    document.addEventListener('DOMContentLoaded', () => {
      document.getElementById('useremail').addEventListener('blur', app.checkEmail);
      document.getElementById('btnSignUp').addEventListener('click', app.trySignUp);
      document.getElementById('toggle-password').addEventListener('click', app.togglePassword);
    });
  },

  checkEmail: async function (ev) {
    app.invalidEmail = false;
    let userEmail = document.getElementById('useremail').value.trim();
    if (userEmail !== '') {
      let emailURL = "https://api.raisely.com/v3/check-user";
      let validBody = {
        campaignUuid: "46aa3270-d2ee-11ea-a9f0-e9a68ccff42a",
        data: {
          email: userEmail,
        }
      };
      fetch(emailURL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json;charset=utf-8' },
        body: JSON.stringify(validBody),
      })
        .then(response => response.json())
        .then((res) => {
          if (res.data.status === "EXISTS") {
            ev.target.parentNode.classList.add('err');
            document.getElementById('errmsg').textContent = "Invalid Email! Please choose another one..."
            ev.target.setAttribute("style", "border-color: red !important");
            app.invalidEmail = true;
            return false;
          } else {
            ev.target.parentNode.classList.remove('err');
            document.getElementById('errmsg').textContent = null;
            ev.target.setAttribute("style", "border-color: rgb(222, 226, 230) !important");
            return null;
          }
        })
        .catch(error => {
          console.log(error);
        })
    } else {
      ev.target.parentNode.classList.remove('err');
      document.getElementById('errmsg').textContent = null;
      ev.target.setAttribute("style", "border-color: rgb(222, 226, 230) !important");
    }
  },

  togglePassword: function (ev) {
    const toggleField = ev.target.dataset.toggle;
    const passwordInput = document.getElementById(toggleField);
    const togglePasswordButton = document.getElementById(ev.target.id);
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      togglePasswordButton.className = "far fa-eye-slash"
      togglePasswordButton.setAttribute('aria-label',
        'Hide password.');
    } else {
      passwordInput.type = 'password';
      togglePasswordButton.className = "far fa-eye"
      togglePasswordButton.setAttribute('aria-label',
        'Show password as plain text. ' +
        'Warning: this will display your password on the screen.');
    }
  },

  trySignUp: async function () {
    const form = document.getElementById('signupform');
    form.reportValidity();
    if (form.checkValidity()) {
      if (!app.invalidEmail) {
        let userFName = document.getElementById('userfname').value.trim();
        let userLName = document.getElementById('userlname').value.trim();
        let userEmail = document.getElementById('useremail').value.trim();
        let userPwd = document.getElementById('userpassword').value;
        let signupURL = "https://api.raisely.com/v3/signup";
        let validBody = {
          campaignUuid: "46aa3270-d2ee-11ea-a9f0-e9a68ccff42a",
          data: {
            firstName: userFName,
            lastName: userLName,
            email: userEmail,
            password: userPwd
          }
        };
        fetch(signupURL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json;charset=utf-8' },
          body: JSON.stringify(validBody),
        })
          .then(response => response.json())
          .then((res) => {
            if (res.status !== undefined) {
              if (res.status !== 200) {
                alert("Error Code: " + res.errors[0].status + " - " + res.errors[0].title + "\n" + res.errors[0].message);
                return false;
              }
            } else {
              alert(res.data.preferredName + ", Sign Up successfully done!\n" + res.message);
              const form = document.getElementById('signupform');
              form.reset();
              document.getElementById('userfname').focus();
              return true;
              // Do more some stuff ...
            }
          })
          .catch(error => {
            console.log(error);
          })
      } else {
        document.getElementById('useremail').focus();
      }
    }
  }
};

app.init();