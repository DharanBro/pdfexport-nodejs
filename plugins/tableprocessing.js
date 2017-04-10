var PDFProcessingUtils= function() {
		return {

			/*
			 * Repeat column headers on each page split:
			 * insert extra column headers to rowsArray where a new page begins (we find out by using maxRows -
			 * the maximum amount of rows which can fit on each page in the PDF for the current page size),
			 * to ensure that they are repeated on each page.
			 */
			repeatColumnHeaders : function(rowsArray, maxRows, noOfColHeaders) {
				var colHeaderCells = [];	// store the column headers
				for (var maxRowsCount = maxRows; maxRowsCount < rowsArray.length; maxRowsCount += maxRows) {			// no. of rows per page
					for (var colHeaderCount = 0; colHeaderCount < noOfColHeaders; colHeaderCount++) {					// no. of header rows to repeat
						for (var rowCellCount = 0; rowCellCount < rowsArray[colHeaderCount].length; rowCellCount++) {	// total no. of columns in a row
							colHeaderCells[rowCellCount] = rowsArray[colHeaderCount][rowCellCount];
						}
						// Push column headers to repeat, to rowsArray at page break(s)
						rowsArray.splice(maxRowsCount + colHeaderCount , 0, colHeaderCells);
						colHeaderCells = [];
					}
				}

				return rowsArray;
			},

			/*
			 * Repeat row headers on each page split:
			 * insert extra row headers to rowsArray where a new page begins (we find out by using maxCols -
			 * the maximum amount of columns which can fit on each page in the PDF for the current page size),
			 * to ensure that they are repeated on each page.
			 */
			repeatRowHeaders : function(rowsArray, maxCols, noOfRowHeaderCols) {
				// 1. Collect row headers first
				var rowHeaderCells = [];
				var rowHeaderCellRow = [];	// to store one row at a time
				for (var rowCount = 0; rowCount < rowsArray.length; rowCount++) {
					for (var rowHeaderCount = 0; rowHeaderCount < noOfRowHeaderCols; rowHeaderCount++) {
						rowHeaderCellRow.push(rowsArray[rowCount][rowHeaderCount]);
					}
					rowHeaderCells.push(rowHeaderCellRow);
					rowHeaderCellRow = [];
				}
				// 2. Push row headers to repeat, to rowsArray at page break(s)
				for (var rowCount = 0; rowCount < rowsArray.length; rowCount++) {	// for each row in crosstab
					for (var colCount = maxCols; colCount < rowsArray[rowCount].length; colCount += maxCols) {	// for each column in crosstab
						// Push a row of row headers to each row - sync with rowCount
						for (var rowHeaderCellCount = rowHeaderCells[rowCount].length - 1; rowHeaderCellCount > -1; rowHeaderCellCount--) {
							rowsArray[rowCount].splice(colCount, 0, rowHeaderCells[rowCount][rowHeaderCellCount]);
						}
					}
				}

				return rowsArray;
			}

		};
	}

	 if (typeof module !== 'undefined' && module.exports) {
    module.exports = PDFProcessingUtils;
  } else {
    global.PDFProcessingUtils = PDFProcessingUtils;
  }