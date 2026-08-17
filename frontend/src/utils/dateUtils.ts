export const formatDateTime = (dateStr?: string): string => {
  if (!dateStr) return '';
  try {
    if (!dateStr.endsWith('Z') && !/[+-]\d{2}:\d{2}$/.test(dateStr)) {
      const parts = dateStr.split('T');
      if (parts.length === 2) {
        const [year, month, day] = parts[0].split('-');
        const timePart = parts[1].substring(0, 5); // HH:mm
        return `${timePart} ngày ${day}/${month}/${year}`;
      }
    }
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
};

export const formatForDatetimeLocal = (isoStr?: string): string => {
  if (!isoStr) return '';
  try {
    if (!isoStr.endsWith('Z') && !/[+-]\d{2}:\d{2}$/.test(isoStr)) {
      const parts = isoStr.split('T');
      if (parts.length === 2) {
        const datePart = parts[0];
        const timePart = parts[1].substring(0, 5); // HH:mm
        return `${datePart}T${timePart}`;
      }
    }
    const d = new Date(isoStr);
    if (isNaN(d.getTime())) return '';
    const pad = (n: number) => (n < 10 ? '0' + n : n);
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(
      d.getMinutes()
    )}`;
  } catch {
    return '';
  }
};

export const formatToLocalISO = (datetimeLocalStr?: string): string | undefined => {
  if (!datetimeLocalStr) return undefined;
  if (datetimeLocalStr.length === 16) {
    return `${datetimeLocalStr}:00`;
  }
  return datetimeLocalStr;
};
