const auth = require('./lib/auth');
const args = process.argv.slice(2);

if (args.length == 2) {
    console.log(auth.generateToken(args[0], args[1]));
}
else {
    console.log("Please specify the parameters username and password example: node token.js user password");
}