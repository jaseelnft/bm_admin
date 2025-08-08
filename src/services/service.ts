import axios from "./httpConfig";
import {
  setCompanies,
  setContractors,
  setPayments,
  setPersons,
  setStatistics,
} from "../static/store";

export default class AppService {
  async loadStatistics() {
    try {
      await axios.get(`admin/api/statistics`).then((res: any) => {
        setStatistics(res);
      });
    } catch (error) {}
  }

  async login(password: string) {
    try {
      await axios.post(`admin/login`, { password }).then((res: any) => {
        window.localStorage.setItem("token", res.token);
        window.history.replaceState(null, "", "overview");
        window.location.reload();
      });
    } catch (error) {}
  }

  async loadPersons(page?: string) {
    const params = new URLSearchParams({
      page: page ?? "1",
      limit: String(10),
      search: "",
    });
    axios.get(`admin/api/person?${params}`).then((res) => setPersons(res));
  }

  async loadCompanies(page?: string) {
    const params = new URLSearchParams({
      page: page ?? "1",
      limit: String(10),
      search: "",
    });
    axios.get(`admin/api/company?${params}`).then((res) => setCompanies(res));
  }

  async loadContractor(page?: string) {
    const params = new URLSearchParams({
      page: page ?? "1",
      limit: String(10),
      search: "",
    });
    axios
      .get(`admin/api/contractor?${params}`)
      .then((res) => setContractors(res));
  }

  async loadPayments(page?: string) {
    const params = new URLSearchParams({
      page: page ?? "1",
      limit: String(10),
      search: "",
    });
    axios.get(`admin/api/payment?${params}`).then((res) => setPayments(res));
  }

  // -----------------------------------------------------------------------------------------------------

  async updatePersonStatus(id: string, status: string) {
    return axios.put(`admin/api/person/status/${id}`, { status });
  }

  async updateCompanyStatus(id: string, status: string) {
    return axios.put(`admin/api/company/status/${id}`, { status });
  }
}
