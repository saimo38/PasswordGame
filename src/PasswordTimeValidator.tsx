interface TimeResult {
    isValid: boolean;
    duration: number;
}

export const PasswordTimeValidator = (password: string, startTime: number | null): TimeResult => {
    if (!startTime || password.length === 0) return { isValid: false, duration: 0 };

    const currentTime = Date.now();
    const durationInSeconds = (currentTime - startTime) / 1000;

    const isValid = durationInSeconds >= 2;
    console.log("Čas:", durationInSeconds, "Je validní?:", isValid);
    return {
        isValid: isValid,
        duration: durationInSeconds
    };
};