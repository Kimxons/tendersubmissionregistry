$(document).ready(function() {
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
                  VERIFY_TENDER_DOCS_INPUT_FILE_ZIP: "#verifyTenderDocsInputFileZIP",
                  UPLOAD_TENDER_DOCS_BUTTON_SUBMIT: "#uploadTenderDocsButtonSubmit",
                  VERIFY_TENDER_DOCS_BUTTON_SUBMIT: "#verifyTenderDocsInputFileZIP"
                };

    $(ROWNAMES.HOME_TENDER_DOCS_MENU_BUTTON).click(function() { displayRow(ROWNAMES.HOW_IT_WORKS) });
    $(ROWNAMES.UPLOAD_TENDER_DOCS_MENU_BUTTON).click(function() { displayRow(ROWNAMES.UPLOAD_TENDER_DOCS) });
    $(ROWNAMES.VERIFY_TENDER_DOCS_MENU_BUTTON).click(function() { displayRow(ROWNAMES.VERIFY_TENDER_DOCS) });
   // $(ROWNAMES.UPLOAD_TENDER_DOCS_BUTTON_SUBMIT).click(uploadTenderZIP);
   // $(ROWNAMES.VERIFY_TENDER_DOCS_BUTTON_SUBMIT).click(verifyTenderZIP);

    displayRow(ROWNAMES.HOW_IT_WORKS);

    // Show/Hide a "loading" indicator when AJAX request starts/completes:
    $(document).on({
        ajaxStart: function() { $(ROWNAMES.LOADING).show() }, //ajaxStart specifies a function to run when the first AJAX request begins
        ajaxStop: function() { $(ROWNAMES.LOADING).hide() } //ajaxStop specifies a function to run when all AJAX requests have completed
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
});
