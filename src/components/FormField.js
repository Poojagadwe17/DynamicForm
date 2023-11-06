import React from 'react';
import styles from './FormField.module.css';


const FormField = ({ label, type, options, value, onChange, errorMessage }) => {
    let inputField;

    switch (type) {
        case 'text':
            inputField = <input type="text" value={value} onChange={onChange} />

            break;
        case 'textarea':

            inputField = <textarea value={value} onChange={onChange} />

            break;
        case 'dropdown':
            inputField = (
                <div>
                    <select value={value} onChange={onChange}>
                        {options.map((option, index) => (
                            <option key={index} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                    {errorMessage && <p className="error">{errorMessage}</p>}
                </div>
            );
            break;
        case 'checkbox':

            inputField = (
                <div>
                    <input type="checkbox" checked={value} className={styles.customCheckbox} onChange={onChange} />

                    {errorMessage && <p className="error">{errorMessage}</p>}
                </div>
            );
            break;
        case 'radio':
            inputField = (
                <div>


                    <input type="radio" className={styles.customRadio} checked={value} onChange={onChange} />

                    {errorMessage && <p className="error">{errorMessage}</p>}

                </div>);
            break;
        default:
            inputField = null;
    }

    return (
        <div>
            <label>{label}</label>
            {inputField}

        </div>
    );
};

export default FormField;
