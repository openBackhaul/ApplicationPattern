module.exports = async (data) => {
    const isValid = typeof data.password === 'string' && data.password.length >= 8;
    return {
      success: isValid,
      message: isValid ? 'Password is valid.' : 'Password must be at least 8 characters long.'
    };
  };