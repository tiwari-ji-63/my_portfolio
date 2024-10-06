import React from 'react'
import {Form, message} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {HideLoading, ShowLoading} from "../../redux/rootSlice";
import axios from "axios";
import SectionTitle from "../../components/SectionTitle";

function AdminLeftSider() {
    const dispatch = useDispatch();
    const {portfolioData} = useSelector((state) => state.root);
    const onFinish = async (values) => {
        try {
            dispatch(ShowLoading())
            const response = await axios.post('/api/portfolio/update-leftSides', {
                ...values,
                _id: portfolioData.leftSides._id
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
            <SectionTitle title="Admin Social Media Link  Management" />
            <Form onFinish={onFinish} layout="vertical" initialValues={portfolioData.leftSides}>
                <Form.Item name="email" label="Email id (Remove Email in Box Including 'mailto:' ) ">
                    <input placeholder="Email id"/>
                </Form.Item>
                <Form.Item name="phone" label="Mobile Number (Please Enter 'tel:+91' then Mobile Number )">
                    <input placeholder="Mobile Number"/>
                </Form.Item>
                <Form.Item name="github" label="GitHub URL Include https:// ">
                    <input placeholder="GitHub URL"/>
                </Form.Item>
                <Form.Item name="linkedin" label="LinkedIn URL Include https:// ">
                    <input placeholder="LinkedIn URL"/>
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

export default AdminLeftSider