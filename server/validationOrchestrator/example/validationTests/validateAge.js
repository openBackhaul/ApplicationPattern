module.exports = async (data) => {
    const isValid = typeof data.age === 'number' && data.age >= 18 && data.age <= 100;
    return {
      success: isValid,
      message: isValid ? 'Age is valid.' : 'Age must be between 18 and 100.'
    };
  };