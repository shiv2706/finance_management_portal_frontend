import React, {useState, useEffect, useRef} from 'react';
import { motion } from "framer-motion";
import Layout from "../components/Layout/Layout";
import Loading from "../components/Loading";
import { useNavigate} from "react-router-dom";
import {Form, Input, Select} from "antd";
import axios from "axios";



const ChatBot = () => {
    const [loading,setLoading] = useState(false);
    const [chatHistory, setChatHistory] = useState([]);
    // const [botMessage, setBotMessage] = useState("");
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const chatContainerRef = useRef(null);
    const [daterange, setdaterange] = useState("365");
    // const [total, setTotal] = useState([{ transactions:[],totalIncome: 0, totalExpense: 0, balance: 0, expenseTransactions:0, incomeTransactions:0, totalTransactions:0 }]);

    const GetResponse = async (query) => {
        try{
            const user = JSON.parse(localStorage.getItem("user"));
            setLoading(true);
            const userDetails = await axios.post("/transactions/get-totals",{userid:user._id,
                daterange,})
            const categoryWiseDetails = await axios.post("/transactions/get-category-details",{userid:user._id,
                daterange,})
            const dayWiseDetails = await axios.post("/transactions/get-linechart-data",{userid:user._id,
                daterange,})
            const reply = await axios.post("/transactions/get-chatbot-response",{userInput: query, userInfo:userDetails.data, CategoryWiseExpense:categoryWiseDetails.data, DayWiseData:dayWiseDetails.data},{
                headers: {
                    "Content-Type": "application/json",
                },
            })
            setLoading(false);
            // setBotMessage(reply.data)
            let ans = reply.data;
            let finans = ans.replace(/\*/g, '');
            setChatHistory(prevChat => [
                ...prevChat,
                { sender: "user", message: query },
                { sender: "bot", message: finans }
            ]);
        }catch(err){
            console.log(err)
            setLoading(false);
        }
    }

    const DashBoardHandler = () =>{
        navigate("/");
    }
    const handleSubmit = async () => {
        try{
            const values = await form.validateFields();
            const query = values.query;
            await GetResponse(query);
            form.resetFields();
        }catch(err){
            console.log(err)
        }
    }
    const onWhatMostHandler = async () => {
        const query = "on what date did i spend the most?"
        await GetResponse(query);
    }
    const CategoryMostHandler = async () => {
        const query = "on what category did i spend the most?"
        await GetResponse(query);
    }
    const BudgetingPlanHandler = async () => {
        const query = "Make a budgeting plan for me"
        await GetResponse(query);
    }

    const DateRangeHandler = async (value)=>{
        setdaterange(value)
        // await getTotalDetails()
    }

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chatHistory]);

    return (
        <Layout>
            <div className="filtersChatbot" onClick={DashBoardHandler}>
                <button className="btn btn-primary">Go To Dashboard</button>
            </div>
            <div className="analytics">
                <motion.div className="dataCard questionBoxChatbot"
                            initial={{x: -50, opacity: 0}}
                            animate={{x: 0, opacity: 1}}
                            transition={{duration: 1, delay: 0.2}}>
                    <h2>Personal Finance Chat-Bot</h2>
                    Enter any question related to your finance data or select from below :
                    <button className="btn btn-primary" onClick={onWhatMostHandler}>On what date did i spend the
                        most?</button>
                    <button className="btn btn-primary" onClick={CategoryMostHandler}>On what Category did i spend the
                        most?
                    </button>
                    <button className="btn btn-primary" onClick={BudgetingPlanHandler}>Draft a Budget Plan for me
                    </button>
                    <p> </p>
                    <h6>Get Answers from the Last {daterange} days <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
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
                    <div className="sendchat">
                        <div>
                            <Form form={form} onFinish={handleSubmit}>
                                <Form.Item name="query" className="userInput"
                                           rules={[{required: true, message: "Please enter your query!"}]}>
                                    <Input type="String" placeholder="Enter Your Query"/>
                                </Form.Item>
                            </Form>
                        </div>
                        <div className="submitInput">
                            <button className="btn btn-primary" onClick={handleSubmit}>SEND</button>
                        </div>
                    </div>
                    {loading && <Loading/>}
                </motion.div>
                <motion.div className="dataCard TotalDetailsCardChatBot" ref={chatContainerRef}
                            initial={{opacity: 0, y: 20}}
                            animate={{opacity: 2, y: 0}}
                            transition={{duration: 1, delay: 0.2}}>
                    <motion.h4
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 2, y: 0}}
                        transition={{duration: 1, delay: 0.1}}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor"
                             class="bi bi-robot" viewBox="0 0 16 16">
                            <path
                                d="M6 12.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5M3 8.062C3 6.76 4.235 5.765 5.53 5.886a26.6 26.6 0 0 0 4.94 0C11.765 5.765 13 6.76 13 8.062v1.157a.93.93 0 0 1-.765.935c-.845.147-2.34.346-4.235.346s-3.39-.2-4.235-.346A.93.93 0 0 1 3 9.219zm4.542-.827a.25.25 0 0 0-.217.068l-.92.9a25 25 0 0 1-1.871-.183.25.25 0 0 0-.068.495c.55.076 1.232.149 2.02.193a.25.25 0 0 0 .189-.071l.754-.736.847 1.71a.25.25 0 0 0 .404.062l.932-.97a25 25 0 0 0 1.922-.188.25.25 0 0 0-.068-.495c-.538.074-1.207.145-1.98.189a.25.25 0 0 0-.166.076l-.754.785-.842-1.7a.25.25 0 0 0-.182-.135"/>
                        <path d="M8.5 1.866a1 1 0 1 0-1 0V3h-2A4.5 4.5 0 0 0 1 7.5V8a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1v1a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1v-.5A4.5 4.5 0 0 0 10.5 3h-2zM14 7.5V13a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7.5A3.5 3.5 0 0 1 5.5 4h5A3.5 3.5 0 0 1 14 7.5"/>
                    </svg>

                    </motion.h4>
                    {chatHistory.map((chat, index) => (
                        <motion.div key={index}
                             className={`chatBubble ${chat.sender === "user" ? "userBubble" : "botBubble"}`}
                                    initial={{ opacity: 0, x: chat.sender === "user" ? -50 : 50 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ duration: 1, delay: 0.2 }}>
                            <strong>{chat.sender === "user" ? "You" : "Bot"}:</strong> {chat.message}
                        </motion.div>
                    ))}

                </motion.div>
            </div>
            <div>
                <div className="last text-dark ">
                    <h6 className="text-center">Shivansh Pradhan ©️</h6>
                </div>
            </div>

        </Layout>
    )


}


export default ChatBot;