import { useState } from "react";
import AppService from "../services/service";

export default function LoginScreen() {
  const appService = new AppService();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  return (
    <div className="loginScreen">
      <form
        className="body"
        onSubmit={async (e: any) => {
          e.preventDefault();
          setLoading(true);
          await appService.login(e.target.password.value);
          setLoading(false);
        }}
      >
        <h2>Hi Admin, Welcome back!</h2>
        <span>Smart managment of your clients</span>
        <div className="input">
          <input
            id="password"
            placeholder="Enter the password"
            type={visible ? "string" : "password"}
          />
          <div onClick={() => setVisible(!visible)} />
        </div>
        <button disabled={loading}>Login</button>
        <br /> <br />
        <span style={{ fontSize: 12 }}>
          Powered by&nbsp;
          <a href="https://buildersmarket.ae">
            <u>Builders Market</u>
          </a>
        </span>
      </form>
    </div>
  );
}
