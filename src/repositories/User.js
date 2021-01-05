const data = require('../database/users.json');

exports.findUserById = (id, done) => {
    let user = data.find(user => {
        if(user.id == id) {
            return user;
        }       
    });

    if (user == null) return done(new Error(`User ${id} not found`));

    return done(null, user);
}

exports.findUserByName = (username, done) => {

let user = data.find(user => {
    if(user.username == username) {
        return user;
    }
});

    if (user == null) return done(null, null);

    return done(null, user);
}