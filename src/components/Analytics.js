// import React, {useEffect, useState} from "react";
// import {Chart as ChartJS} from "chart.js/auto";
// import {Bar, Line, Doughnut} from "react-chartjs-2";
// import axios from "axios";
// import {Select} from "antd";
//
// const Analytics = () => {
//     const [total, setTotal] = useState({ totalIncome: 0, totalExpense: 0, balance: 0 });
//     const [daterange, setdaterange] = useState("SELECT");
//
//     const getTotalDetails = async () => {
//         try{
//             const user = JSON.parse(localStorage.getItem("user"));
//             const res = await axios.post("/transactions/get-totals",{userid:user._id,
//                 daterange,})
//             setTotal(res.data);
//             console.log(res.data);
//         }catch(err) {
//             console.log(err);
//         }
//     }
//
//     useEffect(() => {
//         getTotalDetails();
//     },[daterange])
//
//     const DateRangeHandler = async (value)=>{
//         setdaterange(value)
//         // await getTotalDetails()
//     }
//
//     return (
//
//         <div className="analytics">
//             <div className="dataCard customerCard">
//
//                 <h6>Last {daterange} days <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
//                                                fill="currentColor"
//                                                className="bi bi-arrow-right" viewBox="0 0 16 16">
//                     <path fill-rule="evenodd"
//                           d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"/>
//                 </svg> <Select value={daterange} onChange={(value) => DateRangeHandler(value)}>
//                     <Select.Option value="7">last week</Select.Option>
//                     <Select.Option value="30">last 30 days</Select.Option>
//                     <Select.Option value="60">last 60 days</Select.Option>
//                     <Select.Option value="90">last 90 days</Select.Option>
//                     <Select.Option value="365">LifeTime</Select.Option>
//                 </Select></h6>
//                 <div className="totalsAnalytics">
//                     <div className="head">
//                         <h2>TOTAL INCOME</h2>
//                         <h5>
//                             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
//                                  className="bi bi-currency-rupee" viewBox="0 0 16 16">
//                                 <path
//                                     d="M4 3.06h2.726c1.22 0 2.12.575 2.325 1.724H4v1.051h5.051C8.855 7.001 8 7.558 6.788 7.558H4v1.317L8.437 14h2.11L6.095 8.884h.855c2.316-.018 3.465-1.476 3.688-3.049H12V4.784h-1.345c-.08-.778-.357-1.335-.793-1.732H12V2H4z"/>
//                             </svg>
//                             {total.totalIncome}</h5>
//                     </div>
//                     <div className="head">
//                         <h2>TOTAL EXPENSE</h2>
//                         <h5>
//                             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
//                                  className="bi bi-currency-rupee" viewBox="0 0 16 16">
//                                 <path
//                                     d="M4 3.06h2.726c1.22 0 2.12.575 2.325 1.724H4v1.051h5.051C8.855 7.001 8 7.558 6.788 7.558H4v1.317L8.437 14h2.11L6.095 8.884h.855c2.316-.018 3.465-1.476 3.688-3.049H12V4.784h-1.345c-.08-.778-.357-1.335-.793-1.732H12V2H4z"/>
//                             </svg>
//                             {Math.round(total.totalExpense)}</h5>
//                     </div>
//
//                 </div>
//                 <div className="head">
//                     <h2>BALANCE</h2>
//                     <h5>
//                         <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
//                              className="bi bi-currency-rupee" viewBox="0 0 16 16">
//                             <path
//                                 d="M4 3.06h2.726c1.22 0 2.12.575 2.325 1.724H4v1.051h5.051C8.855 7.001 8 7.558 6.788 7.558H4v1.317L8.437 14h2.11L6.095 8.884h.855c2.316-.018 3.465-1.476 3.688-3.049H12V4.784h-1.345c-.08-.778-.357-1.335-.793-1.732H12V2H4z"/>
//                         </svg>
//                         {Math.round(total.balance)}</h5>
//                 </div>
//
//             </div>
//             <div className="dataCard categoryCard">
//                 <div>
//                     <h4>INCOME Vs EXPENSE</h4>
//                 </div>
//                 <div>
//                     <Doughnut
//                         data={{
//                             labels: ["Income", "Expense"],
//                             datasets: [{
//                                 label: "Total",
//                                 data: [total.totalIncome, total.totalExpense],
//                             }]
//                         }}
//                         options={{
//                             responsive: true,
//                             maintainAspectRatio: false,
//                         }}
//                     />
//                 </div>
//             </div>
//             <div className="dataCard revenueCard">chart2</div>
//         </div>
//     )
//
// }
//
// export default Analytics;