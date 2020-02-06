const TenderRegistry = artifacts.require('TenderRegistry');

// We want to test the following aspects of the TenderSubmissionRegistry:
//
//     there are zero submissions at the beginning
//     adding a Tender Submission works
//     tender hash string array is updated after successful adding a Tender Submission
//     latest Tender Submission Hash can be retrieved from the tender hash string array
//     retrieving Tender Submission details for an existing submission using the ZIP File Hash works
//     retrieving Tender Submission details for an non-existent submission using a Fake ZIP File Hash does not work

contract('TenderRegistry', function () {
  // predefine parameters
  const ZIPFileDetails = 'ZIP File  test.zip (size 0.433993MB)';
  const ZIPFileHash = 'f149d75e984f1e919c4b896a0701637ff0260b834e1c18f3a9776c12fbf82311';
  const TenderSummary = '1003 - Train Data Center Operators';
  const SupplierDetails = '{SubmitterFullName:"John Doe", SubmitterIdentificationNumber:"12345678",SupplierID:123}';
  const SubmissionDate = 'Wed Feb 05 2020 00:09:56 GMT+0200 (South Africa Standard Time)';
  const SubmissionBlocktime = 1580854200;
  const IsSet = 1;

  const FakeZIPFileHash = '12345678984f1e919c4b896a0701637ff0260b834e1c18f3a9776c12fbf82311';

  // predefine the contract instance
  let TenderRegistryInstance;

  //predefine initial Tender Submission Counter which should be zero
  let initialTenderSubmissionCounter;

  // before running the tests, set the value of the initialTenderSubmissionCounter
    before(async() => {
        // retrieve the deployed Tender Registry contract instance
        //TenderRegistryInstance = await TenderRegistry.deployed();

        // deploy a new Tender Registry contract
        TenderRegistryInstance = await TenderRegistry.new();

          // get the initial number of Tender Submissions
        initialTenderSubmissionCounter = await TenderRegistryInstance.getTenderSubmissionsCount();
    })

  it('should contain zero Tender Submissions in the beginning', async function () {
    // fetch instance of TenderRegistry contract
    //let TenderRegistryInstance = await TenderRegistry.deployed()
    // get the number of Tender Submissions
    let tenderSubmissionCounter = await TenderRegistryInstance.getTenderSubmissionsCount()
    // check that there are no Tender Submissions initially
    assert.equal(tenderSubmissionCounter, 0, 'initial number not equal to zero')
  })

  it('should add a Tender Submission to the registry', async function () {
    let TenderRegistryInstance = await TenderRegistry.deployed()
    // register a Tender Submission to the registry
    let tenderSubmissionIndex = await TenderRegistryInstance.registerTenderSubmission(
      ZIPFileDetails,
      ZIPFileHash,
      TenderSummary,
      SupplierDetails,
      SubmissionDate
    );

    //check return value is zero
    assert.equal(tenderSubmissionIndex, initialTenderSubmissionCounter, 'Tender submission added successfully')

  })

  it('should increment Tender Submission hash array after adding to registry', async function () {
    //let TenderRegistryInstance = await TenderRegistry.deployed();
        // get the number of Tender Submissions
    let tenderSubmissionCounter = await TenderRegistryInstance.getTenderSubmissionsCount();

    assert.equal(tenderSubmissionCounter.toNumber(), initialTenderSubmissionCounter + 1, 'Tender Submission was not successfully registered')
  })

  it('retrieve the Tender Hash', async function () {
    //retrieve from map using string array indexing
    //let TenderRegistryInstance = await TenderRegistry.deployed();
    let tenderSubmissionCounter = await TenderRegistryInstance.getTenderSubmissionsCount();
    let latestHash = await TenderRegistry.tenderHashes[tenderSubmissionCounter - 1];

    // check that it returns a match
    assert.equal(latestHash, ZIPFileHash, 'Hash retrieved from Blockchain does not match latest submission')
  })

  it('should verify a true Tender Submission from the registry', async function () {
    //let TenderRegistryInstance = await TenderRegistry.deployed()

    // retrieve the Tender Submission details
    let tenderSubmissionInstance =await TenderRegistryInstance.getTenderSubmission(ZIPFileHash);

    // check that they match the original Tender Submission details
    assert.equal(tenderSubmissionInstance[0], ZIPFileDetails, 'Tender Submission ZIP File Details do not match');
    assert.equal(tenderSubmissionInstance[1], ZIPFileHash, 'Tender Submission ZIP File Hash does not match');
    assert.equal(tenderSubmissionInstance[2], TenderSummary, 'Tender Submission tender summary does not match');
    assert.equal(tenderSubmissionInstance[3], SupplierDetails, 'Tender Submission supplier details do not match');
    assert.equal(tenderSubmissionInstance[4], SubmissionDate, 'Tender Submission date does not match');
  })

  it('should identify a false Tender Submission from the registry', async function () {
    //let TenderRegistryInstance = await TenderRegistry.deployed();
    // retrieve Tender Submission details using a Fake Zip File Hash
    let tenderSubmissionInstance =await TenderRegistryInstance.getTenderSubmission(FakeZIPFileHash);

    //we expect the IsSet variable to be undefined for a fake Hash
    assert(tenderSubmissionInstance[7] === undefined, 'FakeZIPFileHash returned a Tender Submission which is not expected behaviour');
  })


})
