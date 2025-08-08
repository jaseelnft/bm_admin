import AppService from "./service";

const appService = new AppService();
export default () => {
  const socket = new WebSocket("http://192.168.70.80:7011");

  socket.onopen = () => {};

  socket.onmessage = (event) => {
    switch (event.data) {
      case "PERSON":
        appService.loadPersons();
        appService.loadStatistics();
        break;
      case "COMPANY":
        appService.loadCompanies();
        appService.loadStatistics();
        break;
      case "CONTRACTOR":
        appService.loadContractor();
        appService.loadStatistics();
        break;
      case "PAYMENT":
        appService.loadPayments();
        appService.loadStatistics();
        break;
    }
  };

  socket.onclose = () => {};
};
