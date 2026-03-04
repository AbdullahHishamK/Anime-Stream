// Auth utility functions using localStorage

const USERS_KEY = 'anime_stream_users';
const CURRENT_USER_KEY = 'anime_stream_current_user';

// Get all users from localStorage
export const getUsers = () => {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
};

// Generate unique ID
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Save a new user
export const saveUser = (userData) => {
  const users = getUsers();
  
  // Check if email already exists
  if (users.some(u => u.email === userData.email)) {
    return { success: false, message: 'Email already registered' };
  }
  
  // Check if username already exists
  if (users.some(u => u.username === userData.username)) {
    return { success: false, message: 'Username already taken' };
  }
  
  // Create user with generated ID
  const user = {
    ...userData,
    id: generateId(),
    myList: [],
    createdAt: new Date().toISOString()
  };
  
  users.push(user);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  return { success: true, message: 'User registered successfully' };
};

// Login user
export const loginUser = (emailOrUsername, password) => {
  const users = getUsers();
  const user = users.find(
    u => (u.email === emailOrUsername || u.username === emailOrUsername) && u.password === password
  );
  
  if (user) {
    // Don't store password in session
    const { password: _, ...userWithoutPassword } = user;
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
    return { success: true, user: userWithoutPassword };
  }
  
  return { success: false, message: 'Invalid email/username or password' };
};

// Get current logged in user
export const getCurrentUser = () => {
  const user = localStorage.getItem(CURRENT_USER_KEY);
  return user ? JSON.parse(user) : null;
};

// Logout user
export const logoutUser = () => {
  localStorage.removeItem(CURRENT_USER_KEY);
};

// Update user profile
export const updateUser = (updatedUser) => {
  const users = getUsers();
  const index = users.findIndex(u => u.id === updatedUser.id);
  
  if (index !== -1) {
    users[index] = { ...users[index], ...updatedUser };
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
    return { success: true, user: updatedUser };
  }
  
  return { success: false, message: 'User not found' };
};

// Check if user is logged in
export const isAuthenticated = () => {
  return getCurrentUser() !== null;
};

// Password validation rules
export const validatePassword = (password) => {
  const rules = [
    { regex: /.{8,}/, message: 'At least 8 characters' },
    { regex: /[A-Z]/, message: 'One uppercase letter' },
    { regex: /[a-z]/, message: 'One lowercase letter' },
    { regex: /[0-9]/, message: 'One number' },
    { regex: /[!@#$%^&*(),.?":{}|<>]/, message: 'One special character' }
  ];
  
  return rules.map(rule => ({
    ...rule,
    valid: rule.regex.test(password)
  }));
};

// Add anime to user's list
export const addToMyList = (anime) => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    return { success: false, message: 'Please login first' };
  }
  
  const users = getUsers();
  const userIndex = users.findIndex(u => u.id === currentUser.id);
  
  if (userIndex === -1) {
    return { success: false, message: 'User not found' };
  }
  
  // Check if anime already in list
  if (users[userIndex].myList?.some(item => item.mal_id === anime.mal_id)) {
    return { success: false, message: 'Anime already in your list' };
  }
  
  // Add anime to list with timestamp
  const animeEntry = {
    ...anime,
    addedAt: new Date().toISOString()
  };
  
  if (!users[userIndex].myList) {
    users[userIndex].myList = [];
  }
  users[userIndex].myList.push(animeEntry);
  
  // Update current user session
  const updatedUser = { ...currentUser, myList: users[userIndex].myList };
  
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
  
  return { success: true, message: 'Added to My List' };
};

// Remove anime from user's list
export const removeFromMyList = (animeId) => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    return { success: false, message: 'Please login first' };
  }
  
  const users = getUsers();
  const userIndex = users.findIndex(u => u.id === currentUser.id);
  
  if (userIndex === -1) {
    return { success: false, message: 'User not found' };
  }
  
  // Remove anime from list
  users[userIndex].myList = users[userIndex].myList?.filter(item => item.mal_id !== animeId) || [];
  
  // Update current user session
  const updatedUser = { ...currentUser, myList: users[userIndex].myList };
  
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
  
  return { success: true, message: 'Removed from My List' };
};

// Check if anime is in user's list
export const isInMyList = (animeId) => {
  const currentUser = getCurrentUser();
  if (!currentUser) return false;
  
  return currentUser.myList?.some(item => item.mal_id === animeId) || false;
};

// Get user's My List
export const getMyList = () => {
  const currentUser = getCurrentUser();
  return currentUser?.myList || [];
};
