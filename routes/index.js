'use strict'

const express = require('express')
const slugify = require('slugify')
const router = express.Router()
const { ceos } = require('../models');

router.get('/:slug?', async (req, res) => {
    if (!!req.params.slug) {
        const { slug } = req.params;
        const theCEO = await ceos.findOne({ where: { slug }});
        // const theCEO = await ExecutivesModel.getBySlug(slug)
        console.log('THE CEO IS: ', theCEO)

        res.render('template', {
            locals: {
                title: 'CEO DETAILS',
                ceo: theCEO
            },
            partials: {
                body: 'partials/ceo-details'
            }
        })

    } else {

        const ExecutiveData = await ceos.findAll();
        res.render('template', {
            locals: {
                title: 'Home Page',
                data: ExecutiveData
            },
            partials: {
                body: 'partials/home',
            }
        })
    }
})

router.post('/', async (req, res) => {
    const { ceo_name, ceo_year } = req.body;

    const slug = slugify(ceo_name, {
        replacement: '_',
        lower: true,
        strict: true
    })

    const newExecutive = new ExecutivesModel(null, ceo_name, slug, ceo_year)

    const response = await newExecutive.addEntry();
    console.log("POST ROUTE RESPONSE: ", response);
    res.sendStatus(200);
})

router.post('/delete', async (req, res) => {
    const { id, ceo_name, slug, ceo_year } = req.body
    const executiveToDelete = new ExecutivesModel(id, ceo_name, slug, ceo_year);
    const response = await executiveToDelete.deleteEntry();
    console.log("DELETE ROUTE RESPONSE IS: ", response);
    res.sendStatus(200);
})

module.exports = router;