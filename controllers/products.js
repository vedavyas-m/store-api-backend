const product = require("../models/product");
const getAllProductsStatic = async (req, res) => {
  const products = await product.find({ featured: true });
  res.status(200).json({
    products,
    nbHits: products.length,
  });
};

const getAllProducts = async (req, res) => {
  const { featured, company, name, sort, fields, numericFilters } = req.query;
  const queryObject = {};
  if (featured) {
    queryObject.featured = featured === "true" ? true : false;
  }
  if (company) {
    queryObject.company = company;
  }
  if (name) {
    queryObject.name = { $regex: name, $options: "i" };
  }
  if (numericFilters) {
    const operatorMap = {
      ">": "$gt",
      ">=": "$gte",
      "=": "$eq",
      "<": "$lt",
      "<=": "$lte",
    };
    const regEx = /\b(<|>|>=|=|<|<=)\b/g;
    let filters = numericFilters.replace(
      regEx,
      (match) => `-${operatorMap[match]}-`
    );
    const options = ["price", "rating"];
    filters = filters.split(",").forEach((item) => {
      console.log("item", item);
      const [field, operator, value] = item.split("-");
      if (options.includes(field)) {
        queryObject[field] = { [operator]: Number(value) };
      }
    });
  }
  console.log(queryObject);

  let result = product.find(queryObject);
  // .sort
  if (sort) {
    result = result.sort(sort.split(",").join(" "));
  } else {
    result = result.sort("createdAt");
  }
  if (fields) {
    result = result.select(fields.split(",").join(" "));
  }

  // pagination
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 5;

  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);
  const totalCount = await product.countDocuments(queryObject);
  const products = await result;
  res.status(200).json({
    products,
    nbHits: products.length,
    totalCount: totalCount,
  });
};

module.exports = {
  getAllProducts,
  getAllProductsStatic,
};
