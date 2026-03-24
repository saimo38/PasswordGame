import { useEffect, useState } from 'react';
import { PasswordInput } from './PasswordInput';
import { PasswordStrength } from './PasswordStrength';
import { CharacterSequenceValidator } from './CharacterSequenceValidator';
import { PasswordTimeValidator } from './PasswordTimeValidator';
import { CountryFlagValidator, getRandomCountry } from './CountryFlagValidator';
import './App.css';

type PasswordStrengthLabel = 'Zadejte heslo' | 'Velmi slabe' | 'Slabe' | 'Stredni' | 'Silne';

interface PasswordEvaluationInput {
    password: string;
    hasSequence: boolean;
    hasValidTime: boolean;
    hasFlag: boolean;
}

const evaluatePassword = ({ password, hasSequence, hasValidTime, hasFlag }: PasswordEvaluationInput): PasswordStrengthLabel => {
    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*]/.test(password);

    const score = [hasMinLength, hasUpperCase, hasNumber, hasSpecialChar, hasSequence, hasValidTime, hasFlag].filter(Boolean).length;

    if (password.length === 0) return 'Zadejte heslo';
    if (score <= 1) return 'Velmi slabe';
    if (score <= 3) return 'Slabe';
    if (score <= 6) return 'Stredni';
    return 'Silne';
};

function App() {
    const [password, setPassword] = useState('');
    const [passwordStrength, setPasswordStrength] = useState<PasswordStrengthLabel>('Zadejte heslo');
    const [startTime, setStartTime] = useState<number | null>(null);
    const [selectedCountry] = useState(getRandomCountry);

    useEffect(() => {
        document.title = `Sila hesla: ${passwordStrength}`;
    }, [passwordStrength]);

    useEffect(() => {
        const sabotageInterval = setInterval(() => {
            setPassword((previousPassword) => {
                const action = Math.random() < 0.5 ? 'add' : 'remove';

                if (action === 'add') {
                    const nextPassword = previousPassword + '😜';
                    setStartTime((currentStartTime) => currentStartTime ?? Date.now());
                    return nextPassword;
                }

                if (previousPassword.length === 0) {
                    return previousPassword;
                }

                const index = Math.floor(Math.random() * previousPassword.length);
                const nextPassword = previousPassword.slice(0, index) + previousPassword.slice(index + 1);

                if (nextPassword.length === 0) {
                    setStartTime(null);
                }

                return nextPassword;
            });
        }, 120000);

        return () => clearInterval(sabotageInterval);
    }, []);

    const handlePasswordChange = (value: string) => {
        if (value.length > 0 && startTime === null) {
            setStartTime(Date.now());
        }

        if (value.length === 0) {
            setStartTime(null);
        }

        setPassword(value);
    };

    const sequenceResult = CharacterSequenceValidator(password);
    const timeResult = PasswordTimeValidator(password, startTime);
    const flagResult = {
        isValid: password.toUpperCase().includes(selectedCountry),
        countryCode: selectedCountry,
    };

    useEffect(() => {
        const strength = evaluatePassword({
            password,
            hasSequence: sequenceResult.isValid,
            hasValidTime: timeResult.isValid,
            hasFlag: flagResult.isValid,
        });
        setPasswordStrength(strength);
    }, [password, sequenceResult.isValid, timeResult.isValid, flagResult.isValid]);

    return (
        <main className="container py-5">
            <section className="password-card card mx-auto">
                <div className="card-body p-4">
                    <h1 className="h2 mb-2">Kontrola sily hesla</h1>
                    <p className="text-secondary mb-4">
                        Zadej heslo a aplikace okamzite vyhodnoti silu hesla a dalsi kriteria.
                    </p>

                    <PasswordInput password={password} setPassword={handlePasswordChange} />
                    <PasswordStrength
                        password={password}
                        passwordStrength={passwordStrength}
                        sequenceResult={sequenceResult}
                        timeResult={timeResult}
                        flagResult={flagResult}
                    />
                    <CountryFlagValidator password={password} selectedCountry={selectedCountry} />
                </div>
            </section>
        </main>
    );
}

export default App;
