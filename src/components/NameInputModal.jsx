import { useState } from 'react';
import './NameInputModal.css'

export default function NameInputModal({ isOpen, onSubmit}) {
    const [name, setName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name.trim()) {
            onSubmit(name.trim());
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Welcome! 👋</h2>
                <p>Please enter your name to join this event</p>
                <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoFocus
                    className="name-input"
                />
                <button 
                    type="submit" 
                    className="submit-button"
                    disabled={!name.trim()}
                >
                    Continue
                </button>
                </form>
            </div>
        </div>
    );
}