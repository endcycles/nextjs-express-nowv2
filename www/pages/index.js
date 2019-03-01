import url from "url";
import React from "react";
import Link from "next/link";
import Router from "next/router";
import axios from "axios";

import Layout from "../components/Layout.js";

const absoluteUrl = (req, setLocalhost) => {
  let protocol = "https";
  let host = req ? req.headers.host : window.location.hostname;
  if (host.indexOf("localhost") > -1) {
    if (setLocalhost) host = setLocalhost;
    protocol = "http";
  }

  return url.format({
    protocol,
    host,
    pathname: "/" // req.url
  });
};

export default class extends React.Component {
  constructor() {
    super();
    this.state = { showMessage: false };
  }

  _showMessage = bool => {
    this.setState({
      showMessage: bool
    });
  };

  static async getInitialProps(context) {
    /* NOTE - relative url in this function runs will not work and will get ECONNRESET error since it runs on server context */
    const baseUrl = absoluteUrl(context.req, "localhost:3000");
    const apiUrl =
      process.env.NODE_ENV === "production"
        ? `${baseUrl}api/me`
        : "http://localhost:9999/api/me";
    try {
      const { status, data } = await axios.get(apiUrl);
      return { user: data };
    } catch (err) {
      console.log(`Error fetching data from ${apiUrl} - ${err.message}`);
      return { user: null };
    }
  }

  render() {
    return (
      <Layout>
        <h1>NextJS + Express in Now v2</h1>
        {this.props.user && (
          <div>
            <h2>Data from API</h2>
            <p>FirstName: {this.props.user.firstname}</p>
            <p>LastName: {this.props.user.lastname}</p>
            <p>Data: {this.props.user.data}</p>
            <button onClick={this._showMessage.bind(null, true)}>show</button>
            <button onClick={this._showMessage.bind(null, false)}>hide</button>
            {this.state.showMessage && <div>hello world!</div>}
          </div>
        )}
      </Layout>
    );
  }
}
