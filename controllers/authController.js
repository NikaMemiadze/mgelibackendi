const bcrypt = require('bcrypt');
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const jwt = require('jsonwebtoken')
const User = require('../models/User');

exports.register = async (req, res) => {
    const { firstName, lastName, email, displayName, password } = req.body;

    if(!firstName || !lastName || !email || !displayName|| !password) {
        return res.status(400).json({ message: "All fields are required." })
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email is already in use." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            firstName,
            lastName,
            email,
            displayName,
            password: hashedPassword,
        })

        await newUser.save();

        res.status(201).json({ message: "User registered successfully." })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error. Please try again later"})
    }

}

exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required."})
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found."});
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials."});
        }

        const token = jwt.sign(
            { userId: user._id, email: user.email },
            'your_jwt_secret',
            { expiresIn: '1h' } 
        );

        res.status(200).json({
            message: "Login successfull",
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                displayName: user.displayName,
            },
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error. Please try again later."})
    }

}

passport.use(
    new GoogleStrategy(
        {
            clientID: '472884115096-s3kcll24tkvui0u3hm9b8qjg98bvfbvc.apps.googleusercontent.com',
            clientSecret: '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',
            callbackURL: 'http://localhost:3000/api/auth/google/callback',
            scope: ['profile', 'email'],
        },
        (accessToken, refreshToken, profile, done) => {
            const { id, displayName, emails } = profile;

            User.findOne({ email: emails[0].value })
                .then((user) => {
                    if (!user) {
                        const newUser = new User({
                            firstName: displayName.split(' ')[0] || 'GoogleUser',
                            lastName: displayName.split(' ')[1] || '',
                            email: emails[0].value,
                            displayName,
                            password: bcrypt.hashSync(id, 10),  
                        });

                        newUser.save()
                            .then(() => done(null, newUser))
                            .catch((err) => done(err, null));
                    } else {
                        done(null, user);
                    }
                })
                .catch((err) => done(err, null));
        }
    )
);

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
    User.findById(id)
        .then((user) => done(null, user))
        .catch((err) => done(err, null));
});

exports.googleAuth = passport.authenticate('google', {
    scope: ['profile', 'email'],
});

exports.googleCallback = passport.authenticate('google', {
    failureRedirect: '/login',
    session: false,
}), (req, res) => {
    res.status(200).json({ message: 'Google login successful', user: req.user });
    res.redirect('/dashboard');
};

passport.use(new TwitterStrategy({
    consumerKey: 'd6LBygMkIBsgGVQKzmgBuSoJv', 
    consumerSecret: 'l59aZpQMQT0b3ChoDi1ubxBWjsAyZ6A5uBU6zve8YWF3c2gKpe',  
    callbackURL: 'http://localhost:3000/api/auth/twitter/callback', 
},
    (token, tokenSecret, profile, done) => {
        const { id, displayName, emails } = profile;

        User.findOne({ email: emails ? emails[0].value : `${id}@twitter.com` })
            .then((user) => {
                if (!user) {
                    const newUser = new User({
                        firstName: displayName.split(' ')[0] || 'TwitterUser',
                        lastName: displayName.split(' ')[1] || '',
                        email: emails ? emails[0].value : `${id}@twitter.com`, 
                        displayName,
                        password: bcrypt.hashSync(id, 10),
                    });

                    newUser.save()
                        .then(() => done(null, newUser))
                        .catch((err) => done(err, null));
                } else {
                    done(null, user);
                }
            })
            .catch((err) => done(err, null));
    }
));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
    User.findById(id)
        .then((user) => done(null, user))
        .catch((err) => done(err, null));
});

exports.twitterAuth = passport.authenticate('twitter');

exports.twitterCallback = passport.authenticate('twitter', {
    failureRedirect: '/login',
    session: false,
}), (req, res) => {
    res.status(200).json({ message: 'Twitter login successful', user: req.user });
    res.redirect('/dashboard');
};
