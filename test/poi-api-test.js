"use strict";

const assert = require("chai").assert;
const PoiService = require("./poi-service");
const fixtures = require("./fixtures.json");
const _ = require("lodash");

suite("Poi API tests", function () {
  let pois = fixtures.pois;
  let newCategory = fixtures.newCategory;
  let newUser = fixtures.newUser;
  let newPoi = fixtures.newPoi;

  const poiService = new PoiService(fixtures.poiService);

  suiteSetup(async function () {
    await poiService.deleteAllUsers();
    const returnedUser = await poiService.createUser(newUser);
    const response = await poiService.authenticate(newUser);
  });

  suiteTeardown(async function () {
    await poiService.deleteAllUsers();
    await poiService.clearAuth();
  });

  setup(async function () {
    await poiService.deleteAllCategories();
    await poiService.deleteAllPois();
  });

  teardown(async function () {});

  test("create a poi", async function () {
   // let newPoi = fixtures.newPoi;
    const returnedCategory = await poiService.createCategory(newCategory);
    await poiService.makePoi(returnedCategory._id, newPoi);
    const returnedPois = await poiService.getPois(returnedCategory._id);
    console.log(returnedPois);
    assert.equal(returnedPois.length, 1);
    assert(_.some([returnedPois[0]._id], pois[0]._id), "returned poi must be a superset of poi");
  });


  test("create multiple pois", async function () {
    const returnedCategory = await poiService.createCategory(newCategory);
    for (var i = 0; i < pois.length; i++) {
      await poiService.makePoi(returnedCategory._id, newPoi);
    }

    const returnedPois = await poiService.getPois(returnedCategory._id);
    assert.equal(returnedPois.length, pois.length);
    for (var i = 0; i < pois.length; i++) {
      assert(_.some([returnedPois[i]._id], pois[i]._id), "returned poi must be a superset of poi");
    }
  });

  test("delete all pois", async function () {
    const returnedCategory = await poiService.createCategory(newCategory);
    for (var i = 0; i < pois.length; i++) {
      await poiService.makePoi(returnedCategory._id, newPoi);
    }

    const d1 = await poiService.getPois(returnedCategory._id);
    assert.equal(d1.length, pois.length);
    await poiService.deleteAllPois();
    const d2 = await poiService.getPois(returnedCategory._id);
    assert.equal(d2.length, 0);
  });
  test("create a poi and check creator", async function () {
    const returnedCategory = await poiService.createCategory(newCategory);
    await poiService.makePoi(returnedCategory._id, newPoi);
    const returnedPois = await poiService.getPois(returnedCategory._id);
    assert.isDefined(returnedPois[0].creator);

    const users = await poiService.getUsers();
    assert(_.some([users[0]._id], newUser._id), "returnedUser must be a superset of newUser");
  });
});