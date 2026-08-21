const Joi = require('joi');

const CONTENT_GOALS = [
  'Educate',
  'Build Authority',
  'Generate Leads',
  'Promote Product',
  'Share Experience',
  'Share Company Update',
  'Drive Website Traffic',
  'Hiring',
  'Newsletter Promotion',
];

const POST_TYPES = [
  'Educational',
  'Case Study',
  'Founder Story',
  'Personal Experience',
  'Opinion',
  'Industry Insight',
  'Tutorial',
  'Contrarian View',
  'Listicle',
  'Framework',
];

const AUDIENCES = ['Founders', 'Sales Teams', 'Recruiters', 'Marketing Leaders', 'Startup Owners'];

const TONES = [
  'Professional',
  'Conversational',
  'Technical',
  'Founder Style',
  'Thought Leadership',
  'Data Driven',
  'Storytelling',
];

const CTAS = ['No CTA', 'Ask Question', 'DM Me', 'Visit Website', 'Book Demo', 'Download Resource'];

const createContentSchema = Joi.object({
  contentGoal: Joi.string().valid(...CONTENT_GOALS).required(),
  postType: Joi.string().valid(...POST_TYPES).required(),
  topic: Joi.string().trim().min(2).max(200).required(),
  audience: Joi.string().valid(...AUDIENCES).required(),
  experienceNotes: Joi.string().trim().min(20).max(3000).required().messages({
    'string.min': 'Experience / Notes is the most important field — give at least 20 characters of real detail.',
  }),
  tone: Joi.string().valid(...TONES).required(),
  cta: Joi.string().valid(...CTAS).required(),
});

module.exports = {
  createContentSchema,
  CONTENT_GOALS,
  POST_TYPES,
  AUDIENCES,
  TONES,
  CTAS,
};
