const ERROR_CODES = {
    duplicateEntry: 'ER_DUP_ENTRY',
    dataTooLong: 'ER_DATA_TOO_LONG',
    foreignKeyMissing: 'ER_NO_REFERENCED_ROW_2',
    rowIsReferenced: 'ER_ROW_IS_REFERENCED_2',
    rowIsReferencedLegacy: 'ER_ROW_IS_REFERENCED',
    rowIsReferencedNumber: 1451
};

module.exports = {
    ERROR_CODES
};
