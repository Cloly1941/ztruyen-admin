export const getAgeToBirthday = (birthday: Date): number => {
    const today = new Date();
    let age = today.getFullYear() - birthday.getFullYear();
    const monthDiff = today.getMonth() - birthday.getMonth();

    if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthday.getDate())
    ) {
        age--;
    }

    return age;
}

export function isBirthdayValid(date: Date) {
    const today = new Date();

    const minDate = new Date(
        today.getFullYear() - 100,
        today.getMonth(),
        today.getDate()
    );

    const maxDate = new Date(
        today.getFullYear() - 10,
        today.getMonth(),
        today.getDate()
    );

    return date >= minDate && date <= maxDate;
}

export function getDefaultBirthdayMonth() {
    const today = new Date();

    return new Date(
        today.getFullYear() - 10,
        today.getMonth(),
        1
    );
}