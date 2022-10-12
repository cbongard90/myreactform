import React from "react";

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      smsConsent: false,
      phoneNumber: '',
      firstName: "",
      lastName: "",
      email: "",
      country: "",
      dateOfBirth: "",
      statusMessage: "",
      showStatusMessage: false,
      showFirstNameError: false,
      showLastNameError: false,
      showEmailError: false,
      emailErrorMessage: "",
      showDateOfBirthError: false,
      dateOfBirthErrorMessage: "",
      showPhoneNumberError: false,
      phoneNumberErrorMessage: ""
    };

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  emailRegex = new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
  phoneRegex = new RegExp(/^\+?(\d{2}-?\d{3}-?\d{3}-?\d{3}|(\d{3} \d{8}))$/);

  handleDateOfBirthBlur = (event) => {
    if (event.target.value === '') {
      this.setState({ showDateOfBirthError: true, dateOfBirthErrorMessage: 'Date of birth is required' });
    } else if (this.calculateAge(event.target.value) < 16) {
      this.setState({ showDateOfBirthError: true, dateOfBirthErrorMessage: 'You must be over 16' });
    } else {
      this.setState({ showDateOfBirthError: false });
    }
  }

  calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }



  handleInputChange(event) {
    console.log(event.target.type);
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    if (target.type === 'date') {
      if (event.target.value === '') {
        this.setState({ showDateOfBirthError: true, dateOfBirthErrorMessage: 'Date of birth is required' });
      } else if (this.calculateAge(event.target.value) < 16) {
        this.setState({ showDateOfBirthError: true, dateOfBirthErrorMessage: 'You must be over 16' });
      } else {
        this.setState({ showDateOfBirthError: false });
      }
    }

    this.setState({
      [name]: value
    });
  }

  handleFirstNameBlur = (event) => {
    if (event.target.value === '') {
      this.setState({ showFirstNameError: true });
    } else {
      this.setState({ showFirstNameError: false });
    }
  }

  handleLastNameBlur = (event) => {
    if (event.target.value === '') {
      this.setState({ showLastNameError: true });
    } else {
      this.setState({ showLastNameError: false });
    }
  }

  handleEmailBlur = (event) => {
    if (event.target.value === '') {
      this.setState({ showEmailError: true, emailErrorMessage: 'Email is required' });
    } else if (!this.emailRegex.test(event.target.value)) {
      this.setState({ showEmailError: true, emailErrorMessage: 'Email is invalid' });
    } else {
      this.setState({ showEmailError: false, emailErrorMessage: '' });
    }
  }

  handlePhoneNumberBlur = (event) => {
    if (event.target.value === '') {
      this.setState({ showPhoneNumberError: true, phoneNumberErrorMessage: 'Phone number is required' });
    } else if (!this.phoneRegex.test(event.target.value)) {
      this.setState({ showPhoneNumberError: true, phoneNumberErrorMessage: 'Phone number must be 11 digits' });
    } else {
      this.setState({ showPhoneNumberError: false, phoneNumberErrorMessage: '' });
    }
  }

  validateForm = () => {
    let isValid = true;
    if (this.state.firstName === '') {
      this.setState({ showFirstNameError: true });
      isValid = false;
    }
    if (this.state.lastName === '') {
      this.setState({ showLastNameError: true });
      isValid = false;
    }

    if (this.state.email === '') {
      this.setState({ showEmailError: true, emailErrorMessage: 'Email is required' });
      isValid = false;
    } else if (!this.emailRegex.test(this.state.email)) {
      this.setState({ showEmailError: true, emailErrorMessage: 'Email is invalid' });
      isValid = false;
    }

    if (this.state.dateOfBirth === '') {
      this.setState({ showDateOfBirthError: true, dateOfBirthErrorMessage: 'Date of birth is required' });
      isValid = false;
    } else if (this.calculateAge(this.state.dateOfBirth) < 16) {
      this.setState({ showDateOfBirthError: true, dateOfBirthErrorMessage: 'You must be over 16' });
      isValid = false;
    }

    if (this.state.phoneNumber === '') {
      this.setState({ showPhoneNumberError: true, phoneNumberErrorMessage: 'Phone number is required' });
      isValid = false;
    } else if (!this.phoneRegex.test(this.state.phoneNumber)) {
      this.setState({ showPhoneNumberError: true, phoneNumberErrorMessage: 'Phone number must be 11 digits' });
      isValid = false;
    }
    return isValid;
  }

  // create an async function to handle the form submission
  handleSubmit = async (event) => {
    event.preventDefault();
    this.setState({ statusMessage: "", showStatusMessage: false });
    // destructure the state
    const { smsConsent, firstName, lastName, email, country, phoneNumber, dateOfBirth } = this.state;

    // check if the form is valid
    if (this.validateForm()) {
      // create a new object to send to the server
      const data = {
        "user": {
          "first_name": firstName,
          "last_name": lastName,
          "email": email,
          "phone_number": phoneNumber,
          "sms_consent": smsConsent,
          "country": country,
          "date_of_birth": dateOfBirth
        }
      };
      // send the data to the server
      const response = await fetch('http://localhost:3000/api/v1/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      // get the response from the server and handle in case of error
      const body = await response.json();
      // prevent an error if the API is not running


      if (response.status !== 200) {
        console.log("error");
        console.log(body);
        throw Error(body.message)
      }
      // log the response to the console
      if (body.message) {
        this.setState({ statusMessage: body.message, showStatusMessage: true });
      } else if (body.detail) {
        this.setState({ statusMessage: body.detail, showStatusMessage: true });
      } else {
        this.setState({ statusMessage: "Your details have been submitted, thank you for your time", showStatusMessage: true });
      }
    } else {
      this.setState({ statusMessage: "Please check your details", showStatusMessage: true });
    }


  }

  render() {
    return (
      <form onSubmit={this.handleSubmit} className="form">
        <h1>Survey Form</h1>
        <div className="form-row">
          <label htmlFor="firstName">
            First Name:
          </label>
          <input
            name="firstName"
            type="text"
            value={this.state.firstName}
            onChange={this.handleInputChange}
            onBlur={this.handleFirstNameBlur}
            />
            {
            this.state.showFirstNameError && <p>Name can't be blank</p>
            }

        </div>
        <div className="form-row">
          <label>
            Last Name:
            <input
              name="lastName"
              type="text"
              value={this.state.lastName}
              onChange={this.handleInputChange}
              onBlur={this.handleLastNameBlur}
              />
          </label>
          {
            this.state.showLastNameError && <p>Name can't be blank</p>
          }
        </div>
        <div className="form-row">
          <label>
            Phone Number:
            <input
              name="phoneNumber"
              type="text"
              value={this.state.phoneNumber}
              onChange={this.handleInputChange}
              onBlur={this.handlePhoneNumberBlur}
            />
          </label>
          {
            this.state.showPhoneNumberError && <p>{this.state.phoneNumberErrorMessage}</p>
          }
        </div>

        <label>
          Do you wish to receive SMS notifications?:
          <input
            name="smsConsent"
            type="checkbox"
            checked={this.state.smsConsent}
            onChange={this.handleInputChange}
          />
        </label>

        <label hidden>
          Which country are you from?:
          <select name="country" value={"United Kingdom"} readOnly>
            <option value="" hidden></option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="France">France</option>
            <option value="Germany">Germany</option>
            <option value="Belgium">Belgium</option>
            <option value="Italy">Italy</option>
          </select>
        </label>

        <div className="form-row">
          <label>
            Email:
            <input
              name="email"
              type="email"
              value={this.state.email}
              onChange={this.handleInputChange}
              onBlur={this.handleEmailBlur}
              />
          </label>
          {
            this.state.showEmailError && <p>{this.state.emailErrorMessage}</p>
          }
        </div>

        <label>
          Date of Birth:
          <input
            name="dateOfBirth"
            type="date"
            value={this.state.dateOfBirth}
            onChange={this.handleInputChange}
            onBlur={this.handleDateOfBirthBlur}
          />
          {
            this.state.showDateOfBirthError && <p>{this.state.dateOfBirthErrorMessage}</p>
          }
        </label>

        <input id="submit" type="submit" value="Submit" />
        {
          this.state.statusMessage && <p>{this.state.statusMessage}</p>
        }
      </form>
    );
  }
}

export default Form;
