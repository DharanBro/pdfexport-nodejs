
var PDFTextWrappingUtils= function() {
		return {
			/*
			 * Mark column header rows which have cells with text that's longer than the cell width
			 *
			 * 5 cases:
			 * 1. There are no span cells in the row - if there is text to be wrapped, the row height will be expanded --> "exp"
			 * 2. There are span cells, and there is text to be wrapped in non-span cells (row height will be expanded) --> "exp"
			 * 3. There are span cells in the row headers, but there is text to be wrapped ONLY in NS and SS cells - do nothing, as the text will overflow into the adjacent NM/NE/SM/SE cell.3.
			 * 4. There are span cells, but there is text to be wrapped ONLY in SN, SM, and SE span cells (no need to expand row height - just wrap into rowspan M/E cells where needed) --> "wrap"
			 * 5. No text to be wrapped --> no flag inserted
			 */
			markColumnHeaderRowsForExpansion : function(pdf, rowsArray, noOfColHeaders) {
				var maxTextWidthPx = 124;

				var noOfRowsMarked = 0;	// increase noOfColHeaders by this

				var hasNonSpanCellsToWrap = false;
				var hasRowSpanSCellToWrap = false;

				for (var colHeaderCount = 0; colHeaderCount < noOfColHeaders; colHeaderCount++) {
					if (!PDFCrosstabUtils()().hasSpanCell(rowsArray[colHeaderCount])) {
						for (var rowCellCount = 0; rowCellCount < rowsArray[colHeaderCount].length; rowCellCount++) {
							var rowHeaderCellText = rowsArray[colHeaderCount][rowCellCount].text;
							if (pdf.getTextDimensionsPx(rowHeaderCellText).w > maxTextWidthPx) {
								// Mark this row to have text wrapped and be turned into span cells/expanded height-wise
								rowsArray[colHeaderCount].splice(0, 0, "exp");
								noOfRowsMarked++;
								break;
							}
						}
					} else {
						for (var rowCellCount = 0; rowCellCount < rowsArray[colHeaderCount].length; rowCellCount++) {
							var currCell =  rowsArray[colHeaderCount][rowCellCount];
							var currCellSpanPos = currCell.rowSpanPos + currCell.colSpanPos;
							var rowHeaderCellText = currCell.text;

							if (pdf.getTextDimensionsPx(rowHeaderCellText).w > maxTextWidthPx) {
								if (currCellSpanPos === "NS" || currCellSpanPos === "SS") {
									// case 3: do nothing
								} else if (currCell.rowSpanPos.toLowerCase() === "s") {
									hasRowSpanSCellToWrap = true;
								} else {
									hasNonSpanCellsToWrap = true;
								}
							}
						}

						if (hasRowSpanSCellToWrap && !hasNonSpanCellsToWrap) {
							rowsArray[colHeaderCount].splice(0, 0, "wrap");
							noOfRowsMarked++;
						} else if (hasNonSpanCellsToWrap) {
							rowsArray[colHeaderCount].splice(0, 0, "exp");
							noOfRowsMarked++;
						}

						hasRowSpanSCellToWrap = false;
						hasNonSpanCellsToWrap = false;
					}
				}

				rowsArray.splice(0, 0, noOfRowsMarked);

				return rowsArray;
			},

			/*
			 * Mark rows which have cells in the row header columns with text that's longer than the cell width
			 *
			 * 5 cases:
			 * 1. There are no span cells in the row headers - if there is text to be wrapped, the row height will be expanded --> "exp"
			 * 2. There are span cells in the row headers, and there is text to be wrapped in non-span cells of the row headers (row height will be expanded) --> "exp"
			 * 3. There are span cells in the row headers, but there is text to be wrapped ONLY in NS and SS cells - do nothing, as the text will overflow into the adjacent NM/NE/SM/SE cell.
			 * 4. There are span cells, but there is text to be wrapped ONLY in SN, SM, and SE span cells (no need to expand row height - just wrap into rowspan M/E cells where needed) --> "wrap"
			 * 5. No text to be wrapped --> no flag inserted
			 */
			markRowHeaderRowsForExpansion : function(pdf, rowsArray, noOfColHeaders, noOfRowHeaderCols) {
				var maxTextWidthPx = 124;

				var hasNonSpanCellsToWrap = false;
				var hasRowSpanSCellToWrap = false;

				for (var rowCount = noOfColHeaders; rowCount < rowsArray.length; rowCount++) {
					if (!PDFCrosstabUtils()().hasSpanCell(rowsArray[rowCount], 0, noOfRowHeaderCols)) {
						for (var rowCellCount = 0; rowCellCount < noOfRowHeaderCols; rowCellCount++) {
							var rowHeaderCellText = rowsArray[rowCount][rowCellCount].text;
							if (pdf.getTextDimensionsPx(rowHeaderCellText).w > maxTextWidthPx) {
								// Mark this row to have text wrapped and be turned into span cells/expanded height-wise
								rowsArray[rowCount].splice(0, 0, "exp");
								break;
							}
						}
					} else {
						for (var rowCellCount = 0; rowCellCount < noOfRowHeaderCols; rowCellCount++) {
							var currCell =  rowsArray[rowCount][rowCellCount];
							var rowHeaderCellText = currCell.text;
							var currCellSpanPos = currCell.rowSpanPos + currCell.colSpanPos;

							if (pdf.getTextDimensionsPx(rowHeaderCellText).w > maxTextWidthPx) {
								if (currCellSpanPos === "NS" || currCellSpanPos === "SS") {
									// case 3: do nothing
								} else if (currCell.rowSpanPos.toLowerCase() === "s") {
									hasRowSpanSCellToWrap = true;
								} else {
									hasNonSpanCellsToWrap = true;
								}
							}
						}

						if (hasRowSpanSCellToWrap && !hasNonSpanCellsToWrap) {
							rowsArray[rowCount].splice(0, 0, "wrap");
						} else if (hasNonSpanCellsToWrap) {
							rowsArray[rowCount].splice(0, 0, "exp");
						}

						hasRowSpanSCellToWrap = false;
						hasNonSpanCellsToWrap = false;
					}
				}

				return rowsArray;
			},

			// Expand column header rows marked for expansion to 2 lines: wrap text and convert to rowspan if required
			expandColumnHeaderRowsAndWrapText : function(pdf, rowsArray, noOfColHeaders) {
				var noOfRowsMarked = rowsArray.splice(0, 1);	// TODO: Is this needed? Do something with this or remove it.

				var maxTextLen = 95;

				for (var colHeaderCount = 0; colHeaderCount < noOfColHeaders; colHeaderCount++) {
					if (rowsArray[colHeaderCount][0] === "exp") {
						// Splice out "exp"
						rowsArray[colHeaderCount].splice(0, 1);
						// Save for later
						var duplicateOfRow = $.extend(true, [], rowsArray[colHeaderCount]);	// deep copy
						var duplicateCurrCell = "";

						if (!PDFCrosstabUtils().hasSpanCell(rowsArray[colHeaderCount])) {	// simple case - no span cells in row
							for (var rowCellCount = 0; rowCellCount < rowsArray[colHeaderCount].length; rowCellCount++) {
								var currCell = rowsArray[colHeaderCount][rowCellCount];
								var duplicateCurrCell = duplicateOfRow[rowCellCount];
								var wrappedTextArr = pdf.splitTextToSize(currCell.text, maxTextLen);	// TODO: Will this work for non-English characters?
								currCell.text = wrappedTextArr[0];
								wrappedTextArr.length > 1 ? duplicateCurrCell.text = wrappedTextArr[1] : duplicateCurrCell.text = " ";

								currCell.isSpan = "true";
								currCell.rowSpanPos = "S";
								currCell.colSpanPos = "N";

								duplicateCurrCell.isSpan = "true";
								duplicateCurrCell.rowSpanPos = "E";
								duplicateCurrCell.colSpanPos = "N";
							}
						} else {
							for (var rowCellCount = 0; rowCellCount < rowsArray[colHeaderCount].length; rowCellCount++) {
								var currCell = rowsArray[colHeaderCount][rowCellCount];
								var duplicateCurrCell = duplicateOfRow[rowCellCount];
								var wrappedTextArr = pdf.splitTextToSize(currCell.text, maxTextLen);	// TODO: Will this work for non-English characters?
								currCell.text = wrappedTextArr[0];
								wrappedTextArr.length > 1 ? duplicateCurrCell.text = wrappedTextArr[1] : duplicateCurrCell.text = " ";

								currCell.isSpan = "true";
								duplicateCurrCell.isSpan = "true";

								var spanPositions = PDFCrosstabUtils().getNewSpanPosAndExpandedCell(currCell.rowSpanPos + currCell.colSpanPos);

								if (spanPositions[0]) {
									currCell.rowSpanPos = spanPositions[0].rowSpanPos;
									currCell.colSpanPos = spanPositions[0].colSpanPos;
								}

								duplicateCurrCell.rowSpanPos = spanPositions[1].rowSpanPos;
								duplicateCurrCell.colSpanPos = spanPositions[1].colSpanPos;
							}
						}

						rowsArray.splice(colHeaderCount + 1, 0, duplicateOfRow);
						noOfColHeaders += 1;	// extra column header row added (due to heightwise expansion of cell)
						colHeaderCount += 1;	// skip the added row
					} else if (rowsArray[colHeaderCount][0] === "wrap") {
						// Splice out "wrap"
						rowsArray[colHeaderCount].splice(0, 1);

						for (var rowCellCount = 0; rowCellCount < rowsArray[colHeaderCount].length; rowCellCount++) {
							var currCell = rowsArray[colHeaderCount][rowCellCount];
							var cellBelow = rowsArray[colHeaderCount + 1][rowCellCount];

							var wrappedTextArr = pdf.splitTextToSize(currCell.text, maxTextLen);	//  TODO: Will this work for non-English characters?
							currCell.text = wrappedTextArr[0];
							if (wrappedTextArr.length > 1) {

								switch (currCell.rowSpanPos + currCell.colSpanPos) {
									case "SN":
									case "SS":
									case "SM":
									case "SE":
										cellBelow.text = wrappedTextArr[1];
										break;
									default:
										break;
								}
							}
						}
					}
				}

				rowsArray.splice(0, 0, noOfColHeaders);	// number of column header rows have increased!
				return rowsArray;
			},

			// Expand row header rows marked for expansion to 2 lines: wrap text and convert to rowspan if required
			expandHeaderRowsAndWrapText : function(pdf, rowsArray, noOfColHeaders, noOfRowHeaderCols) {
				var maxTextLen = 95;

				for (var rowCount = noOfColHeaders; rowCount < rowsArray.length; rowCount++) {
					if (rowsArray[rowCount][0] === "exp") {
						// Splice out "exp"
						rowsArray[rowCount].splice(0, 1);
						// Save for later
						var duplicateOfRow = $.extend(true, [], rowsArray[rowCount]);	// deep copy
						var duplicateCurrCell = "";

						if (!PDFCrosstabUtils().hasSpanCell(rowsArray[rowCount])) {	// simple case - no span cells in row
							for (var rowCellCount = 0; rowCellCount < rowsArray[rowCount].length; rowCellCount++) {
								var currCell = rowsArray[rowCount][rowCellCount];
								var duplicateCurrCell = duplicateOfRow[rowCellCount];
								var wrappedTextArr = pdf.splitTextToSize(currCell.text, maxTextLen);	// TODO: Will this work for non-English characters?
								currCell.text = wrappedTextArr[0];
								wrappedTextArr.length > 1 ? duplicateCurrCell.text = wrappedTextArr[1] : duplicateCurrCell.text = " ";

								currCell.isSpan = "true";
								currCell.rowSpanPos = "S";
								currCell.colSpanPos = "N";

								duplicateCurrCell.isSpan = "true";
								duplicateCurrCell.rowSpanPos = "E";
								duplicateCurrCell.colSpanPos = "N";
							}
						} else {
							for (var rowCellCount = 0; rowCellCount < rowsArray[rowCount].length; rowCellCount++) {
								var currCell = rowsArray[rowCount][rowCellCount];
								var duplicateCurrCell = duplicateOfRow[rowCellCount];
								var wrappedTextArr = pdf.splitTextToSize(currCell.text, maxTextLen);	// TODO: Will this work for non-English characters?
								currCell.text = wrappedTextArr[0];
								wrappedTextArr.length > 1 ? duplicateCurrCell.text = wrappedTextArr[1] : duplicateCurrCell.text = " ";

								currCell.isSpan = "true";
								duplicateCurrCell.isSpan = "true";

								var spanPositions = PDFCrosstabUtils().getNewSpanPosAndExpandedCell(currCell.rowSpanPos + currCell.colSpanPos);

								if (spanPositions[0]) {
									currCell.rowSpanPos = spanPositions[0].rowSpanPos;
									currCell.colSpanPos = spanPositions[0].colSpanPos;
								}

								duplicateCurrCell.rowSpanPos = spanPositions[1].rowSpanPos;
								duplicateCurrCell.colSpanPos = spanPositions[1].colSpanPos;
							}
						}

						rowsArray.splice(rowCount + 1, 0, duplicateOfRow);
						rowCount += 1;	// skip the added row
					} else if (rowsArray[rowCount][0] === "wrap") {
						// Splice out "wrap"
						rowsArray[rowCount].splice(0, 1);

						for (var rowCellCount = 0; rowCellCount < rowsArray[rowCount].length; rowCellCount++) {
							var currCell = rowsArray[rowCount][rowCellCount];
							var cellBelow = rowsArray[rowCount + 1][rowCellCount];

							var wrappedTextArr = pdf.splitTextToSize(currCell.text, maxTextLen);	// TODO: Will this work for non-English characters?
							currCell.text = wrappedTextArr[0];
							if (wrappedTextArr.length > 1) {

								switch (currCell.rowSpanPos + currCell.colSpanPos) {
									case "SN":
									case "SS":
									case "SM":
									case "SE":
										cellBelow.text = wrappedTextArr[1];
										break;
									default:
										break;
								}
							}
						}
					}
				}

				return rowsArray;
			}

		};
	}

	 if (typeof module !== 'undefined' && module.exports) {
    module.exports = PDFTextWrappingUtils;
  } else {
    global.PDFTextWrappingUtils = PDFTextWrappingUtils;
  }