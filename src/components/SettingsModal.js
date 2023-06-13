import React from "react";
import { Modal, Button, FloatingLabel, Form } from 'react-bootstrap';

import './SettingsModal.css';

const SettingsModal = ({ isOpen, onClose, setSettingOptions, settingOptions, setKeyUrlEntered, setIsLoading }) => {
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
                <Modal.Title className="settings-modal-title">Settings</Modal.Title>
            </Modal.Header>
            <Modal.Body className="settings-modal-body">
                <div>
                    <FloatingLabel className="test" controlId="floatingSelectModel" label="Select Model">
                        <Form.Select
                            aria-label="Floating label select example"
                            defaultValue={settingOptions.model}
                            onChange={handleModelChange}
                        >
                            <option>Open this Select Model</option>
                            <option value="gpt-3.5-turbo">GPT 3.5 Turbo</option>
                            <option disabled value="gpt-4">GPT 4</option>
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
                            <option disabled value="text">Text Completion</option>
                            <option disabled value="image">Image Generation</option>
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
                            <option disabled>Open this Select Plugin</option>
                            <option value="off">OFF</option>
                            <option value="prompt-perfect">Prompt Perfect</option>
                            <option value="web-search">Web Search</option>
                            <option value="web-pilot">Web Pilot</option>
                        </Form.Select>
                    </FloatingLabel>
                </div>

                <Button className="change-API-button" onClick={() => {
                    setKeyUrlEntered(false)
                    onClose()
                    setIsLoading(true)
                }}>Change API Endpoint and KEY</Button>


                {/* Add more dropdown components or other settings options here */}
            </Modal.Body>
            <Modal.Footer style={{ backgroundColor: '#40414F' }}>
                <Button className="close-button" onClick={onClose}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default SettingsModal;
