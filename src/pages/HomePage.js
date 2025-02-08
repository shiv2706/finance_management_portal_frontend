import React,{useState, useEffect} from 'react';
import {Chart as ChartJS} from "chart.js/auto";
import { motion } from "framer-motion";
import {Bar, Line, Doughnut} from "react-chartjs-2";
import CountUp from "react-countup";
import {Button, Form, Input, message, Modal, Select, Table, Upload, DatePicker} from 'antd'
import Layout from "../components/Layout/Layout";
import axios from "axios";
import Loading from "../components/Loading";
import UploadBillForm from "../components/uploadBillForm";
import Success from "../components/Success";
import Failed from "../components/Failed";
import Analytics from "../components/Analytics";
const {RangePicker} = DatePicker;




const HomePage = () => {
    const[showModal,setShowModal] = useState(false);
    const [imageModal, setImageModal] = useState(false);
    const [loading,setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [allTransactions,setAllTransactions] = useState([]);
    const [selectedDate, setSelectedDate] = useState([0,0]);
    const [answer, setAnswer] = useState("0");
    const [categoryy,setCategoryy] = useState("SELECT");
    const [type, setType] = useState("SELECT");
    const [total, setTotal] = useState([{ totalIncome: 0, totalExpense: 0, balance: 0, expenseTransactions:0, incomeTransactions:0, totalTransactions:0 }]);
    const [daterange, setdaterange] = useState("365");
    const [analytics,setAnalytics] = useState("yes");
    const [chartData, setChartData] = useState({ labels: [], datasets: [] });
    const [categoryChartData, setCategoryChartData] = useState([]);
    const [form] = Form.useForm();
    const [error, setError] = useState(false);





    //table data
    const columns = [
        {
            title: 'Date',
            dataIndex: 'date',
            render: (date) => new Date(date).toISOString().split('T')[0],
        },
        {
            title: 'Amount (Rupees)',
            dataIndex: 'amount',
            render: (amount) => (
                <span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor"
                         class="bi bi-currency-rupee" viewBox="0 0 16 16">
                                <path
                                    d="M4 3.06h2.726c1.22 0 2.12.575 2.325 1.724H4v1.051h5.051C8.855 7.001 8 7.558 6.788 7.558H4v1.317L8.437 14h2.11L6.095 8.884h.855c2.316-.018 3.465-1.476 3.688-3.049H12V4.784h-1.345c-.08-.778-.357-1.335-.793-1.732H12V2H4z"/>
                        </svg>{amount}
                </span>)
        },
        {
            title: 'Category',
            dataIndex: 'category',
        },
        {
            title: 'Type',
            dataIndex: 'Type',
        },

    ]

    const getAllTransactionss = async () => {
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            // setLoading(true);
            const res = await axios.post("/transactions/get-transaction", {
                userid: user._id,
                selectedDate,
                answer,
                categoryy,
                type,})
            // setLoading(false);
            console.log(res.data)
            setAllTransactions(res.data);

        }catch(err) {
            console.log(err);
            message.error("fetch issue with transaction");
        }
    }

    const getTotalDetails = async () => {
        try{
            const user = JSON.parse(localStorage.getItem("user"));
            const res = await axios.post("/transactions/get-totals",{userid:user._id,
            daterange,})
            setTotal(res.data);
            console.log(res);
        }catch(err) {
            console.log(err);
        }
    }
    useEffect(() => {
        getTotalDetails();
    },[showModal,imageModal,daterange])

    useEffect(() => {
        getAllTransactionss();
    },[selectedDate,answer,categoryy,type,imageModal,showModal]);

    const getLineChartData = async () => {
        const user = JSON.parse(localStorage.getItem("user"));
        const res = await axios.post("/transactions/get-linechart-data",{userid:user._id,
        daterange,})
        const {labels, incomeData, expenseData} = res.data;
        console.log(res.data)

        setChartData({
            labels,
            datasets: [
                {
                    label: "Income",
                    data: incomeData,
                    borderColor: "green",
                    backgroundColor: "rgba(0, 255, 0, 0.2)",
                    tension: 0, // Smooth line
                    pointRadius: 7,
                },
                {
                    label: "Expense",
                    data: expenseData,
                    borderColor: "red",
                    backgroundColor: "rgba(255, 0, 0, 0.2)",
                    tension: 0,
                    pointRadius: 7,
                },
            ],
        })
    }

    useEffect(() => {
        getLineChartData();
    },[daterange,showModal,imageModal])

    const getCategoryDataDoughnut = async () => {
        try{
            const user = JSON.parse(localStorage.getItem("user"));
            const res = await axios.post("/transactions/get-category-details",{userid:user._id,
                daterange,})
            setCategoryChartData(res.data.categoryExpenses)
            console.log(res.data)
        }catch(err){
            console.log(err);
        }
    }

    useEffect(() => {
        getCategoryDataDoughnut()
    },[showModal,imageModal,daterange])

    const handleSubmit = async (values) => {
        try{
            const user = JSON.parse(localStorage.getItem("user"));
            setLoading(true);
            await axios.post("/transactions/add-transaction", {...values,userid:user._id, })
            await getAllTransactionss();
            setLoading(false);
            setSuccess(true,);
            setTimeout(() => {
                setSuccess(false);
            }, 3000)
            // setShowModal(false);

        }catch(err){
            setLoading(false);
            message.error("Error adding transaction")

        }
    }
    const AddByText = async (query) => {
        try{
            setLoading(true);
            const user = JSON.parse(localStorage.getItem("user"));
            let transactData = await axios.post("/transactions/upload-text",{text:query},{
                headers: {
                    "Content-Type": "application/json",
                },
            })
            let rawData1 = transactData.data;
            let validJsonString = rawData1.replace(/([a-zA-Z0-9_]+):/g, '"$1":') // Add double quotes around keys
                .replace(/(\w+):/g, '"$1":') // Ensure all keys are quoted
                .replace(/'([^']+)'/g, '"$1"');
            let jsonObject = JSON.parse(validJsonString);
            await axios.post("/transactions/add-transaction", {...jsonObject,userid:user._id, })
            setLoading(false);
            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
            }, 3000)

        }catch (err){
            setLoading(false);
            setError(true);
            setTimeout(() => {
                setError(false);
            }, 2000)
            console.log(error);
            message.error("Failed to upload bill. Please try again.");
        }
    }
    const imageHandler = () =>{
        setShowModal(false);
        setImageModal(true);
    }
    const RangeCheckHandeler = async (valuess)=>{
        setAnswer(valuess)
        await getAllTransactionss();
    }
    const ValueHandler = async (values)=>{
        if(!values){
            setSelectedDate([0,0]);
        }else {setSelectedDate(values);}
        // await getAllTransactionss();
    }
    const categoryHandler = async (value) =>{
        setCategoryy(value)
        await getAllTransactionss();

    }
    const typeHandler = async (value) =>{
        setType(value)
        await getAllTransactionss();

    }
    const DateRangeHandler = async (value)=>{
        setdaterange(value)
        // await getTotalDetails()
    }
    const AnalyticsHandler = async ()=>{
        setAnalytics("no");
    }
    const tablehandler = async ()=>{
        setAnalytics("yes")
    }

    const handleSubmitTextQuery = async() => {
        const value = await form.validateFields()
        const query = value.query;
        await AddByText(query);
        form.resetFields();

    }

    return (
        <Layout>
            {/*{analytics==="yes" && <Analytics /> }*/}
            <div className="filters">
                {analytics==="no" && <div>
                    <h6>Select Filter <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                           className="bi bi-funnel" viewBox="0 0 16 16">
                        <path
                            d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0
                             1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5zm1 .5v1.308l4.372
                             4.858A.5.5 0 0 1 7 8.5v5.306l2-.666V8.5a.5.5 0 0 1 .128-.334L13.5 3.308V2z"/>
                    </svg></h6>
                    <h6><Select value={answer} onChange={(valuess) => RangeCheckHandeler(valuess)}>
                        <Select.Option value="0">Show All</Select.Option>
                        <Select.Option value="1">Select Date</Select.Option>
                        <Select.Option value="2">Category</Select.Option>
                        <Select.Option value="3">Type</Select.Option>
                    </Select></h6> {answer === "1" &&
                    <RangePicker value={selectedDate} onChange={(values) => ValueHandler(values)}/>}
                    {answer === "2" && <Select value={categoryy} onChange={(value) => categoryHandler(value)}>
                        <Select.Option value="SALARY">SALARY</Select.Option>
                        <Select.Option value="GIFT">GIFT</Select.Option>
                        <Select.Option value="RENT">RENT</Select.Option>
                        <Select.Option value="FOOD">FOOD</Select.Option>
                        <Select.Option value="EDUCATION">EDUCATION</Select.Option>
                        <Select.Option value="TRANSPORTATION">TRANSPORTATION</Select.Option>
                        <Select.Option value="SHOPPING">SHOPPING</Select.Option>
                        <Select.Option value="ENTERTAINMENT">ENTERTAINMENT</Select.Option>
                        <Select.Option value="GROCERIES">GROCERIES</Select.Option>
                        <Select.Option value="OTHERS">OTHER</Select.Option>
                    </Select>}
                    {answer === "3" && <Select value={type} onChange={(value) => typeHandler(value)}>
                        <Select.Option value="expense">EXPENSE</Select.Option>
                        <Select.Option value="income">INCOME</Select.Option>
                    </Select>}
                </div>}
                {analytics==="no" && <motion.div className="totalHeading"
                                                 initial={{ opacity: 0, y: -20 }}
                                                 animate={{ opacity: 2, y: 0 }}
                                                 transition={{ duration: 1, delay: 0.2 }}>
                    <h6>Last {daterange} days <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                             className="bi bi-arrow-right" viewBox="0 0 16 16">
                            <path fill-rule="evenodd"
                                  d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"/>
                        </svg> <Select value={daterange} onChange={(value) => DateRangeHandler(value)}>
                            <Select.Option value="7">last week</Select.Option>
                            <Select.Option value="30">last 30 days</Select.Option>
                            <Select.Option value="60">last 60 days</Select.Option>
                            <Select.Option value="90">last 90 days</Select.Option>
                            <Select.Option value="365">LifeTime</Select.Option>
                        </Select></h6>
                    <div className="totals">
                        <div>
                            <h6>Total Income</h6>
                            <h5>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                                     className="bi bi-currency-rupee" viewBox="0 0 16 16">
                                    <path
                                        d="M4 3.06h2.726c1.22 0 2.12.575 2.325 1.724H4v1.051h5.051C8.855 7.001 8 7.558 6.788 7.558H4v1.317L8.437 14h2.11L6.095 8.884h.855c2.316-.018 3.465-1.476 3.688-3.049H12V4.784h-1.345c-.08-.778-.357-1.335-.793-1.732H12V2H4z"/>
                                </svg>
                                <CountUp end={total.totalIncome} duration={1.5} /></h5>
                        </div>
                        <div>
                            <h6>Total Expense</h6>
                            <h5>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                                     className="bi bi-currency-rupee" viewBox="0 0 16 16">
                                    <path
                                        d="M4 3.06h2.726c1.22 0 2.12.575 2.325 1.724H4v1.051h5.051C8.855 7.001 8 7.558 6.788 7.558H4v1.317L8.437 14h2.11L6.095 8.884h.855c2.316-.018 3.465-1.476 3.688-3.049H12V4.784h-1.345c-.08-.778-.357-1.335-.793-1.732H12V2H4z"/>
                                </svg>
                                <CountUp end={Math.round(total.totalExpense)} duration={1.5}/> </h5>
                        </div>
                        <div>
                            <h6>Balance</h6>
                            <h5>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                                     className="bi bi-currency-rupee" viewBox="0 0 16 16">
                                    <path
                                        d="M4 3.06h2.726c1.22 0 2.12.575 2.325 1.724H4v1.051h5.051C8.855 7.001 8 7.558 6.788 7.558H4v1.317L8.437 14h2.11L6.095 8.884h.855c2.316-.018 3.465-1.476 3.688-3.049H12V4.784h-1.345c-.08-.778-.357-1.335-.793-1.732H12V2H4z"/>
                                </svg>
                                <CountUp end={Math.round(total.balance)} duration={1.5}/> </h5>
                        </div>
                    </div>
                </motion.div>}
                {analytics==="no" && <div>
                    <h6><button className="btn btn-primary"
                            onClick={() => {
                                setShowModal(true)
                            }}>
                        + Add transaction
                    </button></h6>
                    {analytics==="yes" && <button className="btn btn-primary" onClick={AnalyticsHandler}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                             className="bi bi-card-checklist" viewBox="0 0 16 16">
                            <path
                                d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2z"/>
                            <path
                                d="M7 5.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m-1.496-.854a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 1 1 .708-.708l.146.147 1.146-1.147a.5.5 0 0 1 .708 0M7 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m-1.496-.854a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 0 1 .708-.708l.146.147 1.146-1.147a.5.5 0 0 1 .708 0"/>
                        </svg> View Transactions
                    </button>}
                    {analytics === "no" && <button className="btn btn-primary" onClick={tablehandler}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                             className="bi bi-bar-chart-line" viewBox="0 0 16 16">
                            <path
                                d="M11 2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v12h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1
                                 0-1H1v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h1V7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7h1zm1
                                  12h2V2h-2zm-3 0V7H7v7zm-5 0v-3H2v3z"/>
                        </svg> View Analytics
                    </button>}
                </div>}
                {analytics==="yes" && <div className="whenAnOn">

                        <button className="btn btn-primary"
                                onClick={() => {
                                    setShowModal(true)
                                }}>
                            + Add transaction
                        </button> {total.totalTransactions === 0 && <motion.div
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    whileHover={{ scale: 1.02, transition: 0.2 }}> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                             className="bi bi-arrow-left" viewBox="0 0 16 16">
                            <path fill-rule="evenodd"
                                  d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"/>
                        </svg> Click here to Add your FIRST transaction !
                    </motion.div>}

                </div>}
                {analytics === "yes" && <div>
                    <button className="btn btn-primary" onClick={AnalyticsHandler}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                             className="bi bi-card-checklist" viewBox="0 0 16 16">
                            <path
                                d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2z"/>
                            <path
                                d="M7 5.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m-1.496-.854a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 1 1 .708-.708l.146.147 1.146-1.147a.5.5 0 0 1 .708 0M7 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m-1.496-.854a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 0 1 .708-.708l.146.147 1.146-1.147a.5.5 0 0 1 .708 0"/>
                        </svg> View Transactions
                    </button>
                </div>}
            </div>
            {analytics === "no" && <motion.div className="content"
                                               initial={{ scale: 0.95, opacity: 0 }}
                                               animate={{ scale: 1, opacity: 1 }}
                                               transition={{ duration: 1 }}>
                <Table className="tabular" columns={columns} dataSource={allTransactions} size="small" pagination={{
                    position: ["bottomCenter"],
                    pageSize: 10,
                }}/>

            </motion.div>}
            {analytics === "yes" && <div className="analytics">
                <motion.div className="dataCard TotalDetailsCard"
                     initial={{ x: -50, opacity: 0 }}
                     animate={{ x: 0, opacity: 1 }}
                     transition={{ duration: 1, delay: 0.2 }}
                     whileHover={{ scale: 1.02, transition: 0.2 }}>

                    <h6>Last {daterange} days <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                   fill="currentColor"
                                                   className="bi bi-arrow-right" viewBox="0 0 16 16">
                        <path fill-rule="evenodd"
                              d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"/>
                    </svg> <Select value={daterange} onChange={(value) => DateRangeHandler(value)}>
                        <Select.Option value="7">last week</Select.Option>
                        <Select.Option value="30">last 30 days</Select.Option>
                        <Select.Option value="60">last 60 days</Select.Option>
                        <Select.Option value="90">last 90 days</Select.Option>
                        <Select.Option value="365">LifeTime</Select.Option>
                    </Select></h6>
                    <div className="totalsAnalytics">
                        <div className="headIncome">
                            <h2>TOTAL INCOME</h2>
                            <h5>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                                     className="bi bi-currency-rupee" viewBox="0 0 16 16">
                                    <path
                                        d="M4 3.06h2.726c1.22 0 2.12.575 2.325 1.724H4v1.051h5.051C8.855 7.001 8 7.558 6.788 7.558H4v1.317L8.437 14h2.11L6.095 8.884h.855c2.316-.018 3.465-1.476 3.688-3.049H12V4.784h-1.345c-.08-.778-.357-1.335-.793-1.732H12V2H4z"/>
                                </svg>
                                <CountUp end={total.totalIncome} duration={1.5}/></h5>
                        </div>
                        <div className="headExpense">
                            <h2>TOTAL EXPENSE</h2>
                            <h5>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                                     className="bi bi-currency-rupee" viewBox="0 0 16 16">
                                    <path
                                        d="M4 3.06h2.726c1.22 0 2.12.575 2.325 1.724H4v1.051h5.051C8.855 7.001 8 7.558 6.788 7.558H4v1.317L8.437 14h2.11L6.095 8.884h.855c2.316-.018 3.465-1.476 3.688-3.049H12V4.784h-1.345c-.08-.778-.357-1.335-.793-1.732H12V2H4z"/>
                                </svg>
                                <CountUp end={Math.round(total.totalExpense)} duration={1.5}/></h5>
                        </div>

                    </div>
                    <div className="headBalance">
                        <h2>BALANCE</h2>
                        <h5>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                                 className="bi bi-currency-rupee" viewBox="0 0 16 16">
                                <path
                                    d="M4 3.06h2.726c1.22 0 2.12.575 2.325 1.724H4v1.051h5.051C8.855 7.001 8 7.558 6.788 7.558H4v1.317L8.437 14h2.11L6.095 8.884h.855c2.316-.018 3.465-1.476 3.688-3.049H12V4.784h-1.345c-.08-.778-.357-1.335-.793-1.732H12V2H4z"/>
                            </svg>
                            <CountUp end={Math.round(total.balance)} duration={1.5}/></h5>
                    </div>

                </motion.div>
                <motion.div className="dataCard ComparisonCard"
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ duration: 1, delay: 0.2 }}
                     whileHover={{ scale: 1.02, transition: 0.2 }}>
                    <div>
                        <h4>INCOME Vs EXPENSE</h4>
                        <h6>LAST {daterange} DAYS</h6>
                    </div>
                    <div>
                        <Doughnut
                            data={{
                                labels: ["Income", "Expense"],
                                datasets: [{
                                    label: "total",
                                    data: [total.totalIncome, total.totalExpense],
                                    backgroundColor: [
                                        "lightgreen",
                                        "#FF6384",

                                    ]
                                }]
                            }}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                cutout: "60%",

                            }}
                        />
                    </div>
                </motion.div>
                <div className="dataCard LineChartCard">
                    <div className="cardh4">
                        <h4>DAY WISE INCOME & EXPENSE</h4>
                        <h6>LAST {daterange} DAYS</h6>
                    </div>
                    <div className="linechart">
                        <Line
                            data={chartData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                            }}
                        />
                    </div>
                </div>
                <div className="dataCard TotalDetailsCard">
                    <div>
                        <h4>TOTAL TRANSACTIONS - <CountUp end={total.totalTransactions} duration={1.5}/></h4>
                    </div>
                    <div>
                        <h6>LAST {daterange} DAYS</h6>
                    </div>
                    <div className="barChart">
                        <Bar
                            data={{
                                labels: ["Income", "Expense"],
                                datasets: [{
                                    label: "total",
                                    data: [total.incomeTransactions, total.expenseTransactions],
                                    backgroundColor:[
                                        "lightgreen",
                                        "#ff9999"
                                    ]
                                }]
                            }}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                cutout: "60%",

                            }}
                        />
                    </div>
                </div>
                <div className="dataCard ComparisonCard">
                    <div>
                        <h4>CATEGORY WISE EXPENSE</h4>
                        <h6>LAST {daterange} DAYS</h6>
                    </div>
                    <div>
                    <Doughnut
                            data={{
                                labels: categoryChartData.map((data) => data._id),
                                datasets: [{
                                    label: "total",
                                    data:categoryChartData.map((data) => data.totalAmount) ,
                                    backgroundColor: [
                                        "#FF6384", // Soft Red
                                        "#36A2EB", // Sky Blue
                                        "#FFCE56", // Yellow
                                        "#4BC0C0", // Teal
                                        "#9966FF", // Purple
                                        "#FF9F40", // Orange
                                        "#8D6E63", // Brown
                                        "#B3E5FC", // Light Blue
                                        "#D4E157", // Lime Green
                                        "#E91E63",
                                        "cyan"
                                    ],
                                    borderWidth: 0
                                }]
                            }}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                cutout: "60%",

                            }}
                        />
                    </div>
                </div>
            </div>}
            <Modal className="allModal" title="Add Transaction" open={showModal}
                   onCancel={() => {
                       setShowModal(false)
                   }}
                   footer={false}>
                <div className="d-flex justify-content-around">
                    <button className="btn btn-primary" onClick={imageHandler}>
                        <h8>Upload Image </h8>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                             className="bi bi-cloud-upload" viewBox="0 0 16 16">
                            <path fill-rule="evenodd"
                                  d="M4.406 1.342A5.53 5.53 0 0 1 8 0c2.69 0 4.923 2 5.166 4.579C14.758 4.804 16 6.137 16 7.773 16 9.569 14.502 11 12.687 11H10a.5.5 0 0 1 0-1h2.688C13.979 10 15 8.988 15 7.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 2.825 10.328 1 8 1a4.53 4.53 0 0 0-2.941 1.1c-.757.652-1.153 1.438-1.153 2.055v.448l-.445.049C2.064 4.805 1 5.952 1 7.318 1 8.785 2.23 10 3.781 10H6a.5.5 0 0 1 0 1H3.781C1.708 11 0 9.366 0 7.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383"/>
                            <path fill-rule="evenodd"
                                  d="M7.646 4.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707V14.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708z"/>
                        </svg>
                    </button>
                </div>
                <div className="sendchat">
                    <div>
                        <Form form={form} onFinish={handleSubmitTextQuery}>
                            <Form.Item label="Add-Text" name="query" className="userInput">
                                <Input type="String" placeholder="eg:(rupees 30 on Chai on 6th feb 2025)"/>
                            </Form.Item>
                        </Form>
                    </div>
                    <div className="submitInput">
                        <button className="btn btn-primary" onClick={handleSubmitTextQuery}>SEND</button>
                    </div>
                </div>
                <Form layout="vertical" onFinish={handleSubmit}>
                    {loading && <Loading/>}
                    {success && <Success/>}
                    {error && <Failed />}
                    <Form.Item label="Amount" name="amount">
                        <Input type="number"/>
                    </Form.Item>
                    <Form.Item label="Type" name="Type">
                        <Select>
                            <Select.Option value="income">INCOME</Select.Option>
                            <Select.Option value="expense">EXPENSE</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="Category" name="category">
                        <Select>
                            <Select.Option value="SALARY">SALARY</Select.Option>
                            <Select.Option value="GIFT">GIFT</Select.Option>
                            <Select.Option value="RENT">RENT</Select.Option>
                            <Select.Option value="FOOD">FOOD</Select.Option>
                            <Select.Option value="EDUCATION">EDUCATION</Select.Option>
                            <Select.Option value="TRANSPORTATION">TRANSPORTATION</Select.Option>
                            <Select.Option value="SHOPPING">SHOPPING</Select.Option>
                            <Select.Option value="ENTERTAINMENT">ENTERTAINMENT</Select.Option>
                            <Select.Option value="GROCERIES">GROCERIES</Select.Option>
                            <Select.Option value="OTHERS">OTHER</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="Date" name="date">
                        <Input type="date"/>
                    </Form.Item>
                    <div className="d-flex justify-content-end">
                        <button type="submit" className="btn btn-primary">SAVE</button>
                    </div>
                </Form>

            </Modal>
            <Modal className="allModal" title="Upload image of bill" open={imageModal}
                   onCancel={() => {
                       setImageModal(false)
                   }}
                   footer={false}>
                <div className="note justify-content-start">
                    <h7>(Kindly upload good quality bill images only)</h7>
                </div>
                <UploadBillForm/>


            </Modal>
            <div>
                <div className="last text-dark ">
                    <h6 className="text-center">Shivansh Pradhan ©️</h6>
                </div>
            </div>
        </Layout>
    )
}

export default HomePage;