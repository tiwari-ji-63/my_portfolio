import React from 'react'
import {useDispatch, useSelector} from "react-redux";
import {Form, message, Modal} from "antd";
import {HideLoading, ReloadData, ShowLoading} from "../../redux/rootSlice";
import axios from "axios";
import SectionTitle from "../../components/SectionTitle";

function AdminEducation() {
    const dispatch = useDispatch();
    const [showAddEditModal, setShowAddEditModal] = React.useState(false);
    const [selectedItemForEdit, setSelectedItemForEdit] = React.useState(null);
    const {portfolioData} = useSelector((state) => state.root);
    const {educations} = portfolioData;
    const [type, setType] = React.useState("add");

    const onFinish = async (values) => {
        try {
            dispatch(ShowLoading());
            let response;
            if (selectedItemForEdit) {
                response = await axios.post('/api/portfolio/update-education', {
                    _id: selectedItemForEdit._id,
                    ...values
                });
            } else {
                response = await axios.post('/api/portfolio/add-education', values);
            }

            dispatch(HideLoading());
            if (response.data.success) {
                message.success(response.data.message);
                setShowAddEditModal(false);
                setSelectedItemForEdit(null);
                dispatch(ReloadData(true));
            } else {
                message.error(response.data.message);
            }
        } catch (error) {
            dispatch(HideLoading());
            message.error(error.message);
        }
    };

    const onDelete = async (item) => {
        try {
            dispatch(ShowLoading());
            const response = await axios.post('/api/portfolio/delete-education', {
                _id: item._id
            });
            dispatch(HideLoading());
            if (response.data.success) {
                message.success(response.data.message);
                dispatch(ReloadData(true));
            } else {
                message.error(response.data.message);
            }
        } catch (error) {
            dispatch(HideLoading());
            message.error(error.message);
        }
    };

    return (
        <div>
            <SectionTitle title="Admin Education Management" />
            <div className="flex justify-end mb-4">
                <button className="bg-primary px-5 py-2 text-white mt-5 rounded font-bold hover:bg-secondary"
                        onClick={() => {
                            setSelectedItemForEdit(null);
                            setType("add");
                            setShowAddEditModal(true);
                        }}>Add Education
                </button>
            </div>
            <div className="grid grid-cols-4 gap-5 sm:grid-cols-1">
                {educations.map((education) => (
                    <div key={education._id} className="shadow border-2 p-5 border-tertiary hover:border-secondary flex flex-col gap-5">
                        <h1 className="text-primary text-xl font-bold">{education.title}</h1>
                        <hr/>
                        <h1>Institution : {education.issuer}</h1>
                        <h1>Description : {education.description}</h1>
                        <div className="flex justify-end gap-5 mt-5">
                            <button
                                className="border-2 border-primary bg-secondary text-primary font-bold px-10 py-2 rounded  hover:border-tertiary hover:text-tertiary"
                                onClick={() => {
                                    onDelete(education);
                                }}
                            >Delete
                            </button>
                            <button
                                className="border-2 border-primary bg-tertiary text-secondary font-bold px-10 py-2 rounded  hover:border-secondary hover:text-primary"
                                onClick={() => {
                                    setSelectedItemForEdit(education);
                                    setType("edit");
                                    setShowAddEditModal(true);
                                }}
                            >Edit
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {
                (type === "add" || selectedItemForEdit) && <Modal open={showAddEditModal}
                                                   title={selectedItemForEdit ? "Edit Education" : "Add Education"}
                                                   footer={null}
                                                   onCancel={() => {
                                                       setShowAddEditModal(false);
                                                       setSelectedItemForEdit(null);
                                                   }}
                >
                    <Form layout="vertical" onFinish={onFinish}
                          initialValues={selectedItemForEdit || {}}
                    >
                        <Form.Item name="title" label="Degree or Cource Name">
                            <input placeholder="Degree or Cource Name"/>
                        </Form.Item>
                        <Form.Item name="issuer" label="Institution Name">
                            <input placeholder="Institution Name"/>
                        </Form.Item>
                        <Form.Item name="description" label="Description">
                            <input placeholder="Description"/>
                        </Form.Item>

                        <div className="flex justify-end gap-5">
                            <button
                                type="button"
                                className="border-2 border-primary bg-secondary text-primary font-bold px-10 py-2 rounded  hover:border-tertiary hover:text-tertiary"
                                onClick={() => {
                                    setShowAddEditModal(false);
                                    setSelectedItemForEdit(null);
                                }}
                            >Cancel
                            </button>
                            <button
                                type="submit"
                                className="border-2 border-primary bg-tertiary text-secondary font-bold px-10 py-2 rounded  hover:border-secondary hover:text-primary"
                            >{selectedItemForEdit ? "Update" : "Add"}
                            </button>
                        </div>
                    </Form>
                </Modal>
            }

        </div>
    )
}

export default AdminEducation;