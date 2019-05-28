import React from "react";
import {connect} from "react-redux";
import {logout} from "../actions/SecurityActions";

class LoggedIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  startActivity(): void {
    console.log('finna bust a nut');
  }

  logout(): void {
    const {dispatch: dispetch} = this.props;
    dispetch(logout());
  }

  render() {
    const {fullName} = this.props;
    return (
      <div>
        <h3>What's up {fullName}?</h3>
        <button onClick={this.startActivity}>Start Activity</button>
        There's a ninja with huge boobs over there.
        <button onClick={() => this.logout()}>Logout</button>
      </div>
    );
  }
}

LoggedIn.propTypes = {};

const mapStateToProps = state => {
  const {user: {information: {fullName}}} = state;
  return {
    fullName,
  }
};

export default connect(mapStateToProps)(LoggedIn);
