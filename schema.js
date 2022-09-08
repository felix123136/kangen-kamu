import Joi from "joi";

const productSchema = Joi.object({
  product: Joi.object({
    name: Joi.string().required(),
    price: Joi.number().required().min(0),
  }).required(),
});

export default productSchema;
