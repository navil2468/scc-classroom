const passport = require("passport");
const { Strategy: GoogleStrategy } = require("passport-google-oauth20");
const pool = require("./sql/db");

passport.serializeUser((user, done) => {
  done(null, user.email);
});

passport.deserializeUser(async (email, done) => {
  try {
    const {
      rows: [user],
    } = await pool.query("SELECT account_type FROM accounts WHERE email = $1", [
      email,
    ]);
    console.log("passport deserialize user email: ", email, user);

    if (user.account_type === "teacher") {
      const {
        rows: [user],
      } = await pool.query("SELECT * FROM teacher WHERE email = $1", [email]);
      console.log("passport deserialize teacher: ", user);
      done(null, { ...user, accountType: "teacher" });
    } else if (user.account_type === "student") {
      const {
        rows: [user],
      } = await pool.query("SELECT * FROM student WHERE email = $1", [email]);
      done(null, { ...user, accountType: "student" });
    }
  } catch (err) {
    done(err);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/googlecallback",
    },
    async (accessToken, refreshToken, profile, done) => {
      const {
        rows: [user],
      } = await pool.query("SELECT email FROM accounts WHERE email = $1", [
        profile.emails[0].value,
      ]);

      if (!user) {
        done("Your email is not registered for Steel City Classroom.", null);
      }

      console.log("passport use email: ", user);
      done(null, user);
    }
  )
);
