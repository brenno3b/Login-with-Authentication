const express = require('express');
const session = require('express-session');
const app = express();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./repositories/User');

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/views'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({ secret: 'keyboard cat' }));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
    function (username, password, done) {
        User.findUserByName(username, function (err, user) {

            if (err) return done(err);
            if (!user) return done(null, false, { message: 'Incorrect username.' });
            if (user.password != password) return done(null, false, { message: 'Incorrect password' });

            return done(null, user);
        })
    }
))

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findUserById(id, function (err, user) {
        if (err) return done(err);
        done(null, user);
    });
});

app.get('/', (req, res) => {
    res.render('home', { user: req.user });
})

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', passport.authenticate('local', { successRedirect: '/profile' ,failureRedirect: '/login' }), (req, res) => {
    res.redirect('/');
});

app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

app.get('/profile', (req, res) => {
    res.render('profile', {user: req.user });
});

app.listen(3333, () => {
    console.log('Listening on port 3333');
});