$(document).ready(function() {
    const documentRegistryContractAddress = '0x3CF296C27FB23d81d4f48baD71f59Ddc76389905';

    // The second is the Application Binary interface or the ABI of the contract code.
    // ABI is just a list of method signatures, return types, members etc of the contract in a defined JSON format.
    // This ABI is needed when you will call your contract from a real javascript client.
    const documentRegistryContractABI = [{"constant": true,"inputs": [{"name": "","type": "string"}],"name": "tendersMap","outputs": [{"name": "ZIPFileDetails","type": "string"},{"name": "ZIPFileHash","type": "string"},{"name": "TenderSummary","type": "string"},{"name": "SupplierDetails","type": "string"},{"name": "SubmissionDate","type": "string"},{"name": "BlockTime","type": "uint256"},{"name": "IsSet","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function" }, {"constant": true,"inputs": [{"name": "","type": "uint256"}],"name": "tenderHashes","outputs": [{"name": "","type": "string"}],"payable": false,"stateMutability": "view","type": "function" }, {"payable": false,"stateMutability": "nonpayable","type": "fallback" }, {"anonymous": false,"inputs": [{"indexed": true,"name": "_songId","type": "uint256"}],"name": "registeredTenderEvent","type": "event" }, {"constant": false,"inputs": [{"name": "ZIPFileDetails","type": "string"},{"name": "ZIPFileHash","type": "string"},{"name": "TenderSummary","type": "string"},{"name": "SupplierDetails","type": "string"},{"name": "SubmissionDate","type": "string"}],"name": "registerTenderSubmission","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "nonpayable","type": "function" }, {"constant": true,"inputs": [],"name": "getTenderSubmissionsCount","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function" }, {"constant": true,"inputs": [{"name": "hash","type": "string"}],"name": "getTenderSubmission","outputs": [{"name": "","type": "string"},{"name": "","type": "string"},{"name": "","type": "string"},{"name": "","type": "string"},{"name": "","type": "string"},{"name": "","type": "uint256"},{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function" }, {"constant": true,"inputs": [{"name": "hash","type": "string"}],"name": "checkTenderSubmission","outputs": [{"name": "","type": "bool"}],"payable": false,"stateMutability": "view","type": "function"}];

    var CONSTANTS = {
                  HOME_TENDER_DOCS_MENU_BUTTON : "#homeTenderDocsMenuButton",
                  UPLOAD_TENDER_DOCS_MENU_BUTTON : "#uploadTenderDocsMenuButton",
                  VERIFY_TENDER_DOCS_MENU_BUTTON : "#verifyTenderDocsMenuButton",
                  GET_TENDER_DOCS_COUNT_MENU_BUTTON : "#getTenderDocsCountMenuButton",
                  LOADING : "#loadingRow",
                  NOTIFICATION_BAR_ROW: "#notificationBarRow",
                  HOW_IT_WORKS: "#howItWorksTenderDocsRow",
                  UPLOAD_TENDER_DOCS: "#uploadTenderDocsRow",
                  UPLOAD_TENDER_DOCS_FORM: "#uploadTenderDocsForm",
                  VERIFY_TENDER_DOCS: "#verifyTenderDocsRow",
                  VERIFY_TENDER_DOCS_FORM: "#verifyTenderDocsForm",
                  UPLOAD_TENDER_DOCS_INPUT_CHECKBOX_AUTH: "#uploadTenderDocsInputCheckboxAuthorised",
                  UPLOAD_TENDER_DOCS_INPUT_CHECKBOX_TERMS: "#uploadTenderDocsInputCheckboxTerms",
                  UPLOAD_TENDER_DOCS_INPUT_FILE_ZIP: "#uploadTenderDocsInputFileZIP",
                  UPLOAD_TENDER_DOCS_LABEL_FILE_ZIP: "#uploadTenderDocsLabelFileZIP",
                  VERIFY_TENDER_DOCS_INPUT_CHECKBOX_TERMS: "#verifyTenderDocsInputCheckboxTerms",
                  VERIFY_TENDER_DOCS_INPUT_FILE_ZIP: "#verifyTenderDocsInputFileZIP",
                  VERIFY_TENDER_DOCS_LABEL_FILE_ZIP: "#verifyTenderDocsLabelFileZIP",
                  UPLOAD_TENDER_DOCS_TENDER_NUM_SELECTED: "#uploadTenderDocsSelectTenderNum  :selected",
                  UPLOAD_TENDER_DOCS_TENDER_SUPPLIER_ID: "#uploadTenderDocsInputTextSupplierID",
                  UPLOAD_TENDER_DOCS_BUTTON_SUBMIT: "#uploadTenderDocsButtonSubmit",
                  VERIFY_TENDER_DOCS_BUTTON_SUBMIT: "#verifyTenderDocsButtonSubmit",
                  NOTIFICATION_BAR_DIV: "#divNotificationBar",
                  GET_TENDER_DOCS_COUNT_ROW: "#getTenderDocsCountRow",
                  TENDER_DOCS_COUNT_BUTTON: "#tenderDocsCountButton",
                  TENDER_DOCS_COUNT_DIV: "#getTenderDocsCount",
                  SUCCESS: "success",
                  ERROR: "error",
                  WARNING: "warning",
                  EMPTY_STRING: "",
                  KILO: 1000,
                  MEGA: 1000000
                };

    $(CONSTANTS.HOME_TENDER_DOCS_MENU_BUTTON).click(function() { displayRow(CONSTANTS.HOW_IT_WORKS, CONSTANTS.EMPTY_STRING) });

    $(CONSTANTS.UPLOAD_TENDER_DOCS_MENU_BUTTON).click(function() { displayRow(CONSTANTS.UPLOAD_TENDER_DOCS,
                                                                              CONSTANTS.UPLOAD_TENDER_DOCS_FORM) });

    $(CONSTANTS.VERIFY_TENDER_DOCS_MENU_BUTTON).click(function() { displayRow(CONSTANTS.VERIFY_TENDER_DOCS,
                                                                              CONSTANTS.VERIFY_TENDER_DOCS_FORM) });

    $(CONSTANTS.GET_TENDER_DOCS_COUNT_MENU_BUTTON).click(function() { displayRow(CONSTANTS.GET_TENDER_DOCS_COUNT_ROW,
                                                                              CONSTANTS.EMPTY_STRING) });

    $(CONSTANTS.UPLOAD_TENDER_DOCS_BUTTON_SUBMIT).click(uploadTenderZIP);

    $(CONSTANTS.VERIFY_TENDER_DOCS_BUTTON_SUBMIT).click(verifyTenderZIP);

    displayRow(CONSTANTS.HOW_IT_WORKS, CONSTANTS.EMPTY_STRING);

    // Show/Hide a "loading" indicator when AJAX request starts/completes:
    $(document).on({
        ajaxStart: function() { $(CONSTANTS.LOADING).show() }, //ajaxStart specifies a function to run when the first AJAX request begins
        ajaxStop: function() { $(CONSTANTS.LOADING).hide() } //ajaxStop specifies a function to run when all AJAX requests have completed
    });
    
    $(CONSTANTS.VERIFY_TENDER_DOCS_INPUT_FILE_ZIP).on('change',function(){
        //get the file name
        var fileName = $(this).val();
        //replace the "Choose a file" label
        $(this).next(CONSTANTS.VERIFY_TENDER_DOCS_LABEL_FILE_ZIP).html(fileName);
    });

    $(CONSTANTS.UPLOAD_TENDER_DOCS_INPUT_FILE_ZIP).on('change',function(){
        //get the file name
        var fileName = $(this).val();
        //replace the "Choose a file" label
        $(this).next(CONSTANTS.UPLOAD_TENDER_DOCS_LABEL_FILE_ZIP).html(fileName);
    });

    $(CONSTANTS.TENDER_DOCS_COUNT_BUTTON).click(function (e) {
      e.preventDefault();
      getTenderDocsCount();
    });

    function triggerNotificationOpen(parentDivID, alertDivID, alertMessage, alertType) {
      console.log("triggerNotificationOpen");
      $(CONSTANTS.NOTIFICATION_BAR_ROW).show();
      if (alertType === CONSTANTS.SUCCESS)
        var divNotificationHtml = '<div id='+alertDivID+' class="alert alert-success fade in show"><button type="button" class="close close-alert" data-dismiss="alert" aria-hidden="true">×</button><strong>'+alertMessage+'</strong></div>';
      else if (alertType === CONSTANTS.ERROR)
         var divNotificationHtml = '<div id='+alertDivID+' class="alert alert-danger fade in show"><button type="button" class="close close-alert" data-dismiss="alert" aria-hidden="true">×</button><strong>'+alertMessage+'</strong></div>';
      else if (alertType === CONSTANTS.WARNING)
          var divNotificationHtml = '<div id='+alertDivID+' class="alert alert-warning fade in show"><button type="button" class="close close-alert" data-dismiss="alert" aria-hidden="true">×</button><strong>'+alertMessage+'</strong></div>';
      //console.log(divNotificationHtml);
      $(parentDivID).html(divNotificationHtml);
    };
    
    function displayRow(rowName, formName) {
        // Hide rows
        $(CONSTANTS.LOADING).hide();
        $(CONSTANTS.HOW_IT_WORKS).hide();
        $(CONSTANTS.UPLOAD_TENDER_DOCS).hide();
        $(CONSTANTS.VERIFY_TENDER_DOCS).hide();
        $(CONSTANTS.GET_TENDER_DOCS_COUNT_ROW).hide();
        $(CONSTANTS.NOTIFICATION_BAR_ROW).hide();

        //reset form fields
        console.log("formName " + formName);
        if (formName !== CONSTANTS.EMPTY_STRING) {
            $(formName).get(0).reset();
        }

        // Display the passed in row
        $(rowName).show();
    }

    async function uploadTenderZIP() {
        $(CONSTANTS.NOTIFICATION_BAR_ROW).hide();

        if ($(CONSTANTS.UPLOAD_TENDER_DOCS_INPUT_FILE_ZIP)[0].files.length == 0){
            var message_type = CONSTANTS.ERROR; //error or success
            var message_description = "Please select a Tender Documents ZIP file to upload.";

            triggerNotificationOpen(CONSTANTS.NOTIFICATION_BAR_DIV, '"divUploadTenderZIPAlert"', message_description, message_type);
            return console.log(message_description);
        }

        //console.log("CONSTANTS.UPLOAD_TENDER_DOCS_INPUT_CHECKBOX_AUTH " + $(CONSTANTS.UPLOAD_TENDER_DOCS_INPUT_CHECKBOX_AUTH)[0].checked);
        //console.log("CONSTANTS.UPLOAD_TENDER_DOCS_INPUT_CHECKBOX_TERMS " + $(CONSTANTS.UPLOAD_TENDER_DOCS_INPUT_CHECKBOX_TERMS)[0].checked);

        if ($(CONSTANTS.UPLOAD_TENDER_DOCS_INPUT_CHECKBOX_AUTH)[0].checked === false){
            var message_type = CONSTANTS.ERROR; //error or success
            var message_description = "Please confirm that you are authorised to upload this bid.";

            triggerNotificationOpen(CONSTANTS.NOTIFICATION_BAR_DIV, '"divUploadTenderZIPAlert"', message_description, message_type);
            return console.log(message_description);
        }

        if ($(CONSTANTS.UPLOAD_TENDER_DOCS_INPUT_CHECKBOX_TERMS)[0].checked === false){
            var message_type = CONSTANTS.ERROR; //error or success
            var message_description = "Please confirm that you agree with the Terms and Conditions.";

            triggerNotificationOpen(CONSTANTS.NOTIFICATION_BAR_DIV, '"divUploadTenderZIPAlert"', message_description, message_type);
            return console.log(message_description);
        }

		if (window.ethereum)
			try {
				await window.ethereum.enable();
			} catch (err) {
                var message_type = CONSTANTS.ERROR; //error or success
                var message_description = "Access to your Ethereum account rejected.";

                triggerNotificationOpen(CONSTANTS.NOTIFICATION_BAR_DIV, '"divUploadTenderZIPAlert"', message_description, message_type);
                return console.log(message_description);
			}
        let fileReader = new FileReader();
        let zip_filename = $(CONSTANTS.UPLOAD_TENDER_DOCS_INPUT_FILE_ZIP)[0].files[0].name;
        let zip_filesize = ($(CONSTANTS.UPLOAD_TENDER_DOCS_INPUT_FILE_ZIP)[0].files[0].size)/CONSTANTS.MEGA;
        let webZipFileDetails = "ZIP File  " + zip_filename + " (size " + zip_filesize + "MB)";

        // Get selected value in dropdown list using JavaScript
        // $("#elementId :selected").text(); // The text content of the selected option
        // $("#elementId :selected").val(); // The value of the selected option
        let tender_num = $(CONSTANTS.UPLOAD_TENDER_DOCS_TENDER_NUM_SELECTED).text();

        let supplier_id = $(CONSTANTS.UPLOAD_TENDER_DOCS_TENDER_SUPPLIER_ID).val();

        let submission_date = new String(Date());

        fileReader.onload = function() {
            let documentHash = sha256(fileReader.result);
            if (typeof web3 === 'undefined'){
                var message_type = CONSTANTS.ERROR; //error or success
                var message_description = "Please install MetaMask to access the Ethereum Web3 injected API from your Web browser.";

                triggerNotificationOpen(CONSTANTS.NOTIFICATION_BAR_DIV, '"divUploadTenderZIPAlert"', message_description, message_type);
                return console.log(message_description);
            }

            console.log("ZIP File  " + zip_filename + " (size " + zip_filesize + "MB) successfully hashed (hash value "
                + documentHash + ").");

             // solidityContext required if you use msg object in contract function e.g. msg.sender
             // var solidityContext = {from: web3.eth.accounts[1], gas:3000000}; //add gas to avoid out of gas exception

            // TSR contract registerTenderSubmission
            // (string memory ZIPFileDetails, string memory ZIPFileHash,
            // string memory TenderSummary, string memory SupplierDetails,
            // string memory SubmissionDate)

            // registerTenderSubmission(
            // "{ZIPFIleName: test.zip", ZIPFileSize:"0.433993MB"},
            // f149d75e984f1e919c4b896a0701637ff0260b834e1c18f3a9776c12fbf82311,
            // {SubmitterFullName:"SubmitterFullName", SubmitterIdentificationNumber:"SubmitterIdentificationNumber",SupplierID:SupplierID},
            // "1001 - Fix and Supply Data Center Hardware"),
            // "Tue Feb 04 2020 23:38:39 GMT+0200 (South Africa Standard Time)");

            console.log("Test before sumbit - webZipFileDetails: " + webZipFileDetails + ", documentHash: " +  documentHash +
                    ", tender_num: " + tender_num  + ",supplier_id: " + supplier_id + ", submission_date:" + submission_date);

            //Load the contract schema from the abi and Instantiate the contract by address
            // at(): Create an instance of MyContract that represents your contract at a specific address.
            // deployed(): Create an instance of MyContract that represents the default address managed by MyContract.
            // new(): Deploy a new version of this contract to the network, getting an instance of MyContract that represents the newly deployed instance.

            let contract = web3.eth.contract(documentRegistryContractABI).at(documentRegistryContractAddress);
            contract.registerTenderSubmission(webZipFileDetails, documentHash, tender_num, supplier_id, submission_date.toString(),
                function(err, result) {
            if (err){
                var message_type = CONSTANTS.ERROR; //error or success
                var message_description = "Tender Submission Registry smart contract call failed: " + err;

                triggerNotificationOpen(CONSTANTS.NOTIFICATION_BAR_DIV, '"divUploadTenderZIPAlert"', message_description, message_type);
                return console.log("Smart contract call failed: " + err);
            }

            var message_type = CONSTANTS.SUCCESS; //error or success
            var message_description = `Tender Documents ZIP file with hash ${documentHash} <b>successfully added</b> to the Tender Submission Registry (Blockchain).`;

            triggerNotificationOpen(CONSTANTS.NOTIFICATION_BAR_DIV, '"divUploadTenderZIPAlert"', message_description, message_type);
            console.log(message_description);
            });
        };
        fileReader.readAsBinaryString($(CONSTANTS.UPLOAD_TENDER_DOCS_INPUT_FILE_ZIP)[0].files[0]);
    }

    function verifyTenderZIP() {
        $(CONSTANTS.NOTIFICATION_BAR_ROW).hide();


        if ($(CONSTANTS.VERIFY_TENDER_DOCS_INPUT_FILE_ZIP)[0].files.length == 0){
            var message_type = CONSTANTS.ERROR; //error or success
            var message_description = "Please select a Tender Documents ZIP file to verify.";

            triggerNotificationOpen(CONSTANTS.NOTIFICATION_BAR_DIV, '"divVerifyTenderZIPAlert"', message_description, message_type);
            return console.log(message_description);
        }

         if ($(CONSTANTS.VERIFY_TENDER_DOCS_INPUT_CHECKBOX_TERMS)[0].checked === false){
            var message_type = CONSTANTS.ERROR; //error or success
            var message_description = "Please confirm that you agree with the Terms and Conditions.";

            triggerNotificationOpen(CONSTANTS.NOTIFICATION_BAR_DIV, '"divUploadTenderZIPAlert"', message_description, message_type);
            return console.log(message_description);
        }

        //The FileReader object lets web applications asynchronously read the contents of files (or raw data buffers)
        //stored on the user's computer, using File or Blob objects to specify the file or data to read.
        //File objects may be obtained from a FileList object returned as a result of a user selecting files using the
        // <input> element, from a drag and drop operation's DataTransfer object, or from the mozGetAsFile() API on an
        // HTMLCanvasElement.

        let fileReader = new FileReader();
        let zip_filename = $(CONSTANTS.VERIFY_TENDER_DOCS_INPUT_FILE_ZIP)[0].files[0].name;
        let zip_filesize = ($(CONSTANTS.VERIFY_TENDER_DOCS_INPUT_FILE_ZIP)[0].files[0].size)/CONSTANTS.MEGA;

        fileReader.onload = function() {
            let documentHash = sha256(fileReader.result); //fileReader.result is base64 encoded source of the file
            if (typeof web3 === 'undefined'){
                var message_type = CONSTANTS.ERROR; //error or success
                var message_description = "Please install MetaMask to access the Ethereum Web3 injected API from your Web browser.";

                triggerNotificationOpen(CONSTANTS.NOTIFICATION_BAR_DIV, '"divVerifyTenderZIPAlert"', message_description, message_type);
                return console.log(message_description);
            }

            console.log("ZIP File  " + zip_filename + " (size " + zip_filesize + "MB) successfully hashed (hash value "
                + documentHash + ").");

            let contract = web3.eth.contract(documentRegistryContractABI).at(documentRegistryContractAddress);
            contract.getTenderSubmission(documentHash, function(err, result) {
                if (err){
                    var message_type = CONSTANTS.ERROR; //error or success
                    var message_description = "Tender Submission Registry smart contract call failed: " + err;

                    triggerNotificationOpen(CONSTANTS.NOTIFICATION_BAR_DIV, '"divVerifyTenderZIPAlert"', message_description, message_type);
                    return console.log(message_description);
                }

                // result:
                // ZIPFileDetails
                // ZIPFileHash
                // TenderSummary
                // SupplierDetails
                // SubmissionDate
                // SubmissionBlocktime
                // IsSet

                //result:
                // ZIP File  test.zip (size 0.433993MB),
                // f149d75e984f1e919c4b896a0701637ff0260b834e1c18f3a9776c12fbf82311,
                // 1003 - Train Data Center Operators,
                // 123,
                // Wed Feb 05 2020 00:09:56 GMT+0200 (South Africa Standard Time),
                // 1580854200,
                // 1

                // Output from the contract function call
                console.log("result: " + result);

                let contractIsSet = result[6].toNumber();

                console.log("contractIsSet: " + contractIsSet);
                console.log("result[0]: " + result[0]);
                console.log("(contractIsSet > 0): " + (contractIsSet > 0));

                if (contractIsSet > 0) {
                    let contractZIPFileDetails = result[0];
                    let contractZIPFileHash = result[1];
                    let contractTenderSummary = result[2];
                    let contractSupplierDetails = result[3];
                    let contractSubmissionDate = result[4];
                    let contractSubmissionBlocktime = result[5];
                    let displayDate = new Date(contractSubmissionBlocktime * 1000).toLocaleString();

                    var message_type = CONSTANTS.SUCCESS; //error or success
                    var message_description =`Tender Documents ZIP file with hash ${documentHash} is <b>valid</b>. Uploaded to Tender Submission Registry (Blockchain) on: ${contractSubmissionDate}.`;

                    triggerNotificationOpen(CONSTANTS.NOTIFICATION_BAR_DIV, '"divVerifyTenderZIPAlert"', message_description, message_type);
                    return console.log(message_description);
                }
                else
                    var message_type = CONSTANTS.ERROR; //error or success
                    var message_description =`Tender Documents ZIP file with hash ${documentHash} is <b>invalid</b>: not found in the Tender Submission Registry (Blockchain).`;

                    triggerNotificationOpen(CONSTANTS.NOTIFICATION_BAR_DIV, '"divVerifyTenderZIPAlert"', message_description, message_type);
                    return console.log(message_description);
            });
        };
        fileReader.readAsBinaryString($(CONSTANTS.VERIFY_TENDER_DOCS_INPUT_FILE_ZIP)[0].files[0]);
    }

    function getTenderDocsCount() {
        if (typeof web3 === 'undefined'){
                var message_type = CONSTANTS.ERROR; //error or success
                var message_description = "Please install MetaMask to access the Ethereum Web3 injected API from your Web browser.";

                triggerNotificationOpen(CONSTANTS.NOTIFICATION_BAR_DIV, '"divVerifyTenderZIPAlert"', message_description, message_type);
                return console.log(message_description);
            }

        let contract = web3.eth.contract(documentRegistryContractABI).at(documentRegistryContractAddress);
            contract.getTenderSubmissionsCount(function(err, result) {
                if (err){
                    var message_type = CONSTANTS.ERROR; //error or success
                    var message_description = "Tender Submission Registry smart contract call failed: " + err;

                    triggerNotificationOpen(CONSTANTS.NOTIFICATION_BAR_DIV, '"divVerifyTenderZIPAlert"', message_description, message_type);
                    return console.log(message_description);
                }

                let tenderSubmissionsCount = result.toNumber(); // Output from the contract function call

                console.log("getTenderSubmissionsCount: " + tenderSubmissionsCount);

                var tenderSubmissionsCountHtml = '<div class="alert alert-success fade in show"><button type="button" class="close close-alert" data-dismiss="alert" aria-hidden="true">×</button><strong>Number of Tender Submissions: </strong>' + tenderSubmissionsCount +'</div>'
                $(CONSTANTS.TENDER_DOCS_COUNT_DIV).html(tenderSubmissionsCountHtml);
        });
    }
});
