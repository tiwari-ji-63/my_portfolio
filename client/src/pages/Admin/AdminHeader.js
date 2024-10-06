import React from 'react'
import {Form, message} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {HideLoading, ShowLoading} from "../../redux/rootSlice";
import axios from "axios";
import SectionTitle from "../../components/SectionTitle";

function AdminHeader() {
    const dispatch = useDispatch();
    const {portfolioData} = useSelector((state) => state.root);
    const onFinish = async (values) => {
        try {
            dispatch(ShowLoading())
            const response = await axios.post('/api/portfolio/update-headers', {
                ...values,
                _id: portfolioData.headers._id
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
            <SectionTitle title="Admin Header Management" />
            <Form onFinish={onFinish} layout="vertical" initialValues={portfolioData.headers}>
                <Form.Item name="firstLetter" label="First Letter of Header ">
                    <input placeholder="First Letter"/>
                </Form.Item>
                <Form.Item name="middleLetter" label="Middle Letter of Header">
                    <input placeholder="Middle Letter"/>
                </Form.Item>
                <Form.Item name="lastLetter" label="Last Letter of Header">
                    <input placeholder="Last Letter"/>
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

export default AdminHeader