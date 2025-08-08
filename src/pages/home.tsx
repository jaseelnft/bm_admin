import { useSelector } from "react-redux";
import {
  contracrorPlan,
  expireIn,
  formatDate,
  makePagingNumberSet,
  pagingCounter,
  paymentStatus,
  projectStatus,
} from "../static/simple";
import React, { useEffect, useState } from "react";
import {
  setCompanies,
  setContractors,
  setDashbordIndex,
  setPayments,
  setPersons,
} from "../static/store";
import AppService from "../services/service";
import wsConfig from "../services/wsConfig";
import AppPopup from "../components/popup";

interface NavElement {
  slug: string;
  title: string;
  bottom?: boolean;
  onClick?: () => void;
}
function NavElement({ slug, title, bottom, onClick }: NavElement) {
  const value = useSelector((state: any) => state.app.dashboardIndex);
  return (
    <div
      className={
        slug + (slug === value ? " selected" : "") + (bottom ? " bottom" : "")
      }
      onClick={() => {
        if (onClick) onClick();
        else setDashbordIndex(slug);
      }}
    >
      {title}
    </div>
  );
}

function G1({
  icon,
  title,
  value,
  subTitle,
  subValue,
  subColor,
}: {
  icon?: string;
  title?: string;
  value: any;
  subTitle?: string;
  subValue?: string;
  subColor?: string;
}) {
  return (
    <div className="g1">
      <div className={"g1Title " + icon}>{title}</div>
      <div className="g1Content">
        <div className="g1Value">{value}</div>
        <div className="g1Period">
          <span style={{ color: subColor }}>{subValue ?? "+0%"}</span>
          {subTitle ?? "last 7 days"}
        </div>
      </div>
    </div>
  );
}

