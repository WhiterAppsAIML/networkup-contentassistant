const Framework = require('../../models/Framework.model');
const AppError = require('../../utils/AppError');

async function create(userId, { name, structure, description }) {
  return Framework.create({ userId, name, structure, description });
}

async function list(userId, query) {
  const { page = 1, limit = 20 } = query;
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Framework.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Framework.countDocuments({ userId }),
  ]);

  return { items, pagination: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / limit) || 1 } };
}

async function getById(id, userId) {
  const framework = await Framework.findOne({ _id: id, userId });
  if (!framework) throw new AppError('Framework not found.', 404);
  return framework;
}

async function update(id, userId, data) {
  const framework = await Framework.findOneAndUpdate(
    { _id: id, userId },
    { $set: data },
    { new: true, runValidators: true }
  );
  if (!framework) throw new AppError('Framework not found.', 404);
  return framework;
}

async function remove(id, userId) {
  const framework = await Framework.findOneAndDelete({ _id: id, userId });
  if (!framework) throw new AppError('Framework not found.', 404);
}

module.exports = { create, list, getById, update, remove };