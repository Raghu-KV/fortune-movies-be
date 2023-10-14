export function auth(req, res, next) {
  const token = req.header("x-auth-token");
  if (token === "FSMovies2023") {
    next();
  } else {
    res.status(404).send({ message: "token expected" });
  }
}
