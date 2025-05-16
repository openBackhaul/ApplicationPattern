module.exports = async (data) => {
    const isValid = typeof data.email === 'string' && data.email.includes('@');
    return {
      success: isValid,
      message: isValid ? 'Email is valid.' : 'Invalid email format.'
    };
  };