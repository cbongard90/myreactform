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
    };

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event) {
    console.log(event.target.type);
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  // create an async function to handle the form submission
  handleSubmit = async (event) => {
    event.preventDefault();
    // destructure the state
    const { smsConsent, firstName, lastName, email, country, phoneNumber, dateOfBirth } = this.state;
    console.log(dateOfBirth);
    // create a new object to send to the server
    const data = {
      "user": {
        "first_name": firstName,
        "last_name": lastName,
        "email": email,
        "phone_number": phoneNumber,
        "sms_consent": smsConsent,
        "country": country
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
    // get the response from the server
    const body = await response.json();

    if (response.status !== 200) {
      console.log("error");
      console.log(body);
      throw Error(body.message)
    }
    // log the response to the console
    console.log(body);
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit} className="form">
        <h1>Survey Form</h1>
        <label>
          Do you wish to receive SMS notifications?:
          <input
            name="smsConsent"
            type="checkbox"
            checked={this.state.smsConsent}
            onChange={this.handleInputChange} />
        </label>
        <label>
          First Name:
          <input
            name="firstName"
            type="text"
            value={this.state.firstName}
            onChange={this.handleInputChange} />
        </label>
        <label>
          Last Name:
          <input
            name="lastName"
            type="text"
            value={this.state.lastName}
            onChange={this.handleInputChange} />
        </label>

        <label>
          Phone Number:
          <input
            name="lastName"
            type="text"
            value={this.state.lastName}
            onChange={this.handleInputChange} />
        </label>

        <label>
          Which country are you from?:
          <select name="country" value={this.state.country} onChange={this.handleInputChange}>
            <option value="United Kingdom">United Kingdom</option>
            <option value="France">France</option>
            <option value="Germany">Germany</option>
            <option value="Belgium">Coconut</option>
            <option value="Italy">Italy</option>
          </select>
        </label>

        <label>
          Email:
          <input
            name="email"
            type="email"
            value={this.state.email}
            onChange={this.handleInputChange} />
        </label>

        <label>
          Date of Birth:
          <input
            name="dateOfBirth"
            type="date"
            value={this.state.dateOfBirth}
            onChange={this.handleInputChange} />
        </label>

        <input id="submit" type="submit" value="Submit" />

      </form>
    );
  }
}

export default Form;
