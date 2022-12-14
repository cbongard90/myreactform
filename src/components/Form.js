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
      country: "United Kingdom",
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
    this.dateOfBirthValidation(event.target.value)
  }

  dateOfBirthValidation = (dateOfBirth) => {
    if (dateOfBirth === '') {
      this.setState({ showDateOfBirthError: true, dateOfBirthErrorMessage: 'Date of birth is required' });
    } else if (this.calculateAge(dateOfBirth) < 16) {
      this.setState({ showDateOfBirthError: true, dateOfBirthErrorMessage: 'You must be over 16' });
    } else {
      this.setState({ showDateOfBirthError: false });
    }

    return this.state.showDateOfBirthError;
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
    this.firstNameValidation(event.target.value);
  }

  firstNameValidation = (firstName) => {
    this.setState({ showFirstNameError: (firstName === '') });
    return firstName === '';
  }

  handleLastNameBlur = (event) => {
    this.lastNameValidation(event.target.value);
  }

  lastNameValidation = (lastName) => {
    this.setState({ showLastNameError: (lastName === '') });
    return lastName === '';
  }

  handleEmailBlur = (event) => {
    this.emailValidation(event.target.value);
  }

  emailValidation = (emailInput) => {
    if (emailInput === '') {
      this.setState({ showEmailError: true, emailErrorMessage: 'Email is required' });
    } else if (!this.emailRegex.test(emailInput)) {
      this.setState({ showEmailError: true, emailErrorMessage: 'Email is invalid' });
    } else {
      this.setState({ showEmailError: false, emailErrorMessage: '' });
    }

    return this.state.showEmailError;
  }

  handlePhoneNumberBlur = (event) => {
    this.phoneNumberValidation(event.target.value);
  }

  phoneNumberValidation = (phoneNumber) => {
    if (phoneNumber === '') {
      this.setState({ showPhoneNumberError: true, phoneNumberErrorMessage: 'Phone number is required' });
    } else if (!this.phoneRegex.test(phoneNumber)) {
      this.setState({ showPhoneNumberError: true, phoneNumberErrorMessage: 'Phone number must be 11 digits' });
    } else {
      this.setState({ showPhoneNumberError: false, phoneNumberErrorMessage: '' });
    }

    return this.state.showPhoneNumberError;
  }

  validateForm = () => {
    let isValid = this.firstNameValidation(this.state.firstName);
    isValid = this.lastNameValidation(this.state.lastName);
    isValid = this.emailValidation(this.state.email);
    isValid = this.dateOfBirthValidation(this.state.dateOfBirth);
    isValid = this.phoneNumberValidation(this.state.phoneNumber);

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
        this.setState({ statusMessage: "An error has occured, please try later.", showStatusMessage: true });
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
        <h1 className="text-3xl font-bold mb-3">Survey Form</h1>
        <div className="form-row">
          <div className="half flex items-center">
            <label htmlFor="firstName">
              First Name
            </label>
            <div className="relative">
              <input
                name="firstName"
                type="text"
                className="border border-black/10 bg-slate-100 ml-2 rounded-lg px-2 py-1"
                value={this.state.firstName}
                onChange={this.handleInputChange}
                onBlur={this.handleFirstNameBlur}
                />

                {
                this.state.showFirstNameError && <p className="input-notification absolute text-xs left-2">Please input your first name</p>
                }
            </div>

          </div>
          <div className="half flex items-center">
            <label htmlFor="lastName">
              Last Name
            </label>
            <div className="relative">
              <input
                name="lastName"
                type="text"
                className="border border-black/10 bg-slate-100 ml-2 rounded-lg px-2 py-1"
                value={this.state.lastName}
                onChange={this.handleInputChange}
                onBlur={this.handleLastNameBlur}
                />
              {
                this.state.showLastNameError && <p className="input-notification absolute text-xs left-2">Please input your last name</p>
              }
            </div>
          </div>
        </div>
        <div className="form-row">
          <div className="half flex items-center">
            <label htmlFor="phoneNumber" className="min-w-max">
              Phone N<sup>o</sup>
            </label>
            <div className="relative">
              <input
                name="phoneNumber"
                type="text"
                className="border border-black/10 bg-slate-100 ml-2 rounded-lg px-2 py-1"
                value={this.state.phoneNumber}
                onChange={this.handleInputChange}
                onBlur={this.handlePhoneNumberBlur}
              />

              {
                this.state.showPhoneNumberError && <p className="input-notification absolute text-xs left-2">{this.state.phoneNumberErrorMessage}</p>
              }
            </div>
          </div>
          <div className="half flex items-center">
            <label>
              Email
            </label>
            <div className="relative">
              <input
                name="email"
                type="text"
                className="border border-black/10 bg-slate-100 ml-2 rounded-lg px-2 py-1"
                value={this.state.email}
                onChange={this.handleInputChange}
                onBlur={this.handleEmailBlur}
              />

            {
                this.state.showEmailError && <p className="input-notification absolute text-xs left-2">{this.state.emailErrorMessage}</p>
            }
            </div>
          </div>
        </div>
        <div className="form-row">
          <label>
            Do you wish to receive SMS notifications?
            <input
              name="smsConsent"
              type="checkbox"
              className="ml-2"
              checked={this.state.smsConsent}
              onChange={this.handleInputChange}
            />
          </label>
        </div>

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
          <label htmlFor="dateOfBirth">
            Date of Birth
          </label>
          <div className="relative">
            <input
              name="dateOfBirth"
              type="date"
              className="border border-black/10 bg-slate-100 ml-2 rounded-lg px-2 py-1"
              value={this.state.dateOfBirth}
              onChange={this.handleInputChange}
              onBlur={this.handleDateOfBirthBlur}
            />

            {
              this.state.showDateOfBirthError && <p className="input-notification absolute text-xs left-2">{this.state.dateOfBirthErrorMessage}</p>
            }
          </div>

        </div>

        <input id="submit" type="submit" value="Submit" />
        {
          this.state.statusMessage && <p>{this.state.statusMessage}</p>
        }
      </form>
    );
  }
}

export default Form;
