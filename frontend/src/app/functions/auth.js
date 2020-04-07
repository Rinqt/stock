export const getToken  = (type) => {
    const userInfo = localStorage.getItem("userInfo");
    return (userInfo === null ? userInfo : JSON.parse(userInfo)[type]);
}