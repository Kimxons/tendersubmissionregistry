$(document).ready(function() {
    const documentRegistryContractAddress = '0x949c76215c7333c1697297fcd6307703aa77115d';
    const documentRegistryContractABI = [{"constant":false,"inputs":[{"name":"hash","type":"string"}],"name":"add","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"hash","type":"string"}],"name":"verify","outputs":[{"name":"dateAdded","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}];


    var ROWNAMES = {
                  HOME_TENDER_DOCS_MENU_BUTTON : "#homeTenderDocsMenuButton",
                  UPLOAD_TENDER_DOCS_MENU_BUTTON : "#uploadTenderDocsMenuButton",
                  VERIFY_TENDER_DOCS_MENU_BUTTON : "#verifyTenderDocsMenuButton",
                  LOADING : "#loadingRow",
                  NOTIFICATION_BAR: "#notificationBarRow",
                  HOW_IT_WORKS: "#howItWorksTenderDocsRow",
                  UPLOAD_TENDER_DOCS: "#uploadTenderDocsRow",
                  VERIFY_TENDER_DOCS: "#verifyTenderDocsRow",
                  UPLOAD_TENDER_DOCS_INPUT_FILE_ZIP: "#uploadTenderDocsInputFileZIP",
                  UPLOAD_TENDER_DOCS_LABEL_FILE_ZIP: "#uploadTenderDocsLabelFileZIP",
                  VERIFY_TENDER_DOCS_INPUT_FILE_ZIP: "#verifyTenderDocsInputFileZIP",
                  VERIFY_TENDER_DOCS_LABEL_FILE_ZIP: "#verifyTenderDocsLabelFileZIP",
                  UPLOAD_TENDER_DOCS_BUTTON_SUBMIT: "#uploadTenderDocsButtonSubmit",
                  VERIFY_TENDER_DOCS_BUTTON_SUBMIT: "#verifyTenderDocsButtonSubmit"
                };

    $(ROWNAMES.HOME_TENDER_DOCS_MENU_BUTTON).click(function() { displayRow(ROWNAMES.HOW_IT_WORKS) });
    $(ROWNAMES.UPLOAD_TENDER_DOCS_MENU_BUTTON).click(function() { displayRow(ROWNAMES.UPLOAD_TENDER_DOCS) });
    $(ROWNAMES.VERIFY_TENDER_DOCS_MENU_BUTTON).click(function() { displayRow(ROWNAMES.VERIFY_TENDER_DOCS) });
    $(ROWNAMES.UPLOAD_TENDER_DOCS_BUTTON_SUBMIT).click(uploadTenderZIP);
    $(ROWNAMES.VERIFY_TENDER_DOCS_BUTTON_SUBMIT).click(verifyTenderZIP);

    displayRow(ROWNAMES.HOW_IT_WORKS);

    // Show/Hide a "loading" indicator when AJAX request starts/completes:
    $(document).on({
        ajaxStart: function() { $(ROWNAMES.LOADING).show() }, //ajaxStart specifies a function to run when the first AJAX request begins
        ajaxStop: function() { $(ROWNAMES.LOADING).hide() } //ajaxStop specifies a function to run when all AJAX requests have completed
    });

    $(ROWNAMES.VERIFY_TENDER_DOCS_INPUT_FILE_ZIP).on('change',function(){
        //get the file name
        var fileName = $(this).val();
        //replace the "Choose a file" label
        $(this).next(ROWNAMES.VERIFY_TENDER_DOCS_LABEL_FILE_ZIP).html(fileName);
    });

    $(ROWNAMES.UPLOAD_TENDER_DOCS_INPUT_FILE_ZIP).on('change',function(){
        //get the file name
        var fileName = $(this).val();
        //replace the "Choose a file" label
        $(this).next(ROWNAMES.UPLOAD_TENDER_DOCS_LABEL_FILE_ZIP).html(fileName);
    });

    function displayRow(rowName) {
        // Hide rows
        $(ROWNAMES.LOADING).hide();
        $(ROWNAMES.HOW_IT_WORKS).hide();
        $(ROWNAMES.UPLOAD_TENDER_DOCS).hide();
        $(ROWNAMES.VERIFY_TENDER_DOCS).hide();

        // Display the passed in row
        $(rowName).show();
    }

    async function uploadTenderZIP() {
        if ($(ROWNAMES.UPLOAD_TENDER_DOCS_INPUT_FILE_ZIP)[0].files.length == 0)
            return showError("Please select a ZIP file to upload.");
		if (window.ethereum)
			try {
				await window.ethereum.enable();
			} catch (err) {
                return showError("Access to your Ethereum account rejected.");
			}
        let fileReader = new FileReader();
        fileReader.onload = function() {
            let documentHash = sha256(fileReader.result);
            if (typeof web3 === 'undefined')
                return showError("Please install MetaMask to access the Ethereum Web3 injected API from your Web browser.");
            let contract = web3.eth.contract(documentRegistryContractABI).at(documentRegistryContractAddress);
            contract.add(documentHash, function(err, result) {
                const flashRequest = new XMLHttpRequest();
                flashRequest.open('post', '/flash');
                flashRequest.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                var flash_page = "index";

                if (err){
                    var message_type = "error"; //error or success
                    var message_description = "Tender Submission Registry smart contract call failed: " + err;

                    flashRequest.send(JSON.stringify({
                        'message_type':message_type,
                        'message_description': message_description,
                        'message_page': flash_page
                    }));

                    return console.log("Smart contract call failed: " + err);
                }

                var message_type = "success"; //error or success
                var message_description = `Tender Documents ZIP file with hash ${documentHash} <b>successfully added</b> to the Tender Submission Registry (Blockchain).`;

                flashRequest.send(JSON.stringify({
                    'message_type':message_type,
                    'message_description': message_description,
                    'message_page': flash_page
                }));

                console.log(message_description);
            });
        };
        fileReader.readAsBinaryString($(ROWNAMES.UPLOAD_TENDER_DOCS_INPUT_FILE_ZIP)[0].files[0]);
    }

    function verifyTenderZIP() {
        if ($(ROWNAMES.VERIFY_TENDER_DOCS_INPUT_FILE_ZIP)[0].files.length == 0)
            return showError("Please select a ZIP file to verify.");
        let fileReader = new FileReader();
        fileReader.onload = function() {
            let documentHash = sha256(fileReader.result);
            if (typeof web3 === 'undefined')
                return showError("Please install MetaMask to access the Ethereum Web3 API from your Web browser.");
            let contract = web3.eth.contract(documentRegistryContractABI).at(documentRegistryContractAddress);
            contract.verify(documentHash, function(err, result) {
                const flashRequest = new XMLHttpRequest();
                flashRequest.open('post', '/flash');
                flashRequest.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                var flash_page = "index";

                if (err){
                    var message_type = "error"; //error or success
                    var message_description = "Tender Submission Registry smart contract call failed: " + err;

                    flashRequest.send(JSON.stringify({
                        'message_type':message_type,
                        'message_description': message_description,
                        'message_page': flash_page
                    }));

                    return console.log(message_description);
                }

                let contractPublishDate = result.toNumber(); // Take the output from the execution
                if (contractPublishDate > 0) {
                    let displayDate = new Date(contractPublishDate * 1000).toLocaleString();

                    var message_type = "success"; //error or success
                    var message_description =`Tender Documents ZIP file with hash ${documentHash} is <b>valid<b>. Uploaded to Tender Submission Registry (Blockchain) on: ${displayDate}.`;

                    flashRequest.send(JSON.stringify({
                        'message_type':message_type,
                        'message_description': message_description,
                        'message_page': flash_page
                    }));

                    console.log(message_description);
                }
                else
                    var message_type = "error"; //error or success
                    var message_description =`Tender Documents ZIP file with hash ${documentHash} is <b>invalid</b>: not found in the Tender Submission Registry (Blockchain).`;

                    flashRequest.send(JSON.stringify({
                        'message_type':message_type,
                        'message_description': message_description,
                        'message_page': flash_page
                    }));
                    return console.log(message_description);
            });
        };
        fileReader.readAsBinaryString($(ROWNAMES.VERIFY_TENDER_DOCS_INPUT_FILE_ZIP)[0].files[0]);
    }
});
