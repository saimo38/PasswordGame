interface SequenceResult {
    isValid: boolean;
    count: number;
}

export const CharacterSequenceValidator = (password: string): SequenceResult => {
    const regex = /[a-z][A-Z][0-9][!@#$%^&*]/g;
    const matches = password.match(regex);
    const count = matches ? matches.length : 0;

    return {
        isValid: count > 0,
        count: count
    }
}