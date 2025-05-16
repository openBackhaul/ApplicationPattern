class ValidatorOrchestrator {
    constructor() {
      this.validators = new Map(); // name => function
    }
  
    /**
     * Register a validator function with a unique name.
     * @param {string} name - Unique name for the validator.
     * @param {function} fn - Async function that accepts data and returns { success, message }.
     */
    register(name, fn) {
      if (this.validators.has(name)) {
        throw new Error(`Validator "${name}" is already registered.`);
      }
      this.validators.set(name, fn);
    }
  
    /**
     * Run all or selected validators in the desired sequence.
     * @param {object} data - The input data to validate.
     * @param {string[]?} selectedValidators - Optional ordered list of validator names.
     * @returns {object} - { success: boolean, results: array of individual results }
     */
    async run(data, selectedValidators = null) {
      const executionOrder = selectedValidators || Array.from(this.validators.keys());
      const results = [];
  
      for (const name of executionOrder) {
        const validator = this.validators.get(name);
  
        if (!validator) {
          results.push({
            name,
            success: false,
            message: `Validator "${name}" not found.`
          });
          continue;
        }
  
        try {
          const result = await validator(data);
          results.push({
            name,
            success: result.success,
            message: result.message || ''
          });
        } catch (err) {
          results.push({
            name,
            success: false,
            message: `Validator "${name}" failed: ${err.message || 'Unknown error'}`
          });
        }
      }
  
      return {
        success: results.every(r => r.success),
        results
      };
    }
  }
  
  module.exports = ValidatorOrchestrator;