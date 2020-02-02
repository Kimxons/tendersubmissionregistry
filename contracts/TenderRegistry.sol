pragma solidity ^0.5.0; //solidity version

///@title VTender Submission Registry

//Smart contract
contract TenderRegistry {

    /*
        This is a type for a single Tender Submission.
        A struct in solidity is simply a loose bag of variables.
    */
    struct TenderSubmission {
        string ZIPFileName;
        string ZIPFileSize;
        string ZIPFileHash;
        string SubmitterFullName;
        string SubmitterIdentificationNumber;
        string TenderSummary;
        string SupplierID;
        string SubmissionDate;
        uint256 BlockTime;
        string AuthConfirmation;
        string TermsConfirmation;
    }

    /*
        This declares a state variable that stores a `TenderSubmission` struct for each possible ZIPFile Hash.
        The key is a string i.e. ZIP file hash and the value is a TenderSubmission struct.
        The compiler to automatically generate a getter which allows us to do something like
        TenderSubmissionDetails = tendersMap(f149d75e984f1e919c4b896a0701637ff0260b834e1c18f3a9776c12fbf82311).
        A mapping is essentially a key-value store for storing and looking up data.
    */
    mapping(string => TenderSubmission) public tendersMap;

    string[] public tenderHashes;  //array of tenderHashes made public because of length method


//    constructor () public {
//        address contractOwner = msg.sender;
//        registerTenderSubmission("test.zip", "0.433993MB", f149d75e984f1e919c4b896a0701637ff0260b834e1c18f3a9776c12fbf82311,
//                                 "SubmitterFullName","SubmitterIdentificationNumber",
//                                 "1001 - Fix and Supply Data Center Hardware", "SupplierID",
//                                 "02-02-2020 19:00:00", "02-02-2020 19:00:00", "AuthConfirmation", "TermsConfirmation");
//    }


    event registeredTenderEvent (
        uint indexed _songId
    );
    
    function registerTenderSubmission ( string ZIPFileName, string ZIPFileSize, string ZIPFileHash,
                                        string SubmitterFullName,
                                        string SubmitterIdentificationNumber, string TenderSummary, string SupplierID,
                                        string SubmissionDate, string AuthConfirmation, string TermsConfirmation)
                                        public returns(uint) {
        /*
            A function to register a Tender submission - it should add the Tender submission to the array of
            Tender submission. Public functions need to write all of the arguments to memory because public functions
            may be called internally, which is an entirely different process from external calls. Thus, when the
            compiler generates the code for an internal function, that function expects its arguments to be located in memory.
        */

        //require (msg.sender == contractOwner);

        var SubmissionBlocktime = block.timestamp;

        //create a new TenderSubmission
//        TenderSubmission memory newTenderSubmission = TenderSubmission(ZIPFileName, ZIPFileSize, ZIPFileHash, SubmitterFullName,
//                                                                        SubmitterIdentificationNumber, TenderSummary,
//                                                                        SupplierID, SubmissionDate, SubmissionBlocktime,
//                                                                        AuthConfirmation, TermsConfirmation);

        // Creates new TenderSubmission struct and save in storage.
        tendersMap[ZIPFileHash] = TenderSubmission(ZIPFileName, ZIPFileHash, SubmitterFullName,
                                                                        SubmitterIdentificationNumber, TenderSummary,
                                                                        SupplierID, SubmissionDate, SubmissionBlocktime,
                                                                        AuthConfirmation, TermsConfirmation);

        //add the Tenderhash to the array for length tracking
        uint id = tenderHashes.push(ZIPFileHash) - 1;

        //or in one line
        //tenderHashes.push(ZIPFileHash);

        // trigger registeredTender event
        emit registeredTenderEvent(id);

        return id;
    }

    function getTenderSubmissionsCount() external view returns(uint) {
        /*
            a function to get the number of TenderSubmissions tracked on Blockchain i.e. length of tenderHashes array
        */
       return tenderHashes.length;
    }


    function getTenderSubmission(string hash) external view returns (string, string, string, string, string, string,
                                                                     string, string, uint256, string, string) {
        /*
            a function to return the tender submission details if the hash exists in the map.
        */
        return tendersMap[hash];
    }

function getInstructor(address _address) view public returns (uint, string, string) {
        return (instructors[_address].age, instructors[_address].fName, instructors[_address].lName);
    }

    function checkTenderSubmission(string calldata hash) external view returns (bool) {
        /*
            A function to confirm whether the hash exists in the submissions. Recall that when a function's visibility
            is external, only external contracts can call that function. When such an external call happens,
            the data of that call is stored in calldata. Reading from calldata is cheap as compared to reading from
            memory which uses more data.
        */
        for (uint i = 0; i < tenderHashes.length; i++){
          // check whether the hash is among the list of known hashes
          if (tenderHashes[i] == hash){
            // if yes, return true
            return true;
          }
        }
        // otherwise return false
        return false;
    }

}
