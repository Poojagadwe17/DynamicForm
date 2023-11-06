import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import FormField from './components/FormField';
import styles from './App.module.css';

Modal.setAppElement('#root');

// Function to serialize form configuration to JSON
function serializeFormConfiguration(formFields) {
  const serializedForm = formFields.map((field) => ({
    label: field.label,
    type: field.type,
    options: field.options,
  }));
  return JSON.stringify(serializedForm);
}

function deserializeFormConfiguration(jsonData) {
  try {
    const parsedData = JSON.parse(jsonData);
    const formFields = parsedData.map((fieldData) => ({
      label: fieldData.label,
      type: fieldData.type,
      options: fieldData.options,
      value: '',
    }));
    return formFields;
  } catch (error) {
    console.error('Error deserializing JSON data:', error);
    return [];
  }
}




function App() {
  const [formFields, setFormFields] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFieldType, setSelectedFieldType] = useState('text');
  const [labelName, setLabelName] = useState('');
  const [optionName, setOptionName] = useState('');
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openSuccessModal = () => {
    setIsSuccessModalOpen(true);
  };

  const closeSuccessModal = () => {
    setIsSuccessModalOpen(false);
  };
  const addFormField = () => {
    const newField = {
      label: labelName,
      type: selectedFieldType,
      options: selectedFieldType === 'dropdown' ? dropdownOptions : [],
      value: '',
    };

    setFormFields([...formFields, newField]);
    closeModal();
    setLabelName('');
    setOptionName('');
    setDropdownOptions([]);
  };

  const addOption = () => {
    if (optionName.trim() !== '') {
      setDropdownOptions([...dropdownOptions, optionName]);
      setOptionName('');
    }
  };

  const removeFormField = (index) => {
    const updatedFormFields = [...formFields];
    updatedFormFields.splice(index, 1);
    setFormFields(updatedFormFields);
  };

  const updateFormField = (index, field) => {
    const updatedFormFields = [...formFields];
    updatedFormFields[index] = field;
    setFormFields(updatedFormFields);
  };

  const validateForm = () => {
    // Validate each form field
    const errors = {};
    formFields.forEach((field, index) => {
      if (field.value.trim() === '' && field.type !== 'checkbox') {
        errors[index] = 'Field is required';
      }
      if (field.label.trim() === '') {
        errors[index] = 'Label is required';

      }

    });
    setFormErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      openSuccessModal()
      setIsSuccessModalOpen(true);
    }
  };

  // Function to save the form configuration
  const saveFormConfiguration = () => {
    const jsonData = serializeFormConfiguration(formFields);
    localStorage.setItem('formConfig', jsonData);
    alert("Form Configuration Saved")// Save to local storage
  };

  // Function to load the form configuration
  const loadFormConfiguration = () => {
    const jsonData = localStorage.getItem('formConfig'); 
    if (jsonData) {
      const loadedFormFields = deserializeFormConfiguration(jsonData);
      setFormFields(loadedFormFields);
    }
  };

  useEffect(() => {
    loadFormConfiguration();
  }, []);




  return (
    <div className={styles.app}>
      <h1>Dynamic Form Generator</h1>

      <button onClick={openModal} className={styles.addButton}>
        Add Form Field
      </button>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Add Form Field"
        className={styles.modal}
        overlayClassName={styles.overlay}
      >

        <h2>Add Form Field</h2>
        <label>Field Label:</label>
        <input
          type="text"
          value={labelName}
          onChange={(e) => setLabelName(e.target.value)}
        />
        <h3>Select Field Type</h3>
        <select value={selectedFieldType} onChange={(e) => setSelectedFieldType(e.target.value)}>
          <option value="text">Text Input</option>
          <option value="textarea">Text Area</option>
          <option value="dropdown">Dropdown</option>
          <option value="checkbox">Checkbox</option>
          <option value="radio">Radio Button</option>
        </select>

        {selectedFieldType === 'dropdown' && (
          <div>
            <label>Dropdown Options:</label>
            <input
              type="text"
              value={optionName}
              onChange={(e) => setOptionName(e.target.value)}
            />
            <button onClick={addOption} className={styles.addButton}>
              Add Option
            </button>
          </div>
        )}

        <button onClick={addFormField} className={styles.addOptionButton}>
          Add Field
        </button>
        <button onClick={closeModal} className={styles.closeButton}>
          Cancel
        </button>
      </Modal>
      <Modal
        isOpen={isSuccessModalOpen}
        onRequestClose={closeSuccessModal}
        contentLabel="Form Submitted Successfully"
        className={styles.modal}
        overlayClassName={styles.overlay}
      >
        <h2>Form Submitted Successfully!</h2>
        <button onClick={closeSuccessModal} className={styles.okButton}>
          OK
        </button>
      </Modal>
      {formFields.map((field, index) => (

        <div key={index} className={styles.formField}>
          <FormField
            label={field.label}
            type={field.type}
            options={field.options}
            value={field.value}
            onChange={(e) => {
              const updatedField = { ...field, value: e.target.value };
              updateFormField(index, updatedField);
            }}
            errorMessage={formErrors[`label-${index}`] || formErrors[`options-${index}`]}
          />

          <span className={styles.crossIcon} onClick={() => removeFormField(index)}>
            &#10006; 
          </span>
          {formErrors[index] && (
            <span className={styles.errorText}>{formErrors[index]}</span>
          )}

        </div>
      ))}
      <div className={styles.buttonRow}>
        {formFields.length > 0 && (
          <button onClick={handleSubmit} className={styles.submitButton}>
            Submit Form
          </button>
        )}
        <button onClick={saveFormConfiguration} className={styles.saveButton}>
          Save Form Configuration
        </button>
        <button onClick={loadFormConfiguration} className={styles.saveButton}>
          Load Form Configuration
        </button>
      </div>
    </div>
  );
}

export default App;
