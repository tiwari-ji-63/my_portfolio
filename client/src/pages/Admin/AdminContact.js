import React from 'react'
import {Form, message} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {HideLoading, ShowLoading} from "../../redux/rootSlice";
import axios from "axios";
import AdminCertificates from "./AdminCertificates";
import SectionTitle from "../../components/SectionTitle";

function AdminContact() {
    const dispatch = useDispatch();
    const {portfolioData} = useSelector((state) => state.root);
    const onFinish = async (values) => {
        try {
            dispatch(ShowLoading())
            const response = await axios.post('/api/portfolio/update-contacts', {
                ...values,
                _id: portfolioData.contacts._id
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
            <SectionTitle title="Admin Contact Management" />
            <Form onFinish={onFinish} layout="vertical" initialValues={portfolioData.contacts}>
                <Form.Item name="name" label="Full Name">
                    <input placeholder="Full Name"/>
                </Form.Item>
                <Form.Item name="age" label="Age ">
                    <input placeholder="Age"/>
                </Form.Item>
                <Form.Item name="gender" label="Gender ">
                    <input placeholder="Gender"/>
                </Form.Item>
                <Form.Item name="email" label="Email ">
                    <input placeholder="Email"/>
                </Form.Item>
                <Form.Item name="mobile" label="Mobile ">
                    <input placeholder="Mobile"/>
                </Form.Item>
                <Form.Item name="address" label="Address ">
                    <input placeholder="Address"/>
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

export default AdminContact