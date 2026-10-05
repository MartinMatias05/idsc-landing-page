'use strict';

const { Router } = require('express');
const site = require('../services/site.service');
const news = require('../services/news.service');
const home = require('../services/home.service');
const programs = require('../services/program.service');
const admission = require('../services/admission.service');
const institution = require('../services/institution.service');

/**
 * Thin HTTP layer: map a path to one service call. No business logic here.
 * Services throw ProblemError; Express forwards synchronous throws to the error middleware.
 * Every route below must be documented in openapi.yaml (enforced by tests/contract.test.js).
 */
const router = Router();

router.get('/health', (req, res) => res.json(site.getHealth()));
router.get('/site', (req, res) => res.json(site.getSite()));
router.get('/navigation', (req, res) => res.json(site.getNavigation()));

router.get('/news', (req, res) => res.json(news.listNews()));
router.get('/news/:id', (req, res) => res.json(news.getNews(req.params.id)));

router.get('/enrollment', (req, res) => res.json(home.getEnrollment()));
router.get('/pulse', (req, res) => res.json(home.getPulse()));
router.get('/statistics', (req, res) => res.json(home.getStatistics()));

router.get('/programs', (req, res) => res.json(programs.listPrograms(req.query.level)));
router.get('/programs/:id', (req, res) => res.json(programs.getProgram(req.params.id)));

router.get('/admission/requirements', (req, res) => res.json(admission.getRequirements()));
router.get('/admission/process', (req, res) => res.json(admission.getProcess()));
router.get('/admission/tuition', (req, res) => res.json(admission.getTuition()));
router.get('/admission/payment-instructions', (req, res) =>
  res.json(admission.getPaymentInstructions()),
);

router.get('/about', (req, res) => res.json(institution.getAbout()));
router.get('/facilities', (req, res) => res.json(institution.listFacilities()));

module.exports = router;
