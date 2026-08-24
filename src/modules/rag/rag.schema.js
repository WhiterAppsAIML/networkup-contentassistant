const Joi = require('joi');

const addDocumentSchema = Joi.object({
  sourceId: Joi.string().min(1).max(100).required(),
  sourceType: Joi.string().valid('pdf', 'txt', 'md', 'url', 'manual').required(),
  title: Joi.string().min(1).max(200).required(),
  content: Joi.string().min(1).max(50000).required(),
  metadata: Joi.object().default({}),
  chunkIndex: Joi.number().integer().min(0).default(0),
});

const addDocumentsBatchSchema = Joi.object({
  documents: Joi.array().items(addDocumentSchema).min(1).max(50).required(),
});

const searchSchema = Joi.object({
  query: Joi.string().min(1).max(1000).required(),
  topK: Joi.number().integer().min(1).max(20).default(5),
  sourceId: Joi.string().max(100).allow(''),
  minScore: Joi.number().min(0).max(1).default(0.7),
});

const listSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  sourceId: Joi.string().max(100).allow(''),
});

module.exports = { addDocumentSchema, addDocumentsBatchSchema, searchSchema, listSchema };