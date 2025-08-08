export const makePagingNumberSet = (datas: any) => {
  const { total, limit, page } = datas;
  let length = parseInt((total / limit).toString());
  if (total % limit > 0) length++;
  if (length < 8) return Array.from({ length }, (_, k) => k + 1);
  else {
    let list = [];
    if (page > 1) list.push(1);
    if (page > 2) list.push(2);
    if (page > 3) list.push(3);
    if (page > 5) list.push(0);
    if (page > 4) list.push(page - 1);
    list.push(page);
    if (page + 2 < length) list.push(page + 1);
    if (page + 3 < length) list.push(page + 2);
    if (page + 4 < length) list.push(page + 3);
    if (page + 5 < length) list.push(0);
    if (page + 1 < length) list.push(length - 1);
    if (page < length) list.push(length);
    return list;
  }
};

export const pagingCounter = (datas: any) => {
  const { total, limit, page, data } = datas;
  return `Showing ${(page - 1) * limit + 1} to ${
    (page - 1) * limit + data.length
  } from ${total}`;
};

export function formatDate(date: string) {
  const options: any = {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };
  return new Date(date)
    .toLocaleDateString("en-GB", options)
    .replace(",", "")
    .replace("am", "AM")
    .replace("pm", "PM");
}

export function expireIn(date: string) {
  try {
    if (date === null || date === undefined || date === "")
      return <div className="tagGray">Not Subscribed</div>;

    const options: any = {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    const dateInLocal = new Date(date).toLocaleDateString("en-GB", options);
    if (new Date(dateInLocal) < new Date())
      return <div className="tagRed">Expired</div>;
    const diff = new Date(dateInLocal).getTime() - new Date().getTime();
    const daysLeft = Math.floor(diff / (1000 * 60 * 60 * 24));
    return (
      <div className={daysLeft < 6 ? "tagOrange" : "tagGreen"}>
        {daysLeft + " days"}
      </div>
    );
  } catch (error) {
    return "Error";
  }
}

export function projectStatus(status: any) {
  switch (status) {
    case "INITIATED":
      return <div className="tagBlue">Initiated</div>;
    case "CANCELLED":
      return <div className="tagRed">Cancelled</div>;
    case "COMPLETED":
      return <div className="tagGreen">Completed</div>;
    case "IN_PROGRESS":
      return <div className="tagOrange">In Progress</div>;
    case "DEVELOPING":
      return <div className="tagPurple">Developing</div>;
    case "PENDING":
      return <div className="tagYellow">Pending</div>;
    default:
      return <div className="tagGray">{status}</div>;
  }
}

export function contracrorPlan(plan: any) {
  switch (plan) {
    case "BASIC":
      return <div className="tagBlue">Basic</div>;
    case "PREMIUM":
      return <div className="tagBlue">Premium</div>;
    case "STANDARD":
      return <div className="tagBlue">Standard</div>;
    default:
      return <div className="tagBlue">{plan}</div>;
  }
}

export function paymentStatus(status: any) {
  switch (status) {
    case "INITIATED":
      return <div className="tagBlue">Initiated</div>;
    case "CANCELLED":
      return <div className="tagRed">Cancelled</div>;
    case "COMPLETED":
      return <div className="tagGreen">Completed</div>;
    case "IN_PROGRESS":
      return <div className="tagOrange">In Progress</div>;
    case "DEVELOPING":
      return <div className="tagPurple">Developing</div>;
    case "PENDING":
      return <div className="tagYellow">Pending</div>;
    default:
      return <div className="tagGray">{status}</div>;
  }
}