const bcrypt = require('bcryptjs');

const myPassword = "key_road_123"; 

bcrypt.hash(myPassword, 10, (err, hash) => {
    if (err) console.log(err);
    console.log("Your new hash code:");
    console.log(hash); 
});
