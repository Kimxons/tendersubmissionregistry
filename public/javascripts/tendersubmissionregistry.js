$(document).ready(function() {
    const documentRegistryContractAddress = '0x949c76215c7333c1697297fcd6307703aa77115d';
    const documentRegistryContractABI = [{"constant":false,"inputs":[{"name":"hash","type":"string"}],"name":"add","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"hash","type":"string"}],"name":"verify","outputs":[{"name":"dateAdded","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}];


    var CONSTANTS = {
                  HOME_TENDER_DOCS_MENU_BUTTON : "#homeTenderDocsMenuButton",
                  UPLOAD_TENDER_DOCS_MENU_BUTTON : "#uploadTenderDocsMenuButton",
                  VERIFY_TENDER_DOCS_MENU_BUTTON : "#verifyTenderDocsMenuButton",
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
                  VERIFY_TENDER_DOCS_INPUT_FILE_ZIP: "#verifyTenderDocsInputFileZIP",
                  VERIFY_TENDER_DOCS_LABEL_FILE_ZIP: "#verifyTenderDocsLabelFileZIP",
                  UPLOAD_TENDER_DOCS_BUTTON_SUBMIT: "#uploadTenderDocsButtonSubmit",
                  VERIFY_TENDER_DOCS_BUTTON_SUBMIT: "#verifyTenderDocsButtonSubmit",
                  NOTIFICATION_BAR_DIV: "#divNotificationBar",
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

        console.log("CONSTANTS.UPLOAD_TENDER_DOCS_INPUT_CHECKBOX_AUTH " + $(CONSTANTS.UPLOAD_TENDER_DOCS_INPUT_CHECKBOX_AUTH)[0].checked);
        console.log("CONSTANTS.UPLOAD_TENDER_DOCS_INPUT_CHECKBOX_TERMS " + $(CONSTANTS.UPLOAD_TENDER_DOCS_INPUT_CHECKBOX_TERMS)[0].checked);

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

            let contract = web3.eth.contract(documentRegistryContractABI).at(documentRegistryContractAddress);
            contract.add(documentHash, function(err, result) {
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

        //The FileReader object lets web applications asynchronously read the contents of files (or raw data buffers)
        //stored on the user's computer, using File or Blob objects to specify the file or data to read.
        //File objects may be obtained from a FileList object returned as a result of a user selecting files using the
        // <input> element, from a drag and drop operation's DataTransfer object, or from the mozGetAsFile() API on an
        // HTMLCanvasElement.

        let fileReader = new FileReader();
        let zip_filename = $(CONSTANTS.UPLOAD_TENDER_DOCS_INPUT_FILE_ZIP)[0].files[0].name;
        let zip_filesize = ($(CONSTANTS.UPLOAD_TENDER_DOCS_INPUT_FILE_ZIP)[0].files[0].size)/CONSTANTS.MEGA;

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
            contract.verify(documentHash, function(err, result) {
                if (err){
                    var message_type = CONSTANTS.ERROR; //error or success
                    var message_description = "Tender Submission Registry smart contract call failed: " + err;

                    triggerNotificationOpen(CONSTANTS.NOTIFICATION_BAR_DIV, '"divVerifyTenderZIPAlert"', message_description, message_type);
                    return console.log(message_description);
                }

                let contractPublishDate = result.toNumber(); // Take the output from the execution
                if (contractPublishDate > 0) {
                    let displayDate = new Date(contractPublishDate * 1000).toLocaleString();

                    var message_type = CONSTANTS.SUCCESS; //error or success
                    var message_description =`Tender Documents ZIP file with hash ${documentHash} is <b>valid<b>. Uploaded to Tender Submission Registry (Blockchain) on: ${displayDate}.`;

                    triggerNotificationOpen(CONSTANTS.NOTIFICATION_BAR_DIV, '"divVerifyTenderZIPAlert"', message_description, message_type);
                    console.log(message_description);
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
});
