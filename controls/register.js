const registerHandler = (req, res, db, bcrypt) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json("Incorrect form submission!");
  }

  const hash = bcrypt.hashSync(password, 10);

  let emailExist;
  db("users")
    .where("email", "=", email)
    .then((email) => {
      if (email.length) throw new Error("this email already exist");
    })
    .catch((err) => {
      res.json(err.message);
      emailExist = Boolean(err);
    });

  if (emailExist) return;
  db.transaction((trx) => {
    trx
      .insert({
        hash: hash,
        email: email,
      })
      .into("login")
      .returning("email")
      .then((loginEmail) => {
        return trx("users")
          .returning("*")
          .insert({
            email: loginEmail[0].email,
            name,
            joined: new Date(),
          })
          .then((user) => {
            res.json(user[0]);
          });
      })
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch((err) => console.log(err.message));
};
module.exports = {
  registerHandler: registerHandler,
};
