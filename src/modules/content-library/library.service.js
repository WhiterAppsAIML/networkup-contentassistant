const Content = require('../../models/Content.model');
const Hook = require('../../models/Hook.model');
const AppError = require('../../utils/AppError');

async function listContent(userId, { page, limit, status }) {
  const filter = { userId, ...(status ? { status } : {}) };
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Content.find(filter).sort({ updatedAt: -1 }).skip(skip).limit(limit),
    Content.countDocuments(filter),
  ]);

  return { items, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 } };
}

async function archiveContent(contentId, userId) {
  const content = await Content.findOneAndUpdate({ _id: contentId, userId }, { status: 'archived' }, { new: true });
  if (!content) throw new AppError('Content not found.', 404);
  return content;
}

async function deleteContent(contentId, userId) {
  const content = await Content.findOneAndDelete({ _id: contentId, userId });
  if (!content) throw new AppError('Content not found.', 404);
  await Hook.deleteMany({ contentId: content._id }); // clean up orphaned hooks
  return content;
}

async function listHooks(userId, { page, limit }) {
  const filter = { userId };
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Hook.find(filter).sort({ 'performance.timesUsed': -1, createdAt: -1 }).skip(skip).limit(limit),
    Hook.countDocuments(filter),
  ]);

  return { items, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 } };
}

module.exports = { listContent, archiveContent, deleteContent, listHooks };
