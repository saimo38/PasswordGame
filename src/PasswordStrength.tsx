interface PasswordStrengthProps {
    password: string;
    passwordStrength: 'Zadejte heslo' | 'Velmi slabe' | 'Slabe' | 'Stredni' | 'Silne';
    sequenceResult: { isValid: boolean; count: number };
    timeResult: { isValid: boolean; duration: number };
    flagResult: { isValid: boolean; countryCode: string };
}

const getStrengthMeta = (passwordStrength: PasswordStrengthProps['passwordStrength']) => {
    switch (passwordStrength) {
        case 'Velmi slabe':
            return { label: 'Velmi slabe', color: 'var(--danger-color)', width: '25%', badge: 'text-bg-danger' };
        case 'Slabe':
            return { label: 'Slabe', color: 'var(--warning-color)', width: '50%', badge: 'text-bg-warning' };
        case 'Stredni':
            return { label: 'Stredni', color: 'var(--primary-color)', width: '75%', badge: 'text-bg-primary' };
        case 'Silne':
            return { label: 'Silne', color: 'var(--success-color)', width: '100%', badge: 'text-bg-success' };
        default:
            return { label: 'Zadejte heslo', color: 'var(--muted)', width: '0%', badge: 'bg-secondary-subtle text-secondary-emphasis' };
    }
};

export const PasswordStrength = ({ password, passwordStrength, sequenceResult, timeResult, flagResult }: PasswordStrengthProps) => {
    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*]/.test(password);
    const strength = getStrengthMeta(passwordStrength);

    const criteria = [
        { label: 'Alespon 8 znaku', isValid: hasMinLength },
        { label: 'Velke pismeno', isValid: hasUpperCase },
        { label: 'Cislo', isValid: hasNumber },
        { label: 'Specialni znak', isValid: hasSpecialChar },
    ];

    const extraCriteria = [
        {
            label: 'Sekvence (male-Velke-1-!)',
            value: `${sequenceResult.count}x nalezeno`,
            isValid: sequenceResult.isValid,
        },
        {
            label: 'Rychlost zadani',
            value: `${timeResult.duration.toFixed(1)} s${password.length > 0 && !timeResult.isValid ? ' (Podezreni na bota)' : ''}`,
            isValid: timeResult.isValid,
        },
        {
            label: 'Zkratka statu podle vlajky',
            value: flagResult.isValid ? `${flagResult.countryCode} nalezena` : `${flagResult.countryCode} chybi`,
            isValid: flagResult.isValid,
        },
    ];

    return (
        <section>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="h5 mb-0">Vyhodnoceni hesla</h2>
                <span className={`badge ${strength.badge}`}>{strength.label}</span>
            </div>

            <div className="progress mb-4" role="progressbar" aria-label="Sila hesla" aria-valuemin={0} aria-valuemax={100} aria-valuenow={parseInt(strength.width, 10)}>
                <div className="progress-bar" style={{ width: strength.width, backgroundColor: strength.color }} />
            </div>

            <div className="list-group mb-4">
                {criteria.map((criterion) => (
                    <div key={criterion.label} className={`list-group-item ${criterion.isValid ? 'is-valid' : 'is-invalid'}`}>
                        {criterion.label}
                    </div>
                ))}
            </div>

            <h3 className="h6 mb-3">Dalsi kriteria</h3>
            <div className="list-group">
                {extraCriteria.map((criterion) => (
                    <div key={criterion.label} className={`list-group-item ${criterion.isValid ? 'is-valid' : 'is-invalid'}`}>
                        {criterion.label}: {criterion.value}
                    </div>
                ))}
            </div>
        </section>
    );
};