function TFoot({ data, onClick }: any) {
  return (
    <div className="tfoot">
      <div className="a">{pagingCounter(data)}</div>
      {data.total > data.limit && (
        <div className="b">
          {makePagingNumberSet(data).map((it: any, k: number) =>
            it === 0 ? (
              "..."
            ) : (
              <div
                key={k}
                onClick={() => onClick(it)}
                className={data.page === it ? "selected" : ""}
              >
                {it}
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}

function TView({ on, children }: { on: boolean; children?: React.ReactNode }) {
  return (
    <div className="tview" style={{ maxHeight: on ? 540 : 0 }}>
      {children}
      <br />
    </div>
  );
}

function Overview({
  path,
  statistics,
  persons,
  companies,
  contractors,
  payments,
}: any) {
  if (path !== "overview") return null;

  const _makeSubValue = (v: any) => {
    v = Math.floor(v * 10) / 10;
    return {
      subValue: v !== undefined ? `${v > 0 ? "+" : ""}${v}%` : "0%",
      subColor: v < 0 ? "red" : "",
    };
  };

  return (
    <div style={{ width: "100%", display: "flex", gap: 18 }}>
      <G1
        title="Total contractor"
        value={contractors.total ?? 0}
        {..._makeSubValue(statistics.newContractor)}
      />
      <G1
        title="Total persons"
        value={persons.total ?? 0}
        {..._makeSubValue(statistics.newperson)}
      />
      <G1
        title="Total company"
        value={companies.total ?? 0}
        {..._makeSubValue(statistics.newcompany)}
      />
      <G1
        icon="payment"
        title="Total payments"
        value={payments.total ?? 0}
        subTitle="$ total"
        subValue={statistics.totalAmount ?? 0}
      />
    </div>
  );
}

function ClintStatus({ type, it }: any) {
  const [on, seton] = useState(false);
  const _onSubmit = (e: any) => {
    e.preventDefault();
    const status = e.target[0].value;
    const appService = new AppService();
    if (type === "person")
      appService.updatePersonStatus(it._id, status).then(() => seton(false));
    else
      appService.updateCompanyStatus(it._id, status).then(() => seton(false));
  };
  return (
    <>
      <div onClick={() => seton(true)} className="edit" />
      <AppPopup on={on} onClose={() => seton(false)}>
        <form onSubmit={_onSubmit}>
          <h3>Change status</h3>
          <select id="status" defaultValue={it?.status}>
            <option value="INITIATED">Initiated</option>
            <option value="PENDING">Pending</option>
            <option value="PROCESSING">Processing</option>
            <option value="DEVELOPING">Developing</option>
            <option value="COMPLATED">Complated</option>
            <option value="CANCELLED">Cancel</option>
          </select>
          <br /> <br />
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button>Confirm</button>
          </div>
        </form>
      </AppPopup>
    </>
  );
}

function Persons({ path, data }: any) {
  const [selected, setSelected] = useState("");
  if (path !== "person") return null;
  return (
    <div className="table">
      <h3>Contactors</h3>
      <div className="thead">
        <div className="th">Name/Family Name</div>
        <div className="th">Phone/Email</div>
        <div className="th">Location</div>
        <div className="th">Address</div>
        <div className="th tcenter s">Status</div>
        <div className="th tcenter s">Edit</div>
      </div>
      <div style={{ height: "calc(100vh - 340px)", overflow: "auto" }}>
        {data.data.map((it: any) => (
          <div key={it._id}>
            <div className="tr">
              <div className="td">
                {it?.name}
                <br />
                <span>{it.familyName}</span>
              </div>
              <div className="td">
                {it.regPhone}
                <br />
                <span>{it.regEmail}</span>
              </div>
              <div className="td">{it.location}</div>
              <div className="td">{it.address}</div>
              <div className="td tcenter s">{projectStatus(it.status)}</div>
              <div className="td tcenter s">
                <div
                  className="view"
                  onClick={() => setSelected(selected === it._id ? "" : it._id)}
                />
                <ClintStatus it={it} type="person" />
              </div>
            </div>
            <TView on={selected === it._id}>
              <span>Details</span>
              <div style={{ display: "flex", gap: 18 }}>
                <div style={{ width: "20%" }}>
                  {it.phone}
                  <br />
                  {it.email}
                </div>
                <div style={{ width: "20%" }}>
                  <span>Slot</span> <br />
                  {it.visitDate} {it.visitTimeSlot}
                </div>
                <div>
                  <span>Project Summary</span> <br />
                  {it.projectSummary}
                </div>
              </div>
            </TView>
          </div>
        ))}
      </div>
      <TFoot
        data={data}
        onClick={(page: any) => {
          const appService = new AppService();
          setPersons({ ...data, page });
          appService.loadPersons(page);
        }}
      />
    </div>
  );
}
function Companies({ path, data }: any) {
  const [selected, setSelected] = useState("");
  if (path !== "company") return null;
  return (
    <div className="table">
      <h3>Contactors</h3>
      <div className="thead">
        <div className="th">Company Name</div>
        <div className="th">Phone/Email</div>
        <div className="th">In Charge</div>
        <div className="th tcenter s">Status</div>
        <div className="th tcenter s">Edit</div>
      </div>
      <div style={{ height: "calc(100vh - 340px)", overflow: "auto" }}>
        {data.data.map((it: any) => (
          <div key={it._id}>
            <div className="tr">
              <div className="td">
                {it?.name}
                <br />
                <span>Licence No: {it.licenseNumber}</span>
              </div>
              <div className="td">
                {it.regPhone}
                <br />
                <span>{it.regEmail}</span>
              </div>
              <div className="td">
                {it?.inCharge}
                <br />
                <span>Licence No: {it.phone}</span>
              </div>
              <div className="td tcenter s">{projectStatus(it.status)}</div>
              <div className="td tcenter s">
                <div
                  className="view"
                  onClick={() => setSelected(selected === it._id ? "" : it._id)}
                />
                <ClintStatus it={it} type="company" />
              </div>
            </div>
            <TView on={selected === it._id}>
              <div style={{ display: "flex", gap: 18 }}>
                <div style={{ width: "50%" }}>
                  <span style={{ fontSize: 13 }}>Address Details</span> <br />
                  <div>{it.projectLocation}</div>
                  <div>{it.locationLink}</div>
                  <div>{it.landMark}</div>
                  <div>
                    {it.addressPhone} / {it.addressEmail}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: 13 }}>VAT</span> <br />
                  {it.vat}
                </div>
              </div>
            </TView>
          </div>
        ))}
      </div>
      <TFoot
        data={data}
        onClick={(page: any) => {
          const appService = new AppService();
          setCompanies({ ...data, page });
          appService.loadCompanies(page);
        }}
      />
    </div>
  );
}

function Contactor({ path, data }: any) {
  const [selected, setSelected] = useState("");
  if (path !== "contractor") return null;
  return (
    <div className="table">
      <h3>Contactors</h3>
      <div className="thead">
        <div className="th">Name</div>
        <div className="th">Phone/Email</div>
        <div className="th">In Charge</div>
        <div className="th tcenter s">Plan</div>
        <div className="th tcenter m">Plan Validity</div>
        <div className="th tcenter s">Edit</div>
      </div>
      <div style={{ height: "calc(100vh - 340px)", overflow: "auto" }}>
        {data.data.map((it: any) => (
          <div key={it._id}>
            <div className="tr">
              <div className="td">{it?.name}</div>
              <div className="td">
                {it.regPhone}
                <br />
                <span>{it.regEmail}</span>
              </div>
              <div className="td">{it.inCharge}</div>
              <div className="td tcenter s">{contracrorPlan(it.plan)}</div>
              <div className="td tcenter m">{expireIn(it.planExpireIn)}</div>
              <div className="td tcenter s">
                <div
                  className="view"
                  onClick={() => setSelected(selected === it._id ? "" : it._id)}
                />
              </div>
            </div>
            <TView on={selected === it._id}>
              <div style={{ display: "flex", gap: 18 }}>
                <div style={{ width: "18%" }}>
                  <span style={{ fontSize: 13 }}>Phone</span> <br />
                  {it.phone}
                </div>
                <div style={{ width: "18%" }}>
                  <span style={{ fontSize: 13 }}>Trade Licence</span> <br />
                  {it.tradeLicence}
                </div>
                <div style={{ width: "18%" }}>
                  <span style={{ fontSize: 13 }}>In Charge</span> <br />
                  {it.inCharge}
                </div>
                <div style={{ width: "18%" }}>
                  <span>In Charge Phone</span> <br />
                  {it.inChargePhone}
                </div>
                <div style={{ width: "20%" }}>
                  <span>Project Location</span> <br />
                  {it.projectLocation}
                </div>
              </div>
              <br />
              <div style={{ display: "flex", gap: 18 }}>
                <div
                  style={{
                    width: "18%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  <span style={{ fontSize: 13 }}>Website</span> <br />
                  {it.website}
                </div>
                <div
                  style={{
                    width: "18%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  <span style={{ fontSize: 13 }}>Instagram</span> <br />
                  {it.instagram}
                </div>
                <div
                  style={{
                    width: "18%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  <span style={{ fontSize: 13 }}>LinkedIn</span> <br />
                  {it.linkedIn}
                </div>
                <div style={{ width: "18%" }}>
                  <span style={{ fontSize: 13 }}>Created At</span> <br />
                  {formatDate(it.createdAt)}
                </div>
              </div>
            </TView>
          </div>
        ))}
      </div>
      <TFoot
        data={data}
        onClick={(page: any) => {
          const appService = new AppService();
          setContractors({ ...data, page });
          appService.loadContractor(page);
        }}
      />
    </div>
  );
}

function Payment({ path, data }: any) {
  const [selected, setSelected] = useState("");
  if (path !== "payment") return null;
  return (
    <div className="table">
      <h3>Payment</h3>
      <div className="thead">
        <div className="th">Type</div>
        <div className="th tcenter s">Status</div>
        <div className="th">Ref</div>
        <div className="th tright s">Amount</div>
        <div className="th m">Created At</div>
        <div className="th tcenter s">Edit</div>
      </div>
      <div style={{ height: "calc(100vh - 340px)", overflow: "auto" }}>
        {data.data.map((it: any) => (
          <div className="tr" key={it._id}>
            <div className="td">{it?.type}</div>
            <div className="td tcenter s">{paymentStatus(it.status)}</div>
            <div className="td">{it.ref}</div>
            <div className="td tright s">{it.amount} $</div>
            <div className="td m">{formatDate(it.createdAt)}</div>
            <div className="td tcenter s">
              <div
                className="view"
                onClick={() => setSelected(selected === it._id ? "" : it._id)}
              />
              {/* <PopupBtn button={<div className="edit" />}>
                <div>
                  <h3>Change status</h3>
                  <select>
                    <option>Pending</option>
                    <option>Processing</option>
                    <option>Developing</option>
                    <option>Complated</option>
                  </select>
                  <br /> <br />
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <button>Confirm</button>
                  </div>
                </div>
              </PopupBtn> */}
            </div>
          </div>
        ))}
      </div>
      <TFoot
        data={data}
        onClick={(page: any) => {
          const appService = new AppService();
          setPayments({ ...data, page });
          appService.loadPayments(page);
        }}
      />
    </div>
  );
}

function Settings() {
  const value = useSelector((state: any) => state.app.dashboardIndex);
  if (value !== "settings") return null;
  return <div>Settings</div>;
}

export default function HomeScreen() {
  const appService = new AppService();
  const value = useSelector((state: any) => state.app.dashboardIndex);
  const statistics = useSelector((state: any) => state.data.statistics);
  const persons = useSelector((state: any) => state.data.persons);
  const companies = useSelector((state: any) => state.data.companies);
  const contractors = useSelector((state: any) => state.data.contractors);
  const payments = useSelector((state: any) => state.data.payments);

  useEffect(() => {
    wsConfig();
    setDashbordIndex(window.location.pathname.split("/")[1]);
    appService.loadStatistics();
    appService.loadPersons();
    appService.loadCompanies();
    appService.loadContractor();
    appService.loadPayments();
  }, []);

  return (
    <div className="app">
      <div className="left">
        <NavElement slug="overview" title="Overview" />
        <NavElement slug="person" title="Persons" />
        <NavElement slug="company" title="Companies" />
        <NavElement slug="contractor" title="Contractor" />
        <NavElement slug="payment" title="Payment" />
        <NavElement slug="settings" title="Settings" />
        <NavElement
          bottom
          slug="logout"
          title="Logout"
          onClick={() => {
            window.localStorage.setItem("token", "");
            window.history.replaceState(null, "", "login");
            window.location.reload();
          }}
        />
      </div>
      <div className="right">
        <div className="header">
          <div className="headerTitle">Hi, Admin</div>
          <div>
            <div className="notification" />
            <div className="message" />
            <div className="profile">
              <div>
                <div className="name">Admin</div>
                <div className="position">Admininstrater</div>
              </div>
              <div className="profilePicture" />
            </div>
          </div>
        </div>
        <Overview
          path={value}
          statistics={statistics}
          persons={persons}
          companies={companies}
          contractors={contractors}
          payments={payments}
        />
        <Persons path={value} data={persons} />
        <Companies path={value} data={companies} />
        <Contactor path={value} data={contractors} />
        <Payment path={value} data={payments} />
        <Settings />
      </div>
    </div>
  );
}
