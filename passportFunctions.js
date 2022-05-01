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

    if (user.account_type === "teacher") {
      const {
        rows: [user],
      } = await pool.query("SELECT * FROM teacher WHERE email = $1", [email]);
      done(null, { ...user, accountType: "teacher" });
    } else if (user.account_type === "student") {
      const {
        rows: [user],
      } = await pool.query("SELECT * FROM student WHERE email = $1", [email]);
      done(null, { ...user, accountType: "student" });
    } else if (user.account_type === "admin") {
      const {
        rows: [user],
      } = await pool.query("SELECT * FROM teacher WHERE email = $1", [email]);
      done(null, { ...user, accountType: "admin" });
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
      } = await pool.query("SELECT * FROM accounts WHERE email = $1", [
        profile.emails[0].value,
      ]);

      if (!user) {
        console.log("user not registered");
        done("Your email is not registered for Steel City Classroom.", null);
      }

      if (user.account_type !== "admin") {
        await pool.query(
          `
      INSERT INTO ${user.account_type}
      SELECT uuid_generate_v4(), $1, $2, $3
      WHERE NOT EXISTS(SELECT email FROM student WHERE email = $4)
      `,
          [
            profile.emails[0].value,
            profile.displayName,
            profile.photos[0]?.value,
            profile.emails[0].value,
          ]
        );
      }
      done(null, user);
    }
  )
);
