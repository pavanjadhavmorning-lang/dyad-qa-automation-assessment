export function generateUniqueUser() {
  const timestamp = Date.now();

  return {
    firstName: "Pavan",
    lastName: "Jadhav",
    address: "123 Test Street",
    city: "Ahmedabad",
    state: "Gujrat",
    zipCode: "382210",
    phoneNumber: "9876543210",
    ssn: String(timestamp).slice(-9),
    username: `pavan_${timestamp}`,
    password: "Test@12345",
  };
}
