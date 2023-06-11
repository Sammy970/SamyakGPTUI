import React from "react";
import { Modal, Button, FloatingLabel, Form } from 'react-bootstrap';

import './SettingsModal.css';

const SettingsModal = ({ isOpen, onClose, setSettingOptions, settingOptions }) => {
    const handleModelChange = (e) => {
        setSettingOptions((prevOptions) => ({
            ...prevOptions,
            model: e.target.value,
        }));
    };

    const handleTypeChange = (e) => {
        setSettingOptions((prevOptions) => ({
            ...prevOptions,
            type: e.target.value,
        }));
    };

    const handlePluginChange = (e) => {
        setSettingOptions((prevOptions) => ({
            ...prevOptions,
            plugin: e.target.value,
        }));
    };

    return (
        <Modal show={isOpen} onHide={onClose} backdrop="static" centered>
            <Modal.Header closeButton>
                <Modal.Title>Settings</Modal.Title>
            </Modal.Header>
            <Modal.Body className="settings-modal-body">
                <div>
                    <FloatingLabel controlId="floatingSelectModel" label="Select Model">
                        <Form.Select
                            aria-label="Floating label select example"
                            defaultValue={settingOptions.model}
                            onChange={handleModelChange}
                        >
                            <option>Open this Select Model</option>
                            <option value="gpt-3.5-turbo">GPT 3.5 Turbo</option>
                            <option value="gpt-4">GPT 4</option>
                        </Form.Select>
                    </FloatingLabel>
                </div>

                <div>
                    <FloatingLabel controlId="floatingSelectType" label="Select Type">
                        <Form.Select
                            aria-label="Floating label select example"
                            defaultValue={settingOptions.type}
                            onChange={handleTypeChange}
                        >
                            <option >Open this Select Type</option>
                            <option value="chat">Chat</option>
                            <option value="text">Text Completion</option>
                            <option value="image">Image Generation</option>
                        </Form.Select>
                    </FloatingLabel>
                </div>

                <div>
                    <FloatingLabel controlId="floatingSelectType" label="Select Plugin">
                        <Form.Select
                            aria-label="Floating label select example"
                            defaultValue={settingOptions.plugin}
                            onChange={handlePluginChange}
                        >
                            <option >Open this Select Plugin</option>
                            <option value="off">OFF</option>
                            <option value="prompt-perfect">prompt-perfect</option>
                        </Form.Select>
                    </FloatingLabel>
                </div>

                {/* Add more dropdown components or other settings options here */}
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={onClose}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default SettingsModal;
