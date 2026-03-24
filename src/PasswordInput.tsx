import { useState } from 'react';

interface PasswordInputProps {
    password: string;
    setPassword: (value: string) => void;
}

export const PasswordInput = ({ password, setPassword }: PasswordInputProps) => {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <div className="mb-4">
            <label htmlFor="password-input" className="form-label fw-semibold">
                Heslo
            </label>

            <div className="input-group input-group-lg">
                <input
                    id="password-input"
                    className="form-control"
                    type={isVisible ? 'text' : 'password'}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Zadejte heslo"
                    aria-describedby="password-help"
                />
                <button
                    type="button"
                    className="btn toggle-button"
                    onClick={() => setIsVisible((current) => !current)}
                >
                    {isVisible ? 'Skryt' : 'Zobrazit'}
                </button>
            </div>

            <div id="password-help" className="form-text mt-2">
                Heslo se hodnoti podle delky, typu znaku, sekvence i rychlosti zadani.
            </div>
        </div>
    );
};
