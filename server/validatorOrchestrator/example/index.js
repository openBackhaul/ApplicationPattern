const ValidatorOrchestrator = require('./orchestrator/validatorOrchestrator');

// Import validators
const validateEmail = require('./validators/validateEmail');
const validateAge = require('./validators/validateAge');
const validatePassword = require('./validators/validatePassword');

// Create an orchestrator instance
const orchestrator = new ValidatorOrchestrator();

// Register validators
orchestrator.register('email', validateEmail);
orchestrator.register('age', validateAge);
orchestrator.register('password', validatePassword);

// Input data to validate
const userData = {
  email: 'mwsdnopenbackhaul.com111',
  age: 30,
  password: 'password123'
};

// Run all validators
orchestrator.run(userData).then(result => {
  console.log('=== Running All Validators ===');
  console.log(JSON.stringify(result, null, 2));
});

// Run a selected subset in specific order
orchestrator.run(userData, ['password', 'email']).then(result => {
  console.log('\n=== Running Selected Validators in Order: [password, email] ===');
  console.log(JSON.stringify(result, null, 2));
});