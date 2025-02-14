import React,{useState,useEffect} from 'react';
import {Form, Input, message} from 'antd';
import { motion } from "framer-motion";
import {Link,useNavigate} from "react-router-dom";
import axios from 'axios';
import Loading from "../components/Loading";
import 'antd/dist/reset.css';
import SuccessAuth from "../components/SuccessAuth";

const Register = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const submitHandler = async (values) => {
        try{
            setLoading(true);
            await axios.post("/users/register", values)
            message.success("Registration successfully");
            setLoading(false);
            setSuccess(true);
            setTimeout(()=>{
                setSuccess(false);
                navigate("/login");
            },1000)
            // navigate("/login");
        }catch(err){
            setLoading(false);
            message.error("invalid request")

        }
    }
    //if user already logged in then to prevent this page from opening until logged out
    useEffect(() => {
        if(localStorage.getItem('user')){
            navigate("/")
        }
    },[navigate])
    return (
        <div className="r-page">
            <motion.div className="authheading"
                        initial={{x: 0, opacity: 1}}
                        animate={{x: 0, opacity: 1}}
                        transition={{duration: 0.5, delay: 0.2}}>
                <h1>FinSmart</h1>
            </motion.div>
            <motion.div className="register-page"
                        initial={{x: 0, opacity: 0}}
                        animate={{x: 0, opacity: 1}}
                        transition={{duration: 1, delay: 0.2}}>
                {loading && <Loading/>}
                {success && <SuccessAuth/>}
                <Form layout="vertical" onFinish={submitHandler}>
                    <h1>Register</h1>
                    <Form.Item label="Name" name="name">
                        <Input placeholder="enter name"/>
                    </Form.Item>
                    <Form.Item label="Email" name="email">
                        <Input type="email" placeholder="enter email"/>
                    </Form.Item>
                    <Form.Item label="Password" name="password">
                        <Input type="password" placeholder="create password"/>
                    </Form.Item>
                    <div className="d-flex justify-content-between">
                        <h7>Already registered? <Link to="/login">Login</Link></h7>
                    </div>
                    <div className="d-flex justify-content-around p-2">
                        <button className="btn btn-primary">Register</button>
                    </div>
                </Form>
            </motion.div>
        </div>
    )
}

export default Register;