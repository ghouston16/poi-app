'use strict';

const assert = require('chai').assert;
const PoiService = require('./poi-service');
const fixtures = require('./fixtures.json');
const _ = require('lodash');

suite('Poi API tests', function() {
  let pois = fixtures.pois;
  let newCategory = fixtures.newCategory;

  const poiService = new PoiService(fixtures.poiService);

  setup(async function() {
    poiService.deleteAllCategories();
    poiService.deleteAllPois();
  });

  teardown(async function() {});

  test('create a poi', async function() {
    const returnedCategory = await poiService.createCategory(newCategory);
    await poiService.makePoi(returnedCategory._id, pois[0]);
    const returnedPois = await poiService.getPois(returnedCategory._id);
    console.log(returnedPois);
    assert.equal(returnedPois.length, 1);
    assert(_.some([returnedPois[0]], pois[0]), 'returned poi must be a superset of poi');
  });

  test('create multiple pois', async function() {
    const returnedCategory = await poiService.createCategory(newCategory);
    for (var i = 0; i < pois.length; i++) {
      await poiService.makePoi(returnedCategory._id, pois[i]);
    }

    const returnedPois = await poiService.getPois(returnedCategory._id);
    assert.equal(returnedPois.length, pois.length);
    for (var i = 0; i < pois.length; i++) {
      assert(_.some([returnedPois[i]], pois[i]), 'returned poi must be a superset of poi');
    }
  });

  test('delete all pois', async function() {
    const returnedCategory = await poiService.createCategory(newCategory);
    for (var i = 0; i < pois.length; i++) {
      await poiService.makePoi(returnedCategory._id, pois[i]);
    }

    const d1 = await poiService.getPois(returnedCategory._id);
    assert.equal(d1.length, pois.length);
    await poiService.deleteAllPois();
    const d2 = await poiService.getPois(returnedCategory._id);
    assert.equal(d2.length, 0);
  });
});