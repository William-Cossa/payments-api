export function generateOrderId() {
    const prefix = Math.random().toString(36).substring(2, 7).toUpperCase();
    const timestamp = Date.now();
    return `${prefix}${timestamp}`;
}
