import * as assert from 'assert';
import * as httpMocks from 'node-mocks-http';
import { CreateDraft, DraftPick, LoadDraft, reset } from './routes';


describe('routes', function () {

  it('CreateDraft', function () {
    // First test for valid inputs
    const req1 = httpMocks.createRequest(
      { method: 'POST', url: '/api/create', body: { drafters: ['Test_1', "Test_2"], options: ['Test_1', 'Test_1'], rounds: 3 } });
    const res1 = httpMocks.createResponse();
    CreateDraft(req1, res1);
    assert.deepStrictEqual(res1._getStatusCode(), 200);
    assert.deepStrictEqual(res1._getData(), {
      draft: {
        drafters: ["Test_1", "Test_2"],
        options: ["Test_1", "Test_1"],
        picked: [],
        rounds: 3,
        id: 0,
        isComplete: false,
        picker: "Test_1"
      }
    });

    // Second test for valid inputs
    const req2 = httpMocks.createRequest(
      { method: 'POST', url: '/api/create', body: { drafters: ["Henna", "GummyBears"], options: ["Chicken", "Burgers"], rounds: 3 } });
    const res2 = httpMocks.createResponse();
    CreateDraft(req2, res2);
    assert.deepStrictEqual(res2._getStatusCode(), 200);
    assert.deepStrictEqual(res2._getData(), {
      draft: {
        drafters: ["Henna", "GummyBears"],
        options: ["Chicken", "Burgers"],
        picked: [],
        rounds: 3,
        id: 1,
        isComplete: false,
        picker: "Henna"
      }
    });

    // First test for undefined drafters
    const req3 = httpMocks.createRequest(
      { method: 'POST', url: '/api/create', body: { options: ["Chicken", "Burgers"], rounds: 3 } });
    const res3 = httpMocks.createResponse();
    CreateDraft(req3, res3);
    assert.deepStrictEqual(res3._getStatusCode(), 400);

    // Second test for undefined drafters
    const req4 = httpMocks.createRequest(
      { method: 'POST', url: '/api/create', body: { drafters: undefined, options: ["KitKats", "AlmondJoys"], rounds: 3 } });
    const res4 = httpMocks.createResponse();
    CreateDraft(req4, res4);
    assert.deepStrictEqual(res4._getStatusCode(), 400);

    // First test for one drafter
    const req5 = httpMocks.createRequest(
      { method: 'POST', url: '/api/create', body: { drafters: ["Drafter_1"], options: ["KitKats", "AlmondJoys"], rounds: 3 } });
    const res5 = httpMocks.createResponse();
    CreateDraft(req5, res5);
    assert.deepStrictEqual(res5._getStatusCode(), 400);

    // Second test for one drafter
    const req6 = httpMocks.createRequest(
      { method: 'POST', url: '/api/create', body: { drafters: ["Drafter_2"], options: ["KitKats", "AlmondJoys"], rounds: 3 } });
    const res6 = httpMocks.createResponse();
    CreateDraft(req6, res6);
    assert.deepStrictEqual(res6._getStatusCode(), 400);

    // First test for undefined options
    const req7 = httpMocks.createRequest(
      { method: 'POST', url: '/api/create', body: { drafters: ["Drafter_3", "Two_Drafters"], options: undefined, rounds: 3 } });
    const res7 = httpMocks.createResponse();
    CreateDraft(req7, res7);
    assert.deepStrictEqual(res7._getStatusCode(), 400);

    // Second test for undefined options
    const req8 = httpMocks.createRequest(
      { method: 'POST', url: '/api/create', body: { drafters: ["InvalidDrafter", "InvalidDrafter2"], rounds: 3 } });
    const res8 = httpMocks.createResponse();
    CreateDraft(req8, res8);
    assert.deepStrictEqual(res8._getStatusCode(), 400);

    // First test for one option
    const req9 = httpMocks.createRequest(
      { method: 'POST', url: '/api/create', body: { drafters: ["Drafter_3", "Two_Drafters"], options: ["Option"], rounds: 3 } });
    const res9 = httpMocks.createResponse();
    CreateDraft(req9, res9);
    assert.deepStrictEqual(res9._getStatusCode(), 400);

    // Second test for one option
    const req10 = httpMocks.createRequest(
      { method: 'POST', url: '/api/create', body: { drafters: ["InvalidDrafter", "InvalidDrafter2"], options: ["No"], rounds: 3 } });
    const res10 = httpMocks.createResponse();
    CreateDraft(req10, res10);
    assert.deepStrictEqual(res10._getStatusCode(), 400);

    // First test for undefined rounds
    const req11 = httpMocks.createRequest(
      { method: 'POST', url: '/api/create', body: { drafters: ["Chung", "New"], options: ["Other Candy", "Twix"] } });
    const res11 = httpMocks.createResponse();
    CreateDraft(req11, res11);
    assert.deepStrictEqual(res11._getStatusCode(), 400);

    // Second test for undefined rounds
    const req12 = httpMocks.createRequest(
      { method: 'POST', url: '/api/create', body: { drafters: ["Lily!", "Orchid"], options: ["Pocky", "ChocoPie"], rounds: undefined } });
    const res12 = httpMocks.createResponse();
    CreateDraft(req12, res12);
    assert.deepStrictEqual(res12._getStatusCode(), 400);

    // First test for non-number round
    const req13 = httpMocks.createRequest(
      { method: 'POST', url: '/api/create', body: { drafters: ["Lily!", "Orchid"], options: ["Pocky", "ChocoPie"], rounds: "Test_1" } });
    const res13 = httpMocks.createResponse();
    CreateDraft(req13, res13);
    assert.deepStrictEqual(res13._getStatusCode(), 400);

    // Second test for non-number round
    const req14 = httpMocks.createRequest(
      { method: 'POST', url: '/api/create', body: { drafters: ["Lily!", "Orchid"], options: ["Pocky", "ChocoPie"], rounds: [3] } });
    const res14 = httpMocks.createResponse();
    CreateDraft(req14, res14);
    assert.deepStrictEqual(res14._getStatusCode(), 400);

    reset(req1, res1);
    reset(req2, res2);
    reset(req3, res3);
    reset(req4, res4);
    reset(req5, res5);
    reset(req6, res6);
    reset(req7, res7);
    reset(req8, res8);
    reset(req9, res9);
    reset(req10, res10);
    reset(req11, res11);
    reset(req12, res12);
    reset(req13, res13);
    reset(req14, res14);
  });

  it('DraftPick', function () {
    // First test for valid inputs
    const req1a = httpMocks.createRequest(
      { method: 'POST', url: '/api/create', body: { drafters: ['Test_1', "Test_2"], options: ['Test_1', 'Test_1'], rounds: 3 } });
    const res1a = httpMocks.createResponse();
    const req1b = httpMocks.createRequest(
      { method: 'POST', url: '/api/pick', body: { id: 0, picker: "Test_1", pick: "Test_1" } });
    const res1b = httpMocks.createResponse();
    CreateDraft(req1a, res1a);
    DraftPick(req1b, res1b)

    assert.deepStrictEqual(res1b._getStatusCode(), 200);
    assert.deepStrictEqual(res1b._getData(), {
      draft: {
        drafters: ["Test_1", "Test_2"],
        options: ["Test_1"],
        picked: ["Test_1 Test_1 1"],
        rounds: 3,
        id: 0,
        isComplete: false,
        picker: "Test_2"
      }
    });

    // Testing cycling
    const req1c = httpMocks.createRequest(
      { method: 'POST', url: '/api/pick', body: { id: 0, picker: "Test_2", pick: "Test_1" } });
    const res1c = httpMocks.createResponse();
    DraftPick(req1c, res1c);
    assert.deepStrictEqual(res1c._getData(), {
      draft: {
        drafters: ["Test_1", "Test_2"],
        options: [],
        picked: ["Test_1 Test_1 1", "Test_2 Test_1 2"],
        rounds: 2,
        id: 0,
        isComplete: true,
        picker: "Test_1"
      }
    });

    // Second test for valid inputs
    const req2a = httpMocks.createRequest(
      { method: 'POST', url: '/api/create', body: { drafters: ['Henna', "Chung_2"], options: ['Fruits', 'Candy'], rounds: 3 } });
    const res2a = httpMocks.createResponse();
    const req2b = httpMocks.createRequest(
      { method: 'POST', url: '/api/pick', body: { id: 1, picker: "Henna", pick: "Candy" } });
    const res2b = httpMocks.createResponse();
    CreateDraft(req2a, res2a);
    DraftPick(req2b, res2b);
    assert.deepStrictEqual(res2b._getStatusCode(), 200);
    assert.deepStrictEqual(res2b._getData(), {
      draft: {
        drafters: ["Henna", "Chung_2"],
        options: ["Fruits"],
        picked: ["Henna Candy 1"],
        rounds: 3,
        id: 1,
        isComplete: false,
        picker: "Chung_2"
      }
    });

    // Another check (in case)
    const req15a = httpMocks.createRequest(
      { method: 'POST', url: '/api/create', body: { drafters: ['Henna_2', "Chung_2"], options: ['Fruits', 'Candy'], rounds: 3 } });
    const res15a = httpMocks.createResponse();
    const req15b = httpMocks.createRequest(
      { method: 'POST', url: '/api/pick', body: { id: 2, picker: "Henna_2", pick: "Candy" } });
    const res15b = httpMocks.createResponse();
    CreateDraft(req15a, res15a);
    DraftPick(req15b, res15b);
    assert.deepStrictEqual(res15b._getStatusCode(), 200);
    assert.deepStrictEqual(res15b._getData(), {
      draft: {
        drafters: ["Henna_2", "Chung_2"],
        options: ["Fruits"],
        picked: ["Henna_2 Candy 1"],
        rounds: 3,
        id: 2,
        isComplete: false,
        picker: "Chung_2"
      }
    });

    // First test for undefined id
    const req3b = httpMocks.createRequest(
      { method: 'POST', url: '/api/pick', body: { id: undefined, pick: "Candy" } });
    const res3b = httpMocks.createResponse();
    DraftPick(req3b, res3b);
    assert.deepStrictEqual(res3b._getStatusCode(), 400);

    // Second test for undefined id
    const req4b = httpMocks.createRequest(
      { method: 'POST', url: '/api/pick', body: { pick: "Candy" } });
    const res4b = httpMocks.createResponse();
    DraftPick(req4b, res4b);
    assert.deepStrictEqual(res4b._getStatusCode(), 400);

    // First test for when id is not a number
    const req5b = httpMocks.createRequest(
      { method: 'POST', url: '/api/pick', body: { id: [32], pick: "Candy" } });
    const res5b = httpMocks.createResponse();
    DraftPick(req5b, res5b);
    assert.deepStrictEqual(res5b._getStatusCode(), 400);

    // Second test for when id is not a number
    const req6b = httpMocks.createRequest(
      { method: 'POST', url: '/api/pick', body: { id: "hi", pick: "Candy" } });
    const res6b = httpMocks.createResponse();
    DraftPick(req6b, res6b);
    assert.deepStrictEqual(res6b._getStatusCode(), 400);

    // First test for when id does not exist
    const req7b = httpMocks.createRequest(
      { method: 'POST', url: '/api/pick', body: { id: 6, pick: "Candy" } });
    const res7b = httpMocks.createResponse();
    DraftPick(req7b, res7b);
    assert.deepStrictEqual(res7b._getStatusCode(), 400);

    // Second test for when id does not exist
    const req8b = httpMocks.createRequest(
      { method: 'POST', url: '/api/pick', body: { id: 9, pick: "Candy" } });
    const res8b = httpMocks.createResponse();
    DraftPick(req8b, res8b);
    assert.deepStrictEqual(res8b._getStatusCode(), 400);

    // First test for when pick is undefined
    const req11b = httpMocks.createRequest(
      { method: 'POST', url: '/api/pick', body: { id: 1 } });
    const res11b = httpMocks.createResponse();
    DraftPick(req11b, res11b);
    assert.deepStrictEqual(res11b._getStatusCode(), 400);

    // Second test for when pick is undefined
    const req12b = httpMocks.createRequest(
      { method: 'POST', url: '/api/pick', body: { id: 1, pick: undefined } });
    const res12b = httpMocks.createResponse();
    DraftPick(req12b, res12b);
    assert.deepStrictEqual(res12b._getStatusCode(), 400);

    // First test for when pick does not exist
    const req13b = httpMocks.createRequest(
      { method: 'POST', url: '/api/pick', body: { id: 1, pick: "DNE" } });
    const res13b = httpMocks.createResponse();
    DraftPick(req13b, res13b);
    assert.deepStrictEqual(res13b._getStatusCode(), 400);

    // Second test for when pick does not exist
    const req14b = httpMocks.createRequest(
      { method: 'POST', url: '/api/pick', body: { id: 1, pick: "DNE_2" } });
    const res14b = httpMocks.createResponse();
    DraftPick(req14b, res14b);
    assert.deepStrictEqual(res14b._getStatusCode(), 400);

  });

  it('LoadDraft', function () {
    // First test for valid inputs
    const req1b = httpMocks.createRequest(
      { method: 'GET', url: '/api/load', query: { id: 0 } });
    const res1b = httpMocks.createResponse();
    LoadDraft(req1b, res1b);
    assert.deepStrictEqual(res1b._getStatusCode(), 200);
    assert.deepStrictEqual(res1b._getData(), {
      draft: {
        drafters: ["Test_1", "Test_2"],
        options: [],
        picked: ["Test_1 Test_1 1", "Test_2 Test_1 2"],
        rounds: 2,
        id: 0,
        isComplete: true,
        picker: "Test_1"
      }
    });

    // Second test for valid inputs
    const req2b = httpMocks.createRequest(
      { method: 'GET', url: '/api/load', query: { id: 2 } });
    const res2b = httpMocks.createResponse();
    LoadDraft(req2b, res2b);
    assert.deepStrictEqual(res2b._getStatusCode(), 200);
    assert.deepStrictEqual(res2b._getData(), {
      draft: {
        drafters: ["Henna_2", "Chung_2"],
        options: ["Fruits"],
        picked: ["Henna_2 Candy 1"],
        rounds: 3,
        id: 2,
        isComplete: false,
        picker: "Chung_2"
      }
    });

    // First test for undefined id
    const req3b = httpMocks.createRequest(
      { method: 'GET', url: '/api/load', query: {} });
    const res3b = httpMocks.createResponse();
    LoadDraft(req3b, res3b);
    assert.deepStrictEqual(res3b._getStatusCode(), 400);

    // Second test for undefined id
    const req4b = httpMocks.createRequest(
      { method: 'GET', url: '/api/load', query: { id: undefined } });
    const res4b = httpMocks.createResponse();
    LoadDraft(req4b, res4b);
    assert.deepStrictEqual(res4b._getStatusCode(), 400);

    // First test for when id is not a number
    const req5b = httpMocks.createRequest(
      { method: 'GET', url: '/api/load', query: { id: [5] } });
    const res5b = httpMocks.createResponse();
    LoadDraft(req5b, res5b);
    assert.deepStrictEqual(res5b._getStatusCode(), 400);

    // Second test for when id is not a number
    const req6b = httpMocks.createRequest(
      { method: 'GET', url: '/api/load', query: { id: 'Test_1' } });
    const res6b = httpMocks.createResponse();
    LoadDraft(req6b, res6b);
    assert.deepStrictEqual(res6b._getStatusCode(), 400);

    // First test for when draft does not exist
    const req7b = httpMocks.createRequest(
      { method: 'GET', url: '/api/load', query: { id: 100 } });
    const res7b = httpMocks.createResponse();
    LoadDraft(req7b, res7b);
    assert.deepStrictEqual(res7b._getStatusCode(), 400);

    // Second test for when draft does not exist
    const req8b = httpMocks.createRequest(
      { method: 'GET', url: '/api/load', query: { id: 20 } });
    const res8b = httpMocks.createResponse();
    LoadDraft(req8b, res8b);
    assert.deepStrictEqual(res8b._getStatusCode(), 400);
  });
});
