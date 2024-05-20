import pkg from "lodash";
const { pick } = pkg;
export const filterMiddleware = (filterKeys) => (req, res, next) => {
  req.body = pick(req.body, filterKeys);
  next();
};
