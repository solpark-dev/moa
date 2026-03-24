export function formatPhone(phone = "") {
  const digits = phone.replace(/[^0-9]/g, "");
  if (digits.length !== 11) return phone;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
}
