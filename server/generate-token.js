const jwt = require('jsonwebtoken');

const token = jwt.sign(
  {
    username: 'admin',
    sub: 'c64bf630-ffd2-4884-81da-f9e60e750574',
    role: 'admin'
  },
  '7fec55889b5693c20a8e87ba87af93518be1f1442a6fc5d9a07fe93338047789188a431b6e7378b0110f08a8af5c3d169da5d436937d5a79b627c19b134e79f6', // your JWT_SECRET
  {
    expiresIn: '1d',
    issuer: 'your-app-name'
  }
);

console.log('✅ Your new valid JWT token:\n\n', token);