const notFound = (req, res) => {
  res.data = { mag: "not found" };
  return res.status(404).send("<b>Route does not exist</b>");
};

module.exports = notFound;
