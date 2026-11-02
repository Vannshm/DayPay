export const getQuerryString = (value) => {
    if (typeof value !== "string" || value.trim() === "") {
        return undefined;
    }
    return value.trim();
};
export const parseDateOnly = (value) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return null;
    }
    const date = new Date(`${value}T00:00:00.000Z`);
    if (Number.isNaN(date.getTime()) ||
        date.toISOString().slice(0, 10) !== value) {
        return null;
    }
    return date;
};
//# sourceMappingURL=request-handeler.js.map