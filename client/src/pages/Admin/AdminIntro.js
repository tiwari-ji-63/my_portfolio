import React from 'react'
import {Form, message} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {HideLoading, ShowLoading} from "../../redux/rootSlice";
import axios from "axios";
import SectionTitle from "../../components/SectionTitle";

function AdminIntro() {
    const dispatch = useDispatch();
    const {portfolioData} = useSelector((state) => state.root);
    const onFinish = async (values) => {
        try {
            dispatch(ShowLoading())
            const response = await axios.post('/api/portfolio/update-introduction', {
                ...values,
                _id: portfolioData.introduction._id
            });
            dispatch(HideLoading())
            if (response.data.success){
                message.success(response.data.message)
            }else {
                message.error(response.data.message)
            }
        } catch (error) {
            message.error(error.message)

        }
    };
    return (
        <div>
            <SectionTitle title="Admin Introduction Management" />
            <Form onFinish={onFinish} layout="vertical" initialValues={portfolioData.introduction}>
                <Form.Item name="welcomeText" label="Welcome Text">
                    <input placeholder="Welcome Text"/>
                </Form.Item>
                <Form.Item name="firstName" label="First Name">
                    <input placeholder="First Name"/>
                </Form.Item>
                <Form.Item name="lastName" label="Last Name">
                    <input placeholder="Last Name"/>
                </Form.Item>
                <Form.Item name="jobTitle" label="Job Title">
                    <input placeholder="Job Title"/>
                </Form.Item>
                <Form.Item name="myResume" label="Resume Link URL">
                    <input placeholder="Resume Link URL"/>
                </Form.Item>
                <Form.Item name="description" label="Description">
                    <textarea placeholder="Description"/>
                </Form.Item>
                <div className="flex justify-end w-full">
                    <button
                        className="border-2 border-primary bg-tertiary text-secondary font-bold px-10 py-2 rounded  hover:border-secondary hover:text-primary"
                        type="submit">SAVE
                    </button>
                </div>
            </Form>
        </div>
    )
}

export default AdminIntro