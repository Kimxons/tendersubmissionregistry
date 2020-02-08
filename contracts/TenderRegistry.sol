pragma solidity ^0.5.0; //solidity version

//OpenZeppelin Contract modules for simple authorization and access control mechanisms.
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

/** @title Tender Submission Registry. */
contract TenderRegistry is Ownable {
    address payable contractOwner;

    /*
        This is a type for a single Tender Submission.
        A struct in solidity is simply a loose bag of variables.
    */
    struct TenderSubmission {
        string ZIPFileDetails; // Dict of tender submission package ZIPFilename and ZIPFileSize
        string ZIPFileHash; // sha256 hash of tender submission package zip file
        string TenderSummary; // Tender number and title
        string SupplierDetails; // Dict of SubmitterFullName, SubmitterIdentificationNumber, SupplierID
        string SubmissionDate; // date and time of tender submission package zip upload
        uint256 BlockTime;  // block time of tender submission package zip upload
        uint IsSet; // integer indication of whether Tender Submission exists i.e. default is zero so if > 0 it exists
    }

    /*
        This declares a state variable that stores a `TenderSubmission` struct for each possible ZIPFile Hash.
        The key is a string i.e. ZIP file hash and the value is a TenderSubmission struct.
        The compiler to automatically generate a getter which allows us to do something like
        TenderSubmissionDetails = tendersMap(f149d75e984f1e919c4b896a0701637ff0260b834e1c18f3a9776c12fbf82311).
        Recall that a mapping is essentially a key-value store for storing and looking up data, it allows random access in a single step.
    */
    mapping(string => TenderSubmission) public tendersMap;

    /*
        A dynamically-sized string array containing tender hashes.
        Array of tenderHashes made public because of length method.
    */
    string[] public tenderHashes;

    /**
     * @dev Constructor.
     */
    constructor () public {
          contractOwner = msg.sender;
//        registerTenderSubmission("{ZIPFIleName: test.zip", ZIPFileSize:"0.433993MB"},
//                                  f149d75e984f1e919c4b896a0701637ff0260b834e1c18f3a9776c12fbf82311,
//                                  {SubmitterFullName:"SubmitterFullName",
//                                   SubmitterIdentificationNumber:"SubmitterIdentificationNumber",
//                                   SupplierID:SupplierID},
//                                 "1001 - Fix and Supply Data Center Hardware",
//                                 "02-02-2020 19:00:00", "02-02-2020 19:00:00", 1);
    }

    /**
     * @dev Fired on submission of a Tender ZIP File.
     */
    event registeredTenderEvent (
        uint indexed _tenderSubmissionId
    );
    /*
        NB:
        - "internal" functions can only be called from the contract itself (or from derived contracts).

        - v0.5 breaking changes list that:
            - Explicit data location for all variables of struct, array or mapping types is now mandatory.
            - This is also applied to function parameters and return variables.

        Recall that when a function's visibility is external, only external contracts can call that function.
        When such an external call happens, the data of that call is stored in calldata. Reading from calldata is cheap
        as compared to reading from memory which uses more data.

        External functions = calldata, public functions = memory

        How to Comment:
        /**
          * @dev Throws unless `msg.sender` is the current owner, an authorized operator, or the approved
          * address for this NFT. Throws if `_from` is not the current owner. Throws if `_to` is the zero
          * address. Throws if `_tokenId` is not a valid NFT. This function can be changed to payable.
          * @notice The caller is responsible to confirm that `_to` is capable of receiving NFTs or else
          * they maybe be permanently lost.
          * @param _from The current owner of the NFT.
          * @param _to The new owner.
          * @param _tokenId The NFT to transfer.
          *
        function transferFrom(
            address _from,
            address _to,
            uint256 _tokenId
        )

        If your struct has more than 7 variables, you may run into stack too deep error when creating or when
        returning values from
    */
    
    /**
     * @dev Register a Tender submission - it should add the Tender submission to the array of Tender submission.
     * @param ZIPFileDetails Name and size of ZIP File.
     * @param ZIPFileHash sha256 hash of ZIP File.
     * @param TenderSummary Tender number and title.
     * @param SupplierDetails Submitter Name, Surname, Identity Number and Supplier ID.
     * @param SubmissionDate Date of submission.
     */
    function registerTenderSubmission ( string memory ZIPFileDetails, string memory ZIPFileHash,
                                        string memory TenderSummary, string memory SupplierDetails,
                                        string memory SubmissionDate)
                                        public returns(uint) {
        /*
            Recall that Public functions need to write all of the arguments to memory because public functions
            may be called internally, which is an entirely different process from external calls. Thus, when the
            compiler generates the code for an internal function, that function expects its arguments to be located in memory.
        */

        //require (msg.sender == contractOwner);

        uint256 SubmissionBlocktime = block.timestamp;
        uint256 IsSet = 1;

        // Creates new TenderSubmission struct and save in storage.
        tendersMap[ZIPFileHash] = TenderSubmission(ZIPFileDetails, ZIPFileHash, TenderSummary,
                                                   SupplierDetails, SubmissionDate, SubmissionBlocktime, IsSet);

        //add the Tenderhash to the array for length tracking
        uint id = tenderHashes.push(ZIPFileHash) - 1;

        //or in one line
        //tenderHashes.push(ZIPFileHash);

        // trigger registeredTender event
        emit registeredTenderEvent(id);

        return id;
    }

    /**
     * @dev Returns the number of TenderSubmissions tracked on Blockchain.
     * Can only be called by the current owner.
     */
    function getTenderSubmissionsCount() external onlyOwner view returns(uint) {
        return tenderHashes.length;
    }

    /**
     * @dev Returns a ZIPFileHash from tenderHash array using array index.
     * @param arrayIndex Array index of ZIP File Hash
     */
    function getZipFileHashByIndex(uint256 arrayIndex) external view returns(string memory) {
       return tenderHashes[arrayIndex];
    }

    /**
     * @dev Returns the tender submission details if the hash exists in the map.
     * @param hash ZIP File Hash which is key in the tenderhash map.
     */
    function getTenderSubmission(string calldata hash) external view returns (string memory, string memory, string memory,
                                                                     string memory, string memory, uint256, uint) {
        /*
            Recall that a struct in solidity is simply a loose bag of variables so the return value cannot be a struct
            but rather the individual variables.
        */

        return (tendersMap[hash].ZIPFileDetails, tendersMap[hash].ZIPFileHash, tendersMap[hash].TenderSummary,
               tendersMap[hash].SupplierDetails, tendersMap[hash].SubmissionDate,
               tendersMap[hash].BlockTime, tendersMap[hash].IsSet);
    }

    /**
     * @dev Confirm whether the hash exists in the submissions.
     * @param hash ZIP File Hash which iskey in the tenderhash map
     */
    function checkTenderSubmission(string memory hash) public view returns (bool) {
        // check whether the hash is among the list of known hashes
        uint onChainIsSet = tendersMap[hash].IsSet;
        if (onChainIsSet > 0) {
            // if yes, return true
            return true;
          }
        // otherwise return false
        return false;
    }

    /**
     * @dev This is a fallback function which gets executed if a transaction with invalid data is sent to the contract or
     *   just ether without data. We revert the send so that no-one accidentally loses money when using the contract.
     */
    function() external {
        revert();
    }

    /**
     * @dev Remove the storage and code from the state.
     * Can only be called by the current owner.
     */
    function destroy() public onlyOwner {
        // cast owner which is address to address payable
        //contractOwner = address(uint160(owner));
        selfdestruct(contractOwner);
    }
}
