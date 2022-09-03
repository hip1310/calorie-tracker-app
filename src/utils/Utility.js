// Check whether user has admin access or not
export const isAdmin = () => {
    const userData = JSON.parse(localStorage.getItem('userInfo'));
    return userData && userData.isAdmin;
}

// Get user data function
export const getUserData = () => {
    return JSON.parse(localStorage.getItem('userInfo'));
}
