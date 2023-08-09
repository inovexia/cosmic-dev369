import BASE_URL from "../../../Utils/baseUrl";
import token from "../../../Utils/token";
import Network from "../../../Utils/network";

const UserDetails = async (userId) => {
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);
  myHeaders.append("Network", `${Network}`);

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  try {
    const response = await fetch(
      `${BASE_URL}/users/view/${userId}`,
      requestOptions
    );
    const result = await response.json();
    return result.payload;
  } catch (error) {
    console.log("Error fetching user data:", error);
    return null;
  }
};

export default UserDetails;
