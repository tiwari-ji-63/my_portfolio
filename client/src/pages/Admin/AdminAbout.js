import React from 'react'
import {Form, message} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {HideLoading, ShowLoading} from "../../redux/rootSlice";
import axios from "axios";
import SectionTitle from "../../components/SectionTitle";

function AdminAbout() {
    const dispatch = useDispatch();
    const {portfolioData} = useSelector((state) => state.root);
    const onFinish = async (values) => {
        try {
            const tempskills = values.skills.split(",");
            values.skills = tempskills;
            dispatch(ShowLoading())
            const response = await axios.post('/api/portfolio/update-about', {
                ...values,
                _id: portfolioData.about._id
            });
            dispatch(HideLoading())
            if (response.data.success) {
                message.success(response.data.message)
            } else {
                message.error(response.data.message)
            }
        } catch (error) {
            message.error(error.message)

        }
    };
    return (
        <div>
            <SectionTitle title="Admin About Management" />
            <Form onFinish={onFinish} layout="vertical" initialValues={{
                ...portfolioData.about,
                skills: portfolioData.about.skills.join(" , "),
            }}>
                <Form.Item name="lottieURL" label="Lottie URL">
                    <input placeholder="Lottie URL"/>
                </Form.Item>
                <Form.Item name="description1" label="Description First">
                    <textarea className="scrollable-description" placeholder="Description First"/>
                </Form.Item>
                <Form.Item name="description2" label="Description Second">
                    <textarea className="scrollable-description" placeholder="Description Second"/>
                </Form.Item>
                <Form.Item name="message" label="Message">
                    <textarea className="scrollable-description" placeholder="Message"/>
                </Form.Item>
                <Form.Item name="skills" label="Recently work on Skill ( Separated by (Comma , ) )  ">
                    <textarea placeholder="Recently work on Skill"/>
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

export default AdminAbout