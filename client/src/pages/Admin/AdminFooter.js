import React from 'react'
import {Form, message} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {HideLoading, ShowLoading} from "../../redux/rootSlice";
import axios from "axios";
import SectionTitle from "../../components/SectionTitle";

function AdminFooter() {
    const dispatch = useDispatch();
    const {portfolioData} = useSelector((state) => state.root);
    const onFinish = async (values) => {
        try {
            dispatch(ShowLoading())
            const response = await axios.post('/api/portfolio/update-footer', {
                ...values,
                _id: portfolioData.footer._id
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
            <SectionTitle title="Admin Footer Management" />
            <Form onFinish={onFinish} layout="vertical" initialValues={portfolioData.footer}>
                <Form.Item name="firstLine" label="Footer First Line">
                    <input placeholder="Footer First Line"/>
                </Form.Item>
                <Form.Item name="secondLine" label="Footer Second Line">
                    <input placeholder="Footer Second Line"/>
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

export default AdminFooter