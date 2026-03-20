export const formatDepartureDate = (dateStr) => {
    if (!dateStr) return "N/A";

    // If backend returns a naive ISO string, append Z to force UTC parsing
    let cleanDateStr = dateStr;
    if (cleanDateStr && !cleanDateStr.includes('Z') && !cleanDateStr.includes('+')) {
        cleanDateStr += 'Z';
    }

    const date = new Date(cleanDateStr);
    if (isNaN(date)) return "Invalid Date";

    const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    };

    return date.toLocaleString('en-US', options);
};
