import React from "react";

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isGoing: false,
      numberOfGuests: 2
    };

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event) {
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
    const { isGoing, numberOfGuests } = this.state;
    // create a new object to send to the server
    const data = {
      "user": {
        "first_name": "test2",
        "last_name": "testy",
        "email": "testy1234@test.com",
        "phone_number": "+13239169023"
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
    // log the response to the console
    console.log(body);
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Is going:
          <input
            name="isGoing"
            type="checkbox"
            checked={this.state.isGoing}
            onChange={this.handleInputChange} />
        </label>
        <br />
        <label>
          Number of guests:
          <input
            name="numberOfGuests"
            type="number"
            value={this.state.numberOfGuests}
            onChange={this.handleInputChange} />
        </label>

        <input type="submit" value="Submit" />

      </form>
    );
  }
}

export default Form;
