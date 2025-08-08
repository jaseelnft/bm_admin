import { Component } from "react";

export default class Toast extends Component {
  static showToast = (value: string) => {
    let toast = document.getElementById("myToastBody");
    const newEl = document.createElement("div");
    newEl.className = "myToast";
    newEl.textContent = value;
    toast!.appendChild(newEl);
    setTimeout(() => toast!.removeChild(toast!.firstElementChild!), 4000);
  };

  render() {
    return (
      <>
        <style>{`
        .myToast {
            margin: 12px 20px;
            width: 300px;
            background-color: #000;
            border: 1px solid #d2b48c;
            color: #d2b48c;
            padding: 15px 30px;
            border-radius: 5px;
            box-shadow: 0 4px 8px #d2b48c5c;
            font-size: 1em;
            z-index: 3;
            animation: slideIn 0.5s forwards, fadeOut 0.5s 3.5s forwards;
        }
        @keyframes fadeOut {
            0% {
              opacity: 1;
              margin-top: 0;
              }
              100% {
                opacity: 0;
                margin-top: -50px;
            }
          }
        `}</style>
        <div
          id="myToastBody"
          style={{ position: "fixed", top: 10, right: -1 }}
        />
      </>
    );
  }
}
