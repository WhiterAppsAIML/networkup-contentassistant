const Joi = require('joi');

// "Add" fields per the vision doc's Module 8 spec (the enhanced version of
// the form, not the simpler current one shown in the reference screenshot).
const ASSET_TYPES = [
  'Checklist',
  'Guide',
  'Framework',
  'Ebook',
  'Template',
  'Swipe File',
  'Toolkit',
  'Worksheet',
  'Workbook',
  'Webinar',
];
const AUDIENCES = ['SaaS Founders', 'Recruiters', 'Marketers'];
const PROBLEMS = ['Low response rate', 'Poor hiring quality', 'No LinkedIn strategy'];
const OUTCOMES = ['More meetings', 'Better recruitment', 'More engagement'];
const CTA_GOALS = ['Email Capture', 'Demo Booking', 'Newsletter Signup', 'Community Join'];

const createLeadMagnetSchema = Joi.object({
  audience: Joi.string().valid(...AUDIENCES).required(),
  problem: Joi.string().valid(...PROBLEMS).required(),
  outcome: Joi.string().valid(...OUTCOMES).required(),
  assetType: Joi.string().valid(...ASSET_TYPES).required(),
  ctaGoal: Joi.string().valid(...CTA_GOALS).required(),
  topic: Joi.string().trim().min(10).max(1000).required(),
});

module.exports = { createLeadMagnetSchema, ASSET_TYPES, AUDIENCES, PROBLEMS, OUTCOMES, CTA_GOALS };
