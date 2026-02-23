const axios = require('axios');

async function testApi() {
  try {
    // First login to get a token and org ID
    const loginRes = await axios.post("https://api.vocalabstech.com/auth/login", {
      email: "pande.kartik@gmail.com",
      password: "password", // User will need to run this command themselves if password is unknown, or we can check the local storage format
      // Actually, since I don't know the password, let's write a script that can be run in the browser console instead
    });
  } catch (error) {
    console.error(error);
  }
}
