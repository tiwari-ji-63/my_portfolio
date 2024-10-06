import React from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Form, message, Modal } from "antd";
import { HideLoading, ReloadData, ShowLoading } from "../../redux/rootSlice";
import axios from "axios";
import SectionTitle from "../../components/SectionTitle";

function AdminCertificates() {
    const dispatch = useDispatch();
    const [showAddEditModal, setShowAddEditModal] = React.useState(false);
    const [selectedItemForEdit, setSelectedItemForEdit] = React.useState(null);
    const { portfolioData } = useSelector((state) => state.root);
    const { certificates } = portfolioData;
    const [type, setType] = React.useState("add");

    const onFinish = async (values) => {
        try {
            dispatch(ShowLoading());
            let response;
            if (selectedItemForEdit) {
                response = await axios.post('/api/portfolio/update-certificate', {
                    _id: selectedItemForEdit._id,
                    ...values
                });
            } else {
                response = await axios.post('/api/portfolio/add-certificate', values);
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
            const response = await axios.post('/api/portfolio/delete-certificate', {
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
            <SectionTitle title="Admin Certificate Management" />
            <div className="flex justify-end mb-4">
                <button className="bg-primary px-5 py-2 text-white mt-5 rounded font-bold hover:bg-secondary"
                        onClick={() => {
                            setSelectedItemForEdit(null);
                            setType("add");
                            setShowAddEditModal(true);
                        }}>Add Certificate
                </button>
            </div>
            <div className="grid grid-cols-3 gap-5 sm:grid-cols-1">
                {certificates.map((certificate) => (
                    <div key={certificate._id}
                         className="shadow border-2 p-5 border-tertiary hover:border-secondary flex flex-col gap-5">
                    <h1 className="text-primary text-xl font-bold">{certificate.title}</h1>
                        <hr/>
                        <img src={certificate.image} alt=" " className="w-80 h-60"/>
                        <h1>Certificate Name : {certificate.title}</h1>
                        <h1>IssueDate : {certificate.issueDate}</h1>
                        <h1 className="scrollable-description border-2 border-blue-500 bg-gray-100 p-3 rounded-lg shadow-lg">
                            Description : {certificate.description}
                        </h1>

                        <div className="flex justify-end gap-5 mt-5">
                            <button
                                className="border-2 border-primary bg-secondary text-primary font-bold px-10 py-2 rounded  hover:border-tertiary hover:text-tertiary"
                                onClick={() => {
                                    onDelete(certificate);
                                }}
                            >Delete
                            </button>
                            <button
                                className="border-2 border-primary bg-tertiary text-secondary font-bold px-10 py-2 rounded  hover:border-secondary hover:text-primary"
                                onClick={() => {
                                    setSelectedItemForEdit(certificate);
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
                                                                  title={selectedItemForEdit ? "Edit Certificate" : "Add Certificate"}
                                                                  footer={null}
                                                                  onCancel={() => {
                                                                      setShowAddEditModal(false);
                                                                      setSelectedItemForEdit(null);
                                                                  }}
                >
                    <Form layout="vertical" onFinish={onFinish}
                            initialValues={selectedItemForEdit || {}}
                    >
                        <Form.Item name="title" label="Certificate Name or Issure" rules={[]}>
                            <input placeholder="Certificate Name"/>
                        </Form.Item>
                        <Form.Item name="issueDate" label="Issue Date" rules={[]}>
                            <input placeholder="Issue Date"/>
                        </Form.Item>
                        <Form.Item name="image" label="Certificate Image URL" rules={[]}>
                            <input placeholder="Certificate Image"/>
                        </Form.Item>
                        <Form.Item name="description" label="Description" rules={[]}>
                            <textarea className="scrollable-description" placeholder="Description"/>
                        </Form.Item>
                        {/*<Form.Item name="github_link" label="GitHub Link" rules={[]}>*/}
                        {/*    <input placeholder="GitHub Link"/>*/}
                        {/*</Form.Item>*/}

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

export default AdminCertificates;