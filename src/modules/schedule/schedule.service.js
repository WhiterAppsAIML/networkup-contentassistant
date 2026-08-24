const ScheduledPost = require('../../models/ScheduledPost.model');
const Content = require('../../models/Content.model');
const AppError = require('../../utils/AppError');

const POSTABLE_STATUSES = ['content_generated', 'improved'];

async function createSchedule(userId, { contentId, scheduledFor }) {
  const content = await Content.findOne({ _id: contentId, userId });
  if (!content) throw new AppError('Content not found.', 404);
  if (!POSTABLE_STATUSES.includes(content.status)) {
    throw new AppError('Generate content (Module 4) before it can be scheduled.', 400);
  }

  // Note: this only records the schedule - there's no publish worker here.
  // Content.status is intentionally left as-is; it would be misleading to
  // mark it "published" before anything has actually posted. Actually
  // publishing to LinkedIn needs OAuth + LinkedIn API integration, which is
  // its own scoped piece of work, not built here.
  return ScheduledPost.create({ contentId, userId, scheduledFor });
}

async function list(userId, { page, limit, startDate, endDate }) {
  const skip = (page - 1) * limit;
  const filter = { userId };

  if (startDate || endDate) {
    filter.scheduledFor = {};
    if (startDate) filter.scheduledFor.$gte = new Date(startDate);
    if (endDate) filter.scheduledFor.$lte = new Date(endDate);
  }

  const [items, total] = await Promise.all([
    ScheduledPost.find(filter)
      .sort({ scheduledFor: 1 })
      .skip(skip)
      .limit(limit)
      .populate('contentId', 'topic generatedContent.fullText status'),
    ScheduledPost.countDocuments(filter),
  ]);
  return { items, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 } };
}

async function cancel(id, userId) {
  const scheduled = await ScheduledPost.findOneAndUpdate(
    { _id: id, userId, status: 'scheduled' },
    { status: 'cancelled' },
    { new: true }
  );
  if (!scheduled) throw new AppError('Scheduled post not found or already resolved.', 404);
  return scheduled;
}

module.exports = { createSchedule, list, cancel };
