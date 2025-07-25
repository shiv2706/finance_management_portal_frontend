import React,{useState,useEffect} from 'react';
import {Form, Input, message} from "antd";
import { motion } from "framer-motion";
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";
import Loading from "../components/Loading";
import 'antd/dist/reset.css';
import SuccessAuth from "../components/SuccessAuth";
import FailedAuth from "../components/FailedAuth";

const Login = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);

    const submitHandler = async (values) => {
        try{
            setLoading(true);
            const {data} = await axios.post("/users/login", values)
            setLoading(false);
            message.success("Login successful");
            localStorage.setItem("user", JSON.stringify({...data.user, password:''}));
            setSuccess(true);
            setTimeout(()=>{
                setSuccess(false);
                navigate("/");
            },1000)
            // navigate("/");

        }catch(err){
            setLoading(false);
            setError(true);
            setTimeout(() => {
                setError(false);
            }, 2000)
            message.error("login failed");
        }
    }
    useEffect(() => {
        if(localStorage.getItem('user')){
            navigate("/")
        }
    },[navigate])
    return (
        <div className="r-page">
            {/*<motion.div className="authheading"*/}
            {/*            initial={{x: 0, opacity: 0}}*/}
            {/*            animate={{x: 0, opacity: 1}}*/}
            {/*            transition={{duration: 2, delay: 0.2}}>*/}
            {/*    <h1>FinSmart</h1>*/}
            {/*</motion.div>*/}
            <div className="register-page"
                        >
                {loading && <Loading/>}
                {success && <SuccessAuth/>}
                {error && <FailedAuth/>}
                <Form layout="vertical" onFinish={submitHandler}>
                    <h1>Welcome Back!</h1>
                    <Form.Item label="Email" name="email">
                        <Input type="email" placeholder="for testing : testuser@gmail.com"/>
                    </Form.Item>
                    <Form.Item label="Password" name="password">
                        <Input type="password" placeholder="for testing : test@123"/>
                    </Form.Item>
                    <div className="d-flex justify-content-between">
                        <h7>new User? <Link to="/register">Register Now</Link></h7>
                    </div>
                    <div className="d-flex justify-content-around p-2">
                        <button className="btn btn-primary">Login</button>
                    </div>
                </Form>
            </div>
        </div>
    )
}

export default Login;